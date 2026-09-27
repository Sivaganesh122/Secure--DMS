# Secure DMS - FastAPI Endpoints Implementation
# This file contains comprehensive API endpoint implementations

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Query, Request
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
import json

# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

auth_router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str
    mfa_token: Optional[str] = None

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: dict

@auth_router.post("/register", response_model=dict)
async def register(
    email: EmailStr,
    password: str,
    name: str,
    department: str,
    db: Session = Depends(get_db),
    auth_service: AuthService = Depends()
):
    """
    Register a new user
    
    Security:
    - Password must be at least 12 characters
    - Email must be unique
    - Account requires email verification
    """
    # Validate password strength
    if len(password) < 12:
        raise HTTPException(status_code=400, detail="Password too weak")
    
    # Check if user exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="User already exists")
    
    # Hash password
    hashed_password = auth_service.hash_password(password)
    
    # Create user
    new_user = User(
        email=email,
        name=name,
        hashed_password=hashed_password,
        department=department,
        is_verified=False
    )
    db.add(new_user)
    db.commit()
    
    # Send verification email
    await send_verification_email(email)
    
    return {
        "message": "Registration successful. Please verify your email.",
        "user_id": new_user.id
    }

@auth_router.post("/login", response_model=LoginResponse)
async def login(
    request: Request,
    credentials: LoginRequest,
    db: Session = Depends(get_db),
    auth_service: AuthService = Depends()
):
    """
    Login user and return JWT token
    
    Security:
    - Rate limiting: 5 failed attempts lock account for 15 minutes
    - MFA verification required if enabled
    - Log all login attempts
    """
    ip_address = request.client.host
    
    # Find user
    user = db.query(User).filter(User.email == credentials.username).first()
    
    if not user:
        # Log failed attempt
        await audit_service.log("login_failed", "user", None, ip_address, "User not found")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check if account is locked
    if user.account_locked_until and user.account_locked_until > datetime.utcnow():
        raise HTTPException(status_code=403, detail="Account temporarily locked")
    
    # Verify password
    if not auth_service.verify_password(credentials.password, user.hashed_password):
        user.failed_login_attempts += 1
        
        # Lock account after 5 failed attempts
        if user.failed_login_attempts >= 5:
            user.account_locked_until = datetime.utcnow() + timedelta(minutes=15)
        
        db.commit()
        await audit_service.log("login_failed", "user", user.id, ip_address, "Invalid password")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check MFA if enabled
    if user.mfa_enabled:
        if not credentials.mfa_token:
            # Return temporary token to verify MFA
            return {
                "access_token": auth_service.create_temp_mfa_token(user.id),
                "refresh_token": None,
                "user": None,
                "mfa_required": True
            }
        
        # Verify MFA token
        if not auth_service.verify_mfa(user, credentials.mfa_token):
            await audit_service.log("login_failed", "user", user.id, ip_address, "Invalid MFA")
            raise HTTPException(status_code=401, detail="Invalid MFA token")
    
    # Reset failed login attempts
    user.failed_login_attempts = 0
    user.last_login = datetime.utcnow()
    
    # Create session
    session_token = auth_service.create_access_token({"sub": user.id})
    refresh_token = auth_service.create_refresh_token({"sub": user.id})
    
    user_session = UserSession(
        user_id=user.id,
        session_token=session_token,
        refresh_token=refresh_token,
        ip_address=ip_address,
        user_agent=request.headers.get("user-agent"),
        expires_at=datetime.utcnow() + timedelta(hours=1)
    )
    db.add(user_session)
    db.commit()
    
    # Log successful login
    await audit_service.log("login_success", "user", user.id, ip_address, "User logged in")
    
    return LoginResponse(
        access_token=session_token,
        refresh_token=refresh_token,
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "department": user.department
        }
    )

@auth_router.post("/mfa/setup")
async def setup_mfa(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Setup multi-factor authentication (TOTP)
    
    Returns QR code for authenticator app
    """
    import pyotp
    
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)
    
    # Return QR code URL
    qr_code_url = totp.provisioning_uri(
        name=current_user.email,
        issuer_name="Secure DMS"
    )
    
    return {
        "secret": secret,
        "qr_code_url": qr_code_url,
        "backup_codes": [pyotp.random_base32() for _ in range(10)]
    }

@auth_router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user),
    request: Request = None,
    db: Session = Depends(get_db)
):
    """
    Logout user and invalidate session
    """
    # Invalidate session
    session = db.query(UserSession).filter(
        UserSession.user_id == current_user.id,
        UserSession.is_active == True
    ).first()
    
    if session:
        session.is_active = False
        db.commit()
    
    await audit_service.log("logout", "user", current_user.id, request.client.host)
    
    return {"message": "Logout successful"}

# ============================================================================
# DOCUMENT MANAGEMENT ENDPOINTS
# ============================================================================

document_router = APIRouter(prefix="/api/v1/documents", tags=["Documents"])

class DocumentUploadRequest(BaseModel):
    case_id: int
    document_type: str
    classification_level: str
    description: Optional[str] = None

class DocumentResponse(BaseModel):
    id: int
    filename: str
    document_type: str
    classification_level: str
    uploaded_at: datetime
    uploaded_by: str
    file_size: int
    is_encrypted: bool
    is_signed: bool
    blockchain_verified: bool

@document_router.post("/", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    case_id: int = Query(...),
    document_type: str = Query(...),
    classification_level: str = Query(...),
    description: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    document_service: DocumentService = Depends(),
    audit_service: AuditService = Depends(),
    request: Request = None
):
    """
    Upload a new document
    
    Security:
    - Files are encrypted with AES-256
    - File hash is calculated and stored
    - Document is recorded on blockchain
    - Full audit trail is maintained
    - File size limited to 50MB
    """
    # Check file size (50MB limit)
    file_size = await get_file_size(file)
    if file_size > 52428800:  # 50MB
        raise HTTPException(status_code=413, detail="File too large")
    
    # Check case access
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    if not has_case_access(current_user, case):
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Upload document
    try:
        document = await document_service.upload_document(
            file=file,
            user_id=current_user.id,
            case_id=case_id,
            document_type=document_type,
            classification_level=classification_level,
            description=description
        )
        
        # Log upload
        await audit_service.log(
            action="upload",
            resource_type="document",
            resource_id=document.id,
            user_id=current_user.id,
            ip_address=request.client.host,
            change_details={"filename": document.filename, "size": file_size}
        )
        
        return DocumentResponse(
            id=document.id,
            filename=document.filename,
            document_type=document.document_type,
            classification_level=document.classification,
            uploaded_at=document.uploaded_at,
            uploaded_by=current_user.name,
            file_size=document.file_size,
            is_encrypted=document.is_encrypted,
            is_signed=document.is_signed,
            blockchain_verified=document.blockchain_verified
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@document_router.get("/", response_model=List[DocumentResponse])
async def list_documents(
    case_id: Optional[int] = Query(None),
    document_type: Optional[str] = Query(None),
    classification: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    request: Request = None
):
    """
    List documents with filtering and pagination
    
    Applies access control - users only see documents they have access to
    """
    query = db.query(Document).filter(Document.deleted_at == None)
    
    # Apply filters
    if case_id:
        query = query.filter(Document.case_id == case_id)
    if document_type:
        query = query.filter(Document.document_type == document_type)
    if classification:
        query = query.filter(Document.classification == classification)
    
    # Apply access control
    if current_user.role != "admin":
        # User can only see documents they uploaded or have access to
        query = query.filter(
            (Document.uploaded_by == current_user.id) |
            (Document.id.in_(
                db.query(AccessControl.document_id)
                .filter(AccessControl.user_id == current_user.id)
            ))
        )
    
    documents = query.offset(skip).limit(limit).all()
    
    return [DocumentResponse(
        id=doc.id,
        filename=doc.filename,
        document_type=doc.document_type,
        classification_level=doc.classification,
        uploaded_at=doc.uploaded_at,
        uploaded_by=db.query(User).filter(User.id == doc.uploaded_by).first().name,
        file_size=doc.file_size,
        is_encrypted=doc.is_encrypted,
        is_signed=doc.is_signed,
        blockchain_verified=doc.blockchain_verified
    ) for doc in documents]

@document_router.get("/{document_id}/download")
async def download_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    document_service: DocumentService = Depends(),
    audit_service: AuditService = Depends(),
    request: Request = None
):
    """
    Download a document
    
    Security:
    - Checks access permissions
    - Verifies encryption
    - Logs access in audit trail
    - Increments access count if limited
    """
    # Get document
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check access
    access_control = db.query(AccessControl).filter(
        AccessControl.document_id == document_id,
        AccessControl.user_id == current_user.id,
        AccessControl.permission == "download"
    ).first()
    
    if not access_control and current_user.id != document.uploaded_by and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Check if access is expired
    if access_control and access_control.expires_at and access_control.expires_at < datetime.utcnow():
        raise HTTPException(status_code=403, detail="Access expired")
    
    # Check access count limit
    if access_control and access_control.max_access_count:
        if access_control.access_count >= access_control.max_access_count:
            raise HTTPException(status_code=403, detail="Access limit exceeded")
        access_control.access_count += 1
    
    # Get encrypted document
    encrypted_content = await document_service.get_document_content(document.file_path)
    
    # Decrypt if needed (client-side typically)
    decrypted_content = await document_service.decrypt_document(
        encrypted_content,
        document.encryption_key,
        current_user.id
    )
    
    # Log download
    await audit_service.log(
        action="download",
        resource_type="document",
        resource_id=document_id,
        user_id=current_user.id,
        ip_address=request.client.host,
        change_details={"filename": document.filename}
    )
    
    db.commit()
    
    return FileResponse(
        path=decrypted_content,
        filename=document.original_filename,
        media_type="application/octet-stream"
    )

@document_router.post("/{document_id}/sign")
async def sign_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    signature_service: SignatureService = Depends(),
    audit_service: AuditService = Depends(),
    request: Request = None
):
    """
    Digitally sign a document
    
    Security:
    - Uses RSA-SHA256 signature
    - Stores X.509 certificate
    - Records on blockchain
    - Creates timestamp proof
    """
    # Get document
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check permission
    if not has_signature_permission(current_user, document):
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # Create signature
    signature_data = await signature_service.sign_document(
        document_id=document_id,
        user_id=current_user.id,
        private_key=current_user.encryption_private_key
    )
    
    # Save signature to database
    digital_signature = DigitalSignature(
        document_id=document_id,
        signed_by=current_user.id,
        signature_hash=signature_data["signature_hash"],
        certificate_data=signature_data["certificate"],
        signed_at=datetime.utcnow()
    )
    db.add(digital_signature)
    
    # Record on blockchain
    blockchain_tx = await blockchain_service.record_signature(
        document_id=document_id,
        signature_hash=signature_data["signature_hash"]
    )
    digital_signature.blockchain_tx_hash = blockchain_tx
    
    document.is_signed = True
    document.signature_count = (document.signature_count or 0) + 1
    
    db.commit()
    
    # Log signature
    await audit_service.log(
        action="sign",
        resource_type="document",
        resource_id=document_id,
        user_id=current_user.id,
        ip_address=request.client.host,
        change_details={"signature_hash": signature_data["signature_hash"]}
    )
    
    return {
        "signature_id": digital_signature.id,
        "signed_at": digital_signature.signed_at,
        "blockchain_tx_hash": blockchain_tx,
        "verification_status": "signed"
    }

@document_router.get("/{document_id}/verify-integrity")
async def verify_document_integrity(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    blockchain_service: BlockchainService = Depends()
):
    """
    Verify document integrity using blockchain
    
    Returns:
    - integrity_status: intact, tampered, unverified
    - verification_time
    - blockchain_confirmation
    """
    # Get document
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check access
    if not has_document_access(current_user, document):
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Verify on blockchain
    verification_result = await blockchain_service.verify_document(
        document_id=document_id,
        expected_hash=document.blockchain_hash
    )
    
    return {
        "document_id": document_id,
        "integrity_status": verification_result["status"],
        "blockchain_hash": document.blockchain_hash,
        "current_hash": verification_result["current_hash"],
        "tamper_detected": verification_result["status"] == "tampered",
        "verification_time": datetime.utcnow(),
        "blockchain_confirmation_count": verification_result["confirmation_count"]
    }

@document_router.get("/{document_id}/versions")
async def get_document_versions(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get version history of a document
    
    Shows all versions with who made changes and when
    """
    # Get document
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check access
    if not has_document_access(current_user, document):
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get versions
    versions = db.query(DocumentVersion).filter(
        DocumentVersion.document_id == document_id
    ).order_by(DocumentVersion.version_number.desc()).all()
    
    return [
        {
            "version_number": v.version_number,
            "file_hash": v.file_hash,
            "file_size": v.file_size,
            "change_summary": v.change_summary,
            "changed_by": db.query(User).filter(User.id == v.changed_by).first().name,
            "created_at": v.created_at,
            "blockchain_verified": bool(v.blockchain_tx_hash)
        }
        for v in versions
    ]

# ============================================================================
# ACCESS CONTROL ENDPOINTS
# ============================================================================

access_router = APIRouter(prefix="/api/v1/access", tags=["Access Control"])

class GrantAccessRequest(BaseModel):
    document_id: int
    user_id: int
    permission: str  # view, download, edit, sign
    expires_at: Optional[datetime] = None
    max_access_count: Optional[int] = None

@access_router.post("/grant")
async def grant_access(
    request: GrantAccessRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    audit_service: AuditService = Depends(),
    http_request: Request = None
):
    """
    Grant access to a document
    
    Security:
    - Only document owner or admin can grant access
    - Can set expiration time
    - Can limit access count
    - Creates audit trail
    """
    # Verify user has permission
    document = db.query(Document).filter(Document.id == request.document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if document.uploaded_by != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # Create access control record
    access_control = AccessControl(
        document_id=request.document_id,
        user_id=request.user_id,
        permission=request.permission,
        granted_by=current_user.id,
        granted_at=datetime.utcnow(),
        expires_at=request.expires_at,
        max_access_count=request.max_access_count
    )
    db.add(access_control)
    db.commit()
    
    # Log access grant
    await audit_service.log(
        action="access_granted",
        resource_type="document",
        resource_id=request.document_id,
        user_id=current_user.id,
        ip_address=http_request.client.host,
        change_details={
            "granted_to_user_id": request.user_id,
            "permission": request.permission,
            "expires_at": request.expires_at.isoformat() if request.expires_at else None
        }
    )
    
    # Send notification
    await notification_service.notify(
        user_id=request.user_id,
        title="Document Access Granted",
        message=f"You have been granted {request.permission} access to: {document.filename}"
    )
    
    return {
        "access_control_id": access_control.id,
        "status": "access_granted"
    }

@access_router.get("/{document_id}")
async def get_document_access(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all access controls for a document
    
    Only owner or admin can view
    """
    # Get document
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check permission
    if document.uploaded_by != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # Get access controls
    access_controls = db.query(AccessControl).filter(
        AccessControl.document_id == document_id
    ).all()
    
    return [
        {
            "id": ac.id,
            "user_id": ac.user_id,
            "user_name": db.query(User).filter(User.id == ac.user_id).first().name,
            "permission": ac.permission,
            "granted_at": ac.granted_at,
            "expires_at": ac.expires_at,
            "max_access_count": ac.max_access_count,
            "access_count": ac.access_count
        }
        for ac in access_controls
    ]

# ============================================================================
# AUDIT AND COMPLIANCE ENDPOINTS
# ============================================================================

audit_router = APIRouter(prefix="/api/v1/audit", tags=["Audit"])

@audit_router.get("/logs")
async def get_audit_logs(
    resource_type: Optional[str] = Query(None),
    resource_id: Optional[int] = Query(None),
    action: Optional[str] = Query(None),
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get audit logs
    
    Only admin and authorized users can view
    """
    if current_user.role not in ["admin", "case_manager"]:
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # Build query
    query = db.query(AuditLog)
    
    if resource_type:
        query = query.filter(AuditLog.resource_type == resource_type)
    if resource_id:
        query = query.filter(AuditLog.resource_id == resource_id)
    if action:
        query = query.filter(AuditLog.action == action)
    
    # Filter by date
    start_date = datetime.utcnow() - timedelta(days=days)
    query = query.filter(AuditLog.timestamp >= start_date)
    
    logs = query.order_by(AuditLog.timestamp.desc()).limit(1000).all()
    
    return [
        {
            "id": log.id,
            "user_id": log.user_id,
            "username": log.username,
            "action": log.action,
            "resource_type": log.resource_type,
            "resource_id": log.resource_id,
            "timestamp": log.timestamp,
            "ip_address": str(log.ip_address),
            "success": log.success,
            "blockchain_verified": log.blockchain_verified
        }
        for log in logs
    ]

# ============================================================================
# BLOCKCHAIN VERIFICATION ENDPOINTS
# ============================================================================

blockchain_router = APIRouter(prefix="/api/v1/blockchain", tags=["Blockchain"])

@blockchain_router.post("/verify")
async def verify_on_blockchain(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    blockchain_service: BlockchainService = Depends()
):
    """
    Force verification of document on blockchain
    
    Used to ensure document is recorded and verify integrity
    """
    # Get document
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check access
    if document.uploaded_by != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # Record on blockchain
    tx_hash = await blockchain_service.record_document(
        document_id=document_id,
        document_hash=document.file_hash
    )
    
    # Update document
    document.blockchain_tx_hash = tx_hash
    db.commit()
    
    return {
        "document_id": document_id,
        "transaction_hash": tx_hash,
        "status": "pending_confirmation",
        "message": "Document queued for blockchain verification"
    }

@blockchain_router.get("/hash/{document_id}")
async def get_blockchain_hash(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get blockchain hash for a document
    """
    # Get document
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check access
    if not has_document_access(current_user, document):
        raise HTTPException(status_code=403, detail="Permission denied")
    
    return {
        "document_id": document_id,
        "blockchain_hash": document.blockchain_hash,
        "blockchain_tx_hash": document.blockchain_tx_hash,
        "blockchain_verified": document.blockchain_verified,
        "blockchain_verified_at": document.blockchain_verified_at
    }

# ============================================================================
# APPLICATION STARTUP AND CONFIGURATION
# ============================================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI(
    title="Secure DMS API",
    description="Secure Digital Document Management System",
    version="1.0.0"
)

# Add security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "api.dms.example.com"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://dms.example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(document_router)
app.include_router(access_router)
app.include_router(audit_router)
app.include_router(blockchain_router)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

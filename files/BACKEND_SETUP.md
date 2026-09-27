# FastAPI Backend Setup Guide

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                          # Application entry point
│   ├── config.py                        # Configuration management
│   ├── dependencies.py                  # Dependency injection
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py              # Authentication endpoints
│   │   │   │   ├── documents.py         # Document management
│   │   │   │   ├── cases.py             # Case management
│   │   │   │   ├── access_control.py    # Permission management
│   │   │   │   ├── blockchain.py        # Blockchain operations
│   │   │   │   ├── audit.py             # Audit trail
│   │   │   │   ├── search.py            # Search operations
│   │   │   │   └── analytics.py         # Analytics
│   │   │   └── router.py                # Route aggregator
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── document.py
│   │   ├── case.py
│   │   ├── access_control.py
│   │   ├── audit_log.py
│   │   ├── signature.py
│   │   └── blockchain.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py                      # Pydantic schemas
│   │   ├── document.py
│   │   ├── case.py
│   │   └── common.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── document_service.py
│   │   ├── case_service.py
│   │   ├── encryption_service.py
│   │   ├── blockchain_service.py
│   │   ├── signature_service.py
│   │   ├── audit_service.py
│   │   ├── search_service.py
│   │   ├── notification_service.py
│   │   └── storage_service.py
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py                  # JWT, encryption
│   │   ├── config.py                    # Env variables
│   │   ├── logger.py                    # Logging setup
│   │   └── exceptions.py                # Custom exceptions
│   │
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── auth_middleware.py
│   │   ├── audit_middleware.py
│   │   ├── error_handler.py
│   │   └── cors_middleware.py
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── validators.py
│   │   ├── formatters.py
│   │   └── constants.py
│   │
│   └── db/
│       ├── __init__.py
│       ├── database.py                  # Database connection
│       ├── base.py                      # Base model
│       └── session.py                   # Session management
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_documents.py
│   ├── test_security.py
│   └── test_blockchain.py
│
├── migrations/                          # Alembic migrations
│   ├── versions/
│   └── env.py
│
├── requirements.txt
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Installation & Setup

### 1. Create Python Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. requirements.txt

```txt
# FastAPI and ASGI
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6

# Database
sqlalchemy==2.0.23
alembic==1.13.0
psycopg2-binary==2.9.9
sqlmodel==0.0.14

# Authentication & Security
python-jose==3.3.0
passlib==1.7.4
bcrypt==4.1.1
cryptography==41.0.7
pydantic==2.5.0
pydantic-settings==2.1.0

# JWT & OAuth
PyJWT==2.8.1

# Encryption
cryptography==41.0.7
pycryptodome==3.19.0

# Blockchain
web3==6.11.1
eth-account==0.10.0
eth-keys==0.4.0

# File Storage
minio==7.2.0
python-magic==0.4.27

# Search & Indexing
elasticsearch==8.11.0

# Caching & Message Queue
redis==5.0.1
celery==5.3.4

# Email
python-dotenv==1.0.0
aiosmtplib==3.0.1

# OCR & AI
pytesseract==0.3.10
Pillow==10.1.0

# Monitoring
prometheus-client==0.19.0

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
httpx==0.25.2

# Utilities
python-dateutil==2.8.2
requests==2.31.0
```

### 4. Environment Configuration (.env.example)

```env
# Application
APP_NAME=Secure DMS
APP_VERSION=1.0.0
DEBUG=False
ENVIRONMENT=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dms_db
DB_ECHO=False

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# JWT
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256

# Encryption
ENCRYPTION_KEY=your-encryption-key-base64-encoded

# AWS / S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=dms-documents

# MinIO (if using MinIO instead)
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_URL=http://localhost:9000

# Blockchain
BLOCKCHAIN_RPC_URL=http://localhost:8545
ETHEREUM_PRIVATE_KEY=your-private-key
SMART_CONTRACT_ADDRESS=0x...
NETWORK_ID=1

# Redis
REDIS_URL=redis://localhost:6379/0

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# CORS
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
CORS_ALLOW_CREDENTIALS=True

# Logging
LOG_LEVEL=INFO
LOG_FILE=app.log

# MFA
MFA_ISSUER=Secure DMS
MFA_WINDOW=1

# File Upload
MAX_FILE_SIZE=52428800  # 50MB
ALLOWED_EXTENSIONS=pdf,doc,docx,jpg,jpeg,png,tiff

# Audit & Compliance
AUDIT_RETENTION_DAYS=2555  # 7 years
DATA_RETENTION_DAYS=2555
```

### 5. Database Initialization

```bash
# Initialize Alembic
alembic init migrations

# Create migration
alembic revision --autogenerate -m "Initial schema"

# Apply migrations
alembic upgrade head
```

### 6. Create Initial SQLAlchemy Models

**app/models/user.py**
```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.db.base import Base

class RoleEnum(str, enum.Enum):
    ADMIN = "admin"
    CASE_MANAGER = "case_manager"
    INVESTIGATOR = "investigator"
    JUDGE = "judge"
    LAWYER = "lawyer"
    WITNESS = "witness"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    role = Column(Enum(RoleEnum), default=RoleEnum.INVESTIGATOR)
    department = Column(String)
    is_active = Column(Boolean, default=True)
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    documents = relationship("Document", back_populates="owner")
    audit_logs = relationship("AuditLog", back_populates="user")
```

**app/models/document.py**
```python
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.db.base import Base

class DocumentTypeEnum(str, enum.Enum):
    FIR = "fir"
    REPORT = "report"
    WITNESS_STATEMENT = "witness_statement"
    CHARGE_SHEET = "charge_sheet"
    EVIDENCE = "evidence"
    JUDGMENT = "judgment"
    OTHER = "other"

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    original_filename = Column(String)
    file_type = Column(String)  # PDF, DOC, etc.
    file_size = Column(Integer)  # Size in bytes
    file_path = Column(String)  # Path in storage
    file_hash = Column(String, unique=True)  # SHA-256 hash
    
    case_id = Column(Integer, ForeignKey("cases.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    document_type = Column(Enum(DocumentTypeEnum))
    classification_level = Column(String)  # Public, Confidential, Secret
    description = Column(Text)
    
    is_encrypted = Column(Boolean, default=True)
    encryption_key = Column(String)  # Encrypted key storage
    
    is_signed = Column(Boolean, default=False)
    blockchain_hash = Column(String, nullable=True)  # Blockchain verification
    blockchain_tx_hash = Column(String, nullable=True)  # Transaction hash
    
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)  # Soft delete
    
    owner = relationship("User", back_populates="documents")
    case = relationship("Case", back_populates="documents")
    versions = relationship("DocumentVersion", back_populates="document", cascade="all, delete-orphan")
    signatures = relationship("DigitalSignature", back_populates="document")
    access_controls = relationship("AccessControl", back_populates="document", cascade="all, delete-orphan")
```

## Running the Application

```bash
# Development
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## Docker Deployment

**Dockerfile**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: dms_db
      POSTGRES_USER: dms_user
      POSTGRES_PASSWORD: dms_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  fastapi:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
      - minio
      - elasticsearch
    environment:
      DATABASE_URL: postgresql://dms_user:dms_password@postgres:5432/dms_db
      REDIS_URL: redis://redis:6379/0
      MINIO_URL: http://minio:9000
      ELASTICSEARCH_URL: http://elasticsearch:9200
    volumes:
      - .:/app

volumes:
  postgres_data:
  minio_data:
  elasticsearch_data:
```

Run with:
```bash
docker-compose up -d
```

## Key Implementation Files

### Authentication Service (app/services/auth_service.py)

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import EmailStr

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self, config):
        self.config = config
        self.pwd_context = pwd_context
    
    def hash_password(self, password: str) -> str:
        return self.pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=self.config.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.config.SECRET_KEY, algorithm=self.config.ALGORITHM)
        return encoded_jwt
    
    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, self.config.SECRET_KEY, algorithms=[self.config.ALGORITHM])
            user_id: int = payload.get("sub")
            if user_id is None:
                return None
            return user_id
        except JWTError:
            return None
```

### Document Service (app/services/document_service.py)

```python
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.document import Document
from app.services.encryption_service import EncryptionService
from app.services.blockchain_service import BlockchainService
import hashlib

class DocumentService:
    def __init__(self, db: Session, encryption_service: EncryptionService, blockchain_service: BlockchainService):
        self.db = db
        self.encryption = encryption_service
        self.blockchain = blockchain_service
    
    async def upload_document(self, file, user_id: int, case_id: int, document_type: str):
        # Read file content
        content = await file.read()
        
        # Calculate hash
        file_hash = hashlib.sha256(content).hexdigest()
        
        # Check if document already exists
        existing = self.db.query(Document).filter(Document.file_hash == file_hash).first()
        if existing:
            raise ValueError("Document already exists")
        
        # Encrypt content
        encrypted_content, encryption_key = self.encryption.encrypt(content)
        
        # Store in object storage
        file_path = await self.storage.save(encrypted_content, file.filename)
        
        # Create document record
        doc = Document(
            filename=file.filename,
            file_type=file.content_type,
            file_size=len(content),
            file_path=file_path,
            file_hash=file_hash,
            owner_id=user_id,
            case_id=case_id,
            document_type=document_type,
            is_encrypted=True,
            encryption_key=encryption_key
        )
        
        self.db.add(doc)
        self.db.commit()
        
        # Store on blockchain
        blockchain_tx = await self.blockchain.record_document(doc.id, file_hash)
        doc.blockchain_tx_hash = blockchain_tx
        self.db.commit()
        
        return doc
    
    async def get_document(self, document_id: int, user_id: int):
        doc = self.db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            raise ValueError("Document not found")
        
        # Check access
        if not self.has_access(doc, user_id):
            raise ValueError("Access denied")
        
        # Log access
        await self.audit_service.log("download", document_id, user_id)
        
        return doc
    
    def has_access(self, document: Document, user_id: int) -> bool:
        # Check RBAC and time-based access
        return True  # Implement access control logic
```

This setup provides a solid foundation for building the Secure DMS backend with FastAPI!


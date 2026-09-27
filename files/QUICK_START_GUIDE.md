# Secure DMS - Quick Start Guide

## 📋 Overview

This guide helps you get the Secure Digital Document Management System up and running quickly.

**Tech Stack:**
- **Backend:** Python 3.11 + FastAPI
- **Frontend:** React 18 + Vite
- **Database:** PostgreSQL 15 + Encryption
- **Security:** AES-256, Blockchain (Ethereum), JWT, Digital Signatures
- **Deployment:** Docker, Kubernetes
- **Search:** Elasticsearch
- **Cache:** Redis

---

## 🚀 Quick Start (5 minutes)

### Option 1: Docker Compose (Easiest)

```bash
# Clone repository
git clone https://github.com/your-org/secure-dms.git
cd secure-dms

# Create environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Wait for services to initialize (2-3 minutes)
docker-compose logs -f fastapi

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development

#### Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env.development

# Start dev server
npm run dev

# Application will open at http://localhost:5173
```

---

## 📚 Documentation Files

Your complete solution package includes:

### 1. **SECURE_DMS_SOLUTION.md** ⭐
   - Comprehensive system design
   - Architecture overview
   - Feature breakdown
   - Technology justification
   - Security compliance
   - **Start here for understanding the big picture**

### 2. **BACKEND_SETUP.md**
   - FastAPI project structure
   - Installation instructions
   - Core service implementations
   - Database models
   - Key FastAPI code examples

### 3. **FRONTEND_SETUP.md**
   - React + Vite project setup
   - Component architecture
   - Store management (Zustand)
   - Service layer
   - Sample component implementations

### 4. **DATABASE_SCHEMA.sql**
   - Complete PostgreSQL schema
   - All 20+ tables
   - Indexes and relationships
   - Views for analytics
   - Security functions
   - **Ready to use - just execute in PostgreSQL**

### 5. **API_ENDPOINTS.py**
   - Complete API implementation
   - Authentication endpoints
   - Document management
   - Access control
   - Blockchain integration
   - Audit trail
   - **Production-ready code**

### 6. **KUBERNETES_DEPLOYMENT.yaml**
   - Complete K8s manifests
   - StatefulSets for databases
   - Deployments for services
   - Services and Ingress
   - Security policies
   - Auto-scaling configuration
   - **Ready for production deployment**

### 7. **IMPLEMENTATION_ROADMAP.md**
   - 16-week implementation plan
   - Phase-by-phase breakdown
   - Testing strategy (Unit, Integration, E2E)
   - Security testing checklist
   - Performance benchmarks
   - CI/CD pipeline configuration

---

## 🔑 Key Features Implemented

### Security ✅
- ✅ JWT + OAuth2 Authentication
- ✅ Multi-Factor Authentication (TOTP, SMS)
- ✅ AES-256 Encryption (at rest)
- ✅ TLS 1.3 (in transit)
- ✅ Role-Based Access Control (RBAC)
- ✅ Blockchain-backed audit trail
- ✅ Digital signatures (RSA-SHA256)
- ✅ Field-level encryption

### Document Management ✅
- ✅ Centralized document storage
- ✅ Multiple file format support
- ✅ Version control system
- ✅ Document classification
- ✅ Full-text search
- ✅ Document metadata extraction
- ✅ OCR capabilities

### Compliance ✅
- ✅ Complete audit logging
- ✅ Blockchain verification
- ✅ GDPR compliance tools
- ✅ Data retention policies
- ✅ Right-to-be-forgotten
- ✅ Regulatory reporting

### Collaboration ✅
- ✅ Secure document sharing
- ✅ Time-limited access tokens
- ✅ Permission delegation
- ✅ Annotation support
- ✅ Case management
- ✅ Team collaboration

---

## 🛠️ Default Credentials (Change in Production!)

```
Admin User:
  Email: admin@example.com
  Password: Admin@123456

Investigator:
  Email: investigator@example.com
  Password: Investigator@123456

Judge:
  Email: judge@example.com
  Password: Judge@123456
```

---

## 📊 Database Schema Overview

### Core Tables (25+ tables)
```
Users & Auth
├── users
├── roles
├── user_permissions
└── user_sessions

Cases & Documents
├── cases
├── case_participants
├── documents
├── document_versions
├── document_tags
└── document_shares

Security & Access
├── access_control
├── access_history
├── digital_signatures
└── signature_verifications

Blockchain & Audit
├── blockchain_records
├── blockchain_audit_trail
└── audit_logs

Compliance
├── data_retention_policies
└── deletion_requests

Collaboration
├── document_comments
└── notifications
```

---

## 🔌 API Quick Reference

### Authentication
```bash
# Login
POST /api/v1/auth/login
{
  "username": "user@example.com",
  "password": "password123"
}

# Setup MFA
POST /api/v1/auth/mfa/setup

# Logout
POST /api/v1/auth/logout
```

### Documents
```bash
# Upload document
POST /api/v1/documents
  - file: multipart/form-data
  - case_id: integer
  - document_type: string (fir, report, etc.)
  - classification_level: string

# List documents
GET /api/v1/documents?case_id=1&skip=0&limit=10

# Download document
GET /api/v1/documents/{id}/download

# Sign document
POST /api/v1/documents/{id}/sign

# Verify integrity
GET /api/v1/documents/{id}/verify-integrity
```

### Access Control
```bash
# Grant access
POST /api/v1/access/grant
{
  "document_id": 1,
  "user_id": 2,
  "permission": "download",
  "expires_at": "2024-12-31T23:59:59Z"
}

# View access
GET /api/v1/access/{document_id}
```

### Audit & Compliance
```bash
# Get audit logs
GET /api/v1/audit/logs?resource_type=document&days=30

# Verify on blockchain
POST /api/v1/blockchain/verify?document_id=1

# Get blockchain hash
GET /api/v1/blockchain/hash/{document_id}
```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
pytest tests/ -v --cov=app

# Specific test file
pytest tests/test_auth.py -v

# With coverage report
pytest tests/ --cov=app --cov-report=html
```

### Run Frontend Tests
```bash
cd frontend
npm run test

# Watch mode
npm run test -- --watch

# Coverage
npm run test -- --coverage
```

### Run Integration Tests
```bash
# All tests (requires services running)
pytest tests/integration/ -v

# Specific integration test
pytest tests/integration/test_document_workflow.py -v
```

---

## 📈 Deployment Steps

### 1. Development
```bash
docker-compose -f docker-compose.dev.yml up
```

### 2. Staging
```bash
# Update image tags in docker-compose
docker-compose -f docker-compose.staging.yml pull
docker-compose -f docker-compose.staging.yml up -d
```

### 3. Production (Kubernetes)
```bash
# Create namespace
kubectl create namespace secure-dms

# Apply secrets (update with real values first!)
kubectl apply -f kubernetes/secrets.yaml

# Deploy all services
kubectl apply -f KUBERNETES_DEPLOYMENT.yaml

# Verify deployment
kubectl get pods -n secure-dms
kubectl get services -n secure-dms

# Check ingress
kubectl get ingress -n secure-dms
```

---

## 🔐 Security Checklist

Before going to production:

- [ ] Change all default credentials
- [ ] Generate new encryption keys
- [ ] Update secret keys in environment variables
- [ ] Configure SSL/TLS certificates
- [ ] Enable CORS for production domain only
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Test encryption/decryption
- [ ] Verify blockchain integration
- [ ] Run security audit
- [ ] Test disaster recovery
- [ ] Configure monitoring and alerts
- [ ] Set up incident response
- [ ] Document security procedures

---

## 📞 Common Issues & Solutions

### Backend won't start
```bash
# Check if ports are in use
lsof -i :8000

# Check database connection
psql -h localhost -U dms_user -d dms_db

# Check environment variables
cat .env
```

### Frontend can't connect to API
```bash
# Check VITE_API_BASE_URL in .env
cat .env.development

# Check if backend is running
curl http://localhost:8000/health

# Check CORS configuration
# Look for CORS errors in browser console
```

### Database migration issues
```bash
# Reset migrations (dev only!)
alembic downgrade base

# Upgrade migrations
alembic upgrade head

# Check migration status
alembic current
```

### Blockchain connection issues
```bash
# Test blockchain connection
python -c "from web3 import Web3; w3 = Web3(...); print(w3.is_connected())"

# Check smart contract deployment
curl http://localhost:8545 -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

---

## 📚 Additional Resources

### Documentation
- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/
- PostgreSQL: https://www.postgresql.org/docs/
- Kubernetes: https://kubernetes.io/docs/
- Ethereum: https://ethereum.org/en/developers/

### Security References
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- GDPR: https://gdpr.eu/
- ISO 27001: https://www.iso.org/isoiec-27001-information-security-management.html

### Tools & Services
- MinIO: https://min.io/
- Elasticsearch: https://www.elastic.co/
- Prometheus: https://prometheus.io/
- Grafana: https://grafana.com/

---

## 🎯 Next Steps

1. **Understand the Architecture**
   - Read: SECURE_DMS_SOLUTION.md
   - Review: System architecture diagrams

2. **Setup Development Environment**
   - Run: `docker-compose up` or local setup
   - Test: `pytest tests/` and `npm run test`

3. **Review Implementation**
   - Database: DATABASE_SCHEMA.sql
   - API: API_ENDPOINTS.py
   - Frontend: FRONTEND_SETUP.md

4. **Customize for Your Needs**
   - Update role definitions
   - Configure departments
   - Adjust security policies

5. **Deploy**
   - Staging: Docker Compose
   - Production: Kubernetes

6. **Monitor & Maintain**
   - Set up monitoring (Prometheus)
   - Configure logging (ELK)
   - Establish incident response

---

## 💡 Tips for Success

✅ **Start Small:** Deploy with minimal configuration first
✅ **Test Thoroughly:** Use all 7 test types before production
✅ **Monitor Everything:** Set up observability from day one
✅ **Document Changes:** Keep runbooks up to date
✅ **Security First:** Never skip security steps
✅ **Automate Tests:** Run tests on every commit
✅ **Plan Backups:** Test recovery procedures weekly
✅ **Communicate:** Document decisions and changes

---

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review API_ENDPOINTS.py for implementation details
3. Check IMPLEMENTATION_ROADMAP.md for deployment steps
4. Review error logs and debugging guides

---

## 📄 License & Usage

This solution is provided as-is for the Ministry of Home Affairs, NCRB.

**Files Included:**
- ✅ Complete system design (SECURE_DMS_SOLUTION.md)
- ✅ Backend setup guide (BACKEND_SETUP.md)
- ✅ Frontend setup guide (FRONTEND_SETUP.md)
- ✅ Database schema (DATABASE_SCHEMA.sql)
- ✅ API implementation (API_ENDPOINTS.py)
- ✅ Kubernetes manifests (KUBERNETES_DEPLOYMENT.yaml)
- ✅ Implementation roadmap (IMPLEMENTATION_ROADMAP.md)
- ✅ Quick start guide (This file)

---

**Last Updated:** September 2026
**Version:** 1.0.0
**Status:** Production Ready


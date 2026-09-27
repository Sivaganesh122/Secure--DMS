# System Architecture Document

## SecureDoc DMS — Cloud-Deployed, AI-Powered, Blockchain-Secured Architecture

---

## 1. Architecture Overview

SecureDoc DMS follows a **cloud-deployed layered architecture** with six distinct layers. The system is designed for multi-location, multi-department access — police stations, courts, prosecutor offices, and forensic labs all connect to a central cloud server.

### 1.1 High-Level Architecture Diagram

```
                         CLIENTS (Multiple Locations)
  +-------------+  +-------------+  +-------------+  +-------------+
  | Police      |  | Prosecutor  |  | Court       |  | Forensic    |
  | Station     |  | Office      |  | Terminal    |  | Lab         |
  | (Browser)   |  | (Browser)   |  | (Browser)   |  | (Browser)   |
  +------+------+  +------+------+  +------+------+  +------+------+
         |                |                |                |
         +--------+-------+--------+-------+--------+------+
                  |                |                |
              HTTPS (TLS 1.3) / VPN / Government Network
                  |                |                |
  +===============|================|================|===============+
  |               |    CLOUD SERVER (NIC/MeghRaj/AWS)               |
  |               |                                                  |
  |  +------------v------------------------------------------------+|
  |  |              REVERSE PROXY (Nginx)                           ||
  |  |  TLS termination | Rate limiting | Static files | Gzip      ||
  |  +---------------------------+----------------------------------+|
  |                              |                                   |
  |  +---------------------------v----------------------------------+|
  |  |              APPLICATION SERVER (FastAPI + Uvicorn)          ||
  |  |                                                              ||
  |  |  +--------------------------------------------------------+ ||
  |  |  |  MIDDLEWARE: CORS > JWT Auth > Rate Limit > Audit Log   | ||
  |  |  +--------------------------------------------------------+ ||
  |  |                                                              ||
  |  |  +----------+ +----------+ +--------+ +--------+ +--------+ ||
  |  |  | Auth     | | Documents| | Cases  | | Search | | Block- | ||
  |  |  | Routes   | | Routes   | | Routes | | Routes | | chain  | ||
  |  |  | /auth/*  | | /docs/*  | | /cases | | /search| | Routes | ||
  |  |  +----------+ +----------+ +--------+ +--------+ +--------+ ||
  |  |                                                              ||
  |  |  +----------+ +----------+ +----------+ +---------+         ||
  |  |  | Audit    | | Custody  | | Signature| | System  |         ||
  |  |  | Routes   | | Routes   | | Routes   | | Routes  |         ||
  |  |  | /audit/* | | /custody | | /sign/*  | | /health |         ||
  |  |  +----------+ +----------+ +----------+ +---------+         ||
  |  +--------------------------------------------------------------+|
  |                              |                                   |
  |  +---------------------------v----------------------------------+|
  |  |              SERVICE LAYER                                   ||
  |  |                                                              ||
  |  |  +----------+ +----------+ +----------+ +----------+        ||
  |  |  | Auth     | | Parser   | | Indexer  | | Search   |        ||
  |  |  | Service  | | PDF/DOCX | | AI class | | BM25 +   |        ||
  |  |  | JWT+RBAC | | OCR      | | Summary  | | Vector + |        ||
  |  |  |          | |          | | Tags     | | Rerank   |        ||
  |  |  +----------+ +----------+ +----------+ +----------+        ||
  |  |                                                              ||
  |  |  +----------+ +----------+ +----------+                     ||
  |  |  | Block-   | | Signature| | Integrity|                     ||
  |  |  | chain    | | Service  | | Service  |                     ||
  |  |  | Service  | | RSA/ECDSA| | SHA-256  |                     ||
  |  |  | Merkle   | | PKI ops  | | Tamper   |                     ||
  |  |  +----------+ +----------+ +----------+                     ||
  |  +--------------------------------------------------------------+|
  |                              |                                   |
  |  +---------------------------v----------------------------------+|
  |  |              AI/ML LAYER (GPU Accelerated)                   ||
  |  |                                                              ||
  |  |  +----------------+ +----------------+ +-----------------+   ||
  |  |  | GTE-Large      | | BART-CNN       | | DeBERTa-v3      |   ||
  |  |  | Embeddings     | | Summarizer     | | Classifier      |   ||
  |  |  | (1024-dim)     | |                | | (Zero-shot NLI) |   ||
  |  |  +----------------+ +----------------+ +-----------------+   ||
  |  |                                                              ||
  |  |  +----------------+ +--------------------+                   ||
  |  |  | GTE-Reranker   | | PaddleOCR+Tesseract|                   ||
  |  |  | Cross-encoder  | | Dual OCR engine    |                   ||
  |  |  +----------------+ +--------------------+                   ||
  |  +--------------------------------------------------------------+|
  |                              |                                   |
  |  +---------------------------v----------------------------------+|
  |  |              STORAGE LAYER                                   ||
  |  |                                                              ||
  |  |  +-------------+  +-------------+  +-----------+ +---------+ ||
  |  |  | PostgreSQL  |  | ChromaDB    |  | File      | | HF Model| ||
  |  |  | (Primary DB)|  | (Vectors)   |  | System    | | Cache   | ||
  |  |  |             |  |             |  |           | |         | ||
  |  |  | - users     |  | - doc chunks|  | - uploads/| | - GTE   | ||
  |  |  | - cases     |  | - HNSW cos  |  | - versions| | - BART  | ||
  |  |  | - documents |  | - 1024-dim  |  | - keys/   | | - DeBER | ||
  |  |  | - audit_log |  |             |  |           | | - OCR   | ||
  |  |  | - blockchain|  |             |  |           | |         | ||
  |  |  | - signatures|  |             |  |           | |         | ||
  |  |  | - custody   |  |             |  |           | |         | ||
  |  |  | - full-text |  |             |  |           | |         | ||
  |  |  +-------------+  +-------------+  +-----------+ +---------+ ||
  |  +--------------------------------------------------------------+|
  |                                                                  |
  |  GPU: NVIDIA CUDA (or CPU fallback)                             |
  |  OS: Ubuntu 22.04+ / Docker Container                          |
  +==================================================================+
```

---

## 2. Key Architectural Changes from DocuSync

| Aspect | DocuSync (Before) | SecureDoc DMS (After) | Why |
|---|---|---|---|
| **Deployment** | Local machine only | Cloud server, multi-location access | Problem statement requires collaboration between departments |
| **Database** | SQLite (single-user) | PostgreSQL (multi-user concurrent) | Hundreds of simultaneous users across departments |
| **Authentication** | None | JWT + bcrypt + RBAC (7 roles) | Secure access control is a core requirement |
| **Audit** | None | Blockchain hash-chain + Merkle tree | Immutable audit trail required |
| **Signatures** | None | RSA/ECDSA PKI per-user key pairs | Digital signatures explicitly required |
| **Integrity** | None | SHA-256 on upload + periodic verification | Prevent unauthorized modifications |
| **Sharing** | Not possible | Access grants with permissions + expiry | Inter-department collaboration required |
| **Search** | Open to anyone | Permission-filtered results | Users only see documents they're authorized to view |

---

## 3. Blockchain Architecture (Detailed)

### 3.1 Hash-Chain Structure

```
  BLOCKCHAIN AUDIT LEDGER
  
  +-- Block 0 (Genesis) -------+     +-- Block 1 -----------------+
  | Block Hash: 0x7a3f...      |     | Block Hash: 0xb2c1...      |
  | Prev Hash:  0x0000...      |     | Prev Hash:  0x7a3f...      |<-- links to Block 0
  | Timestamp:  2026-01-01     |     | Timestamp:  2026-08-29     |
  | Merkle Root: 0x1a2b...     |     | Merkle Root: 0x4d5e...     |
  | Entries: 1                 |     | Entries: 4                 |
  |                            |     |                            |
  | Entry 0:                   |     | Entry 1: IO uploads FIR    |
  |   system_initialized       |     | Entry 2: IO signs FIR      |
  |                            |     | Entry 3: SHO countersigns  |
  +----------------------------+     | Entry 4: Prosecutor views   |
                                     +----------------------------+
                                                   |
                                     +-- Block 2 -----------------+
                                     | Block Hash: 0xd4e5...      |
                                     | Prev Hash:  0xb2c1...      |<-- links to Block 1
                                     | Timestamp:  2026-08-30     |
                                     | Merkle Root: 0x7f8g...     |
                                     | Entries: 3                 |
                                     |                            |
                                     | Entry 5: Prosecutor downloads|
                                     | Entry 6: Judge verifies    |
                                     | Entry 7: Judge views custody|
                                     +----------------------------+
```

### 3.2 Merkle Tree Within Each Block

```
  Block 1 has 4 entries. Merkle tree:
  
                    Merkle Root: H(H12 + H34)
                   /                          \
          H12: H(H1 + H2)              H34: H(H3 + H4)
         /              \             /              \
  H1: SHA256(Entry1)  H2: SHA256(Entry2)  H3: SHA256(Entry3)  H4: SHA256(Entry4)
  
  To prove Entry 2 exists without revealing other entries:
  Proof = [H1, H34]  (only 2 hashes for 4 entries = O(log n))
  Verify: H(H(H1 + H2) + H34) == Merkle Root?
```

### 3.3 Blockchain API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `GET /blockchain/status` | GET | Chain length, last block hash, verification status |
| `POST /blockchain/verify` | POST | Full chain verification (walk every block) |
| `GET /blockchain/blocks` | GET | List blocks with pagination |
| `GET /blockchain/blocks/{id}` | GET | Single block with entries |
| `GET /blockchain/entries/{id}/proof` | GET | Merkle proof for a specific entry |
| `GET /blockchain/document/{doc_id}` | GET | All blockchain entries for a document |

---

## 4. Digital Signature Architecture

### 4.1 PKI Key Management

```
  USER REGISTRATION:
  
  Admin creates user "IO Kumar"
    --> System generates RSA-2048 key pair
    --> Private key encrypted with user's password-derived key (PBKDF2)
    --> Encrypted private key stored in database
    --> Public key stored in database (accessible to all for verification)
    --> Key fingerprint displayed to user for verification
```

### 4.2 Signing Flow

```
  IO Kumar wants to sign FIR-2026-001:
  
  1. Client sends: POST /documents/{id}/sign
  2. Server retrieves document file
  3. Server computes SHA-256 hash of file content
  4. Server decrypts IO Kumar's private key (using session-derived key)
  5. Server creates signature: RSA_SIGN(private_key, SHA256_hash)
  6. Server stores:
     - signature_data (bytes)
     - signer_user_id
     - signer_public_key_fingerprint
     - signed_hash (the hash that was signed)
     - timestamp
     - purpose (e.g., "authentication", "approval", "attestation")
  7. Blockchain entry: "IO Kumar signed FIR-2026-001 at 09:15:00"
  8. Response: {signed: true, signer: "IO Kumar", timestamp: "..."}
```

### 4.3 Verification Flow

```
  Prosecutor verifies signature on FIR-2026-001:
  
  1. Client sends: GET /documents/{id}/signatures
  2. Server returns all signatures on this document
  3. For each signature:
     a. Retrieve signer's public key
     b. Decrypt signature using public key --> original_hash
     c. Recompute SHA-256 of current document --> current_hash
     d. Compare: original_hash == current_hash?
        - YES: "Valid signature by IO Kumar. Document not modified since signing."
        - NO:  "INVALID! Document modified after IO Kumar's signature."
  4. Blockchain entry: "Prosecutor verified signatures on FIR-2026-001"
```

### 4.4 Signature API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `POST /documents/{id}/sign` | POST | Sign a document |
| `GET /documents/{id}/signatures` | GET | List all signatures |
| `POST /documents/{id}/verify-signatures` | POST | Verify all signatures |
| `GET /users/{id}/public-key` | GET | Get user's public key |

---

## 5. Data Architecture

### 5.1 Database (PostgreSQL)

**Core Tables**:
- `users` — id, username, email, password_hash, role, department, public_key, encrypted_private_key, is_active, created_at
- `cases` — id, case_number, title, description, status, priority, crime_category, created_by, assigned_to, department, created_at, updated_at
- `documents` — id, filename, file_size, page_count, summary, tags, classifications, key_findings, doc_type, sensitivity, status, uploaded_by, upload_date
- `case_documents` — case_id, document_id, role_in_case, added_by, added_at
- `document_integrity` — document_id, original_hash (SHA-256), current_hash, algorithm, last_verified, is_tampered

**Blockchain Tables**:
- `blockchain_blocks` — id, prev_hash, merkle_root, block_hash, entry_count, timestamp
- `blockchain_entries` — id, block_id, user_id, action, resource_type, resource_id, details (JSON), entry_hash, timestamp

**Signature Tables**:
- `document_signatures` — id, document_id, signer_id, signature_data, signed_hash, purpose, timestamp, is_valid
- `user_keys` — user_id, public_key, encrypted_private_key, key_algorithm, created_at, revoked_at

**Access Control Tables**:
- `access_grants` — id, resource_type, resource_id, user_id, permission, granted_by, granted_at, expires_at
- `chain_of_custody` — id, document_id, case_id, action, from_user, to_user, notes, location, timestamp

**Search Tables**:
- `documents_fts` — Full-text search index (PostgreSQL tsvector)

---

## 6. Security Architecture

```
  DEFENSE IN DEPTH:

  Layer 1: NETWORK
  +-- HTTPS/TLS 1.3 (Nginx) -- encrypts all data in transit
  +-- VPN option for government networks
  +-- Rate limiting (100 req/min per IP)
  +-- CORS restricted to known origins

  Layer 2: AUTHENTICATION  
  +-- JWT tokens (HS256 signed, 8-hour expiry)
  +-- bcrypt password hashing (cost factor 12)
  +-- Refresh tokens (7-day expiry)
  +-- Failed login lockout (5 attempts --> 15 min cooldown)

  Layer 3: AUTHORIZATION
  +-- 7-role RBAC (SuperAdmin to Viewer)
  +-- Per-resource permission grants
  +-- Search results filtered by access
  +-- API endpoints protected by role decorators

  Layer 4: DATA INTEGRITY
  +-- SHA-256 document hashing on upload
  +-- Digital signatures (RSA-2048 / ECDSA-P256)
  +-- Periodic integrity verification
  +-- Version checksums

  Layer 5: AUDIT (BLOCKCHAIN)
  +-- Every action recorded in hash-chain
  +-- Merkle tree for efficient verification
  +-- Tamper detection on chain break
  +-- Compliance reports from audit data

  Layer 6: STORAGE
  +-- PostgreSQL with encrypted connections
  +-- File system with OS-level permissions
  +-- Private keys encrypted at rest (PBKDF2)
  +-- Backup with integrity verification
```

---

## 7. API Surface (Complete)

### Authentication
| Endpoint | Method | Purpose |
|---|---|---|
| `/auth/login` | POST | Login, get JWT |
| `/auth/register` | POST | Create user (admin) |
| `/auth/refresh` | POST | Refresh token |
| `/auth/me` | GET | Current user profile |
| `/auth/users` | GET | List users (admin) |
| `/auth/users/{id}/role` | PUT | Change role (admin) |

### Cases
| Endpoint | Method | Purpose |
|---|---|---|
| `/cases` | POST | Create case |
| `/cases` | GET | List cases (permission-filtered) |
| `/cases/{id}` | GET | Case detail + linked docs |
| `/cases/{id}` | PUT | Update case |
| `/cases/{id}/status` | PUT | Change status |
| `/cases/{id}/documents` | POST | Link document to case |
| `/cases/{id}/timeline` | GET | Activity timeline |

### Documents
| Endpoint | Method | Purpose |
|---|---|---|
| `/upload` | POST | Upload + hash + ingest |
| `/documents` | GET | List (permission-filtered) |
| `/documents/{id}/status` | GET | Ingestion progress |
| `/documents/{id}/text` | GET | Full text |
| `/documents/{id}/download` | GET | Original file |
| `/documents/{id}` | DELETE | Remove from all stores |
| `/documents/{id}/verify` | POST | Verify SHA-256 integrity |
| `/documents/{id}/sign` | POST | Digitally sign |
| `/documents/{id}/signatures` | GET | List signatures |
| `/documents/{id}/verify-signatures` | POST | Verify all signatures |
| `/documents/{id}/custody` | GET/POST | Chain of custody |

### Search
| Endpoint | Method | Purpose |
|---|---|---|
| `/search` | POST | Hybrid search (permission-filtered) |

### Blockchain
| Endpoint | Method | Purpose |
|---|---|---|
| `/blockchain/status` | GET | Chain status |
| `/blockchain/verify` | POST | Full chain verification |
| `/blockchain/blocks` | GET | List blocks |
| `/blockchain/blocks/{id}` | GET | Block detail |
| `/blockchain/entries/{id}/proof` | GET | Merkle proof |

### Audit
| Endpoint | Method | Purpose |
|---|---|---|
| `/audit/log` | GET | Query audit entries |
| `/audit/{type}/{id}` | GET | Audit for specific resource |
| `/audit/report` | GET | Compliance report |

### System
| Endpoint | Method | Purpose |
|---|---|---|
| `/health` | GET | System status |
| `/dashboard/stats` | GET | Dashboard analytics |

---

## 8. Deployment Architecture

```
  PRODUCTION DEPLOYMENT:
  
  +----------------------------------------------------------+
  | Cloud Server (NIC MeghRaj / AWS / Azure / GCP)           |
  |                                                          |
  |  +----------------------------------------------------+  |
  |  | Docker Compose                                      |  |
  |  |                                                     |  |
  |  |  +----------------+    +------------------------+   |  |
  |  |  | Nginx          |    | FastAPI App             |   |  |
  |  |  | (port 443/80)  |--->| (port 8000)            |   |  |
  |  |  | TLS + rate     |    | + React SPA            |   |  |
  |  |  | limit + gzip   |    | + AI Models            |   |  |
  |  |  +----------------+    +------------------------+   |  |
  |  |                              |                      |  |
  |  |  +----------------+    +----v-------------------+   |  |
  |  |  | PostgreSQL     |    | ChromaDB               |   |  |
  |  |  | (port 5432)    |    | (embedded/port 8001)  |   |  |
  |  |  | Metadata, auth,|    | Vector embeddings      |   |  |
  |  |  | blockchain,    |    |                        |   |  |
  |  |  | audit, custody |    |                        |   |  |
  |  |  +----------------+    +------------------------+   |  |
  |  |                                                     |  |
  |  |  Volumes:                                           |  |
  |  |  - /data/uploads (document files)                   |  |
  |  |  - /data/vectors (ChromaDB)                         |  |
  |  |  - /data/postgres (database)                        |  |
  |  |  - /data/keys (encrypted key storage)               |  |
  |  +----------------------------------------------------+  |
  |                                                          |
  |  GPU: NVIDIA CUDA (optional, accelerates AI)            |
  +----------------------------------------------------------+
```

---

*Document Version: 2.0 — Updated for cloud deployment, blockchain, digital signatures*  
*Last Updated: August 2026*

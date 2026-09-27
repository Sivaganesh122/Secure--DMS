# Proposed Solution Document

## SecureDoc DMS — Secure Digital Document Management System for Legal & Investigation Documents

**Cloud-Deployed | AI-Powered | Blockchain-Secured | Digitally Signed | Role-Controlled**

---

## 1. Solution Overview

**SecureDoc DMS** is a cloud-deployed, secure digital document management system designed for law enforcement agencies, courts, legal departments, and investigative organizations. It provides end-to-end document lifecycle management powered by five key technologies mandated by the problem statement: **Cloud Computing, Artificial Intelligence, Blockchain, Digital Signatures, and Secure Access Control**.

### 1.1 Vision Statement

> *"To digitize, secure, and intelligently manage every document in India's legal and investigation ecosystem — ensuring that evidence is never lost, justice is never delayed by paperwork, and every document action is accountable and legally valid."*

### 1.2 How Each Required Technology Is Used

| Required Technology | How We Use It | Key Feature |
|---|---|---|
| **Cloud Computing** | System deployed on cloud/government server (NIC/MeghRaj/AWS), accessible from any police station, court, or prosecutor office via browser | Multi-location, multi-department access over secure HTTPS |
| **Artificial Intelligence** | Zero-shot document classification (DeBERTa NLI), abstractive summarization (BART), dual OCR (PaddleOCR + Tesseract), hybrid semantic search (GTE embeddings + cross-encoder reranking) | Auto-classify FIR vs Charge Sheet vs Evidence; search by meaning; OCR scanned documents |
| **Blockchain** | Private blockchain ledger (Hyperledger-inspired hash-chain) for immutable audit trail; Merkle tree root published periodically for tamper-proof verification | Every document upload, view, download, edit, share is recorded in an unbreakable chain |
| **Digital Signatures** | PKI-based (RSA/ECDSA) digital signing of documents; each officer has a key pair; signature verifiable by anyone | IO signs FIR, forensic expert signs report, judge signs order — legally valid under IT Act |
| **Secure Access Control** | JWT authentication + 7-role RBAC + per-document permission grants + session management | Police see police cases; prosecutor sees assigned cases; judge verifies evidence; admin manages users |

---

## 2. Core Pillars

```
+-------------------------------------------------------------------------+
|                    SecureDoc DMS — 5 Technology Pillars                  |
|                                                                         |
|  +-------------+  +-------------+  +-------------+  +-------------+    |
|  | CLOUD       |  | AI          |  | BLOCKCHAIN  |  | DIGITAL     |    |
|  | COMPUTING   |  | INTELLIGENCE|  | AUDIT       |  | SIGNATURES  |    |
|  |             |  |             |  |             |  |             |    |
|  | Multi-dept  |  | Zero-shot   |  | Hash-chain  |  | RSA/ECDSA   |    |
|  | access      |  | classify    |  | immutable   |  | PKI signing |    |
|  | PostgreSQL  |  | OCR + NLP   |  | Merkle tree |  | Per-user    |    |
|  | cloud-ready |  | Semantic    |  | Tamper-proof|  | key pairs   |    |
|  | scalable    |  | search      |  | Verifiable  |  | IT Act valid|    |
|  +-------------+  +-------------+  +-------------+  +-------------+    |
|                                                                         |
|  +-------------+  +-------------+  +-------------+                     |
|  | SECURE      |  | CASE        |  | COMPLIANCE  |                     |
|  | ACCESS      |  | MANAGEMENT  |  |             |                     |
|  |             |  |             |  |             |                     |
|  | JWT + RBAC  |  | Case-doc    |  | BSA 2023    |                     |
|  | 7 roles     |  | linking     |  | DPDPA 2023  |                     |
|  | Permissions |  | Lifecycle   |  | IT Act      |                     |
|  | Audit logged|  | Custody     |  | RTI ready   |                     |
|  +-------------+  +-------------+  +-------------+                     |
+-------------------------------------------------------------------------+
```

---

## 3. Detailed Feature Breakdown

### 3.1 Cloud Computing — Multi-Location Deployment

**What it does**: Deploys the system on a central cloud server accessible from any authorized location — police stations, courts, prosecutor offices, forensic labs — via a web browser over secure HTTPS.

**Architecture**:
```
  Police Station A ----+
                       |
  Police Station B ----+----> Cloud Server (NIC/MeghRaj/AWS)
                       |      - FastAPI Backend
  Prosecutor Office ---+      - PostgreSQL Database
                       |      - ChromaDB Vector Store
  Court ---------------+      - AI Models (GPU)
                       |      - Blockchain Ledger
  Forensic Lab --------+      - File Storage
                       |
  Senior Officer ------+----> via HTTPS + VPN
  (Mobile/Tablet)
```

**Key Design Decisions**:
- **PostgreSQL** replaces SQLite for proper multi-user concurrent access (hundreds of simultaneous users)
- **Nginx reverse proxy** with TLS termination for HTTPS encryption in transit
- **Docker containerization** for reproducible deployment on any cloud provider
- **Government cloud compatible** — deployable on NIC's MeghRaj cloud, ensuring data sovereignty
- **VPN/private network option** — for air-gapped or restricted networks

**Why Cloud**:
- A police station in District A uploads an FIR → a prosecutor in the district HQ can immediately access it
- A forensic lab in the state capital uploads a report → the investigating officer sees it instantly
- A judge can verify document integrity from the court's terminal
- Senior officers get real-time dashboards from any location

---

### 3.2 Artificial Intelligence — Document Intelligence

**What it does**: Automatically processes every uploaded document through an AI pipeline that extracts text, classifies the document type, generates summaries, extracts keywords, and makes the document searchable by meaning.

**AI Pipeline**:
```
  Upload FIR (PDF) --> Parse text (PyMuPDF)
                       |
                       +--> [If scanned] OCR (PaddleOCR + Tesseract ensemble)
                       |    - Reading-order reconstruction
                       |    - Density-based quality gating
                       |    - 90%+ accuracy on degraded prints
                       |
                       +--> Classification (DeBERTa-v3 Zero-Shot NLI)
                       |    Input: document text
                       |    Output: "FIR" (0.92), "Charge Sheet" (0.03), ...
                       |    - No training data needed
                       |    - Understands natural language descriptions
                       |
                       +--> Summarization (BART-large-CNN)
                       |    Input: first 3 pages
                       |    Output: 1-2 sentence summary
                       |
                       +--> Keyword Extraction (YAKE + KeyBERT + TF-IDF cascade)
                       |    Output: ["robbery", "SBI branch", "MG Road", ...]
                       |
                       +--> Semantic Indexing (GTE-large 1024-dim vectors)
                            Stored in ChromaDB for meaning-based search
```

**Search Architecture (3-Stage Hybrid)**:
```
  Query: "witness statement about theft at jewellery shop"
  
  Stage 1: BM25 keyword search (PostgreSQL full-text) --> top matches by words
  Stage 2: Semantic vector search (ChromaDB cosine)   --> top matches by meaning
  Stage 3: Cross-encoder reranking (GTE-Reranker)     --> neural relevance scoring
  
  Result: < 2 seconds, ranked by actual relevance, not just keyword match
```

**Legal Document Taxonomy** (AI auto-classifies into these):

| Dimension | Categories |
|---|---|
| **Document Type** | FIR, Charge Sheet, Investigation Report, Witness Statement, Evidence Record, Forensic Report, Court Filing, Legal Notice, Judgment/Order, Bail Application, Correspondence |
| **Jurisdiction** | District Court, Sessions Court, High Court, Supreme Court, Tribunal |
| **Crime Category** | Cybercrime, Financial Fraud, Violent Crime, Property Crime, Narcotics, White Collar Crime |
| **Sensitivity** | Top Secret, Confidential, Restricted, Unclassified |

---

### 3.3 Blockchain — Immutable Audit Trail

**What it does**: Records every action in the system in a blockchain-inspired immutable ledger. Once an entry is recorded, it cannot be modified or deleted without breaking the chain — providing mathematical proof of tamper-free audit history.

**How the Blockchain Audit Works**:

```
  Block 0 (Genesis)              Block 1                      Block 2
  +---------------------+       +---------------------+      +---------------------+
  | Action: system_init |       | Action: doc_upload  |      | Action: doc_viewed  |
  | User: system        |       | User: IO_Kumar      |      | User: Prosecutor_R  |
  | Time: 2026-01-01    |       | Doc: FIR-2026-001   |      | Doc: FIR-2026-001   |
  | Data: ...           |       | Hash: a3f2c9...     |      | Details: page 1-5   |
  |                     |       |                     |      |                     |
  | Prev Hash: 0000...  |       | Prev Hash: [Block0] |      | Prev Hash: [Block1] |
  | Merkle Root: abc1.. |  +--->| Merkle Root: d4e2.. | +--->| Merkle Root: f7g3.. |
  | Block Hash: xyz1... |--+    | Block Hash: xyz2... |-+    | Block Hash: xyz3... |
  +---------------------+       +---------------------+      +---------------------+
  
  TAMPER DETECTION:
  If Block 1 is modified --> its hash changes 
  --> Block 2's prev_hash no longer matches --> CHAIN BROKEN
  --> System alerts: "AUDIT TRAIL TAMPERED AT BLOCK 1"
  
  MERKLE TREE (within each block):
  Every N entries are grouped into a block.
  Entries within a block are organized as a Merkle tree.
  The Merkle root is a single hash representing ALL entries in the block.
  Verification: O(log n) instead of O(n) — efficient even with millions of entries.
```

**What gets recorded on the blockchain**:
- Document uploads, views, downloads, edits, deletions
- Digital signature operations (sign, verify)
- Case creation, status changes, assignments
- User logins, logouts, failed attempts
- Access grants, role changes
- Integrity verification results
- Chain of custody transfers

**Blockchain Verification API**:
- `POST /blockchain/verify` — Walks the entire chain, verifies every hash link
- `GET /blockchain/block/{id}` — View a specific block with its entries
- `GET /blockchain/merkle-proof/{entry_id}` — Get Merkle proof for a specific audit entry
- Returns: chain_valid (true/false), total_blocks, first_broken_block (if any)

---

### 3.4 Digital Signatures — Legal Validity

**What it does**: Allows authorized users to digitally sign documents using PKI (Public Key Infrastructure) cryptography. A signed document carries legally valid proof of who signed it and that the content hasn't changed since signing.

**How Digital Signatures Work**:

```
  SIGNING (by Investigating Officer):
  
  1. IO uploads FIR document
  2. System computes SHA-256 hash of document content
  3. IO clicks "Sign Document"
  4. System encrypts the hash with IO's PRIVATE key --> Digital Signature
  5. Signature + IO's public key certificate stored alongside document
  6. Action recorded on blockchain audit trail
  
  VERIFICATION (by Prosecutor or Judge):
  
  1. User clicks "Verify Signature" on the document
  2. System decrypts the signature using IO's PUBLIC key --> Original Hash
  3. System recomputes SHA-256 hash of current document content
  4. Compare:
     - Match    --> "Signature VALID. Signed by IO Kumar on 29-Aug-2026. 
                     Document has NOT been modified since signing."
     - Mismatch --> "SIGNATURE INVALID. Document has been TAMPERED with 
                     after signing. Original signer: IO Kumar."
```

**Key Features**:
- **Per-user key pairs**: Each user gets an RSA-2048 or ECDSA-P256 key pair on registration
- **Multi-signature support**: A document can be signed by multiple parties (IO signs, SHO countersigns)
- **Signature history**: Track all signatures on a document with timestamps
- **Revocation**: Admin can revoke a user's signing capability if compromised
- **Legal compliance**: Aligns with IT Act 2000 Section 3 (Electronic Governance) and Section 5 (Legal recognition of digital signatures)

**Signature Roles**:
| Role | What They Sign | Legal Significance |
|---|---|---|
| Investigating Officer | FIRs, Investigation Reports, Seizure Memos | Authentication of investigation records |
| Station House Officer | Charge Sheets, Case Diaries | Supervisory approval |
| Forensic Expert | Forensic Reports, Lab Results | Expert attestation |
| Prosecutor | Court filings, Legal opinions | Prosecution authentication |
| Judge | Orders, Judgments, Warrants | Judicial authority |

---

### 3.5 Secure Access Control — RBAC

**What it does**: Ensures every user is authenticated and authorized. Different roles see different data and have different permissions.

**Authentication Flow**:
```
  User --> Login (username + password)
       --> Server verifies (bcrypt hash comparison)
       --> JWT token issued (8-hour expiry)
       --> Token sent with every subsequent request
       --> Server validates token + checks role permissions
       --> Access granted or denied (403)
```

**Role Permission Matrix**:

| Capability | SuperAdmin | Admin | IO | Prosecutor | Judge | Forensic | Viewer |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Manage users and roles | Yes | Yes | - | - | - | - | - |
| Create cases | Yes | Yes | Yes | Yes | - | - | - |
| Upload documents | Yes | Yes | Yes | Yes | - | Yes | - |
| Sign documents | Yes | Yes | Yes | Yes | Yes | Yes | - |
| View assigned cases | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| View all cases | Yes | Yes | - | - | Yes | - | - |
| Download documents | Yes | Yes | Yes | Yes | Yes | Yes | - |
| Delete documents | Yes | Yes | - | - | - | - | - |
| View audit log | Yes | Yes | Own | Own | Yes | Own | - |
| Verify blockchain | Yes | Yes | Yes | Yes | Yes | Yes | - |
| Verify signatures | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Manage custody chain | Yes | Yes | Yes | - | - | Yes | - |
| System administration | Yes | Yes | - | - | - | - | - |
| Search documents | Yes | Yes | Yes | Yes | Yes | Yes | Yes |

---

### 3.6 Case Management

**Case Lifecycle**:
```
  OPEN --> INVESTIGATION --> PROSECUTION --> TRIAL --> CLOSED --> ARCHIVED
  (FIR)   (Evidence,        (Charge sheet   (Court    (Judgment   (Retention
           witness stmts)    filed)          hearings)  delivered)  period)
```

- Cases link to multiple documents (many-to-many)
- Cases assigned to officers and departments
- Case timeline shows all activities chronologically
- Chain of custody tracking for evidence documents

---

### 3.8 Version Control — Document Versioning

**What it does**: Maintains a complete version history of every document in the system. Every time a document is edited or re-uploaded, a new version is created — the previous version is preserved intact, never overwritten. Users can view, compare, and restore any previous version at any time.

**How Version Control Works**:

```
  DOCUMENT: Charge Sheet — Case #2026-001

  Version 1 (01-Aug-2026, IO Kumar)
    +-----------------------------+
    | Original charge sheet       |
    | SHA-256: a3f2c9...          |  ◄── preserved, immutable
    | Signed by: IO Kumar         |
    +-----------------------------+
               │
               ▼
  Version 2 (10-Aug-2026, IO Kumar)
    +-----------------------------+
    | Added 2 new witness names   |
    | SHA-256: d7e4b1...          |  ◄── preserved, immutable
    | Signed by: IO Kumar         |
    | Change note: "Added witness  |
    |   Rahul Verma & Priya Singh"|
    +-----------------------------+
               │
               ▼
  Version 3 (20-Aug-2026, SHO Sharma)    ◄── CURRENT VERSION
    +-----------------------------+
    | Corrected crime section ref |
    | SHA-256: f1a8c3...          |
    | Signed by: SHO Sharma       |
    | Change note: "Corrected IPC  |
    |   section from 379 to 392"  |
    +-----------------------------+
```

**Key Features**:

| Feature | Description |
|---|---|
| **Full Version History** | Every version of a document is stored with its own SHA-256 hash, timestamp, and author — no data is ever lost |
| **Diff / Compare** | Side-by-side comparison between any two versions highlighting what was added, removed, or changed |
| **Rollback** | Authorized users (Admin, SuperAdmin) can restore a previous version as the current version, with the rollback action itself recorded on the blockchain audit trail |
| **Change Notes** | Each version requires a change note describing what was modified and why — creating a clear amendment trail |
| **Version-Aware Signatures** | Digital signatures are bound to a specific version; re-signing is required after edits, preventing signature from being carried over to modified content |
| **Branching for Amendments** | Formal amendments (e.g., supplementary charge sheets) are linked as branches to the original document, maintaining the relationship |
| **Immutable Audit** | Every version creation, comparison, and rollback is recorded on the blockchain audit trail |

**Why This Matters for Legal Documents**:
- **Charge sheets** are frequently amended as investigations progress — version control tracks every amendment
- **Investigation reports** evolve over weeks/months — officers can review how findings changed over time
- **Court filings** may require revision — judges can verify what changed between submissions
- **Evidence records** — any modification to evidence documentation is permanently recorded, supporting chain of custody integrity
- **Compliance** — meets the Gap Analysis requirement of "Full version history with diff capability" identified in the Problem Statement Analysis

**Version Control APIs**:
- `GET /documents/{id}/versions` — List all versions of a document with metadata
- `GET /documents/{id}/versions/{version_id}` — Retrieve a specific version
- `GET /documents/{id}/diff?v1={ver1}&v2={ver2}` — Compare two versions
- `POST /documents/{id}/rollback/{version_id}` — Restore a previous version (admin-only)

---

### 3.9 Compliance

| Requirement | How We Comply |
|---|---|
| **BSA 2023, Section 63** — Electronic evidence admissibility | SHA-256 hashing + digital signatures + chain of custody + blockchain audit |
| **DPDPA 2023** — Personal data protection | RBAC + audit trails + access grants with expiry |
| **IT Act, Section 3 and 5** — Digital signatures | PKI-based RSA/ECDSA signatures per user |
| **IT Act, Section 43A** — Data security | HTTPS encryption + bcrypt passwords + role-based access |
| **RTI Act** — Right to Information | Instant document search and retrieval for RTI compliance |

---

## 4. Innovation and Uniqueness

| Feature | Generic DMS | Cloud DMS (Google/SharePoint) | **SecureDoc DMS (Ours)** |
|---|---|---|---|
| AI-powered auto-classification | No | Basic labels | Zero-shot legal classification (no training data needed) |
| Semantic search (by meaning) | No | Basic | 3-stage hybrid (BM25 + vector + reranker) |
| Blockchain audit trail | No | No | Hash-chain with Merkle tree verification |
| Digital signatures | No | Basic cloud signatures | PKI-based per-user key pairs (IT Act compliant) |
| OCR for scanned documents | Basic | Cloud OCR (data leaves premises) | Dual-engine (PaddleOCR + Tesseract) |
| **Document version control** | Basic (overwrite) | Basic version history | Full version history with diff, rollback, change notes, blockchain-audited amendments |
| Legal-domain taxonomy | Generic | Generic | Indian legal system categories |
| Chain of custody | Not applicable | Not applicable | Purpose-built for evidence |
| Data sovereignty | On-premise | US/foreign servers | Deployable on government cloud (NIC/MeghRaj) |
| Indian legal compliance | Not designed for it | Not designed for it | Built for BSA 2023, DPDPA 2023, IT Act |
| Cost | Expensive licenses | Per-user subscription | Open-source, zero licensing cost |

---

## 5. User Workflows

### 5.1 Investigating Officer — FIR Upload and Sign

```
Login --> Dashboard --> Create Case "Robbery at SBI, MG Road"
  --> Upload FIR.pdf
  --> System auto: OCR + Classify as "FIR" + Summarize + Hash (SHA-256)
  --> IO clicks "Sign Document" (RSA private key signs the hash)
  --> Action logged on blockchain: "IO Kumar uploaded and signed FIR-2026-001"
  --> Prosecutor gets notified: "New FIR in Case #2026-001"
```

### 5.2 Prosecutor — Review and Verify

```
Login --> My Cases --> Case #2026-001
  --> View FIR (action logged on blockchain)
  --> Click "Verify Signature" --> "Valid. Signed by IO Kumar, 29-Aug-2026"
  --> Click "Verify Integrity" --> "SHA-256 match. Document not tampered."
  --> Search: "witness statements about robbery" --> Semantic results in 2 sec
  --> Download charge sheet for court filing (logged on blockchain)
```

### 5.3 Judge — Evidence Verification

```
Login --> Filed Cases --> Case #2026-001
  --> Select evidence document
  --> "Verify Integrity": SHA-256 original = current --> NOT TAMPERED
  --> "Verify Signature": Signed by IO Kumar (valid), Countersigned by SHO (valid)
  --> "View Chain of Custody": IO received at scene --> FSL examined --> IO to Prosecutor --> Filed in court
  --> "Verify Blockchain": All 47 audit entries verified, chain intact
  --> Document admissible as evidence under BSA 2023, Section 63
```

---

*Document Version: 2.0 — Updated to address all 5 required technologies*  
*Last Updated: August 2026*

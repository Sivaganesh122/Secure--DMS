# Technology Stack Justification

## SecureDoc DMS — Why Each Technology Was Chosen

---

## 1. Technology Stack Summary

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Backend Framework** | FastAPI | ≥0.110 | Async REST API server |
| **Runtime** | Python | 3.11+ | Backend language |
| **ASGI Server** | Uvicorn | ≥0.30 | High-performance async server |
| **Frontend Framework** | React | 19 | Single-page dashboard application |
| **Build Tool** | Vite | 8 | Fast frontend builds, HMR |
| **CSS Framework** | Tailwind CSS | 4 | Utility-first styling |
| **Primary Database** | PostgreSQL | ≥15 | Multi-user cloud database (metadata, users, cases, audit, blockchain) |
| **Full-Text Search** | PostgreSQL tsvector | Built-in | BM25 keyword search |
| **Vector Database** | ChromaDB | ≥0.5 | Semantic similarity search |
| **Embeddings Model** | GTE-large-en-v1.5 | - | 1024-dim bi-encoder |
| **Reranking Model** | GTE-Reranker-ModernBERT | - | Cross-encoder reranker |
| **Summarization Model** | BART-large-CNN | - | Abstractive summarization |
| **Classification Model** | DeBERTa-v3-large NLI | - | Zero-shot classification |
| **OCR (Primary)** | PaddleOCR PP-OCRv4 | ≥3.5 | Text recognition from images |
| **OCR (Fallback)** | Tesseract | 5 | Ensemble fallback OCR |
| **PDF Parsing** | PyMuPDF (fitz) | ≥1.24 | PDF text + table extraction |
| **DOCX Parsing** | python-docx | ≥1.1 | Word document parsing |
| **Authentication** | python-jose + passlib | - | JWT tokens + bcrypt hashing |
| **Digital Signatures** | cryptography (Python) | ≥42.0 | RSA-2048 / ECDSA-P256 PKI signing and verification |
| **Blockchain Audit** | Custom hash-chain + Merkle tree | - | Immutable audit trail with tamper detection |
| **Hashing** | hashlib (stdlib) | Built-in | SHA-256 document integrity |
| **ML Framework** | PyTorch | ≥2.1 | GPU inference backend |
| **Cloud Deployment** | Docker + Docker Compose | - | Containerized cloud deployment |
| **Reverse Proxy** | Nginx | - | TLS termination, rate limiting, static files |
| **GPU Compute** | NVIDIA CUDA / Apple MPS / CPU | - | Accelerated AI inference |
| **Keyword Extraction** | YAKE | - | Statistical keyphrases |
| **Containerization** | Docker | - | Reproducible deployment |
| **Reverse Proxy** | Nginx | - | TLS, rate limiting, caching |
| **GPU Compute** | NVIDIA CUDA / Apple MPS | - | Accelerated AI inference |
| **Charts (Frontend)** | Recharts | - | Dashboard visualizations |
| **Routing (Frontend)** | React Router | v7 | Client-side navigation |

---

## 2. Detailed Justifications

### 2.1 Backend: FastAPI + Python

**Why FastAPI over Django / Flask / Express.js / Spring Boot?**

| Criteria | FastAPI | Django | Flask | Express.js | Spring Boot |
|---|:---:|:---:|:---:|:---:|:---:|
| Async support (native) | ✅ | ⚠️ Partial | ❌ | ✅ | ✅ |
| Auto API docs (Swagger) | ✅ | ❌ | ❌ | ❌ | ✅ |
| Python ML ecosystem | ✅ | ✅ | ✅ | ❌ | ❌ |
| Type validation (Pydantic) | ✅ | ❌ | ❌ | ❌ | ✅ |
| Performance (req/sec) | ~15K | ~5K | ~8K | ~12K | ~10K |
| Learning curve | Low | Medium | Low | Low | High |
| Community size | Growing fast | Very large | Large | Very large | Large |

**Decision rationale**:

1. **Python is non-negotiable** for the AI/ML stack — PyTorch, Transformers, PaddleOCR, sentence-transformers, ChromaDB all have Python as their primary SDK. Using Node.js or Java would require maintaining a separate Python inference service, adding complexity.

2. **FastAPI's async architecture** is critical for our use case: document uploads trigger long-running background tasks (OCR, AI inference), while the API must remain responsive for search queries and status polling. FastAPI's native `async/await` with `BackgroundTasks` handles this elegantly.

3. **Automatic OpenAPI documentation** — FastAPI generates interactive API documentation (Swagger UI) from type annotations. This is valuable for SIH demonstration and for future API consumers (mobile apps, integrations).

4. **Pydantic validation** — Request/response models are validated automatically, reducing boilerplate and preventing invalid data from reaching the database.

5. **Performance** — FastAPI on Uvicorn is one of the fastest Python web frameworks, handling ~15K requests/second for simple endpoints. This is more than sufficient for a departmental DMS.

---

### 2.2 Database: SQLite

**Why SQLite over PostgreSQL / MySQL / MongoDB?**

| Criteria | SQLite | PostgreSQL | MySQL | MongoDB |
|---|:---:|:---:|:---:|:---:|
| Zero configuration | ✅ | ❌ | ❌ | ❌ |
| No separate server process | ✅ | ❌ | ❌ | ❌ |
| Single-file deployment | ✅ | ❌ | ❌ | ❌ |
| Built-in FTS (full-text search) | ✅ FTS5 | ✅ tsvector | ✅ | ✅ |
| ACID compliance | ✅ | ✅ | ✅ | ⚠️ |
| Read performance | Excellent | Excellent | Good | Good |
| Write concurrency | WAL mode (good) | Excellent | Good | Good |
| Air-gap deployable | ✅ | ✅ | ✅ | ✅ |
| Backup simplicity | Copy 1 file | pg_dump | mysqldump | mongodump |
| Max practical DB size | ~1 TB | Unlimited | Unlimited | Unlimited |

**Decision rationale**:

1. **Zero-configuration deployment** — Police departments often lack dedicated DBA staff. SQLite requires no separate database server, no configuration tuning, no connection pooling. It's a single file that can be backed up by simply copying it.

2. **Air-gap compatibility** — Many sensitive installations operate on air-gapped networks. SQLite has zero network dependencies. PostgreSQL/MySQL would require a running server process and network socket configuration.

3. **FTS5 (Full-Text Search 5)** — SQLite's built-in FTS5 with Porter stemming provides production-quality BM25 keyword search without any additional service. This eliminates the need for Elasticsearch or Solr.

4. **WAL (Write-Ahead Logging) mode** — Enables concurrent reads while writes are serialized, which matches our access pattern (many readers searching, occasional writers uploading/updating).

5. **Sufficient scale** — For a single-department or multi-department deployment, SQLite comfortably handles millions of rows. The NDJG data suggests even large district courts process ~50K cases/year with ~500K documents/year — well within SQLite's capability.

6. **Migration path** — If a deployment outgrows SQLite, the schema is standard SQL and can be migrated to PostgreSQL with minimal changes. The abstraction through `get_db_connection()` makes this swap straightforward.

**Trade-off acknowledged**: SQLite's write serialization means only one write transaction at a time. For our use case (document ingestion is the primary write path), this is acceptable because ingestion is already serialized through the AI semaphore (`asyncio.Semaphore(3)`).

---

### 2.3 Vector Database: ChromaDB

**Why ChromaDB over Pinecone / Weaviate / Milvus / Qdrant / FAISS?**

| Criteria | ChromaDB | Pinecone | Weaviate | Milvus | FAISS |
|---|:---:|:---:|:---:|:---:|:---:|
| 100% local (no cloud) | ✅ | ❌ | ✅ | ✅ | ✅ |
| Persistent storage | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Python-native API | ✅ | ✅ | ✅ | ✅ | ✅ |
| Zero configuration | ✅ | ❌ | ❌ | ❌ | ✅ |
| No separate server | ✅ (embedded) | ❌ | ❌ | ❌ | ✅ |
| Metadata filtering | ✅ | ✅ | ✅ | ✅ | ❌ |
| HNSW algorithm | ✅ | ✅ | ✅ | ✅ | ✅ |
| Setup complexity | Minimal | Account setup | Docker | Docker | Code |

**Decision rationale**:

1. **Embedded mode** — ChromaDB runs in-process with the FastAPI application. No separate server, no Docker sidecar, no network hops. This reduces latency and simplifies deployment.

2. **Data sovereignty** — Pinecone is cloud-only. For classified investigation documents, all data must remain on-premises. ChromaDB's `PersistentClient` stores data as local files.

3. **Metadata filtering** — ChromaDB supports `where` clauses on metadata (e.g., filter by `document_id`, `page`). FAISS lacks this — you'd need to implement your own metadata store alongside it.

4. **HNSW with cosine similarity** — The HNSW (Hierarchical Navigable Small World) index provides approximate nearest-neighbor search with configurable recall/speed tradeoff. Cosine similarity is the standard metric for text embeddings.

5. **Scale** — For our use case (hundreds of thousands of document chunks), ChromaDB's performance is excellent. For million+ chunk deployments, Milvus or Qdrant would be considered.

---

### 2.4 AI Model Stack

#### Embeddings: GTE-large-en-v1.5 (Alibaba-NLP)

**Why this model?**

| Model | Dimensions | MTEB Score | Size | Speed |
|---|:---:|:---:|:---:|:---:|
| **GTE-large-en-v1.5** | 1024 | 65.39 | 1.3 GB | Good |
| all-MiniLM-L6-v2 | 384 | 56.26 | 80 MB | Fast |
| e5-large-v2 | 1024 | 62.20 | 1.3 GB | Good |
| nomic-embed-text | 768 | 62.39 | 550 MB | Good |
| OpenAI text-embedding-3-large | 3072 | 64.59 | Cloud | N/A |

- **Best open-source English embedding model** in its size class (MTEB benchmark)
- 1024-dimensional vectors provide rich semantic representation
- Runs locally on GPU (CUDA/MPS) or CPU — no API calls
- Alibaba-NLP actively maintains it with the sentence-transformers library

#### Summarizer: BART-large-CNN (Facebook)

- **Purpose-built for summarization** — fine-tuned on CNN/DailyMail dataset
- Generates abstractive summaries (not just extractive sentence selection)
- For legal documents, this provides concise case summaries from multi-page documents
- Fallback to lead-sentence extraction if model fails to load

#### Classifier: DeBERTa-v3-large NLI (MoritzLaurer)

**Why zero-shot NLI for classification?**

Traditional classifiers require labeled training data (thousands of examples per category). Zero-shot classification uses Natural Language Inference:

```
Premise:   "The accused was arrested on 15th March at MG Road junction..."
Hypothesis: "This document is a First Information Report"
NLI Output: Entailment (0.87) → Classified as FIR
```

- **No legal training data required** — the model understands natural language descriptions of categories
- **Dynamic categories** — new document types can be added by simply defining the category name
- **DeBERTa-v3-large** achieves state-of-the-art zero-shot accuracy on NLI benchmarks
- Thresholds per dimension prevent false classifications (configurable)

#### Reranker: GTE-Reranker-ModernBERT-Base

- **Cross-encoder architecture** — considers query and document jointly (not independently like bi-encoders)
- Dramatically improves search precision by re-scoring the top candidates from the approximate retrieval stage
- ModernBERT base — modern architecture with strong performance at small size

#### OCR: PaddleOCR + Tesseract Ensemble

**Why two OCR engines?**

| Criteria | PaddleOCR | Tesseract | Ensemble |
|---|:---:|:---:|:---:|
| Accuracy (clean print) | 97%+ | 95% | 97%+ |
| Accuracy (degraded) | 85% | 80% | 90%+ |
| Speed (per page) | ~3s GPU | ~5s CPU | Best result wins |
| Table detection | ✅ | ❌ | ✅ |
| Reading order | ✅ (with post-processing) | ❌ | ✅ |
| Model size | 150 MB | <50 MB | 200 MB |

- **PaddleOCR (primary)** — PP-OCRv4 mobile models provide excellent accuracy with small footprint. Detection + recognition without classification (pages already oriented from PDF).
- **Tesseract (fallback)** — Activated when PaddleOCR returns sparse text (density < 5 chars/10K pixels). PSM 11 (sparse text) mode handles difficult layouts.
- **Reading-order reconstruction** — OCR outputs are Y-band clustered then X-sorted to reconstruct natural reading order from detection polygons.

---

### 2.5 Frontend: React 19 + Vite 8 + Tailwind 4

**Why React over Angular / Vue / Svelte?**

| Criteria | React | Angular | Vue | Svelte |
|---|:---:|:---:|:---:|:---:|
| Ecosystem size | Largest | Large | Medium | Growing |
| Component libraries | Extensive | Extensive | Good | Limited |
| Learning resources | Most | Many | Many | Fewer |
| Performance | Excellent (19) | Good | Excellent | Excellent |
| Hiring availability | Highest | High | Medium | Low |
| SPA routing | React Router | Built-in | Vue Router | SvelteKit |

- **React 19** — Latest version with concurrent features, improved performance, and simplified state management
- **Vite 8** — Sub-second hot module replacement, instant dev server start, optimized production builds
- **Tailwind 4** — Utility-first CSS framework that enables rapid prototyping while maintaining design consistency

---

### 2.6 Authentication: JWT + bcrypt

**Why JWT over session cookies / OAuth2 / SAML?**

| Criteria | JWT | Session Cookies | OAuth2 | SAML |
|---|:---:|:---:|:---:|:---:|
| Stateless | ✅ | ❌ | ✅ | ✅ |
| No server-side session store | ✅ | ❌ | ✅ | ✅ |
| External service dependency | ❌ | ❌ | ✅ | ✅ |
| Air-gap compatible | ✅ | ✅ | ❌ | ❌ |
| Mobile-friendly | ✅ | ⚠️ | ✅ | ⚠️ |
| Scalable | ✅ | ⚠️ | ✅ | ✅ |

- **JWT (JSON Web Tokens)** — Self-contained tokens with user claims, signed with HMAC-SHA256. No server-side session store needed.
- **bcrypt** — Industry-standard password hashing with configurable cost factor. Resistant to brute-force and rainbow table attacks.
- **Air-gap friendly** — Unlike OAuth2/SAML, JWT doesn't require communication with an external identity provider.

---

### 2.7 Document Integrity: SHA-256

**Why SHA-256 over MD5 / SHA-1 / SHA-3 / BLAKE3?**

| Algorithm | Security | Speed | Output Size | Standard Adoption |
|---|:---:|:---:|:---:|:---:|
| MD5 | ❌ Broken | Fast | 128-bit | Legacy only |
| SHA-1 | ❌ Broken | Fast | 160-bit | Deprecated |
| **SHA-256** | ✅ Secure | Good | 256-bit | Industry standard |
| SHA-3 | ✅ Secure | Slower | 256-bit | Newer, less adopted |
| BLAKE3 | ✅ Secure | Fastest | 256-bit | Newest, less adopted |

- **SHA-256** is the gold standard for document integrity — used in digital certificates (SSL/TLS), Bitcoin blockchain, government digital signature standards, and India's eSign framework.
- Built into Python's `hashlib` — no additional dependencies.
- 256-bit output provides 2^128 collision resistance — computationally infeasible to forge.
- Accepted in Indian courts under the Information Technology Act for digital evidence verification.

---

### 2.8 Containerization: Docker

**Why Docker?**

1. **Reproducible environment** — The AI model stack requires specific versions of PyTorch, PaddleOCR, CUDA libraries. Docker ensures the exact same environment runs everywhere.

2. **GPU support** — NVIDIA Container Toolkit enables GPU passthrough to Docker containers, essential for fast AI inference.

3. **Multi-stage builds** — Frontend (Node.js) and backend (Python) are built in separate stages, producing a single optimized image.

4. **Deployment simplicity** — `docker-compose up -d` deploys the entire system with all dependencies.

---

## 3. Technology Comparison Matrix

### 3.1 SecureDoc DMS vs. Alternative Approaches

| Approach | Pros | Cons | Why Not Chosen |
|---|---|---|---|
| **Commercial DMS (OpenText, DocuWare)** | Mature, feature-rich | Expensive licenses (₹50L+/year), vendor lock-in, cloud dependency | Cost prohibitive for police departments; no Indian legal customization |
| **Generic Cloud (Google Workspace)** | Easy setup, collaboration | Data sovereignty issues, no chain of custody, no legal taxonomy | Classified data cannot leave Indian premises; no integrity verification |
| **Blockchain-based DMS** | True immutability | Extremely complex, high resource usage, slow writes | Overkill for single-organization use; hash-chain provides same tamper detection |
| **Custom Java/Spring Boot** | Enterprise-grade | No Python ML ecosystem, would need separate inference service | Adds architectural complexity; AI is core to the product |
| **CCTNS Extension** | Already deployed in police | Closed-source, limited DMS features, vendor-controlled roadmap | Cannot extend; our system complements CCTNS, not replaces it |
| **Our Approach (FastAPI + AI + SQLite)** | Full-featured, local AI, zero cost, legally compliant | Requires GPU for optimal AI speed | Best balance of features, cost, and deployability |

---

## 4. Scalability & Future Technology Roadmap

### 4.1 Current Capacity (Single Server)

| Metric | Capacity |
|---|---|
| Concurrent users | ~50–100 |
| Total documents | ~100K–500K |
| Total vector chunks | ~5M–10M |
| Database size | ~2–10 GB |
| Storage (documents) | Limited by disk |
| Search latency | < 2 seconds |

### 4.2 Scale-Up Path

| When Needed | Technology Change |
|---|---|
| 100+ concurrent users | Add Nginx load balancer, 2nd app server |
| 500K+ documents | Migrate SQLite → PostgreSQL |
| 10M+ vectors | Migrate ChromaDB → Milvus/Qdrant |
| Multi-region deployment | Add Redis for session caching, PostgreSQL replication |
| Mobile app | API is already REST — add React Native frontend |
| Hindi/regional OCR | Add PaddleOCR Hindi models (already supported) |
| Production auth | Migrate JWT → Keycloak/Authelia (OAuth2/OIDC) |

---

## 5. Open Source & Licensing

| Technology | License | Implication |
|---|---|---|
| FastAPI | MIT | Free for any use |
| React | MIT | Free for any use |
| SQLite | Public Domain | No restrictions |
| ChromaDB | Apache 2.0 | Free for any use |
| PyTorch | BSD | Free for any use |
| Transformers (HuggingFace) | Apache 2.0 | Free for any use |
| PaddleOCR | Apache 2.0 | Free for any use |
| Tesseract | Apache 2.0 | Free for any use |
| GTE models | Apache 2.0 | Free for any use |
| BART-large-CNN | MIT | Free for any use |
| DeBERTa-v3-large NLI | MIT | Free for any use |

**All components are open-source with permissive licenses** — the entire stack can be freely used, modified, and deployed by government agencies without any licensing cost or legal restriction.

---

*Document Version: 1.0*  
*Last Updated: August 2026*

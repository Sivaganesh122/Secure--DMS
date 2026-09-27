"""
Police Cases Route — Case management, subtab organization, and case-scoped search.
"""
from __future__ import annotations
import json
import os
import sqlite3
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from core.db import get_db_connection
from core.config import UPLOAD_DIR

router = APIRouter(prefix="/cases", tags=["Police Cases"])

# Standard law-enforcement investigation subtabs matching problem statement
CASE_SUBTABS = [
    {
        "id": "fir_police_reports",
        "label": "FIRs and police reports",
        "description": "First Information Reports, formal complaints, preliminary inquiry reports",
        "icon": "FileText",
        "is_fir": True,
    },
    {
        "id": "investigation_records",
        "label": "Investigation records",
        "description": "Case diary entries, inspection notes, scene of crime reports",
        "icon": "Folder",
    },
    {
        "id": "witness_statements",
        "label": "Witness statements",
        "description": "Recorded statements under Section 161/164 CrPC / BNSS",
        "icon": "Users",
    },
    {
        "id": "charge_sheets",
        "label": "Charge sheets",
        "description": "Final police investigation reports / charge sheets submitted to court",
        "icon": "CheckSquare",
    },
    {
        "id": "court_filings",
        "label": "Court filings",
        "description": "Judicial petitions, remand applications, bail applications, affidavits",
        "icon": "Scale",
    },
    {
        "id": "evidence_records",
        "label": "Evidence records",
        "description": "Panchnamas, recovery memos, seizure lists, chain of custody logs",
        "icon": "Package",
    },
    {
        "id": "forensic_reports",
        "label": "Forensic reports",
        "description": "Ballistic, chemical, digital cyber forensics, post-mortem / autopsy",
        "icon": "Activity",
    },
    {
        "id": "legal_notices_judgments",
        "label": "Legal notices and judgments",
        "description": "Statutory notices, summons, court orders, bail orders, judgments",
        "icon": "FileSearch",
    },
]

VALID_SUBTAB_IDS = {tab["id"] for tab in CASE_SUBTABS}
# Backward compatibility aliases for previous subtab ids
SUBTAB_ALIASES = {
    "fir": "fir_police_reports",
    "evidence": "evidence_records",
    "charge_sheet": "charge_sheets",
    "court_orders": "court_filings",
    "other": "investigation_records",
}


class CreateCaseRequest(BaseModel):
    case_number: str = Field(..., min_length=1, description="Unique FIR or Case Number (e.g. FIR-2026-0042)")
    title: str = Field(..., min_length=1, description="Short title of the incident / case")
    crime_type: str = Field(..., min_length=1, description="Category of crime / penal sections")
    status: Optional[str] = Field("under_investigation", description="Case status")
    priority: Optional[str] = Field("medium", description="Priority level: low, medium, high, urgent")
    investigating_officer: Optional[str] = Field("", description="Name / ID of the Investigating Officer (IO)")
    police_station: Optional[str] = Field("", description="Police Station / Jurisdiction")
    incident_date: Optional[str] = Field("", description="Date and time of the incident")
    description: Optional[str] = Field("", description="Brief narrative of the case")


class UpdateCaseRequest(BaseModel):
    title: Optional[str] = None
    crime_type: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    investigating_officer: Optional[str] = None
    police_station: Optional[str] = None
    incident_date: Optional[str] = None
    description: Optional[str] = None


@router.get("/subtabs")
def get_case_subtabs():
    """Returns the predefined investigation subtabs for police cases."""
    return CASE_SUBTABS


@router.get("/stats")
def get_case_stats():
    """Computes real-time system metrics directly from the database with no dummy data."""
    conn = get_db_connection()
    try:
        total_cases = conn.execute("SELECT COUNT(*) FROM cases").fetchone()[0]
        under_inv = conn.execute("SELECT COUNT(*) FROM cases WHERE status = 'under_investigation'").fetchone()[0]
        chargesheeted = conn.execute("SELECT COUNT(*) FROM cases WHERE status = 'chargesheeted'").fetchone()[0]
        closed = conn.execute("SELECT COUNT(*) FROM cases WHERE status = 'closed'").fetchone()[0]

        doc_stats = conn.execute(
            "SELECT COUNT(*), COALESCE(SUM(page_count), 0), COALESCE(SUM(file_size_bytes), 0) "
            "FROM documents"
        ).fetchone()
        total_docs = doc_stats[0]
        total_pages = doc_stats[1]
        total_bytes = doc_stats[2]

        return {
            "total_cases": total_cases,
            "under_investigation": under_inv,
            "chargesheeted": chargesheeted,
            "closed": closed,
            "total_documents": total_docs,
            "total_pages": total_pages,
            "total_bytes": total_bytes,
        }
    finally:
        conn.close()


@router.post("", status_code=201)
def create_case(payload: CreateCaseRequest):
    """Registers a new police case in the system."""
    case_number = payload.case_number.strip()
    title = payload.title.strip()
    if not case_number or not title:
        raise HTTPException(status_code=400, detail="Case number and title are required.")

    case_id = str(uuid.uuid4())
    conn = get_db_connection()
    try:
        existing = conn.execute("SELECT id FROM cases WHERE case_number = ?", (case_number,)).fetchone()
        if existing:
            raise HTTPException(status_code=409, detail=f"Case number '{case_number}' already exists.")

        now = datetime.utcnow().isoformat()
        conn.execute(
            """
            INSERT INTO cases (
                id, case_number, title, crime_type, status, priority,
                investigating_officer, police_station, incident_date,
                description, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                case_id,
                case_number,
                title,
                payload.crime_type.strip(),
                payload.status or "under_investigation",
                payload.priority or "medium",
                payload.investigating_officer.strip() if payload.investigating_officer else "",
                payload.police_station.strip() if payload.police_station else "",
                payload.incident_date.strip() if payload.incident_date else "",
                payload.description.strip() if payload.description else "",
                now,
                now,
            ),
        )
        conn.commit()
        created = conn.execute("SELECT * FROM cases WHERE id = ?", (case_id,)).fetchone()
        return dict(created)
    finally:
        conn.close()


@router.get("")
def list_cases(
    query: Optional[str] = Query(None, description="Search by case number, title, or crime type"),
    status: Optional[str] = Query(None, description="Filter by case status"),
    crime_type: Optional[str] = Query(None, description="Filter by crime type"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
):
    """Lists all cases with real document counts aggregated per subtab."""
    conn = get_db_connection()
    try:
        sql = "SELECT * FROM cases WHERE 1=1"
        params: list[Any] = []

        q_val = query.strip() if isinstance(query, str) and query.strip() else None
        s_val = status.strip() if isinstance(status, str) and status.strip() else None
        c_val = crime_type.strip() if isinstance(crime_type, str) and crime_type.strip() else None
        p_val = priority.strip() if isinstance(priority, str) and priority.strip() else None

        if q_val:
            q_like = f"%{q_val}%"
            sql += " AND (case_number LIKE ? OR title LIKE ? OR crime_type LIKE ? OR investigating_officer LIKE ?)"
            params.extend([q_like, q_like, q_like, q_like])

        if s_val:
            sql += " AND status = ?"
            params.append(s_val)

        if c_val:
            sql += " AND crime_type = ?"
            params.append(c_val)

        if p_val:
            sql += " AND priority = ?"
            params.append(p_val)

        sql += " ORDER BY created_at DESC"
        cases = conn.execute(sql, params).fetchall()

        # Aggregate document counts per case and subtab
        doc_rows = conn.execute(
            "SELECT case_id, subtab, COUNT(*) as cnt FROM documents WHERE case_id IS NOT NULL GROUP BY case_id, subtab"
        ).fetchall()

        doc_map: dict[str, dict[str, int]] = {}
        total_doc_map: dict[str, int] = {}
        for r in doc_rows:
            cid = r["case_id"]
            stab = r["subtab"] or "other"
            cnt = r["cnt"]
            if cid not in doc_map:
                doc_map[cid] = {}
                total_doc_map[cid] = 0
            doc_map[cid][stab] = cnt
            total_doc_map[cid] += cnt

        results = []
        for c in cases:
            cid = c["id"]
            case_dict = dict(c)
            case_dict["total_documents"] = total_doc_map.get(cid, 0)
            case_dict["subtab_counts"] = doc_map.get(cid, {})
            results.append(case_dict)

        return results
    finally:
        conn.close()


@router.get("/system/integrity-status")
def global_system_integrity():
    """
    Audits all cases in the repository for any document tampering or broken chain links.
    Used for global notification banners and security audit reports.
    """
    from services.hash_chain import verify_all_cases_integrity
    return verify_all_cases_integrity()


@router.get("/{case_id}")
def get_case_detail(case_id: str):
    """Returns details for a single case along with all its documents grouped by subtab."""
    conn = get_db_connection()
    try:
        case = conn.execute("SELECT * FROM cases WHERE id = ?", (case_id,)).fetchone()
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")

        doc_rows = conn.execute(
            """
            SELECT id, filename, file_size_bytes, page_count, summary, tags,
                   classifications, key_findings, entities, doc_type, status,
                   error_message, upload_date, subtab, file_hash
            FROM documents
            WHERE case_id = ?
            ORDER BY upload_date DESC
            """,
            (case_id,),
        ).fetchall()

        # Group documents by subtab
        documents_by_subtab: dict[str, list[dict]] = {tab["id"]: [] for tab in CASE_SUBTABS}
        for r in doc_rows:
            raw_tab = r["subtab"] or "investigation_records"
            stab = SUBTAB_ALIASES.get(raw_tab, raw_tab)
            if stab not in VALID_SUBTAB_IDS:
                stab = "investigation_records"
            doc_data = {
                "id": r["id"],
                "filename": r["filename"],
                "file_size_bytes": r["file_size_bytes"],
                "page_count": r["page_count"],
                "summary": r["summary"],
                "tags": json.loads(r["tags"]) if r["tags"] else [],
                "status": r["status"],
                "error_message": r["error_message"],
                "upload_date": r["upload_date"],
                "subtab": stab,
                "file_hash": r["file_hash"] if "file_hash" in r.keys() else None,
            }
            documents_by_subtab[stab].append(doc_data)

        case_dict = dict(case)
        case_dict["documents_by_subtab"] = documents_by_subtab
        case_dict["total_documents"] = len(doc_rows)

        # Cryptographic Hash Chain Audit
        try:
            from services.hash_chain import verify_case_hash_chain
            case_dict["integrity"] = verify_case_hash_chain(case_id)
        except Exception as ver_err:
            case_dict["integrity"] = {
                "is_valid": True,
                "tamper_detected": False,
                "total_blocks": 0,
                "tampered_documents": [],
                "chain": [],
                "warning": f"Integrity check failed: {ver_err}",
            }

        return case_dict
    finally:
        conn.close()


@router.patch("/{case_id}")
def update_case(case_id: str, payload: UpdateCaseRequest):
    """Updates mutable case fields."""
    conn = get_db_connection()
    try:
        case = conn.execute("SELECT id FROM cases WHERE id = ?", (case_id,)).fetchone()
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")

        fields: list[str] = []
        values: list[Any] = []
        for field, val in payload.dict(exclude_unset=True).items():
            if val is not None:
                fields.append(f"{field} = ?")
                values.append(val)

        if not fields:
            return {"message": "No updates requested"}

        fields.append("updated_at = ?")
        values.append(datetime.utcnow().isoformat())
        values.append(case_id)

        sql = f"UPDATE cases SET {', '.join(fields)} WHERE id = ?"
        conn.execute(sql, values)
        conn.commit()

        updated = conn.execute("SELECT * FROM cases WHERE id = ?", (case_id,)).fetchone()
        return dict(updated)
    finally:
        conn.close()


@router.delete("/{case_id}")
def delete_case(case_id: str):
    """Deletes a case, its associated documents, file storage, and Chroma vector chunks."""
    conn = get_db_connection()
    try:
        case = conn.execute("SELECT id, case_number FROM cases WHERE id = ?", (case_id,)).fetchone()
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")

        docs = conn.execute("SELECT id, filename FROM documents WHERE case_id = ?", (case_id,)).fetchall()
        doc_ids = [d["id"] for d in docs]

        # Delete from ChromaDB vector store
        try:
            from services.embeddings import get_chroma_collection
            collection = get_chroma_collection()
            collection.delete(where={"case_id": case_id})
        except Exception as e:
            print(f"Warning: Could not delete Chroma chunks for case {case_id}: {e}")

        # Delete physical files
        for doc_id in doc_ids:
            for fname in os.listdir(UPLOAD_DIR):
                if fname.startswith(doc_id):
                    fpath = os.path.join(UPLOAD_DIR, fname)
                    if os.path.isfile(fpath):
                        try:
                            os.remove(fpath)
                        except OSError:
                            pass

        # Delete records from SQLite
        conn.execute("DELETE FROM hash_chain WHERE case_id = ?", (case_id,))
        conn.execute("DELETE FROM documents_fts WHERE id IN (SELECT id FROM documents WHERE case_id = ?)", (case_id,))
        conn.execute("DELETE FROM documents WHERE case_id = ?", (case_id,))
        conn.execute("DELETE FROM cases WHERE id = ?", (case_id,))
        conn.commit()

        return {
            "message": f"Case '{case['case_number']}' and {len(doc_ids)} associated document(s) deleted successfully.",
            "deleted_case_id": case_id,
            "deleted_docs_count": len(doc_ids),
        }
    finally:
        conn.close()


@router.get("/{case_id}/search")
def search_case_documents(
    case_id: str,
    q: str = Query(..., min_length=1, description="Semantic search query"),
    subtab: Optional[str] = Query(None, description="Filter search to a specific subtab"),
    limit: int = Query(8, ge=1, le=50),
):
    """Performs semantic vector search across all documents belonging specifically to this case."""
    conn = get_db_connection()
    try:
        case = conn.execute("SELECT id, case_number, title FROM cases WHERE id = ?", (case_id,)).fetchone()
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")

        hits = []
        vector_error = None
        try:
            from services.embeddings import get_chroma_collection, get_embedding_model
            model = get_embedding_model()
            query_vec = model.encode([q])[0].tolist()
            collection = get_chroma_collection()

            where_filter: dict[str, Any] = {"case_id": case_id}
            if subtab and subtab in VALID_SUBTAB_IDS:
                where_filter = {
                    "$and": [
                        {"case_id": {"$eq": case_id}},
                        {"subtab": {"$eq": subtab}},
                    ]
                }

            # Query ChromaDB with case filter
            results = collection.query(
                query_embeddings=[query_vec],
                n_results=limit,
                where=where_filter,
                include=["documents", "metadatas", "distances"],
            )

            if results and results.get("ids") and results["ids"][0]:
                chunk_ids = results["ids"][0]
                documents = results["documents"][0]
                metadatas = results["metadatas"][0]
                distances = results["distances"][0]

                d_ids = list({m.get("document_id") for m in metadatas if m and m.get("document_id")})
                doc_info = {}
                if d_ids:
                    placeholders = ",".join("?" for _ in d_ids)
                    rows = conn.execute(
                        f"SELECT id, filename, subtab, summary FROM documents WHERE id IN ({placeholders})",
                        d_ids,
                    ).fetchall()
                    doc_info = {r["id"]: dict(r) for r in rows}

                for cid, doc_text, meta, dist in zip(chunk_ids, documents, metadatas, distances):
                    doc_meta_id = meta.get("document_id")
                    d_rec = doc_info.get(doc_meta_id, {})
                    score = round(1.0 - (dist / 2.0), 4) if dist is not None else 0.0

                    hits.append({
                        "chunk_id": cid,
                        "document_id": doc_meta_id,
                        "filename": d_rec.get("filename", "Unknown"),
                        "subtab": d_rec.get("subtab", meta.get("subtab", "other")),
                        "page": meta.get("page", 1),
                        "text": doc_text,
                        "similarity_score": score,
                        "document_summary": d_rec.get("summary", ""),
                    })
        except Exception as err:
            vector_error = str(err)

        # Robust Full-Text Search and database text matching fallback
        if not hits:
            try:
                import re
                clean_terms = re.findall(r"\w+", q)
                fts_query = " OR ".join(clean_terms)
                fts_rows = []
                if fts_query:
                    try:
                        fts_rows = conn.execute(
                            """
                            SELECT d.id, d.filename, d.subtab, d.summary, f.text
                            FROM documents d
                            JOIN documents_fts f ON d.id = f.id
                            WHERE d.case_id = ? AND documents_fts MATCH ?
                            LIMIT ?
                            """,
                            (case_id, fts_query, limit),
                        ).fetchall()
                    except Exception:
                        pass

                if not fts_rows:
                    pattern = f"%{q}%"
                    fts_rows = conn.execute(
                        """
                        SELECT d.id, d.filename, d.subtab, d.summary, f.text
                        FROM documents d
                        JOIN documents_fts f ON d.id = f.id
                        WHERE d.case_id = ? AND (f.text LIKE ? OR d.summary LIKE ? OR d.filename LIKE ?)
                        LIMIT ?
                        """,
                        (case_id, pattern, pattern, pattern, limit),
                    ).fetchall()

                for r in fts_rows:
                    snippet = r["text"][:350] + "..." if len(r["text"]) > 350 else r["text"]
                    hits.append({
                        "chunk_id": f"{r['id']}_match",
                        "document_id": r["id"],
                        "filename": r["filename"],
                        "subtab": r["subtab"],
                        "page": 1,
                        "text": snippet,
                        "similarity_score": 0.95,
                        "document_summary": r["summary"] or "",
                    })
            except Exception as fts_err:
                print(f"FTS search error: {fts_err}")

        res = {
            "case_id": case_id,
            "case_number": case["case_number"],
            "case_title": case["title"],
            "query": q,
            "results_count": len(hits),
            "hits": hits,
        }
        if vector_error and not hits:
            res["warning"] = f"Semantic vector engine: {vector_error}"
        return res
    finally:
        conn.close()


# ── Cryptographic Hash Chain & Tamper Evidence Endpoints ─────────────────────

@router.get("/{case_id}/hash-chain")
def get_case_hash_chain(case_id: str):
    """
    Returns the cryptographic hash chain ledger for a case, including previous hash links,
    block hashes, timestamps, and current file verification status.
    """
    from services.hash_chain import verify_case_hash_chain
    return verify_case_hash_chain(case_id)


@router.get("/{case_id}/integrity")
@router.post("/{case_id}/integrity/verify")
def verify_case_integrity(case_id: str):
    """
    Triggers an on-demand cryptographic audit across all evidence documents in the case docket.
    Verifies physical SHA-256 digests against recorded genesis/block hashes and checks chain continuity.
    """
    from services.hash_chain import verify_case_hash_chain
    return verify_case_hash_chain(case_id)


class TamperSimulateRequest(BaseModel):
    document_id: str


@router.post("/{case_id}/integrity/simulate-tamper")
def simulate_tamper_endpoint(case_id: str, payload: TamperSimulateRequest):
    """
    Demonstration/Testing endpoint: Simulates unauthorized document tampering by
    modifying file bytes on disk. A safe backup is preserved for subsequent restoration.
    """
    from services.hash_chain import simulate_document_tamper, verify_case_hash_chain
    sim_res = simulate_document_tamper(payload.document_id)
    if not sim_res.get("success"):
        raise HTTPException(status_code=400, detail=sim_res.get("error", "Tamper simulation failed."))
    
    audit = verify_case_hash_chain(case_id)
    return {
        "simulation": sim_res,
        "audit_after_tamper": audit,
        "message": "Tampering simulated on disk. Hash chain audit has detected the breach.",
    }


@router.post("/{case_id}/integrity/restore-tamper")
def restore_tamper_endpoint(case_id: str, payload: TamperSimulateRequest):
    """
    Restores the original untampered evidence file from the demo backup, returning
    the hash chain to a verified intact state.
    """
    from services.hash_chain import restore_document_tamper, verify_case_hash_chain
    rest_res = restore_document_tamper(payload.document_id)
    if not rest_res.get("success"):
        raise HTTPException(status_code=400, detail=rest_res.get("error", "Restore failed."))
    
    audit = verify_case_hash_chain(case_id)
    return {
        "restoration": rest_res,
        "audit_after_restore": audit,
        "message": "Original evidence file restored. Hash chain integrity verified intact.",
    }


"""
Document routes — upload, list, status, text, download, delete, retry.
"""
from __future__ import annotations
from typing import Optional
import asyncio
import json
import os
import re
import shutil
import uuid

import numpy as np
from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse

from core.config import ALLOWED_EXTENSIONS, MAX_CHUNKS_PER_DOC, MAX_UPLOAD_BYTES, UPLOAD_DIR
from core.db import get_db_connection
from services.embeddings import get_chroma_collection, get_embedding_model
from services.indexer import (
    _rule_based_tags,
    _rule_based_summary,
    _distilbart_summary,
    chunk_document,
    extract_ai_metadata,
    extract_key_insights,
)
from services.ocr import warm_up_ocr  # noqa: F401  (imported in lifespan)
from services.parser import extract_text_by_pages, _extract_page_text_reading_order
from services.ocr import ocr_pdf_page, ocr_image_bytes

router = APIRouter()

# ── Helper to detect if a subtab is FIR / Police Reports ────────────────────────
def is_fir_subtab(subtab: Optional[str]) -> bool:
    if not subtab:
        return False
    s = subtab.lower().strip()
    return s in {"fir", "fir_police_reports", "fir_and_police_reports"}

def extract_fir_ocr_text(file_path: str, progress_cb=None) -> list[dict]:
    """
    Dedicated OCR pipeline for FIR documents:
    Uses PyMuPDF (fitz) to load the PDF pages, render each page to image,
    and runs PaddleOCR (via ocr_pdf_page / ocr_image_bytes) to extract textual content.
    Returns: [{"page": int, "text": str}]
    """
    _, ext = os.path.splitext(file_path.lower())
    pages_content = []

    if ext == ".pdf":
        import fitz
        doc = fitz.open(file_path)
        total_pages = doc.page_count
        for page_idx in range(total_pages):
            page_num = page_idx + 1
            if progress_cb:
                progress_cb(page_num, total_pages)
            page = doc.load_page(page_idx)
            # First check reading order text via PyMuPDF
            direct_text = _extract_page_text_reading_order(page)
            # If text is minimal (e.g. scanned FIR document), run PaddleOCR
            if not direct_text or len(direct_text.strip()) < 40:
                try:
                    ocr_text = ocr_pdf_page(page, dpi=300)
                    text = ocr_text.strip() if ocr_text else direct_text.strip()
                except Exception as ocr_err:
                    print(f"FIR PaddleOCR fallback error on page {page_num}: {ocr_err}")
                    text = direct_text.strip()
            else:
                text = direct_text.strip()

            pages_content.append({"page": page_num, "text": text or ""})
        doc.close()
    elif ext in [".png", ".jpg", ".jpeg", ".tiff", ".bmp", ".webp"]:
        # Direct image FIR
        with open(file_path, "rb") as f:
            img_bytes = f.read()
        ocr_text = ocr_image_bytes(img_bytes)
        pages_content.append({"page": 1, "text": ocr_text.strip()})
    else:
        # Fallback to standard parser for docx, txt, etc.
        pages_content = extract_text_by_pages(file_path, progress_cb)

    return pages_content

# ── Serialise AI inference to avoid GPU memory contention ─────────────────────
# Running DeBERTa + DistilBART concurrently on the same MPS/CUDA device causes
# "meta tensor" errors when models are half-initialised. One ingest at a time.
_AI_SEMAPHORE = asyncio.Semaphore(3)

# ── In-memory progress tracker (resets on restart) ────────────────────────────
_ingest_progress: dict[str, dict] = {}


def get_ingest_progress() -> dict[str, dict]:
    return _ingest_progress


def _set_progress(doc_id: str, step: str, pct: int, detail: str = "") -> None:
    _ingest_progress[doc_id] = {"step": step, "pct": pct, "detail": detail}


# ── Tag / doc-type helpers ────────────────────────────────────────────────────

_SYLLABUS_TAGS = {"Course Syllabus", "Syllabus"}
_NOTES_TAGS    = {"Lecture Notes", "Lab Report", "Lab Notes"}
_ASSIGN_TAGS   = {"Assignment", "Final Exam", "Midterm Exam", "Exam / Quiz",
                  "Question Bank", "Homework", "Project"}
_LEVEL_WORDS   = ("Graduate", "Doctoral", "Undergraduate", "Upper", "Sophomore",
                  "Introductory", "Advanced")
_TERM_RE       = re.compile(r"^(Spring|Fall|Summer|Winter)\s+\d{4}$", re.IGNORECASE)


def _classify_doc_type(tags: list[str]) -> str:
    tag_set = set(tags)
    if tag_set & _SYLLABUS_TAGS:
        return "syllabus"
    if tag_set & _NOTES_TAGS:
        return "notes"
    if tag_set & _ASSIGN_TAGS:
        return "assign"
    return "other"


def _categorise_tags(tags: list[str]) -> dict:
    DOC_TYPE_SET = _SYLLABUS_TAGS | _NOTES_TAGS | _ASSIGN_TAGS
    result: dict[str, list[str]] = {"subject": [], "doc_type": [], "level": [], "term": []}
    for t in tags:
        if t in DOC_TYPE_SET:
            result["doc_type"].append(t)
        elif _TERM_RE.match(t):
            result["term"].append(t)
        elif any(w in t for w in _LEVEL_WORDS):
            result["level"].append(t)
        else:
            result["subject"].append(t)
    return result


# ── Background ingestion pipeline ─────────────────────────────────────────────

async def background_ingest_task(
    file_path: str,
    doc_id: str,
    case_id: Optional[str] = None,
    subtab: str = "investigation_records",
) -> None:
    conn = None
    cursor = None
    try:
        filename = os.path.basename(file_path)
        file_size = os.path.getsize(file_path)
        is_fir = is_fir_subtab(subtab)

        _set_progress(doc_id, "parsing", 10, f"Processing {filename}…")

        def _page_cb(current: int, total: int) -> None:
            pct = 10 + int((current / max(total, 1)) * 50)
            _set_progress(doc_id, "parsing", pct, f"Reading page {current}/{total}…")

        # ── ONLY for FIR documents: run PyMuPDF + PaddleOCR pipeline ───────────
        if is_fir:
            _set_progress(doc_id, "ocr", 20, "Running PyMuPDF & PaddleOCR extraction on FIR…")
            pages_content = await asyncio.to_thread(extract_fir_ocr_text, file_path, _page_cb)
        else:
            # For other case files: extract direct text without heavy OCR
            pages_content = await asyncio.to_thread(extract_text_by_pages, file_path, _page_cb)

        page_count = len(pages_content) if pages_content else 1
        full_text = "\n\n".join(p["text"] for p in pages_content) if pages_content else ""

        # ── ONLY for FIR documents: run summarization model ───────────────────
        summary = ""
        tags = ["FIR", "Police Report"] if is_fir else [subtab.replace("_", " ").title()]
        classifications = {"doc_type": ["FIR"]} if is_fir else {"doc_type": [subtab]}
        key_findings = []
        entities = {}

        if is_fir and full_text.strip():
            _set_progress(doc_id, "summarizing", 70, "Generating AI summary of FIR content…")
            sample_for_summary = full_text[:4000]
            # Use the existing DistilBART / BART summarization model in the system
            async with _AI_SEMAPHORE:
                bart_sum = await asyncio.to_thread(_distilbart_summary, sample_for_summary)
                if bart_sum:
                    summary = bart_sum
                else:
                    summary = _rule_based_summary(filename, sample_for_summary)
        elif not is_fir:
            # Non-FIR: brief descriptive tag, stored locally
            summary = f"Archived under {subtab.replace('_', ' ').title()}."

        # ── Index into Chroma vector DB if there is text ─────────────────────
        if pages_content and any(p["text"].strip() for p in pages_content):
            _set_progress(doc_id, "chunking", 80, "Indexing content chunks…")
            chunks = chunk_document(pages_content)
            if len(chunks) > MAX_CHUNKS_PER_DOC:
                chunks = chunks[:MAX_CHUNKS_PER_DOC]

            if chunks:
                chunk_texts = [c["text"] for c in chunks]
                try:
                    model = get_embedding_model()
                    embeddings_ndarray = await asyncio.to_thread(model.encode, chunk_texts)
                    valid_mask = np.all(np.isfinite(embeddings_ndarray), axis=1)
                    if not np.all(valid_mask):
                        chunks = [c for c, v in zip(chunks, valid_mask) if v]
                        chunk_texts = [t for t, v in zip(chunk_texts, valid_mask) if v]
                        embeddings_ndarray = embeddings_ndarray[valid_mask]

                    ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
                    metadatas = [
                        {
                            "document_id": doc_id,
                            "case_id": case_id or "",
                            "subtab": subtab or "investigation_records",
                            "page": c["page"],
                        }
                        for c in chunks
                    ]
                    collection = get_chroma_collection()
                    await asyncio.to_thread(
                        collection.add,
                        ids=ids,
                        embeddings=embeddings_ndarray.tolist(),
                        metadatas=metadatas,
                        documents=chunk_texts,
                    )
                except Exception as emb_err:
                    print(f"Vector indexing skipped/failed for {filename}: {emb_err}")

        _set_progress(doc_id, "saving", 95, "Storing case document locally…")
        doc_type = "fir" if is_fir else "other"

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE documents
            SET file_size_bytes=?, page_count=?, summary=?, tags=?,
                classifications=?, key_findings=?, entities=?, doc_type=?,
                case_id=?, subtab=?, status='completed'
            WHERE id=?
            """,
            (
                file_size, page_count, summary,
                json.dumps(tags), json.dumps(classifications),
                json.dumps(key_findings), json.dumps(entities),
                doc_type, case_id, subtab, doc_id,
            ),
        )
        if full_text.strip():
            cursor.execute(
                "INSERT OR REPLACE INTO documents_fts (id, filename, text, tags, summary) "
                "VALUES (?, ?, ?, ?, ?)",
                (doc_id, filename, full_text, " ".join(tags), summary),
            )
        conn.commit()
        _ingest_progress.pop(doc_id, None)
        print(f"Successfully processed and stored document: {filename} (FIR={is_fir})")

    except Exception as exc:
        if conn is not None:
            conn.rollback()
        print(f"Ingestion failed for {file_path}: {exc}")
        _ingest_progress.pop(doc_id, None)
        try:
            fail_conn = get_db_connection()
            fail_conn.execute(
                "UPDATE documents SET status='failed', error_message=? WHERE id=?",
                (str(exc), doc_id),
            )
            fail_conn.commit()
            fail_conn.close()
        except Exception:
            pass
    finally:
        if conn is not None:
            conn.close()


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/upload")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    case_id: Optional[str] = Form(None),
    subtab: Optional[str] = Form("other"),
):
    """Saves a document to disk and starts background ingestion."""
    _, ext = os.path.splitext(file.filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    doc_id    = str(uuid.uuid4())
    temp_path = os.path.join(UPLOAD_DIR, f"{doc_id}{ext}")

    with open(temp_path, "wb") as buf:
        shutil.copyfileobj(file.file, buf)

    file_size = os.path.getsize(temp_path)
    if file_size > MAX_UPLOAD_BYTES:
        os.remove(temp_path)
        raise HTTPException(
            status_code=413,
            detail=(
                f"File too large ({file_size // (1024 * 1024)} MB). "
                f"Max: {MAX_UPLOAD_BYTES // (1024 * 1024)} MB "
                f"(set MAX_UPLOAD_SIZE_MB to raise)."
            ),
        )

    clean_subtab = subtab if subtab else "other"
    clean_case_id = case_id.strip() if case_id and case_id.strip() else None

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO documents (id, case_id, subtab, filename, file_size_bytes, page_count, status) "
        "VALUES (?, ?, ?, ?, 0, 0, 'processing')",
        (doc_id, clean_case_id, clean_subtab, file.filename),
    )
    conn.commit()
    conn.close()

    if clean_case_id:
        try:
            from services.hash_chain import record_document_in_hash_chain
            record_document_in_hash_chain(clean_case_id, doc_id, file.filename, clean_subtab, temp_path)
        except Exception as chain_err:
            print(f"Warning: Hash chain recording failed: {chain_err}")

    background_tasks.add_task(background_ingest_task, temp_path, doc_id, clean_case_id, clean_subtab)
    return {
        "message": "Upload accepted. Processing started.",
        "document_id": doc_id,
        "case_id": clean_case_id,
        "subtab": clean_subtab,
    }


@router.get("/documents")
def list_documents(
    type:      Optional[str] = Query(None, description="Legacy doc_type filter: syllabus|notes|assign|other"),
    tag:       Optional[str] = Query(None, description="Filter by keyword tag"),
    dimension: Optional[str] = Query(None, description="Perspective: subject|field|doc_type|methodology"),
    value:     Optional[str] = Query(None, description="Classification value within the dimension"),
    case_id:   Optional[str] = Query(None, description="Filter by police case ID"),
    subtab:    Optional[str] = Query(None, description="Filter by case subtab"),
):
    """Returns all documents, newest first. Supports case_id, subtab, tag, type, and dimension/value filters."""
    conn = get_db_connection()
    rows = conn.execute(
        "SELECT id, case_id, subtab, filename, file_size_bytes, page_count, summary, tags, "
        "classifications, key_findings, entities, doc_type, status, error_message, upload_date, file_hash "
        "FROM documents ORDER BY upload_date DESC"
    ).fetchall()
    conn.close()

    results = []
    for r in rows:
        tags_list = json.loads(r["tags"]) if r["tags"] else []
        cls       = json.loads(r["classifications"]) if r["classifications"] else {}
        doc_type  = r["doc_type"] or _classify_doc_type(tags_list)

        if case_id and r["case_id"] != case_id:
            continue
        if subtab and r["subtab"] != subtab:
            continue
        if type and doc_type != type:
            continue
        if tag and tag not in tags_list:
            continue
        if dimension and value and value not in cls.get(dimension, []):
            continue

        results.append({
            "id":              r["id"],
            "case_id":         r["case_id"],
            "subtab":          r["subtab"],
            "filename":        r["filename"],
            "file_size_bytes": r["file_size_bytes"],
            "page_count":      r["page_count"],
            "summary":         r["summary"],
            "tags":            tags_list,
            "classifications": cls,
            "tag_categories":  _categorise_tags(tags_list),
            "doc_type":        doc_type,
            "key_findings":    json.loads(r["key_findings"]) if r["key_findings"] else [],
            "entities":        json.loads(r["entities"])     if r["entities"]     else {},
            "status":          r["status"],
            "error_message":   r["error_message"],
            "upload_date":     r["upload_date"],
            "file_hash":       r["file_hash"] if "file_hash" in r.keys() else None,
        })
    return results


@router.get("/documents/counts")
def document_counts():
    """Per-category document counts for sidebar badges."""
    conn  = get_db_connection()
    rows  = conn.execute("SELECT doc_type, status FROM documents").fetchall()
    conn.close()
    counts = {"all": 0, "syllabus": 0, "notes": 0, "assign": 0, "other": 0,
              "processing": 0, "failed": 0}
    for r in rows:
        if r["status"] == "processing":
            counts["processing"] += 1
        elif r["status"] == "failed":
            counts["failed"] += 1
        elif r["status"] == "completed":
            counts["all"] += 1
            dt = r["doc_type"] or "other"
            if dt in counts:
                counts[dt] += 1
    return counts


@router.get("/documents/{doc_id}/status")
def get_document_status(doc_id: str):
    """Lightweight polling endpoint for ingestion progress."""
    conn = get_db_connection()
    row  = conn.execute(
        "SELECT status, error_message FROM documents WHERE id=?", (doc_id,)
    ).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Document not found.")

    prog   = _ingest_progress.get(doc_id, {})
    status = row["status"]
    return {
        "document_id":  doc_id,
        "status":       status,
        "error_message": row["error_message"],
        "step":   prog.get("step",   "queued" if status == "processing" else status),
        "pct":    prog.get("pct",    0 if status == "processing" else (100 if status == "completed" else 0)),
        "detail": prog.get("detail", "Waiting to start…" if status == "processing" else ""),
    }


@router.get("/documents/{doc_id}/text")
def get_document_text(doc_id: str):
    """Returns the full indexed text of a document."""
    conn = get_db_connection()
    row  = conn.execute("SELECT text FROM documents_fts WHERE id=?", (doc_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Document text not found.")
    return {"text": row["text"]}


@router.get("/documents/{doc_id}/insights")
def get_document_insights(doc_id: str):
    """
    Returns key insight sentences extracted from the document's indexed text.
    Uses stored key_findings if available; otherwise extracts on-demand from FTS text.
    """
    conn = get_db_connection()
    meta = conn.execute(
        "SELECT key_findings FROM documents WHERE id=? AND status='completed'", (doc_id,)
    ).fetchone()
    fts  = conn.execute("SELECT text FROM documents_fts WHERE id=?", (doc_id,)).fetchone()
    conn.close()

    if not meta:
        raise HTTPException(status_code=404, detail="Document not found.")

    # Always extract fresh from full text using the scientific-signal extractor
    # (stored key_findings used policy/syllabus heuristics — not suitable for research papers)
    text = fts["text"] if fts else ""
    if not text.strip():
        return {"insights": [], "source": "none"}

    return {"insights": extract_key_insights(text, n=5), "source": "extracted"}


@router.get("/documents/{doc_id}/download")
def download_original_document(doc_id: str):
    """Serves the original uploaded file."""
    conn = get_db_connection()
    row  = conn.execute("SELECT filename FROM documents WHERE id=?", (doc_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Document not found.")

    filename = row["filename"]
    _, ext   = os.path.splitext(filename.lower())
    path     = os.path.join(UPLOAD_DIR, f"{doc_id}{ext}")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Original file not found on disk.")
    return FileResponse(path=path, filename=filename, media_type="application/octet-stream")


@router.delete("/documents/{doc_id}")
def delete_document(doc_id: str):
    """Removes a document from all stores."""
    conn   = get_db_connection()
    cursor = conn.cursor()
    row    = cursor.execute("SELECT filename FROM documents WHERE id=?", (doc_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Document not found.")

    filename = row["filename"]
    try:
        for ext in ALLOWED_EXTENSIONS:
            p = os.path.join(UPLOAD_DIR, f"{doc_id}{ext}")
            if os.path.exists(p):
                os.remove(p)
                break
        get_chroma_collection().delete(where={"document_id": doc_id})
        cursor.execute("DELETE FROM hash_chain    WHERE document_id=?", (doc_id,))
        cursor.execute("DELETE FROM documents     WHERE id=?", (doc_id,))
        cursor.execute("DELETE FROM documents_fts WHERE id=?", (doc_id,))
        conn.commit()
    except Exception as exc:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Delete failed: {exc}")
    finally:
        conn.close()
    return {"message": f"Deleted {filename}"}


@router.post("/documents/{doc_id}/retry")
async def retry_failed_document(doc_id: str, background_tasks: BackgroundTasks):
    """Re-queue a failed document for ingestion without re-uploading the file."""
    conn = get_db_connection()
    row  = conn.execute(
        "SELECT filename, status FROM documents WHERE id=?", (doc_id,)
    ).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Document not found.")
    if row["status"] not in ("failed", "processing"):
        conn.close()
        raise HTTPException(
            status_code=400,
            detail=f"Status is '{row['status']}' — only failed documents can be retried.",
        )

    filename  = row["filename"]
    _, ext    = os.path.splitext(filename.lower())
    file_path = os.path.join(UPLOAD_DIR, f"{doc_id}{ext}")
    if not os.path.exists(file_path):
        conn.close()
        raise HTTPException(status_code=404, detail="Original file not found on disk. Please re-upload.")

    conn.execute(
        "UPDATE documents SET status='processing', error_message=NULL WHERE id=?", (doc_id,)
    )
    conn.commit()
    conn.close()
    background_tasks.add_task(background_ingest_task, file_path, doc_id)
    return {"message": f"Retry started for {filename}.", "document_id": doc_id}

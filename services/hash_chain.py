"""
Cryptographic Hash Chain Service for Legal & Investigation Documents.

Provides non-repudiation, immutable hash chaining, and tamper detection.
Each document uploaded under a case docket is recorded as a cryptographic block
linked to the previous block's SHA-256 hash. If any file byte is modified on disk,
or if blocks in the chain are reordered or removed, the verification engine detects
and flags the tampering immediately.
"""
from __future__ import annotations
import hashlib
import os
import shutil
from datetime import datetime
from typing import Any, Dict, List, Optional

from core.db import get_db_connection
from core.config import UPLOAD_DIR, ALLOWED_EXTENSIONS

GENESIS_PREV_HASH = "0" * 64


def calculate_file_sha256(file_path: str) -> str:
    """Calculates the SHA-256 hash digest of a file on disk."""
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def calculate_block_hash(
    block_index: int,
    case_id: str,
    document_id: str,
    file_hash: str,
    prev_hash: str,
    timestamp: str,
) -> str:
    """Computes deterministic SHA-256 block hash linking previous block and document payload."""
    payload = f"{block_index}|{case_id}|{document_id}|{file_hash}|{prev_hash}|{timestamp}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def find_document_file_path(document_id: str) -> Optional[str]:
    """Finds the stored file path on disk for a given document UUID."""
    for ext in ALLOWED_EXTENSIONS:
        path = os.path.join(UPLOAD_DIR, f"{document_id}{ext}")
        if os.path.isfile(path):
            return path
    for fname in os.listdir(UPLOAD_DIR):
        if fname.startswith(document_id):
            p = os.path.join(UPLOAD_DIR, fname)
            if os.path.isfile(p):
                return p
    return None


def record_document_in_hash_chain(
    case_id: str,
    document_id: str,
    filename: str,
    subtab: str,
    file_path: str,
    operator: str = "Investigating Officer",
) -> Dict[str, Any]:
    """
    Appends a new evidentiary document to the case's cryptographic hash chain.
    If this is the first document for the case, prev_hash is set to GENESIS_PREV_HASH.
    """
    file_hash = calculate_file_sha256(file_path)
    now = datetime.utcnow().isoformat()

    conn = get_db_connection()
    try:
        # Check if already in chain
        existing = conn.execute(
            "SELECT * FROM hash_chain WHERE document_id = ?", (document_id,)
        ).fetchone()
        if existing:
            return dict(existing)

        # Get the previous block for this specific case
        last_block = conn.execute(
            "SELECT block_index, block_hash FROM hash_chain WHERE case_id = ? ORDER BY block_index DESC LIMIT 1",
            (case_id,),
        ).fetchone()

        if last_block:
            prev_hash = last_block["block_hash"]
            next_index = last_block["block_index"] + 1
        else:
            prev_hash = GENESIS_PREV_HASH
            # Get next global block index
            max_global = conn.execute(
                "SELECT MAX(block_index) as m FROM hash_chain"
            ).fetchone()
            next_index = (max_global["m"] or 0) + 1

        block_hash = calculate_block_hash(
            next_index, case_id, document_id, file_hash, prev_hash, now
        )

        conn.execute(
            """
            INSERT INTO hash_chain (
                block_index, case_id, document_id, filename, subtab,
                file_hash, prev_hash, block_hash, timestamp, operator
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                next_index,
                case_id,
                document_id,
                filename,
                subtab,
                file_hash,
                prev_hash,
                block_hash,
                now,
                operator,
            ),
        )

        # Update document record with initial file hash
        conn.execute(
            "UPDATE documents SET file_hash = ? WHERE id = ?",
            (file_hash, document_id),
        )
        conn.commit()

        created = conn.execute(
            "SELECT * FROM hash_chain WHERE document_id = ?", (document_id,)
        ).fetchone()
        return dict(created)
    finally:
        conn.close()


def verify_case_hash_chain(case_id: str) -> Dict[str, Any]:
    """
    Cryptographically audits the hash chain and disk files for a specific case.
    Detects:
    1. Physical file modifications / corruption on disk.
    2. Missing evidence files.
    3. Tampered block hashes or header contents.
    4. Broken chain linkages (previous hash mismatch).
    """
    conn = get_db_connection()
    try:
        case = conn.execute(
            "SELECT id, case_number, title, status FROM cases WHERE id = ?", (case_id,)
        ).fetchone()
        if not case:
            return {
                "case_id": case_id,
                "is_valid": False,
                "tamper_detected": True,
                "error": "Case not found",
            }

        blocks = conn.execute(
            "SELECT * FROM hash_chain WHERE case_id = ? ORDER BY block_index ASC",
            (case_id,),
        ).fetchall()

        if not blocks:
            return {
                "case_id": case_id,
                "case_number": case["case_number"],
                "case_title": case["title"],
                "is_valid": True,
                "tamper_detected": False,
                "total_blocks": 0,
                "tampered_blocks_count": 0,
                "tampered_documents": [],
                "chain": [],
                "verified_at": datetime.utcnow().isoformat(),
                "status_message": "Hash chain ready. No evidentiary documents uploaded yet.",
            }

        is_valid = True
        tampered_blocks = []
        chain_report = []

        for i, row in enumerate(blocks):
            block = dict(row)
            reasons = []

            # 1. Verify Hash Chain Link
            if i == 0:
                # First block in case must point to GENESIS or previous
                link_valid = (block["prev_hash"] == GENESIS_PREV_HASH)
            else:
                expected_prev = blocks[i - 1]["block_hash"]
                link_valid = (block["prev_hash"] == expected_prev)

            if not link_valid:
                reasons.append("Broken hash chain link: Previous block pointer does not match.")

            # 2. Verify Block Hash recalculation
            expected_block_hash = calculate_block_hash(
                block["block_index"],
                block["case_id"],
                block["document_id"],
                block["file_hash"],
                block["prev_hash"],
                block["timestamp"],
            )
            block_hash_valid = (block["block_hash"] == expected_block_hash)
            if not block_hash_valid:
                reasons.append("Block header corrupted: Recalculated block hash does not match recorded block hash.")

            # 3. Verify physical file on disk
            doc_path = find_document_file_path(block["document_id"])
            current_file_hash = None
            file_intact = True

            if not doc_path or not os.path.isfile(doc_path):
                file_intact = False
                reasons.append("Missing file: Evidentiary document file not found on vault disk.")
            else:
                try:
                    current_file_hash = calculate_file_sha256(doc_path)
                    if current_file_hash != block["file_hash"]:
                        file_intact = False
                        reasons.append(
                            f"File tampering detected! Disk hash ({current_file_hash[:16]}...) "
                            f"does not match registered hash ({block['file_hash'][:16]}...)."
                        )
                except Exception as err:
                    file_intact = False
                    reasons.append(f"Failed to read file from disk: {err}")

            block_valid = (link_valid and block_hash_valid and file_intact)
            if not block_valid:
                is_valid = False
                tamper_summary = " | ".join(reasons)
                tampered_blocks.append({
                    "block_index": block["block_index"],
                    "document_id": block["document_id"],
                    "filename": block["filename"],
                    "subtab": block["subtab"],
                    "recorded_hash": block["file_hash"],
                    "current_disk_hash": current_file_hash,
                    "reason": tamper_summary,
                })

            chain_report.append({
                "block_index": block["block_index"],
                "document_id": block["document_id"],
                "filename": block["filename"],
                "subtab": block["subtab"],
                "file_hash": block["file_hash"],
                "current_disk_hash": current_file_hash,
                "prev_hash": block["prev_hash"],
                "block_hash": block["block_hash"],
                "timestamp": block["timestamp"],
                "operator": block.get("operator", "Investigating Officer"),
                "is_valid": block_valid,
                "file_intact": file_intact,
                "link_intact": link_valid,
                "tamper_reason": " | ".join(reasons) if reasons else None,
            })

        return {
            "case_id": case_id,
            "case_number": case["case_number"],
            "case_title": case["title"],
            "is_valid": is_valid,
            "tamper_detected": not is_valid,
            "total_blocks": len(blocks),
            "tampered_blocks_count": len(tampered_blocks),
            "tampered_documents": tampered_blocks,
            "chain": chain_report,
            "verified_at": datetime.utcnow().isoformat(),
            "status_message": "All documents cryptographically verified. Hash chain intact."
            if is_valid
            else f"CRITICAL: {len(tampered_blocks)} tampered or corrupted document(s) detected!",
        }
    finally:
        conn.close()


def verify_all_cases_integrity() -> Dict[str, Any]:
    """
    Runs integrity check across all cases in the repository.
    Used for global alerts, dashboard badges, and repository health monitoring.
    """
    conn = get_db_connection()
    try:
        cases = conn.execute("SELECT id, case_number, title FROM cases ORDER BY created_at DESC").fetchall()
        total_cases = len(cases)
        tampered_cases = []
        total_tampered_docs = 0

        for c in cases:
            res = verify_case_hash_chain(c["id"])
            if res.get("tamper_detected"):
                tampered_cases.append({
                    "case_id": c["id"],
                    "case_number": c["case_number"],
                    "title": c["title"],
                    "tampered_docs": res.get("tampered_documents", []),
                })
                total_tampered_docs += res.get("tampered_blocks_count", 0)

        return {
            "total_cases_audited": total_cases,
            "tampered_cases_count": len(tampered_cases),
            "total_tampered_documents": total_tampered_docs,
            "system_status": "TAMPER_DETECTED" if tampered_cases else "SECURE",
            "tampered_cases": tampered_cases,
            "audited_at": datetime.utcnow().isoformat(),
        }
    finally:
        conn.close()


def simulate_document_tamper(document_id: str) -> Dict[str, Any]:
    """
    Demo/Test utility: Simulates tampering by modifying file bytes on disk,
    keeping a backup to allow restoration.
    """
    doc_path = find_document_file_path(document_id)
    if not doc_path:
        return {"success": False, "error": "Document file not found on disk."}

    backup_path = f"{doc_path}.orig_backup"
    if not os.path.exists(backup_path):
        shutil.copy2(doc_path, backup_path)

    with open(doc_path, "a", encoding="utf-8", errors="ignore") as f:
        f.write(f"\n[UNAUTHORIZED_MODIFICATION_TIMESTAMP_{datetime.utcnow().isoformat()}]")

    new_hash = calculate_file_sha256(doc_path)
    return {
        "success": True,
        "document_id": document_id,
        "message": "File content modified on disk. Cryptographic hash chain verification will now detect tampering.",
        "new_hash": new_hash,
    }


def restore_document_tamper(document_id: str) -> Dict[str, Any]:
    """
    Restores the original untampered file from the backup created during simulation.
    """
    doc_path = find_document_file_path(document_id)
    if not doc_path:
        return {"success": False, "error": "Document file not found on disk."}

    backup_path = f"{doc_path}.orig_backup"
    if not os.path.exists(backup_path):
        return {"success": False, "error": "No original backup found to restore."}

    shutil.copy2(backup_path, doc_path)
    os.remove(backup_path)

    restored_hash = calculate_file_sha256(doc_path)
    return {
        "success": True,
        "document_id": document_id,
        "message": "Original file content restored. Cryptographic hash chain verification will now succeed.",
        "restored_hash": restored_hash,
    }

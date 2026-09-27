from __future__ import annotations
try:
    __import__('pysqlite3')
    import sys
    sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
except ImportError:
    pass

import os

from core.config import EMBEDDING_BATCH_SIZE, EMBEDDING_MODEL_NAME, VECTOR_DIR

_embedding_model = None
_chroma_client = None
_chroma_collection = None


def _best_device() -> str:
    """Return 'cuda', 'mps', or 'cpu' — whichever is available."""
    try:
        import torch
        if torch.cuda.is_available():
            return "cuda"
        if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
            return "mps"
    except Exception:
        pass
    return "cpu"


def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        device = _best_device()
        print(f"Loading embedding model ({EMBEDDING_MODEL_NAME}) on {device.upper()}…")
        try:
            _embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME, device=device)
        except Exception as e:
            print(f"Warning: Failed to load {EMBEDDING_MODEL_NAME}: {e}. Falling back to all-MiniLM-L6-v2")
            _embedding_model = SentenceTransformer("all-MiniLM-L6-v2", device=device)
    return _embedding_model


def get_chroma_client():
    """Returns the shared ChromaDB persistent client."""
    global _chroma_client
    if _chroma_client is None:
        import chromadb
        _chroma_client = chromadb.PersistentClient(path=VECTOR_DIR)
    return _chroma_client


def get_chroma_collection():
    """Returns the document-chunks collection, creating it with cosine space if needed."""
    global _chroma_collection
    if _chroma_collection is None:
        client = get_chroma_client()
        _chroma_collection = client.get_or_create_collection(
            name="document_chunks",
            metadata={"hnsw:space": "cosine"},
        )
        existing_space = (_chroma_collection.metadata or {}).get("hnsw:space", "l2")
        if existing_space != "cosine" and _chroma_collection.count() > 0:
            print(
                "WARNING: Existing ChromaDB collection uses L2 distance. "
                "Call POST /migrate-to-cosine to fix without re-uploading, "
                "or POST /reset to start fresh."
            )
    return _chroma_collection


def reset_chroma_singleton():
    """Force re-initialisation of the collection singleton after deletion/recreation."""
    global _chroma_collection
    _chroma_collection = None

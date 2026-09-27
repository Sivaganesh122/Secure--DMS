const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function fetchDocuments(docType = null, tag = null, dimension = null, value = null) {
  const params = new URLSearchParams();
  if (docType) params.set('type', docType);
  if (tag) params.set('tag', tag);
  if (dimension) params.set('dimension', dimension);
  if (value) params.set('value', value);
  const qs = params.toString() ? '?' + params.toString() : '';
  const r = await fetch(`${BASE}/documents${qs}`);
  if (!r.ok) throw new Error('Failed to load documents');
  return r.json();
}

export async function fetchTags() {
  const r = await fetch(`${BASE}/tags`);
  if (!r.ok) throw new Error('Failed to load tags');
  return r.json();
}

export async function fetchTagsConfig() {
  const r = await fetch(`${BASE}/tags/config`);
  if (!r.ok) throw new Error('Failed to load tags config');
  return r.json();
}

export async function fetchPerspectives() {
  const r = await fetch(`${BASE}/tags/perspectives`);
  if (!r.ok) throw new Error('Failed to load perspectives');
  return r.json();
}

export async function fetchCounts() {
  const r = await fetch(`${BASE}/documents/counts`);
  if (!r.ok) throw new Error('Failed to load counts');
  return r.json();
}

export async function uploadFile(file, caseId = null, subtab = 'other') {
  const fd = new FormData();
  fd.append('file', file);
  if (caseId) fd.append('case_id', caseId);
  if (subtab) fd.append('subtab', subtab);
  const r = await fetch(`${BASE}/upload`, { method: 'POST', body: fd });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: `HTTP ${r.status}` }));
    throw new Error(err.detail || 'Upload failed');
  }
  return r.json();
}

// ── Police Case APIs ──────────────────────────────────────────────────────────

export async function fetchCases(query = null, status = null, crimeType = null, priority = null) {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (status) params.set('status', status);
  if (crimeType) params.set('crime_type', crimeType);
  if (priority) params.set('priority', priority);
  const qs = params.toString() ? '?' + params.toString() : '';
  const r = await fetch(`${BASE}/cases${qs}`);
  if (!r.ok) throw new Error('Failed to load cases');
  return r.json();
}

export async function fetchCaseStats() {
  const r = await fetch(`${BASE}/cases/stats`);
  if (!r.ok) throw new Error('Failed to load case statistics');
  return r.json();
}

export async function fetchCaseSubtabs() {
  const r = await fetch(`${BASE}/cases/subtabs`);
  if (!r.ok) throw new Error('Failed to load case subtabs');
  return r.json();
}

export async function fetchCaseDetail(caseId) {
  const r = await fetch(`${BASE}/cases/${caseId}`);
  if (!r.ok) throw new Error('Failed to load case details');
  return r.json();
}

export async function createCase(data) {
  const r = await fetch(`${BASE}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: `HTTP ${r.status}` }));
    throw new Error(err.detail || 'Case creation failed');
  }
  return r.json();
}

export async function updateCase(caseId, data) {
  const r = await fetch(`${BASE}/cases/${caseId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error('Case update failed');
  return r.json();
}

export async function deleteCase(caseId) {
  const r = await fetch(`${BASE}/cases/${caseId}`, { method: 'DELETE' });
  if (!r.ok) throw new Error('Case deletion failed');
  return r.json();
}

export async function searchCaseDocuments(caseId, query, subtab = null, limit = 8) {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  if (subtab) params.set('subtab', subtab);
  const r = await fetch(`${BASE}/cases/${caseId}/search?${params.toString()}`);
  if (!r.ok) throw new Error('Case semantic search failed');
  return r.json();
}

export async function searchDocuments(query, limit = 10) {
  const r = await fetch(`${BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, limit }),
  });
  if (!r.ok) throw new Error('Search failed');
  return r.json();
}

export async function deleteDocument(id) {
  const r = await fetch(`${BASE}/documents/${id}`, { method: 'DELETE' });
  if (!r.ok) throw new Error('Delete failed');
}

export async function fetchDocumentText(id) {
  const r = await fetch(`${BASE}/documents/${id}/text`);
  if (!r.ok) throw new Error('Could not retrieve document text');
  return r.json();
}

export async function fetchDocumentStatus(id) {
  const r = await fetch(`${BASE}/documents/${id}/status`);
  if (!r.ok) throw new Error('Status fetch failed');
  return r.json();
}

export async function fetchDocumentInsights(id) {
  const r = await fetch(`${BASE}/documents/${id}/insights`);
  if (!r.ok) throw new Error('Insights fetch failed');
  return r.json();
}

export function downloadUrl(id) {
  return `${BASE}/documents/${id}/download`;
}

// ── Hash Chain & Cryptographic Integrity APIs ────────────────────────────────

export async function fetchCaseHashChain(caseId) {
  const r = await fetch(`${BASE}/cases/${caseId}/hash-chain`);
  if (!r.ok) throw new Error('Failed to load hash chain');
  return r.json();
}

export async function verifyCaseIntegrity(caseId) {
  const r = await fetch(`${BASE}/cases/${caseId}/integrity/verify`, { method: 'POST' });
  if (!r.ok) throw new Error('Integrity verification failed');
  return r.json();
}

export async function simulateDocumentTamper(caseId, documentId) {
  const r = await fetch(`${BASE}/cases/${caseId}/integrity/simulate-tamper`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id: documentId }),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: `HTTP ${r.status}` }));
    throw new Error(err.detail || 'Tamper simulation failed');
  }
  return r.json();
}

export async function restoreDocumentTamper(caseId, documentId) {
  const r = await fetch(`${BASE}/cases/${caseId}/integrity/restore-tamper`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id: documentId }),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: `HTTP ${r.status}` }));
    throw new Error(err.detail || 'Tamper restore failed');
  }
  return r.json();
}

export async function fetchSystemIntegrity() {
  const r = await fetch(`${BASE}/cases/system/integrity-status`);
  if (!r.ok) throw new Error('Failed to load system integrity status');
  return r.json();
}


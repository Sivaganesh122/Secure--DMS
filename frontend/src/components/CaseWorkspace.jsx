import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Upload, FileText, Search, Shield, Trash2, Download, 
  ExternalLink, CheckCircle2, Clock, AlertCircle, Sparkles, Filter, 
  Eye, RefreshCw, X, ChevronRight, FileSearch
} from 'lucide-react';
import { 
  fetchCaseDetail, updateCase, uploadFile, deleteDocument, 
  searchCaseDocuments, downloadUrl, fetchDocumentText 
} from '../lib/api.js';

const SUBTABS_META = [
  { id: 'fir_police_reports', label: 'FIRs and police reports', desc: 'First Information Reports, formal complaints, preliminary inquiry reports (PyMuPDF + PaddleOCR & AI Summary Enabled)', is_fir: true },
  { id: 'investigation_records', label: 'Investigation records', desc: 'Case diary entries, inspection notes, scene of crime reports' },
  { id: 'witness_statements', label: 'Witness statements', desc: 'Recorded statements under Section 161/164 CrPC / BNSS' },
  { id: 'charge_sheets', label: 'Charge sheets', desc: 'Final police investigation reports / charge sheets submitted to court' },
  { id: 'court_filings', label: 'Court filings', desc: 'Judicial petitions, remand applications, bail applications, affidavits' },
  { id: 'evidence_records', label: 'Evidence records', desc: 'Panchnamas, recovery memos, seizure lists, chain of custody logs' },
  { id: 'forensic_reports', label: 'Forensic reports', desc: 'Ballistic, chemical, digital cyber forensics, post-mortem / autopsy' },
  { id: 'legal_notices_judgments', label: 'Legal notices and judgments', desc: 'Statutory notices, summons, court orders, bail orders, judgments' },
];

export default function CaseWorkspace({
  caseId,
  onBack,
  onShowToast,
}) {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubtab, setActiveSubtab] = useState('fir_police_reports');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // In-case semantic search state
  const [searchQuery, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  // Document inspection modal
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docText, setDocText] = useState('');
  const [loadingText, setLoadingText] = useState(false);

  const loadCase = async () => {
    try {
      setLoading(true);
      const data = await fetchCaseDetail(caseId);
      setCaseData(data);
    } catch (err) {
      onShowToast?.('Failed to load case details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseId) {
      loadCase();
    }
  }, [caseId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateCase(caseId, { status: newStatus });
      setCaseData((prev) => ({ ...prev, status: newStatus }));
      onShowToast?.(`Status updated to ${newStatus}`, 'success');
    } catch (err) {
      onShowToast?.('Failed to update status', 'error');
    }
  };

  const handleFilesUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let successCount = 0;

    for (const file of files) {
      try {
        await uploadFile(file, caseId, activeSubtab);
        successCount++;
      } catch (err) {
        onShowToast?.(`Failed to upload ${file.name}: ${err.message}`, 'error');
      }
    }

    if (successCount > 0) {
      onShowToast?.(
        `Uploaded ${successCount} document(s). OCR extraction & AI summarization initiated in background.`,
        'success'
      );
      // Reload case details to show new documents
      setTimeout(loadCase, 800);
    }
    setUploading(false);
  };

  const handleDeleteDoc = async (docId, filename) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;
    try {
      await deleteDocument(docId);
      onShowToast?.('Document deleted', 'success');
      loadCase();
    } catch (err) {
      onShowToast?.('Delete failed', 'error');
    }
  };

  const handleSemanticSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const res = await searchCaseDocuments(caseId, searchQuery.trim());
      setSearchResults(res);
    } catch (err) {
      onShowToast?.('Search error: ' + err.message, 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleOpenDocModal = async (doc) => {
    setSelectedDoc(doc);
    setDocText('');
    setLoadingText(true);
    try {
      const textRes = await fetchDocumentText(doc.id);
      setDocText(textRes.text || 'No text extracted.');
    } catch (err) {
      setDocText('Could not load extracted text: ' + err.message);
    } finally {
      setLoadingText(false);
    }
  };

  if (loading && !caseData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-3">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-xs font-medium">Loading case workspace...</span>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-600 gap-4 p-6">
        <AlertCircle className="w-10 h-10 text-rose-500" />
        <h2 className="text-base font-bold text-slate-900">Case Not Found</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const docsMap = caseData.documents_by_subtab || {};
  const currentDocs = docsMap[activeSubtab] || [];
  const activeTabMeta = SUBTABS_META.find((t) => t.id === activeSubtab) || SUBTABS_META[0];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/60 text-slate-800 min-h-screen overflow-y-auto">
      {/* Workspace Top Header */}
      <header className="border-b border-slate-200 bg-white shadow-xs px-6 lg:px-10 py-4 sticky top-0 z-20 space-y-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
              title="Return to Police Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-sm font-extrabold text-blue-700 tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  {caseData.case_number}
                </span>
                <span className="text-slate-300 font-bold">•</span>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">{caseData.title}</h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-mono text-slate-700 font-medium border border-slate-200">
                  {caseData.crime_type}
                </span>
                {caseData.investigating_officer && (
                  <span>IO: <strong className="text-slate-800 font-semibold">{caseData.investigating_officer}</strong></span>
                )}
                {caseData.police_station && (
                  <span>Unit: <strong className="text-slate-800 font-semibold">{caseData.police_station}</strong></span>
                )}
                {caseData.incident_date && (
                  <span>Incident Date: <strong className="text-slate-700 font-semibold">{caseData.incident_date}</strong></span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
              <span className="text-slate-500 font-medium">Status:</span>
              <select
                value={caseData.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-transparent text-blue-700 font-bold focus:outline-none cursor-pointer"
              >
                <option value="under_investigation">Under Investigation</option>
                <option value="chargesheeted">Chargesheeted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <button
              onClick={loadCase}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
              title="Refresh Case Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Case-Scoped Semantic Search Bar */}
        <div className="max-w-7xl mx-auto w-full">
          <form onSubmit={handleSemanticSearch} className="pt-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600" />
              <input
                type="text"
                placeholder="Ask anything or search semantically across all documents in this case (e.g. 'weapon recovered', 'witness description of car')..."
                value={searchQuery}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); setSearchResults(null); }}
                  className="absolute right-16 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer"
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                disabled={searching}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
              >
                {searching ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Semantic Search Results Drawer (if search active) */}
          {searchResults && (
            <div className="mt-3 p-4 bg-white border border-blue-200 rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 text-xs">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-900">
                    Semantic Search Hits for "{searchResults.query}":
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {searchResults.results_count} relevant excerpt(s) found
                  </span>
                </div>
                <button
                  onClick={() => setSearchResults(null)}
                  className="text-slate-500 hover:text-slate-700 text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer font-medium"
                >
                  Close Results
                </button>
              </div>

              {searchResults.results_count === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center font-medium">
                  No matching passages found with sufficient similarity. Try rephrasing your search query.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-80 overflow-y-auto pr-1">
                  {searchResults.hits.map((hit, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs hover:border-blue-300 transition"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-blue-800 truncate max-w-[200px]" title={hit.filename}>
                          {hit.filename}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-600 font-medium">
                            p. {hit.page}
                          </span>
                          <span className="font-mono text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {Math.round(hit.similarity_score * 100)}% match
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed bg-white p-3 rounded-lg border border-slate-200 font-serif">
                        "...{hit.text}..."
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Case Subtabs Navigation Bar */}
      <div className="border-b border-slate-200 bg-white px-6 lg:px-10 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max py-2.5">
          {SUBTABS_META.map((tab) => {
            const count = (docsMap[tab.id] || []).length;
            const isActive = activeSubtab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubtab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Subtab Workspace Body */}
      <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8 flex-1">
        {/* Active Subtab Description & Header */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
              <span>{activeTabMeta.label}</span>
              <span className="text-slate-500 font-semibold text-xs bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {currentDocs.length} attached
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">{activeTabMeta.desc}</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".pdf,.docx,.txt,.md,.json,image/*"
              className="hidden"
              onChange={(e) => handleFilesUpload(Array.from(e.target.files || []))}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-50 shadow-sm shadow-blue-500/20"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Processing OCR & Summary...' : `Attach Document to ${activeTabMeta.label}`}</span>
            </button>
          </div>
        </section>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFilesUpload(Array.from(e.dataTransfer.files || []));
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50 shadow-xs'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3 border border-blue-100">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">
            Drop case documents here, or <span className="text-blue-600 underline">browse files</span>
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            {activeTabMeta.is_fir 
              ? 'FIR Document Ingestion: Extracts content via PyMuPDF and PaddleOCR, then runs the system AI model to generate a summary stored alongside case files.'
              : 'Secure Local Storage: Uploaded documents are saved directly to local storage and indexed under this case file.'}
          </p>
        </div>

        {/* Documents in this Subtab */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Documents Filed Under {activeTabMeta.label}
            </h4>
            <span className="text-xs text-slate-400 font-medium">{currentDocs.length} Total Record(s)</span>
          </div>

          {currentDocs.length === 0 ? (
            <div className="p-12 border border-slate-200 bg-white rounded-2xl text-center shadow-xs">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">No documents attached in this category</p>
              <p className="text-xs text-slate-400 mt-1">
                Upload relevant files above to attach them under {activeTabMeta.label}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {currentDocs.map((doc) => {
                const isProcessing = doc.status === 'processing';
                const isFailed = doc.status === 'failed';
                const isCompleted = doc.status === 'completed';

                return (
                  <div
                    key={doc.id}
                    className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-300 shadow-xs transition"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h5 className="text-sm font-bold text-slate-900 truncate max-w-lg" title={doc.filename}>
                            {doc.filename}
                          </h5>

                          {isCompleted && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>OCR & Vectors Indexed</span>
                            </span>
                          )}

                          {isProcessing && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Ingesting & Summarizing...</span>
                            </span>
                          )}

                          {isFailed && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              <span>Failed</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                          {doc.page_count > 0 && <span>{doc.page_count} page(s)</span>}
                          <span>•</span>
                          <span>{(doc.file_size_bytes / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span>Uploaded: {doc.upload_date}</span>
                        </div>

                        {/* AI Summary Snippet */}
                        {doc.summary && (
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 mt-2.5">
                            <span className="text-blue-700 font-bold text-[10px] uppercase block mb-1 tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>AI Forensic Summary:</span>
                            </span>
                            <p className="line-clamp-2 leading-relaxed">{doc.summary}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleOpenDocModal(doc)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                        title="View Extracted Text & Full Summary"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Inspect</span>
                      </button>

                      <a
                        href={downloadUrl(doc.id)}
                        download
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                        title="Download Original Document"
                      >
                        <Download className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleDeleteDoc(doc.id, doc.filename)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Document Inspector Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 truncate max-w-lg">
                    {selectedDoc.filename}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono font-medium">
                    Case Subtab: {selectedDoc.subtab} • {selectedDoc.page_count} Pages
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Summary Box */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1.5">
                <span className="text-blue-800 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Model Generated Summary</span>
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {selectedDoc.summary || 'No summary generated yet.'}
                </p>
              </div>

              {/* OCR Extracted Text */}
              <div className="space-y-2">
                <span className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  Extracted Text (OCR / Document Parser Content):
                </span>
                {loadingText ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <span className="font-medium">Loading OCR text...</span>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed shadow-inner">
                    {docText}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-[11px] text-slate-500 font-medium">
                Indexed into ChromaDB Vector Store for Semantic Search
              </span>
              <a
                href={downloadUrl(selectedDoc.id)}
                download
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Original</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

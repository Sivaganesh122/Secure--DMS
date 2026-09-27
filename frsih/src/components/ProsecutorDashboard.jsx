import { useState, useEffect } from 'react';
import Layout from './shared/Layout';

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'mycases', label: 'My Cases' },
  { id: 'allcases', label: 'Show All Cases', sub: '' },
  { id: 'evidence', label: 'Evidence Review', sub: '' },
  { id: 'hearings', label: 'Hearings' },
  { id: 'profile', label: 'Profile' },
];

const cases = [
  { id: 'C-1023', title: 'XYZ Investigation', type: 'Theft Prosecution', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', updated: '10 Sep', court: 'Court Room 2', isAssigned: true },
  { id: 'C-1024', title: 'Cyber Security Breach', type: 'Cyber Crime Trial', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Ready', updated: '11 Sep', court: 'Court Room 1', isAssigned: true },
  { id: 'C-1025', title: 'Financial Fraud Case', type: 'Financial Fraud', officer: 'Inspector K. Varma', division: 'Crime Branch Div-2', status: 'Revision', updated: '11 Sep', court: 'Court Room 3', isAssigned: true },
  { id: 'C-1026', title: 'Commercial Burglary', type: 'Burglary Case', officer: 'Sub-Inspector Ramesh', division: 'Cyber Crime', status: 'Completed', updated: '12 Sep', court: 'Court Room 1', isAssigned: true },
  { id: 'C-1027', title: 'Corporate Money Fraud', type: 'Corporate Fraud', officer: 'Inspector Priya M.', division: 'Special Task Force', status: 'Completed', updated: '12 Sep', court: 'Court Room 2', isAssigned: true },
];

const hearings = [
  { case: 'C-1023', date: '15 Sep', time: '10:30 AM', court: 'Court Room 2', type: 'Trial Hearing' },
  { case: 'C-1024', date: '16 Sep', time: '11:00 AM', court: 'Court Room 1', type: 'Bail Hearing' },
  { case: 'C-1025', date: '18 Sep', time: '02:00 PM', court: 'Court Room 3', type: 'Judicial Appeal' },
  { case: 'C-1026', date: '20 Sep', time: '10:00 AM', court: 'Court Room 1', type: 'Judgment Order' },
];

const prosecutorCaseMetadataMap = {
  'C-1023': {
    id: 'C-1023',
    title: 'XYZ Investigation',
    category: 'Theft / Burglary',
    officer: 'Inspector Sharma (Cyber Crime)',
    suspect: 'Raj Kumar (ID: ACC-2024-0047)',
    victim: 'Suresh Sundaram',
    witness: 'Ramesh (Shopkeeper) & Security Guard Statement',
    incidentDate: '2026-09-12',
    incidentTime: '18:30',
    location: 'Sector 4 Commercial Market, Main Road',
    description: 'The accused was found in possession of stolen property valued at ₹4,50,000. CCTV footage and witness statements corroborate the evidence collected at the scene. Initial FIR registered under theft sections.',
    legalSummary: 'Prima facie case established under Sections 379 & 411. Digital CCTV footage and eyewitness statements corroborate stolen property recovery of ₹4,50,000. Recommended for prosecution trial presentation.',
    completedHearings: 2,
    nextHearingNum: '3rd Hearing (Trial Hearing)',
    nextHearingDate: '18 Sep 2026',
    nextHearingTime: '10:30 AM',
    courtRoom: 'Court Room 2 - Special Criminal Bench'
  },
  'C-1024': {
    id: 'C-1024',
    title: 'Cyber Security Breach',
    category: 'Phishing / Cybercrime',
    officer: 'Inspector Sharma (Cyber Crime)',
    suspect: 'Vikram Singh (ID: ACC-2024-0102)',
    victim: 'National Information Systems Hub',
    witness: 'Network Administrator & Cyber Forensic Analyst',
    incidentDate: '2026-09-10',
    incidentTime: '22:15',
    location: 'Central IT Server Infrastructure Zone',
    description: 'Unauthorized penetration and access to administrative server dockets. System logs and IP tracing data verified by forensic team.',
    legalSummary: 'Cybercrime trail verified with digital signatures. Chargesheet framed under Information Technology Act provisions.',
    completedHearings: 1,
    nextHearingNum: '2nd Hearing (Bail Arguments)',
    nextHearingDate: '16 Sep 2026',
    nextHearingTime: '11:00 AM',
    courtRoom: 'Court Room 1 - Cyber Special Court'
  },
  'C-1025': {
    id: 'C-1025',
    title: 'Financial Fraud Case',
    category: 'Banking Fraud',
    officer: 'Inspector K. Varma (Crime Branch Div-2)',
    suspect: 'Deepak Mehta & Partners',
    victim: 'State Treasury & Bank Operations',
    witness: 'Enforcement Directorate Intelligence Officer',
    incidentDate: '2026-09-11',
    incidentTime: '15:30',
    location: 'District Financial Hub',
    description: 'Fraudulent loan approvals backed by forged property titles amounting to ₹1.2 Crores. Financial intelligence unit report corroborates bank audit findings.',
    legalSummary: 'Forensic bank audit report attached. Additional charge sheet revision requested for co-conspirator involvement.',
    completedHearings: 3,
    nextHearingNum: '4th Hearing (Evidence Arguments)',
    nextHearingDate: '20 Sep 2026',
    nextHearingTime: '02:15 PM',
    courtRoom: 'Court Room 3 - Financial Crimes Division'
  },
  'C-1026': {
    id: 'C-1026',
    title: 'Commercial Burglary',
    category: 'Theft / Burglary',
    officer: 'Sub-Inspector Ramesh (Cyber Crime)',
    suspect: 'Ganesh @ Blacky',
    victim: 'Vanguard Retail Enterprises',
    witness: 'Night Security Guard & CCTV Manager',
    incidentDate: '2026-09-12',
    incidentTime: '02:15',
    location: 'Pollachi Commercial Market Complex',
    description: 'Store break-in involving deactivation of security alarm circuit. Stolen merchandise recovered during police checkpoint interception.',
    legalSummary: 'Stolen goods recovery seizure memo verified. Final arguments concluded.',
    completedHearings: 4,
    nextHearingNum: '5th Hearing (Judgment Order)',
    nextHearingDate: '22 Sep 2026',
    nextHearingTime: '10:00 AM',
    courtRoom: 'Court Room 1 - Magistrate Bench'
  },
  'C-1027': {
    id: 'C-1027',
    title: 'Corporate Money Fraud',
    category: 'Banking Fraud',
    officer: 'Inspector Priya M. (Special Task Force)',
    suspect: 'Ex-Chief Accountant',
    victim: 'Apex Logistics Corporate Corp',
    witness: 'Internal Audit Committee',
    incidentDate: '2026-09-12',
    incidentTime: '16:00',
    location: 'Industrial Zone Office Complex',
    description: 'Falsified vendor ledger entries used to divert corporate operational funds into personal offshore holdings over 8 consecutive months.',
    legalSummary: 'Corporate embezzlement ledger hash matched with government vault ledger. Summon issued to audit witnesses.',
    completedHearings: 2,
    nextHearingNum: '3rd Hearing (Cross Examination)',
    nextHearingDate: '23 Sep 2026',
    nextHearingTime: '11:30 AM',
    courtRoom: 'Court Room 2 - Commercial Disputes Bench'
  },
  'C-2022': {
    id: 'C-2022',
    title: 'Bank Money Laundering Indictment',
    category: 'Banking Fraud',
    officer: 'Inspector K. Varma (Crime Branch Div-2)',
    suspect: 'Rajesh Malhotra & Syndicate',
    victim: 'State Treasury & Bank Operations',
    witness: 'Enforcement Directorate Intelligence Officer',
    incidentDate: '2026-09-11',
    incidentTime: '15:30',
    location: 'District Financial Hub',
    description: 'Bank money laundering indictment under active investigation by Inspector K. Varma (Crime Branch Div-2). Master record updated on 11 Sep 2026.',
    legalSummary: 'Multi-account financial trace brief filed. Court summons pending service.',
    completedHearings: 1,
    nextHearingNum: '2nd Hearing (Charge Framing)',
    nextHearingDate: '24 Sep 2026',
    nextHearingTime: '02:00 PM',
    courtRoom: 'Court Room 2 - Criminal Bench'
  }
};

function statusBadge(status) {
  const map = { Active: 'badge-active', Ready: 'badge-done', Revision: 'badge-warning', Completed: 'badge-pending', Review: 'badge-done', Closed: 'badge-done', Pending: 'badge-pending' };
  return map[status] || 'badge-done';
}

export default function ProsecutorDashboard({ onLogout }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [hideDocsForCase, setHideDocsForCase] = useState(false);
  const [myCasesStatusFilter, setMyCasesStatusFilter] = useState('All');

  const handleOpenCase = (c, hideDocs = false) => {
    const id = typeof c === 'string' ? c : c.id;
    setSelectedCaseId(id);
    setHideDocsForCase(hideDocs);
  };

  const handleNavChange = (nav) => {
    setActiveNav(nav);
    setSelectedCaseId(null);
    setHideDocsForCase(false);
    setMyCasesStatusFilter('All');
  };

  const handleNavWithFilter = (nav, filter = 'All') => {
    setActiveNav(nav);
    setMyCasesStatusFilter(filter);
    setSelectedCaseId(null);
    setHideDocsForCase(false);
  };

  return (
    <Layout title="Public Prosecution Workspace" titleIcon="🛡️" userLabel="Rajesh Sharma" userIcon=""
      navItems={navItems} activeNav={activeNav} onNavChange={handleNavChange} onLogout={onLogout} unreadCount={2}>
      {selectedCaseId ? (
        <ProsecutorCaseDetailView
          caseId={selectedCaseId}
          hideDocuments={hideDocsForCase}
          onBack={() => { setSelectedCaseId(null); setHideDocsForCase(false); }}
        />
      ) : (
        <>
          {activeNav === 'dashboard' && <DashboardView onNav={setActiveNav} onNavWithFilter={handleNavWithFilter} onOpenCase={handleOpenCase} />}
          {activeNav === 'mycases' && <MyCasesView onNav={setActiveNav} onOpenCase={handleOpenCase} initialFilter={myCasesStatusFilter} />}
          {activeNav === 'allcases' && <AllCasesView onNav={setActiveNav} onOpenCase={handleOpenCase} />}
          {activeNav === 'evidence' && <EvidenceReviewView onNav={setActiveNav} />}
          {activeNav === 'hearings' && <HearingsView onNav={setActiveNav} onOpenCase={handleOpenCase} />}
          {activeNav === 'alerts' && <AlertsView onNav={setActiveNav} onOpenCase={handleOpenCase} />}
          {activeNav === 'profile' && <ProfileView onNav={setActiveNav} />}
          {!['dashboard', 'mycases', 'allcases', 'evidence', 'hearings', 'alerts', 'profile'].includes(activeNav) && (
            <PlaceholderView title={navItems.find(n => n.id === activeNav)?.label || activeNav} />
          )}
        </>
      )}
    </Layout>
  );
}

function ProsecutorCaseDetailView({ caseId, onBack, hideDocuments }) {
  const isMyCase = cases.some(c => c.id === caseId);

  const defaultMeta = {
    id: caseId,
    title: 'Investigation Case ' + caseId,
    category: 'General Crime Investigation',
    officer: 'Inspector Sharma (Cyber Crime)',
    suspect: 'Under Active Verification',
    victim: 'Complainant On Record',
    witness: 'Witness Statement Ingested',
    incidentDate: '2026-09-12',
    incidentTime: '18:30',
    location: 'Metropolitan Station Jurisdiction',
    description: `Official FIR docket registered under law enforcement system for case ${caseId}. Case documents and evidence records submitted by police.`,
    legalSummary: `Prosecution legal brief for case ${caseId}. Evidence verified under central vault ledger. Ready for upcoming court hearing presentation.`,
    completedHearings: 2,
    nextHearingNum: '3rd Hearing (Trial Hearing)',
    nextHearingDate: '18 Sep 2026',
    nextHearingTime: '10:30 AM',
    courtRoom: 'Court Room 2 - Criminal Bench'
  };

  const caseData = { ...defaultMeta, ...(prosecutorCaseMetadataMap[caseId] || {}) };

  const [legalSummary, setLegalSummary] = useState(caseData.legalSummary);
  const [saveNotif, setSaveNotif] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);

  const handleSaveSummary = () => {
    prosecutorCaseMetadataMap[caseId] = {
      ...caseData,
      legalSummary: legalSummary
    };
    setSaveNotif(true);
    setTimeout(() => setSaveNotif(false), 3000);
  };

  const docs = [
    { id: 'FIRs', title: 'FIRS', subtitle: 'First Information Reports & FIR copies', filename: `FIR_${caseId}_Certified_Copy.pdf`, size: '2.4 MB', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { id: 'INVESTIGATION RECORDS', title: 'INVESTIGATION RECORDS', subtitle: 'Case dockets, logs & officer notes', filename: `Investigation_Docket_${caseId}.pdf`, size: '1.8 MB', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
    { id: 'WITNESS STATEMENTS', title: 'WITNESS STATEMENTS', subtitle: 'Depositions, audio transcripts & statements', filename: `Witness_Deposition_${caseId}.pdf`, size: '3.1 MB', hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0' },
    { id: 'CHARGE SHEETS', title: 'CHARGE SHEETS', subtitle: 'Draft & submitted final charge sheets', filename: `Charge_Sheet_${caseId}.pdf`, size: '4.2 MB', hash: 'b9434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327bb5' },
    { id: 'EVIDENCE RECORDS', title: 'EVIDENCE RECORDS', subtitle: 'Physical evidence photos, hashes & custody logs', filename: `Evidence_Log_${caseId}.pdf`, size: '1.5 MB', hash: '7c9e6679b47401d67764f6480b801f489637c269bf96d91b2925b0f732b01f6f' },
    { id: 'FORENSIC REPORTS', title: 'FORENSIC REPORTS', subtitle: 'Lab analysis, cyber forensics & DNA reports', filename: `Forensic_Lab_Report_${caseId}.pdf`, size: '2.9 MB', hash: '98434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327cc6' }
  ];

  return (
    <div>
      {/* Header bar with back button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            PROSECUTION CASE FILE: {caseId}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            {isMyCase ? 'Official Law Enforcement Dossier & Police Evidence Locker' : 'Central Registry ReadOnly Record — Metadata & Court Hearing Details Only'}
          </p>
        </div>
        <button onClick={onBack} className="btn-secondary" style={{ fontSize: 12 }}>
          ← BACK
        </button>
      </div>

      {/* SECTION 1: COURT HEARINGS & TRIAL SCHEDULE STATUS (FIRST) */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-card-header">COURT HEARINGS & TRIAL SCHEDULE STATUS ({caseId})</div>
        <div className="section-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>COMPLETED HEARINGS</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 24, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#15803d' }}>{caseData.completedHearings}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-charcoal)' }}>Hearings Done</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>UPCOMING HEARING NUMBER</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{caseData.nextHearingNum}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>NEXT HEARING DATE & TIME</div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>
                {caseData.nextHearingDate} · {caseData.nextHearingTime}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>ASSIGNED COURT ROOM / VENUE</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>
                {caseData.courtRoom}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CASE DATA & PARTICULARS */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-card-header">CASE DATA & PARTICULARS</div>
        <div className="section-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px 24px', marginBottom: (isMyCase ? 20 : 0) }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>CASE REFERENCE ID</div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-ink)' }}>{caseData.id}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>CRIME CATEGORY</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{caseData.category}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>INVESTIGATION OFFICER</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{caseData.officer}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>CASE TITLE / INVESTIGATION TITLE</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{caseData.title}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>SUSPECT NAME</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{caseData.suspect}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>VICTIM NAME</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{caseData.victim}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>WITNESS DETAILS</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{caseData.witness}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>INCIDENT DATE</div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{caseData.incidentDate}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>INCIDENT TIME</div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{caseData.incidentTime}</div>
            </div>

            <div style={{ gridColumn: 'span 3' }}>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>INCIDENT LOCATION</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)' }}>{caseData.location}</div>
            </div>
          </div>

          {/* BRIEF INCIDENT SUMMARY & INITIAL FIR STATEMENT (MY CASES ONLY) */}
          {isMyCase && (
            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontWeight: 700 }}>
                BRIEF INCIDENT SUMMARY & INITIAL FIR STATEMENT
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-ink)', lineHeight: 1.5, fontWeight: 500 }}>
                {caseData.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: ASSOCIATED CASE DOCUMENTS & EVIDENCE CATEGORIES (ONLY FOR MY CASES) */}
      {isMyCase && !hideDocuments && (
        <div className="section-card" style={{ marginBottom: 20 }}>
          <div className="section-card-header">ASSOCIATED CASE DOCUMENTS & EVIDENCE CATEGORIES ({caseId})</div>
          <div className="section-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {docs.map(doc => (
                <div key={doc.id} style={{ border: '2px solid #cbd5e1', borderRadius: 8, padding: 16, background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 160 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {doc.title}
                      </div>
                      <span style={{ fontSize: 10, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '1px 6px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>
                        ACTIVE
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-charcoal)', marginBottom: 12 }}>{doc.subtitle}</div>
                    
                    <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all', marginBottom: 16 }}>
                      ✓ {doc.filename} ({doc.size})
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => setViewingDoc(doc)}
                      style={{
                        width: '100%',
                        padding: '8px 16px',
                        background: '#1A1A1A',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 4,
                        fontFamily: 'Oswald, sans-serif',
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                      }}
                    >
                      VIEW DOCUMENT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: PROSECUTION BRIEF LEGAL SUMMARY & ASSESSMENT (BRIEF SUMMARY OPTION ONLY FOR MY CASES) */}
      {isMyCase && (
        <div className="section-card">
          <div className="section-card-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <span>PROSECUTION BRIEF LEGAL SUMMARY & ASSESSMENT</span>
              {saveNotif && (
                <span style={{ fontSize: 11, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: 4, fontWeight: 700, border: '1px solid #86efac' }}>
                  ✓ Legal Brief Summary Saved!
                </span>
              )}
            </div>
          </div>
          <div className="section-card-body">
            <div style={{ marginBottom: 12 }}>
              <textarea
                className="field-input"
                rows={3}
                value={legalSummary}
                onChange={(e) => setLegalSummary(e.target.value)}
                placeholder="Enter prosecutor brief legal summary, evidence observations, case laws, or court presentation notes..."
                style={{
                  width: '100%',
                  fontSize: 13,
                  lineHeight: 1.5,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  background: '#ffffff',
                  border: '1px solid #94a3b8',
                  borderRadius: 6,
                  padding: '12px 14px',
                  boxShadow: 'none',
                  outline: 'none',
                  color: 'var(--color-ink)'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button className="btn-primary" onClick={handleSaveSummary} style={{ padding: '8px 20px', fontSize: 12 }}>
                SAVE LEGAL BRIEF SUMMARY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT VIEWER MODAL */}
      {viewingDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#ffffff', border: '2px solid #1A1A1A', borderRadius: 8, width: '100%', maxWidth: 540, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)', overflow: 'hidden' }}>
            <div style={{ background: '#1A1A1A', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Oswald, sans-serif' }}>
                DOCUMENT PREVIEW — {viewingDoc.title || viewingDoc.filename}
              </div>
              <button onClick={() => setViewingDoc(null)} style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: 18, cursor: 'pointer', fontWeight: 700 }}>✕</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 4 }}>{viewingDoc.filename}</div>
                <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'JetBrains Mono, monospace' }}>Size: {viewingDoc.size} · Verification Date: 12 Sep 2026</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-charcoal)', lineHeight: 1.5, marginBottom: 18 }}>
                Official evidentiary document registered under Case {caseId}. Document digital signature verified against central government vault ledger.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button className="btn-secondary" onClick={() => setViewingDoc(null)} style={{ fontSize: 12 }}>Close Viewer</button>
                <button className="btn-primary" onClick={() => alert(`Opening ${viewingDoc.filename} in document viewer...`)} style={{ fontSize: 12 }}>
                  View Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardView({ onNav, onNavWithFilter, onOpenCase }) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Public Prosecution Dashboard</h2>
        <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>Chief Public Prosecutor: Rajesh Sharma · District Legal Authority, New Delhi</p>
      </div>

      {/* 3-DAY COURT HEARING ALERTS BANNER */}
      <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: 8, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>
            2 COURT HEARINGS SCHEDULED WITHIN 3 DAYS!
          </div>
          <div style={{ fontSize: 12, color: '#7f1d1d', fontWeight: 600 }}>
            Case C-1023 (in 2 days on 15 Sep) & Case C-1024 (in 3 days on 16 Sep) require prosecution brief preparation.
          </div>
        </div>
        <button className="btn-secondary" onClick={() => onNav('alerts')} style={{ fontSize: 12 }}>
          VIEW HEARINGS ALERTS (2) →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Assigned Cases', value: cases.length, filter: 'All' },
          { label: 'Active Trials', value: cases.filter(c => c.status === 'Active' || c.status === 'Ready').length, filter: 'Active' },
          { label: 'Pending Legal Review', value: cases.filter(c => c.status === 'Revision' || c.status === 'Pending').length, warn: true, filter: 'Pending' },
          { label: 'Disposed / Completed', value: cases.filter(c => c.status === 'Completed').length, filter: 'Completed' },
          { label: 'Upcoming Court Dates', value: hearings.length, warn: true, target: 'hearings' },
        ].map(s => (
          <div
            key={s.label}
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => s.target ? onNav(s.target) : (onNavWithFilter ? onNavWithFilter('mycases', s.filter) : onNav('mycases'))}
            title={`Navigate to ${s.label}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: s.warn ? '#b45309' : 'var(--color-ink)', lineHeight: 1 }}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        {/* Case overview */}
        <div className="section-card">
          <div className="section-card-header">Legal Assessment Status Overview</div>
          <div className="section-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
              {[
                { label: 'Under Review', count: 6, color: '#000000' },
                { label: 'Trial Ready', count: 9, color: '#15803d' },
                { label: 'Needs Revision', count: 3, color: '#b45309' },
                { label: 'Completed', count: 8, color: '#525252' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', padding: '12px 6px', background: '#f8fafc', borderRadius: 4, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 24, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: s.color }}>{s.count}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-charcoal)', marginTop: 2, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Interactive SVG Pie / Donut Chart Distribution */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '12px 10px', background: '#f8fafc', borderRadius: 6, border: '1px solid var(--border)' }}>
              {/* SVG Donut / Pie Chart */}
              <div style={{ position: 'relative', width: 120, height: 120 }}>
                <svg width="120" height="120" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Circle 1: Trial Ready (9 cases - 34.6%) */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#15803d" strokeWidth="18" strokeDasharray="87 164.3" strokeDashoffset="0" />
                  {/* Circle 2: Completed (8 cases - 30.8%) */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#475569" strokeWidth="18" strokeDasharray="77.3 174" strokeDashoffset="-87" />
                  {/* Circle 3: Under Review (6 cases - 23.1%) */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1A1A1A" strokeWidth="18" strokeDasharray="58 193.3" strokeDashoffset="-164.3" />
                  {/* Circle 4: Needs Revision (3 cases - 11.5%) */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#b45309" strokeWidth="18" strokeDasharray="29 222.3" strokeDashoffset="-222.3" />
                </svg>
                {/* Center Badge */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontSize: 20, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1 }}>26</span>
                  <span style={{ fontSize: 9, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>CASES</span>
                </div>
              </div>

              {/* Pie Chart Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Trial Ready', count: '9 (34.6%)', color: '#15803d' },
                  { label: 'Completed', count: '8 (30.8%)', color: '#475569' },
                  { label: 'Under Review', count: '6 (23.1%)', color: '#1A1A1A' },
                  { label: 'Needs Revision', count: '3 (11.5%)', color: '#b45309' },
                ].map(leg => (
                  <div key={leg.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: leg.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-ink)' }}>{leg.label}:</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{leg.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming hearings */}
        <div className="section-card">
          <div className="section-card-header">Upcoming Court Dates</div>
          <div style={{ padding: 0 }}>
            {hearings.map((h, i) => (
              <div key={i} style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, background: '#f8fafc', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 14, fontFamily: 'Oswald, sans-serif', fontWeight: 700, lineHeight: 1, color: 'var(--primary)' }}>{h.date.split(' ')[0]}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-charcoal)', fontWeight: 600 }}>Sep</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{h.case}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-charcoal)' }}>{h.court}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-body)', fontWeight: 500 }}>{h.type} · {h.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prosecution Case Registry (Full Width) */}
      <div className="section-card">
        <div className="section-card-header">Prosecution Case Registry (Active Cases)</div>
        <table className="data-table">
          <thead><tr><th>Case ID</th><th>Case Type</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
          <tbody>
            {cases.filter(c => c.status === 'Active').map(c => (
              <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => onOpenCase && onOpenCase(c)}>
                <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{c.id}</td>
                <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{c.type}</td>
                <td><span className={`badge ${statusBadge(c.status)}`}>{c.status}</span></td>
                <td className="mono" style={{ fontSize: 12, color: '#000000', fontWeight: 700 }}>{c.updated}</td>
                <td>
                  <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 11 }} onClick={(e) => { e.stopPropagation(); onOpenCase && onOpenCase(c); }}>Open Case</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MyCasesView({ onNav, onOpenCase, initialFilter = 'All' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    setStatusFilter(initialFilter);
  }, [initialFilter]);

  const filtered = cases.filter(c => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.court && c.court.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter === 'Active') {
      matchesStatus = c.status === 'Active' || c.status === 'Ready';
    } else if (statusFilter === 'Pending') {
      matchesStatus = c.status === 'Pending' || c.status === 'Revision' || c.status === 'Review';
    } else if (statusFilter === 'Completed') {
      matchesStatus = c.status === 'Completed' || c.status === 'Closed';
    } else if (statusFilter !== 'All') {
      matchesStatus = c.status === statusFilter;
    }

    const matchesCategory = categoryFilter === 'All' || c.type === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0, color: 'var(--color-ink)' }}>Prosecution Docket</h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: '4px 0 0', fontWeight: 500 }}>Assigned Cases under Prosecution Review</p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      {/* Filter & Search Controls Bar */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-card-header">Search & Filter My Prosecution Cases</div>
        <div className="section-card-body" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14, alignItems: 'center' }}>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="field-input"
              type="text"
              placeholder="Search by Case ID, Category, Court Room..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 32 }}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select className="field-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Active">Active / Ready</option>
              <option value="Pending">Pending / Revision</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select className="field-input" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Theft / Burglary">Theft / Burglary</option>
              <option value="Banking Fraud">Banking Fraud</option>
              <option value="Phishing / Cybercrime">Phishing / Cybercrime</option>
              <option value="Physical Assault">Physical Assault</option>
            </select>
          </div>
        </div>
      </div>

      <div className="section-card">
        <table className="data-table">
          <thead><tr><th>Case ID</th><th>Category</th><th>Accused Name</th><th>Legal Status</th><th>Court Room</th><th>Updated</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => onOpenCase && onOpenCase(c)}>
                <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{c.id}</td>
                <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{c.type}</td>
                <td style={{ color: 'var(--color-charcoal)', fontWeight: 500 }}>Raj Kumar</td>
                <td><span className={`badge ${statusBadge(c.status)}`}>{c.status}</span></td>
                <td style={{ color: 'var(--color-charcoal)' }}>{c.court}</td>
                <td className="mono" style={{ fontSize: 12, color: '#000000', fontWeight: 700 }}>{c.updated} Sep</td>
                <td>
                  <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 11 }} onClick={(e) => { e.stopPropagation(); onOpenCase && onOpenCase(c); }}>Open Case</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EvidenceReviewView({ onNav }) {
  const [selectedCaseId, setSelectedCaseId] = useState('C-1023');
  const [viewingDoc, setViewingDoc] = useState(null);

  const isMyCase = cases.some(c => c.id === selectedCaseId);

  const docs = [
    { id: 'FIRs', title: 'FIRS', subtitle: 'First Information Reports & FIR copies', filename: `FIR_${selectedCaseId}_Certified_Copy.pdf`, size: '2.4 MB' },
    { id: 'INVESTIGATION RECORDS', title: 'INVESTIGATION RECORDS', subtitle: 'Case dockets, logs & officer notes', filename: `Investigation_Docket_${selectedCaseId}.pdf`, size: '1.8 MB' },
    { id: 'WITNESS STATEMENTS', title: 'WITNESS STATEMENTS', subtitle: 'Depositions, audio transcripts & statements', filename: `Witness_Deposition_${selectedCaseId}.pdf`, size: '3.1 MB' },
    { id: 'CHARGE SHEETS', title: 'CHARGE SHEETS', subtitle: 'Draft & submitted final charge sheets', filename: `Charge_Sheet_${selectedCaseId}.pdf`, size: '4.2 MB' },
    { id: 'EVIDENCE RECORDS', title: 'EVIDENCE RECORDS', subtitle: 'Physical evidence photos, hashes & custody logs', filename: `Evidence_Log_${selectedCaseId}.pdf`, size: '1.5 MB' },
    { id: 'FORENSIC REPORTS', title: 'FORENSIC REPORTS', subtitle: 'Lab analysis, cyber forensics & DNA reports', filename: `Forensic_Lab_Report_${selectedCaseId}.pdf`, size: '2.9 MB' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>PROSECUTION EVIDENCE LOCKER</h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Police Submitted Case Documents & Certified Evidence Categories
          </p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      {/* Case Selector Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, background: '#ffffff', padding: '12px 18px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
        <span style={{ fontSize: 12, fontFamily: 'Oswald, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-ink)' }}>
          Select Case Reference:
        </span>
        <select
          className="field-input"
          style={{ width: 320, fontSize: 13, fontWeight: 700 }}
          value={selectedCaseId}
          onChange={e => setSelectedCaseId(e.target.value)}
        >
          {cases.map(c => (
            <option key={c.id} value={c.id}>
              {c.id} ({c.title} - My Case)
            </option>
          ))}
        </select>
      </div>
      {/* ASSOCIATED CASE DOCUMENTS & EVIDENCE CATEGORIES */}
      <div className="section-card">
        <div className="section-card-header">ASSOCIATED CASE DOCUMENTS & EVIDENCE CATEGORIES ({selectedCaseId})</div>
        <div className="section-card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {docs.map(doc => (
              <div key={doc.id} style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '14px 20px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {doc.title}
                    </div>
                    <span style={{ fontSize: 10, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '1px 6px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>
                      ACTIVE
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-charcoal)', marginBottom: 6 }}>{doc.subtitle}</div>
                  
                  <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>
                    ✓ {doc.filename} ({doc.size})
                  </div>
                </div>

                <div>
                  {isMyCase ? (
                    <button
                      onClick={() => setViewingDoc(doc)}
                      style={{
                        padding: '8px 24px',
                        background: '#1A1A1A',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 4,
                        fontFamily: 'Oswald, sans-serif',
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                      }}
                    >
                      VIEW DOCUMENT
                    </button>
                  ) : (
                    <button
                      disabled
                      style={{
                        padding: '8px 16px',
                        background: '#f1f5f9',
                        color: '#94a3b8',
                        border: '1px solid #cbd5e1',
                        borderRadius: 4,
                        fontFamily: 'Oswald, sans-serif',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'not-allowed'
                      }}
                    >
                      🔒 RESTRICTED
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DOCUMENT VIEWER MODAL */}
      {viewingDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#ffffff', border: '2px solid #1A1A1A', borderRadius: 8, width: '100%', maxWidth: 540, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)', overflow: 'hidden' }}>
            <div style={{ background: '#1A1A1A', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Government Law Enforcement Vault</div>
                <div style={{ fontSize: 16, color: '#ffffff', fontWeight: 700, margin: 0 }}>{viewingDoc.title} Document Viewer</div>
              </div>
              <button onClick={() => setViewingDoc(null)} style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: 18, cursor: 'pointer', fontWeight: 700 }}>✕</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 4 }}>📄 {viewingDoc.filename}</div>
                <div style={{ fontSize: 12, color: 'var(--color-charcoal)', display: 'flex', gap: 16, marginTop: 8 }}>
                  <span>Size: <strong>{viewingDoc.size}</strong></span>
                  <span>Verification Date: <strong>2026-09-12</strong></span>
                </div>
              </div>
              
              <div style={{ border: '2px dashed #cbd5e1', borderRadius: 6, padding: 40, textAlign: 'center', background: '#fafafa', marginBottom: 20 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 4 }}>Official Document Preview</div>
                <div style={{ fontSize: 12, color: 'var(--color-charcoal)' }}>Certified Legal Record & Chain of Custody Verified</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button className="btn-secondary" onClick={() => setViewingDoc(null)} style={{ fontSize: 12 }}>
                  Close Viewer
                </button>
                <button className="btn-primary" onClick={() => alert(`Opening ${viewingDoc.filename} in secure legal PDF viewer...`)} style={{ fontSize: 12 }}>
                  👁️ View Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HearingsView({ onNav, onOpenCase }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0, color: 'var(--color-ink)' }}>Court Hearing Calendar</h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: '4px 0 0', fontWeight: 500 }}>Scheduled Trial & Hearing Sessions for Prosecution Brief Preparation</p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      <div className="section-card">
        <table className="data-table">
          <thead><tr><th>Case Reference</th><th>Date</th><th>Time</th><th>Hearing Purpose</th><th>Court Venue</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {hearings.map((h, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{h.case}</td>
                <td>{h.date} 2026</td>
                <td className="mono" style={{ fontSize: 12, fontWeight: 700 }}>{h.time}</td>
                <td style={{ fontWeight: 600 }}>{h.type}</td>
                <td>{h.court}</td>
                <td><span className="badge badge-pending">Scheduled</span></td>
                <td>
                  <button
                    className="btn-secondary"
                    style={{ padding: '4px 12px', fontSize: 11 }}
                    onClick={() => onOpenCase && onOpenCase(h.case, true)}
                  >
                    Prepare Brief
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const hearingAlertsList = [
  {
    id: 'ALT-101',
    caseId: 'C-1023',
    caseTitle: 'XYZ Investigation',
    daysLeft: 2,
    date: '15 Sep 2026',
    time: '10:30 AM',
    purpose: 'Trial Hearing',
    court: 'Court Room 2 - Special Criminal Bench',
    message: 'Court Hearing for Case C-1023 (XYZ Investigation) is scheduled in 2 days on 15 Sep 2026 at 10:30 AM.'
  },
  {
    id: 'ALT-102',
    caseId: 'C-1024',
    caseTitle: 'Cyber Security Breach',
    daysLeft: 3,
    date: '16 Sep 2026',
    time: '11:00 AM',
    purpose: 'Bail Motion Review',
    court: 'Court Room 1 - Cyber Appellate Bench',
    message: 'Court Hearing for Case C-1024 (Cyber Security Breach) is scheduled in 3 days on 16 Sep 2026 at 11:00 AM.'
  }
];

function AlertsView({ onNav, onOpenCase }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            PROSECUTION ALERTS & HEARING NOTIFICATIONS
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Automated 3-Day Court Hearing Alerts & System Legal Notifications
          </p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      {/* 3-Day Upcoming Court Hearing Alerts Banner */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-card-header" style={{ background: '#fef2f2', borderBottom: '1px solid #fca5a5' }}>
          <span style={{ color: '#b91c1c' }}>CRITICAL 3-DAY COURT HEARING ALERTS ({hearingAlertsList.length})</span>
        </div>
        <div className="section-card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {hearingAlertsList.map(item => (
              <div
                key={item.id}
                style={{
                  border: '2px solid #fca5a5',
                  background: '#fff5f5',
                  borderRadius: 8,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ background: '#ef4444', color: '#ffffff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                      HEARING IN {item.daysLeft} DAYS
                    </span>
                    <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>
                      {item.caseId} — {item.caseTitle}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: '#991b1b', fontWeight: 600, marginBottom: 6 }}>
                    {item.message}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-charcoal)', display: 'flex', gap: 20 }}>
                    <span>Date & Time: <strong>{item.date} · {item.time}</strong></span>
                    <span>Venue: <strong>{item.court}</strong></span>
                    <span>Purpose: <strong>{item.purpose}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* General Notifications Card */}
      <div className="section-card">
        <div className="section-card-header">General System Activity & Ledger Logs</div>
        <div className="section-card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { title: 'Police Evidence Log Ingested', detail: 'Inspector Sharma uploaded certified forensic logs for Case C-1023.', time: '10 Sep 2026' },
              { title: 'Bail Motion Docket Received', detail: 'Defense counsel filed bail application notice for Case C-1024.', time: '11 Sep 2026' },
              { title: 'Central Ledger Hash Audit Verified', detail: 'Vault ledger hash verification passed for all active case records.', time: '12 Sep 2026' }
            ].map((log, idx) => (
              <div key={idx} style={{ padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: 6, background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{log.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-charcoal)' }}>{log.detail}</div>
                </div>
                <div className="mono" style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{log.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileView({ onNav }) {
  const profileData = {
    name: 'Rajesh Sharma',
    dob: '18 Aug 1988',
    age: '38 Years',
    title: 'Senior Public Prosecutor & Chief Legal Counsel',
    barCouncilNo: 'BCI/DEL/2012/84920',
    serviceId: 'PROS-84920-DL',
    experience: '14 Years in High Court & Criminal Prosecution',
    email: 'r.sharma@prosecution.gov.in',
    phone: '+91 98100 45678',
    courtRoom: 'Court Room 2 - Special Criminal Bench',
    officeAddress: 'Chamber 402, High Court Complex, New Delhi - 110001',
    joiningDate: '14 Mar 2012',
    clearanceLevel: 'LEVEL 4 - TOP SECRET LEGAL VAULT'
  };

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            PROSECUTOR OFFICIAL PROFILE
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Directorate of Public Prosecutions · Legal Authority Credentials & Identity
          </p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      {/* Main Identity Hero Card */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-card-body" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Avatar / Badge Icon */}
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#1A1A1A', border: '3px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: '#ffffff', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
            ⚖️
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h3 style={{ fontSize: 20, fontFamily: 'Oswald, sans-serif', fontWeight: 700, margin: 0, color: 'var(--color-ink)', letterSpacing: '0.05em' }}>
                {profileData.name}
              </h3>
              <span style={{ fontSize: 10, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '2px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>
                ACTIVE PROSECUTOR
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-charcoal)', fontWeight: 600, marginBottom: 8 }}>
              {profileData.title}
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--color-charcoal)' }}>
              <span>Bar Council ID: <strong className="mono" style={{ color: 'var(--color-ink)' }}>{profileData.barCouncilNo}</strong></span>
              <span>Service ID: <strong className="mono" style={{ color: 'var(--color-ink)' }}>{profileData.serviceId}</strong></span>
              <span>DOB / Age: <strong style={{ color: 'var(--color-ink)' }}>{profileData.dob} ({profileData.age})</strong></span>
              <span>Experience: <strong style={{ color: '#15803d', fontWeight: 700 }}>14 Years</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Personal & Official Details */}
        <div className="section-card">
          <div className="section-card-header">OFFICIAL CREDENTIALS & CONTACT INFO</div>
          <div className="section-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Row 1: Full Name (Left) | DOB & Age (Right) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>FULL NAME</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{profileData.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>DATE OF BIRTH & AGE</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{profileData.dob} (Age: {profileData.age})</div>
                </div>
              </div>

              {/* Row 2: Email (Left) | Phone (Right) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>OFFICIAL EMAIL ADDRESS</div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{profileData.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>OFFICIAL PHONE NUMBER</div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{profileData.phone}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>LEGAL PRACTICE EXPERIENCE</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{profileData.experience}</div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>ASSIGNED COURT BENCH / VENUE</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{profileData.courtRoom}</div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>OFFICE CHAMBER ADDRESS</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{profileData.officeAddress}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Prosecution Metrics Card */}
        <div>
          <div className="section-card">
            <div className="section-card-header">PROSECUTION TRACK RECORD & METRICS</div>
            <div className="section-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>TOTAL CASES PROSECUTED</div>
                  <div style={{ fontSize: 24, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--color-ink)' }}>{cases.length}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>TRIAL SUCCESS RATE</div>
                  <div style={{ fontSize: 24, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#15803d' }}>100%</div>
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>ACTIVE TRIALS HANDLED</div>
                  <div style={{ fontSize: 24, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--primary)' }}>{cases.filter(c => c.status === 'Active' || c.status === 'Ready' || c.status === 'Revision').length}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>VERIFIED EVIDENCES</div>
                  <div style={{ fontSize: 24, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--color-ink)' }}>{cases.length * 6}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderView({ title }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, color: 'var(--color-body)' }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>⚖️</div>
      <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px', color: 'var(--color-ink)' }}>{title}</h3>
      <p style={{ fontSize: 13 }}>This module is active in the official deployment.</p>
    </div>
  );
}

const allSystemCases = [
  // All System Investigation Cases (Handled by Police Officers)
  { id: 'C-1023', title: 'XYZ Investigation', type: 'Theft / Burglary', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', priority: 'High', updated: '12 Sep 2026', isAssigned: true },
  { id: 'C-1031', title: 'Financial Fraud Case', type: 'Banking Fraud', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', priority: 'Critical', updated: '11 Sep 2026', isAssigned: false },
  { id: 'C-1018', title: 'Cybercrime Incident', type: 'Phishing / Cybercrime', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Pending', priority: 'Medium', updated: '10 Sep 2026', isAssigned: false },
  { id: 'C-1009', title: 'Assault Complaint', type: 'Physical Assault', officer: 'Inspector Sharma', division: 'Special Investigation', status: 'Closed', priority: 'Low', updated: '08 Sep 2026', isAssigned: false },
  { id: 'C-1044', title: 'Commercial Complex Burglary', type: 'Theft / Burglary', officer: 'Inspector K. Varma', division: 'Crime Branch Div-2', status: 'Active', priority: 'High', updated: '12 Sep 2026', isAssigned: false },
  { id: 'C-1052', title: 'Crypto Wallet Exploitation', type: 'Phishing / Cybercrime', officer: 'Sub-Inspector Ramesh', division: 'Cyber Crime', status: 'Active', priority: 'Critical', updated: '12 Sep 2026', isAssigned: false },
  { id: 'C-2015', title: 'State vs. Raj Kumar Syndicate', type: 'Banking Fraud', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', priority: 'Critical', updated: '12 Sep 2026', isAssigned: false },
  { id: 'C-2022', title: 'Bank Money Laundering Indictment', type: 'Banking Fraud', officer: 'Inspector K. Varma', division: 'Crime Branch Div-2', status: 'Pending', priority: 'High', updated: '11 Sep 2026', isAssigned: false },
  { id: 'C-2038', title: 'Cyber Extortion Prosecution', type: 'Phishing / Cybercrime', officer: 'Sub-Inspector Ramesh', division: 'Cyber Crime', status: 'Pending', priority: 'Medium', updated: '10 Sep 2026', isAssigned: false },
  { id: 'C-2041', title: 'Industrial Theft Prosecution', type: 'Theft / Burglary', officer: 'Inspector Priya M.', division: 'Special Task Force', status: 'Active', priority: 'High', updated: '09 Sep 2026', isAssigned: false },
  { id: 'C-3088', title: 'State vs. Metropolitan Bank', type: 'Banking Fraud', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', priority: 'Critical', updated: '12 Sep 2026', isAssigned: false },
  { id: 'C-3092', title: 'Bail Motion: Cyber Attack Case', type: 'Phishing / Cybercrime', officer: 'Sub-Inspector Ramesh', division: 'Cyber Crime', status: 'Pending', priority: 'High', updated: '11 Sep 2026', isAssigned: false },
  { id: 'C-3105', title: 'Judicial Inquiry & Asset Seizure', type: 'Banking Fraud', officer: 'Inspector K. Varma', division: 'Crime Branch Div-2', status: 'Active', priority: 'Critical', updated: '10 Sep 2026', isAssigned: false },
  { id: 'C-3118', title: 'Magistrate Verdict & Final Order', type: 'Physical Assault', officer: 'Inspector Priya M.', division: 'Special Task Force', status: 'Closed', priority: 'Low', updated: '08 Sep 2026', isAssigned: false }
];

function AllCasesView({ onNav, onOpenCase }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredCases = allSystemCases.filter(c => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.officer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.type === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Central Department Cases Registry</h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>Comprehensive Logged Cases across All Investigating Officers & Divisions</p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      {/* Filter & Search Controls Bar */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-card-header">Search & Filter All System Cases</div>
        <div className="section-card-body" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14, alignItems: 'center' }}>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="field-input"
              type="text"
              placeholder="Search by Case ID, Title, Officer or Category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 32 }}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select className="field-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Crime Category Filter */}
          <div>
            <select className="field-input" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Theft / Burglary">Theft / Burglary</option>
              <option value="Banking Fraud">Banking Fraud</option>
              <option value="Phishing / Cybercrime">Phishing / Cybercrime</option>
              <option value="Physical Assault">Physical Assault</option>
            </select>
          </div>

        </div>
      </div>

      {/* Cases Data Table */}
      <div className="section-card">
        <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>System Master Case Docket ({filteredCases.length} Records)</span>
          <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 600 }}>Showing case handling police officers & divisions</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Case Reference</th>
              <th>Case Title</th>
              <th>Category</th>
              <th>Case Handling Police Officer</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map(c => (
              <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => onOpenCase && onOpenCase(c)}>
                <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{c.id}</td>
                <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{c.title}</td>
                <td>{c.type}</td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: 13 }}>{c.officer}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-charcoal)' }}>{c.division}</div>
                </td>
                <td><span className={`badge ${c.status === 'Active' ? 'badge-active' : c.status === 'Pending' ? 'badge-pending' : 'badge-done'}`}>{c.status}</span></td>
                <td className="mono" style={{ fontSize: 12, color: '#000000', fontWeight: 700 }}>{c.updated}</td>
                <td>
                  <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 11 }} onClick={(e) => { e.stopPropagation(); onOpenCase && onOpenCase(c); }}>Open Case</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

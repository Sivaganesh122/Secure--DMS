import { useState } from 'react';
import Layout from './shared/Layout';
import NotificationModal from './shared/NotificationModal';

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'mycases', label: 'My Cases' },
  { id: 'allcases', label: 'Show All Cases', sub: '' },
  { id: 'hearings', label: 'Hearings' },
  { id: 'orders', label: 'Orders' },
  { id: 'aging', label: 'Pending & Aging Cases' },
  { id: 'profile', label: 'Profile' },
];

const todayHearings = [
  { id: 'C-101', time: '10:00 AM', type: 'Bail Application', title: 'State vs Patel', parties: 'State vs Patel', status: 'Scheduled', category: 'Hearing', officer: 'Inspector Sharma (Cyber Crime)', suspect: 'Rakesh Patel', victim: 'State of Maharashtra', witness: 'Sub-Inspector Kumar', incidentDate: '2026-09-01', incidentTime: '10:00', location: 'Commercial Complex, Sector 4', summary: 'Bail application submitted under Section 439 CrPC regarding alleged financial irregularity.' },
  { id: 'C-102', time: '11:30 AM', type: 'Trial Hearing', title: 'State vs Kumar', parties: 'State vs Kumar', status: 'In Progress', category: 'Hearing', officer: 'Inspector K. Varma', suspect: 'Rajesh Kumar', victim: 'Anil Mehta', witness: 'Ramesh (Shopkeeper)', incidentDate: '2026-08-25', incidentTime: '14:30', location: 'Main Market Road', summary: 'Trial hearing in cyber fraud case. Accused produced from judicial custody.' },
  { id: 'C-103', time: '02:00 PM', type: 'Appeal Hearing', title: 'Sharma vs State', parties: 'Sharma vs State', status: 'Scheduled', category: 'Hearing', officer: 'Inspector Sharma', suspect: 'Vijay Sharma', victim: 'State Government', witness: 'Revenue Inspector', incidentDate: '2026-07-15', incidentTime: '11:15', location: 'District Office Zone 2', summary: 'Judicial appeal against lower court conviction in land document dispute.' },
  { id: 'C-104', time: '03:30 PM', type: 'Verdict Pronouncement', title: 'State vs Singh', parties: 'State vs Singh', status: 'Scheduled', category: 'Hearing', officer: 'Inspector Priya M.', suspect: 'Harpreet Singh', victim: 'Metropolitan Bank', witness: 'Bank Manager & Auditor', incidentDate: '2026-06-10', incidentTime: '16:00', location: 'Central Bank Branch', summary: 'Case reserved for final verdict pronouncement today at 03:30 PM.' },
  { id: 'C-105', time: '04:30 PM', type: 'Bail Hearing', title: 'State vs Gupta', parties: 'State vs Gupta', status: 'Scheduled', category: 'Hearing', officer: 'Inspector Sharma', suspect: 'Amit Gupta', victim: 'Deepak Traders', witness: 'Accountant Statement', incidentDate: '2026-09-05', incidentTime: '12:00', location: 'Industrial Area Phase 1', summary: 'Interim bail motion filed on grounds of medical urgency.' },
  { id: 'C-106', time: '09:30 AM', type: 'Corruption Trial (New Filing)', title: 'CBI vs Apex Infra', parties: 'CBI vs Apex Infra', status: 'Newly Listed', category: 'New Case', officer: 'DSP R. Deshmukh', suspect: 'Apex Infra Directors', victim: 'Public Works Dept', witness: 'Audit Bureau Report', incidentDate: '2026-08-30', incidentTime: '10:00', location: 'Infra Corridor Project', summary: 'Fresh chargesheet submitted under PC Act for tender irregularity.' },
  { id: 'C-108', time: '11:00 AM', type: 'Writ Petition Hearing', title: 'Municipal Corp vs Resident Body', parties: 'Municipal Corp vs Resident Body', status: 'Scheduled', category: 'Hearing', officer: 'Adv. G. Bhat', suspect: 'Commercial Developers', victim: 'Resident Association', witness: 'Town Planner', incidentDate: '2026-09-02', incidentTime: '09:30', location: 'Green Belt Zone 4', summary: 'Writ petition contesting municipal rezoning resolution.' },
  { id: 'C-110', time: '12:15 PM', type: 'Economic Offence (New Motion)', title: 'State vs Mehra', parties: 'State vs Mehra', status: 'Newly Listed', category: 'New Case', officer: 'Inspector K. Singh', suspect: 'Sanjay Mehra', victim: 'Investments Ltd', witness: 'Forensic Accountant', incidentDate: '2026-09-08', incidentTime: '15:20', location: 'Financial District', summary: 'Newly listed economic offence motion for custodial interrogation.' },
  { id: 'C-112', time: '02:45 PM', type: 'Cyber Financial Fraud', title: 'State vs Cyber Gang', parties: 'State vs Cyber Gang', status: 'Newly Listed', category: 'New Case', officer: 'SI Ramesh', suspect: 'Cyber Syndicate', victim: 'Bank Account Holders', witness: 'CERT-In Analysis', incidentDate: '2026-09-10', incidentTime: '02:00', location: 'Online Network Domain', summary: 'Newly listed cyber extortion indictment.' },
  { id: 'C-115', time: '05:00 PM', type: 'Special Motion Hearing', title: 'State vs Verma', parties: 'State vs Verma', status: 'Scheduled', category: 'Hearing', officer: 'Inspector Sharma', suspect: 'Nitin Verma', victim: 'State Treasury', witness: 'Customs Examiner', incidentDate: '2026-09-04', incidentTime: '17:45', location: 'Customs Cargo Terminal', summary: 'Special motion hearing regarding seizure of unregistered items.' }
];

const myCases = [
  { id: 'C-101', title: 'State vs Patel', type: 'Criminal Trial', status: 'Active', stage: 'Hearing' },
  { id: 'C-102', title: 'State vs Kumar', type: 'Criminal Trial', status: 'Active', stage: 'Evidence' },
  { id: 'C-103', title: 'Sharma vs State', type: 'Judicial Appeal', status: 'Active', stage: 'Arguments' },
  { id: 'C-104', title: 'State vs Singh', type: 'Criminal Trial', status: 'Judgment', stage: 'Verdict Draft' },
  { id: 'C-105', title: 'State vs Gupta', type: 'Criminal Motion', status: 'Active', stage: 'Bail Hearing' },
];

export default function JudgeDashboard({ onLogout }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [hearingsList, setHearingsList] = useState(todayHearings);
  const [alertsList, setAlertsList] = useState([
    { id: 1, type: 'critical', title: 'Verdict Pronouncement Due Today', text: 'State vs Singh (Case #C-104) is scheduled for final judgment pronouncement at 03:30 PM today in Court Room 2.', time: '10 mins ago' },
    { id: 2, type: 'warning', title: 'Digital Signatures Pending', text: '2 Judicial Orders (ORD-2026-441 & ORD-2026-440) are draft-approved and await your e-Signature.', time: '1 hour ago' },
    { id: 3, type: 'info', title: 'High-Court Circular Issued', text: 'New High Court directive regarding expedited disposal of cyber financial fraud cases (>90 days).', time: '3 hours ago' },
    { id: 4, type: 'urgent', title: 'Aging Case Warning (>90 Days)', text: 'Case C-1009 (State vs Kumar) has reached 94 days in Evidence Stage without progress.', time: '5 hours ago' },
  ]);

  return (
    <Layout 
      title="Judicial Bench & Courtroom Portal" 
      titleIcon="🛡️" 
      userLabel="Ramesh" 
      userIcon=""
      unreadCount={alertsList.length}
      navItems={navItems} 
      activeNav={activeNav} 
      onNavChange={setActiveNav} 
      onLogout={onLogout}
    >
      {activeNav === 'dashboard' && <DashboardView onNav={setActiveNav} alertsList={alertsList} setAlertsList={setAlertsList} />}
      {activeNav === 'mycases' && <MyCasesView onNav={setActiveNav} />}
      {activeNav === 'allcases' && <AllCasesView onNav={setActiveNav} />}
      {activeNav === 'hearings' && <HearingsDetailView onNav={setActiveNav} hearingsList={hearingsList} setHearingsList={setHearingsList} />}
      {activeNav === 'orders' && <OrdersView hearingsList={hearingsList} onNav={setActiveNav} />}
      {activeNav === 'aging' && <AgingCasesView onNav={setActiveNav} />}
      {activeNav === 'alerts' && <JudicialAlertsView onNav={setActiveNav} alertsList={alertsList} setAlertsList={setAlertsList} />}
      {activeNav === 'profile' && <JudgeProfileView onNav={setActiveNav} />}
      {!['dashboard', 'mycases', 'allcases', 'hearings', 'orders', 'aging', 'alerts', 'profile'].includes(activeNav) && (
        <PlaceholderView title={navItems.find(n => n.id === activeNav)?.label || activeNav} onNav={setActiveNav} />
      )}
    </Layout>
  );
}

function DashboardView({ onNav, alertsList: propAlerts, setAlertsList: propSetAlerts }) {
  const [selectedCaseForDrawer, setSelectedCaseForDrawer] = useState(null);
  const [selectedJudgmentForSign, setSelectedJudgmentForSign] = useState(null);
  const [escalationCase, setEscalationCase] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const [localAlerts, setLocalAlerts] = useState([
    { id: 1, type: 'critical', title: 'Verdict Pronouncement Due Today', text: 'State vs Singh (Case #C-104) is scheduled for final judgment pronouncement at 03:30 PM today.', time: '10 mins ago' },
    { id: 2, type: 'warning', title: 'Digital Signatures Pending', text: '2 Judicial Orders (ORD-2026-441 & ORD-2026-440) are draft-approved and await your e-Signature.', time: '1 hour ago' },
    { id: 3, type: 'info', title: 'High-Court Circular Issued', text: 'New High Court directive regarding expedited disposal of cyber financial fraud cases (>90 days).', time: '3 hours ago' },
    { id: 4, type: 'urgent', title: 'Aging Case Warning (>90 Days)', text: 'Case C-1009 (State vs Kumar) has reached 94 days in Evidence Stage without progress.', time: '5 hours ago' },
  ]);

  const alerts = propAlerts !== undefined ? propAlerts : localAlerts;
  const setAlerts = propSetAlerts !== undefined ? propSetAlerts : setLocalAlerts;

  const [documents, setDocuments] = useState([
    { id: 'DOC-901', name: 'Final_ChargeSheet_C102.pdf', caseId: 'C-102', type: 'Police Charge Sheet', date: 'Today, 09:15 AM', status: 'Pending Review', badge: 'badge-warning' },
    { id: 'DOC-902', name: 'Bail_Application_Exhibit_A.pdf', caseId: 'C-105', type: 'Bail Petition', date: 'Today, 08:30 AM', status: 'Reviewed', badge: 'badge-done' },
    { id: 'DOC-903', name: 'Cyber_Forensic_Lab_Report.pdf', caseId: 'C-104', type: 'Expert Opinion', date: '12 Sep 2026', status: 'Verified Seal', badge: 'badge-active' },
    { id: 'DOC-904', name: 'Medical_Examination_Record.pdf', caseId: 'C-101', type: 'Hospital Report', date: '11 Sep 2026', status: 'Pending Review', badge: 'badge-warning' },
  ]);

  const [agingCases, setAgingCases] = useState([
    { id: 'C-1009', title: 'State vs Kumar', stage: 'Evidence Stage', pendingDays: 94, reason: 'Forensic Report Delayed', escalated: false },
    { id: 'C-1018', title: 'Sharma vs State', stage: 'Arguments', pendingDays: 82, reason: 'Counsel Extension Request', escalated: false },
    { id: 'C-1031', title: 'Financial Fraud Case', stage: 'Witness Cross-Exam', pendingDays: 68, reason: 'Multiple Accused Hearing', escalated: false },
  ]);

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const markDocVerified = (docId) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: 'Verified Seal', badge: 'badge-done' } : d));
  };

  const handleConfirmEscalation = (caseId) => {
    setAgingCases(prev => prev.map(c => c.id === caseId ? { ...c, escalated: true } : c));
    setEscalationCase(null);
    setNotification({
      isOpen: true,
      title: 'CASE ESCALATED TO REGISTRAR',
      message: `Case ${caseId} has been formally escalated to the High Court Registrar General for expedited intervention and priority listing.`,
      type: 'success'
    });
  };

  const handleSignatureComplete = (judgmentId, hash) => {
    setSelectedJudgmentForSign(null);
    setAuditLogs(prev => [
      { id: Date.now(), judgmentId, hash, timestamp: new Date().toLocaleString(), judge: 'Hon. Justice Ramesh' },
      ...prev
    ]);
    setNotification({
      isOpen: true,
      title: 'E-SIGNATURE AUTHORIZED & LOGGED',
      message: `Judgement for Case ${judgmentId} has been cryptographically signed and logged with audit hash: ${hash.slice(0, 16)}...`,
      type: 'success'
    });
  };

  return (
    <div>
      <NotificationModal 
        isOpen={notification.isOpen} 
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      {/* Slide-in Quick Access Case Drawer */}
      {selectedCaseForDrawer && (
        <CaseQuickAccessDrawer 
          caseId={selectedCaseForDrawer} 
          onClose={() => setSelectedCaseForDrawer(null)} 
        />
      )}

      {/* Multi-step E-Signature Modal */}
      {selectedJudgmentForSign && (
        <ESignatureModal 
          judgment={selectedJudgmentForSign}
          onClose={() => setSelectedJudgmentForSign(null)}
          onComplete={handleSignatureComplete}
        />
      )}

      {/* Escalation Micro-Dialog */}
      {escalationCase && (
        <EscalationDialog
          caseItem={escalationCase}
          onClose={() => setEscalationCase(null)}
          onConfirm={() => handleConfirmEscalation(escalationCase.id)}
        />
      )}

      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            Judicial Bench Master Dashboard
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Hon. Justice Ramesh · Additional Sessions Court, New Delhi Bench · Courtroom No. 4
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => onNav('orders')} className="btn-primary" style={{ fontSize: 12 }}>
            Today's Judgements
          </button>
        </div>
      </div>

      {/* 1. ACTION REQUIRED STRIP (Top Priority Zone) */}
      <ActionRequiredStrip 
        onSignClick={(judgment) => setSelectedJudgmentForSign(judgment)}
        onCaseClick={(caseId) => setSelectedCaseForDrawer(caseId)}
        onEscalateClick={(caseItem) => setEscalationCase(caseItem)}
        agingCases={agingCases}
      />

      {/* Top Stat Overview Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: "Today's Case List", value: '5 Cases', warn: true, sub: 'Scheduled today', target: 'hearings' },
          { label: 'Case Status', value: '32 Total', sub: '18 Active Hearings', target: 'mycases' },
          { label: 'Pending / Aging', value: '3 Overdue', warn: true, sub: '> 90 Days Backlog', target: 'aging' },
          { label: 'Judgment Status', value: '4 Pending', sub: '1 Ready for Sign', target: 'orders' },
          { label: 'Documents & Alerts', value: `${documents.length} Docs / ${alerts.length} Alerts`, sub: 'Requires Review', target: 'alerts' },
        ].map((s, idx) => (
          <div key={idx} className="stat-card" onClick={() => onNav && onNav(s.target)} style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 24, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: s.warn ? 'var(--primary)' : 'var(--color-ink)', lineHeight: 1.1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-charcoal)', marginTop: 4, fontWeight: 500 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Row 1: Today's Case List + Case Status & Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
        
        {/* SECTION 1: TODAY'S CASE LIST */}
        <div className="section-card">
          <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 4, height: 16, background: '#c9a227', borderRadius: 2 }} />
              <span style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}>TODAY'S CASE LIST ({new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase()})</span>
            </div>
            <button onClick={() => onNav('hearings')} className="btn-secondary" style={{ padding: '4px 12px', fontSize: 11, fontWeight: 700, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}>
              VIEW ALL ({todayHearings.length})
            </button>
          </div>
          <div>
            {todayHearings.slice(0, 3).map((h, i) => (
              <div key={i} style={{ padding: '12px 18px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: 'var(--primary)', flexShrink: 0, width: 68 }}>{h.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{h.id}</span>
                      {h.id === 'C-102' && <ConflictBadge text="Overlap Warning (11:30 AM)" />}
                      {h.category === 'New Case' && <span style={{ fontSize: 9, background: '#dbeafe', color: '#1e40af', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>NEW CASE</span>}
                    </div>
                    <span className={`badge ${h.status === 'In Progress' ? 'badge-active' : h.status === 'Newly Listed' ? 'badge-done' : 'badge-pending'}`}>{h.status}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{h.type}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-charcoal)' }}>{h.parties}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setSelectedCaseForDrawer(h.id)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: 11 }}>Quick View</button>
                  <button onClick={() => onNav('orders')} className="btn-secondary" style={{ padding: '4px 8px', fontSize: 11 }}>Order</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 18px', background: '#f8fafc', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 12, color: 'var(--color-charcoal)', fontWeight: 600 }}>
            Showing top 3 of {todayHearings.length} listed cases for today. <span onClick={() => onNav('hearings')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>View full schedule ({todayHearings.length} cases) →</span>
          </div>
        </div>

        {/* SECTION 2: CASE STATUS & DISTRIBUTION */}
        <div className="section-card">
          <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>BENCH CASE STATUS & DISTRIBUTION</span>
            <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 600 }}>32 Total Assigned</span>
          </div>
          <div className="section-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
              {[
                { label: 'Active Hearing', count: 18, color: '#15803d' },
                { label: 'Trial Stage', count: 5, color: '#000000' },
                { label: 'Judgment Draft', count: 4, color: '#b45309' },
                { label: 'Disposed', count: 5, color: '#525252' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', padding: '10px 4px', background: '#f8fafc', borderRadius: 4, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 22, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: s.color }}>{s.count}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-charcoal)', marginTop: 2, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Pie Chart & Legend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '14px 12px', background: '#f8fafc', borderRadius: 6, border: '1px solid var(--border)' }}>
              <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
                <svg width="110" height="110" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#15803d" strokeWidth="18" strokeDasharray="134.3 104.5" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1A1A1A" strokeWidth="18" strokeDasharray="37.3 201.5" strokeDashoffset="-134.3" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#b45309" strokeWidth="18" strokeDasharray="29.8 209.0" strokeDashoffset="-171.6" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#525252" strokeWidth="18" strokeDasharray="37.3 201.5" strokeDashoffset="-201.4" />
                </svg>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontSize: 18, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1 }}>32</span>
                  <span style={{ fontSize: 8, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase' }}>CASES</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Active Hearing', count: '18 (56%)', color: '#15803d' },
                  { label: 'Trial Stage', count: '5 (16%)', color: '#1A1A1A' },
                  { label: 'Judgment Draft', count: '4 (12%)', color: '#b45309' },
                  { label: 'Disposed', count: '5 (16%)', color: '#525252' },
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

      </div>

      {/* Main Grid Row 2: Pending/Aging Cases + Bench Critical Alerts (Side-by-Side) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
        
        {/* SECTION 3: PENDING & AGING CASES */}
        <div className="section-card">
          <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>PENDING & AGING CASES ANALYSIS</span>
              <span className="badge badge-warning" style={{ fontSize: 10 }}>3 OVERDUE (&gt;90 DAYS)</span>
            </div>
            <button 
              onClick={() => onNav('aging')} 
              className="btn-secondary" 
              style={{ padding: '4px 12px', fontSize: 11, fontWeight: 700, borderColor: 'var(--primary)', color: 'var(--primary)', cursor: 'pointer', background: '#ffffff' }}
              title="Open full Pending & Aging Cases page"
            >
              VIEW ALL →
            </button>
          </div>
          <div className="section-card-body">
            {/* Aging Distribution Bars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
              {[
                { range: '30-60 Days', count: 10, status: 'Moderate', color: '#0284c7' },
                { range: '60-90 Days', count: 5, status: 'Attention', color: '#d97706' },
                { range: '> 90 Days', count: 3, status: 'Critical', color: '#dc2626' },
              ].map(ag => (
                <div 
                  key={ag.range} 
                  onClick={() => onNav('aging')}
                  style={{ padding: '8px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0', textAlign: 'center', cursor: 'pointer' }}
                  title="Click to open full analysis page"
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase' }}>{ag.range}</div>
                  <div style={{ fontSize: 18, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: ag.color, margin: '2px 0' }}>{ag.count}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: ag.color }}>{ag.status}</div>
                </div>
              ))}
            </div>

            {/* Overdue/Aging Case List */}
            <div style={{ background: '#fff', borderRadius: 6, border: '1px solid var(--border)' }}>
              {agingCases.map((ac, idx) => (
                <div key={ac.id} style={{ padding: '10px 14px', borderBottom: idx < agingCases.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{ac.id}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-ink)' }}>{ac.title}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-charcoal)', marginTop: 2 }}>{ac.stage} · {ac.reason}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="badge badge-error" style={{ fontSize: 10, fontWeight: 700 }}>{ac.pendingDays} DAYS AGING</span>
                    {ac.escalated ? (
                      <span className="badge badge-done" style={{ fontSize: 10 }}>Escalated ✓</span>
                    ) : (
                      <button onClick={() => setEscalationCase(ac)} className="btn-secondary" style={{ padding: '3px 8px', fontSize: 10, borderColor: '#dc2626', color: '#dc2626' }}>
                        Escalate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: 10, textAlign: 'center' }}>
              <button 
                onClick={() => onNav('aging')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
              >
                View Complete Pending & Aging Cases Backlog →
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: BENCH CRITICAL ALERTS & NOTICES */}
        <div className="section-card">
          <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>BENCH CRITICAL ALERTS & NOTICES</span>
              <span className="badge badge-error" style={{ fontSize: 10 }}>{alerts.length} ACTIVE ALERTS</span>
            </div>
            <button 
              onClick={() => onNav('alerts')} 
              className="btn-secondary" 
              style={{ padding: '4px 12px', fontSize: 11, fontWeight: 700, borderColor: 'var(--primary)', color: 'var(--primary)', cursor: 'pointer', background: '#ffffff' }}
              title="Open full Alerts & Notices page"
            >
              VIEW ALL →
            </button>
          </div>
          <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-charcoal)', fontSize: 13 }}>
                No active critical alerts for the Bench.
              </div>
            ) : (
              alerts.map(alt => (
                <div key={alt.id} style={{
                  padding: '12px 14px',
                  borderRadius: 6,
                  border: alt.type === 'critical' ? '1px solid #fca5a5' : alt.type === 'warning' ? '1px solid #fde68a' : '1px solid #cbd5e1',
                  background: alt.type === 'critical' ? '#fef2f2' : alt.type === 'warning' ? '#fffbeb' : '#f8fafc',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: alt.type === 'critical' ? '#991b1b' : alt.type === 'warning' ? '#92400e' : '#1e293b' }}>
                        {alt.title}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--color-charcoal)', fontFamily: 'JetBrains Mono, monospace' }}>{alt.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-ink)', lineHeight: 1.4 }}>
                      {alt.text}
                    </div>
                  </div>
                  <button onClick={() => dismissAlert(alt.id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14 }} title="Dismiss Alert">
                    ×
                  </button>
                </div>
              ))
            )}
            <div style={{ marginTop: 4, textAlign: 'center' }}>
              <button 
                onClick={() => onNav('alerts')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
              >
                View All Alerts & Judicial Directives →
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

{/* SPEC MODULE 1: Action Required Strip Component */}
function ActionRequiredStrip({ onSignClick, onCaseClick, onEscalateClick, agingCases }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
      border: '1px solid #c9a227',
      borderRadius: '8px',
      padding: '12px 18px',
      marginBottom: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ background: '#c9a227', color: '#000', fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 4, fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          ACTION REQUIRED
        </div>
        <div style={{ color: '#f3f4f6', fontSize: 13, fontWeight: 600 }}>
          3 Critical Tasks Require Presiding Bench Action & Authorization
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button 
          onClick={() => onSignClick({ caseId: 'C-104', title: 'State vs Singh', type: 'Verdict Draft' })}
          style={{ background: '#c9a227', color: '#000000', border: 'none', padding: '6px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
        >
          Sign Verdict (C-104)
        </button>
        <button 
          onClick={() => onCaseClick('C-102')}
          style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff', border: '1px solid #4b5563', padding: '6px 12px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
        >
          Quick Brief (C-102)
        </button>
        <button 
          onClick={() => onEscalateClick(agingCases[0])}
          style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
        >
          Escalate C-1009 (&gt;90d)
        </button>
      </div>
    </div>
  );
}

{/* SPEC MODULE 2: Conflict Badge Component */}
function ConflictBadge({ text }) {
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 700,
      color: '#991b1b',
      background: '#fee2e2',
      border: '1px solid #fca5a5',
      padding: '1px 6px',
      borderRadius: 4
    }}>
      {text}
    </span>
  );
}



{/* SPEC MODULE 4: Case Quick Access Drawer Component */}
function CaseQuickAccessDrawer({ caseId, onClose }) {
  const caseDetails = {
    'C-101': { id: 'C-101', title: 'State vs Patel', suspect: 'Ramesh Patel', victim: 'Commercial Bank of India', witness: 'Inspector Sharma, Sub-Inspector Priya', type: 'Bail Application', date: '10 Sep 2026', location: 'Connaught Place, New Delhi', summary: 'Bail petition filed in connection with financial misrepresentation under IPC Sec 420/468. Defense counsel submitted interim medical certificate.' },
    'C-102': { id: 'C-102', title: 'State vs Kumar', suspect: 'Raj Kumar', victim: 'State of NCT Delhi', witness: 'Dr. V. K. Malhotra (Forensic Lab)', type: 'Trial Hearing', date: '08 Aug 2026', location: 'Sector 4, Dwarka', summary: 'Trial proceeding regarding alleged unauthorized access and systemic fraud. Prosecution evidence phase ongoing with expert cross-examination.' },
    'C-104': { id: 'C-104', title: 'State vs Singh', suspect: 'Harpreet Singh', victim: 'Vanguard Cyber Tech', witness: 'Sub-Inspector Ramesh', type: 'Verdict Draft', date: '12 Jun 2026', location: 'Nehru Place Tech Hub', summary: 'Final trial completed. Rationale and judgment drafted for pronouncement today.' },
  }[caseId] || { id: caseId, title: 'State vs Defendant', suspect: 'Rajesh Kumar', victim: 'State Dept', witness: 'Investigating Officer', type: 'Judicial Hearing', date: '12 Sep 2026', location: 'New Delhi', summary: 'Case brief loaded into bench quick portal.' };

  const [benchNotes, setBenchNotes] = useState('Bench Observation: Counsel requested 2 days extension for additional documentary evidence.');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '480px',
      height: '100vh',
      background: '#ffffff',
      boxShadow: '-8px 0 25px rgba(0,0,0,0.25)',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '2px solid #1A1A1A',
      animation: 'slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Header */}
      <div style={{ background: '#1A1A1A', padding: '16px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: '#c9a227', fontFamily: 'Oswald, sans-serif', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>CASE QUICK ACCESS BRIEF</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '2px 0 0' }}>{caseDetails.id} · {caseDetails.title}</div>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer' }}>×</button>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
        <div style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase' }}>Case Type</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{caseDetails.type}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase' }}>Incident Date</div>
            <div style={{ fontSize: 13, fontWeight: 600 }} className="mono">{caseDetails.date}</div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 4 }}>Key Parties</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>Suspect: <span style={{ fontWeight: 500 }}>{caseDetails.suspect}</span></div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', marginTop: 2 }}>Complainant: <span style={{ fontWeight: 500 }}>{caseDetails.victim}</span></div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', marginTop: 2 }}>Witnesses: <span style={{ fontWeight: 500 }}>{caseDetails.witness}</span></div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 4 }}>Incident Summary</div>
          <div style={{ fontSize: 12, lineHeight: 1.5, color: '#334155', background: '#f1f5f9', padding: 10, borderRadius: 4 }}>
            {caseDetails.summary}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 4 }}>Bench Notes & Directives</div>
          <textarea
            className="field-input"
            rows={4}
            value={benchNotes}
            onChange={e => setBenchNotes(e.target.value)}
            style={{ width: '100%', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button onClick={onClose} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }}>Close Drawer</button>
        <button onClick={onClose} className="btn-primary" style={{ padding: '6px 16px', fontSize: 12 }}>Save Notes & Exit</button>
      </div>
    </div>
  );
}

{/* SPEC MODULE 5: E-Signature Multi-Step Modal Component */}
function ESignatureModal({ judgment, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [cryptoHash, setCryptoHash] = useState('');

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const generatedHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setCryptoHash(generatedHash);
      setStep(3);
    }, 1000);
  };

  const handleFinalConfirm = () => {
    onComplete(judgment.caseId, cryptoHash);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999
    }}>
      <div style={{
        width: '90%',
        maxWidth: '580px',
        background: '#ffffff',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
        border: '1px solid #1A1A1A'
      }}>
        {/* Header */}
        <div style={{ background: '#1A1A1A', padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', color: '#c9a227', textTransform: 'uppercase' }}>
              JUDICIAL E-SIGNATURE AUTHORIZATION PORTAL
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Case {judgment.caseId} · {judgment.title} ({judgment.type})
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer' }}>×</button>
        </div>

        {/* Step 1: Preview */}
        {step === 1 && (
          <div style={{ padding: '20px' }}>
            <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 6 }}>
              Step 1 of 3: Read-Only Judgement Text Preview
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '14px', borderRadius: 6, maxHeight: '200px', overflowY: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.6, color: '#1e293b', marginBottom: 20 }}>
              IN THE COURT OF THE ADDITIONAL SESSIONS JUDGE, NEW DELHI BENCH<br/>
              BEFORE HON. JUSTICE RAMESH<br/><br/>
              CASE REFERENCE: {judgment.caseId} ({judgment.title})<br/>
              RE: PROCEEDING VERDICT & JUDICIAL ORDERS.<br/><br/>
              UPON READING the chargesheet and hearing evidence submitted by learned prosecution and defense counsels, this Bench orders that the proceedings stand concluded with final digital signoff recorded under Section 65B Indian Evidence Act.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 18px', fontSize: 13 }}>Cancel</button>
              <button onClick={() => setStep(2)} className="btn-primary" style={{ padding: '8px 22px', fontSize: 13, background: '#c9a227', color: '#000', border: 'none' }}>
                Proceed to OTP Authorization →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: OTP Authorization */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ padding: '20px' }}>
            <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 6 }}>
              Step 2 of 3: 2FA Mobile OTP Verification
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-ink)', marginBottom: 14 }}>
              Enter the 6-digit Security OTP dispatched to Hon. Judge's registered mobile number <strong>+91 98******10</strong>:
            </div>

            <div style={{ marginBottom: 20 }}>
              <input
                className="field-input"
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP (e.g. 123456)"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                style={{ width: '100%', fontSize: 18, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.2em', textAlign: 'center', padding: '10px' }}
                autoFocus
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" onClick={() => setStep(1)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 12 }}>← Back</button>
              <button type="submit" className="btn-primary" style={{ padding: '8px 22px', fontSize: 13 }} disabled={isVerifying}>
                {isVerifying ? 'Verifying OTP...' : 'Verify & Generate Seal'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Cryptographic Confirmation */}
        {step === 3 && (
          <div style={{ padding: '20px' }}>
            <div style={{ fontSize: 11, color: '#15803d', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 6 }}>
              Step 3 of 3: Cryptographic Seal & Audit Verification
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '14px', borderRadius: 6, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 4 }}>OTP Verification Successful</div>
              <div style={{ fontSize: 11, color: '#15803d', fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' }}>
                SHA-256 Hash: {cryptoHash}
              </div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>
                Timestamp: {new Date().toLocaleString()} · Cert ID: GOI-BENCH-2026-991
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={handleFinalConfirm} className="btn-primary" style={{ padding: '8px 24px', fontSize: 13, background: '#15803d', borderColor: '#15803d' }}>
                Confirm & Record in Vault
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

{/* SPEC MODULE 6: Escalation Micro-Dialog Component */}
function EscalationDialog({ caseItem, onClose, onConfirm }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999
    }}>
      <div style={{
        width: '90%',
        maxWidth: '460px',
        background: '#ffffff',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
        border: '1px solid #dc2626'
      }}>
        <div style={{ background: '#dc2626', padding: '14px 20px', color: '#fff', fontFamily: 'Oswald, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          CONFIRM AGING CASE ESCALATION
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 8 }}>
            Escalate Case {caseItem.id} ({caseItem.title}) to High Court Registrar General?
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-charcoal)', lineHeight: 1.5, marginBottom: 16 }}>
            This case has exceeded the 90-day SLA statutory limit ({caseItem.pendingDays} days aging). Formally escalating will flag the docket for priority bench allocation and registry review.
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={onClose} className="btn-secondary" style={{ padding: '6px 16px', fontSize: 12 }}>Cancel</button>
            <button onClick={onConfirm} className="btn-primary" style={{ padding: '6px 18px', fontSize: 12, background: '#dc2626', border: 'none' }}>
              Confirm Escalation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyCasesView({ onNav }) {
  const [casesList, setCasesList] = useState([
    { id: 'C-101', title: 'State vs Patel', type: 'Criminal Trial', status: 'Active', stage: 'Bail Hearing', filingDate: '02 Jan 2026', nextHearing: '13 Sep 2026', prosecutor: 'Adv. A. Sharma', defense: 'Adv. K. Varma', summary: 'Bail application submitted under Section 439 CrPC regarding financial irregularity charges.' },
    { id: 'C-102', title: 'State vs Kumar', type: 'Cyber Financial Fraud', status: 'Pending', stage: 'Evidence Stage', filingDate: '15 Dec 2025', nextHearing: '18 Sep 2026', prosecutor: 'Adv. S. Nair', defense: 'Adv. R. Mehta', summary: 'Awaiting forensic report submission from Central Cyber Laboratory.' },
    { id: 'C-103', title: 'Sharma vs State', type: 'Judicial Appeal', status: 'Active', stage: 'Final Arguments', filingDate: '10 Feb 2026', nextHearing: '13 Sep 2026', prosecutor: 'Adv. P. Rao', defense: 'Adv. M. Gupta', summary: 'Appeal against Sessions Court conviction in property dispute matter.' },
    { id: 'C-104', title: 'State vs Singh', type: 'Criminal Trial', status: 'Completed', stage: 'Judgement Pronounced', verdict: 'Guilty / Convicted', judgementSummary: 'Accused convicted under IPC Section 420; 5 years rigorous imprisonment and ₹50,000 fine imposed.', verdictDate: '10 Sep 2026', prosecutor: 'Adv. A. Sharma', defense: 'Adv. D. Joshi', summary: 'Prosecution proved charges beyond reasonable doubt through bank ledger records.' },
    { id: 'C-105', title: 'State vs Gupta', type: 'Criminal Motion', status: 'Completed', stage: 'Bail Application', verdict: 'Bail Granted', judgementSummary: 'Interim bail granted subject to personal bond of ₹1,00,000 and two solvent sureties.', verdictDate: '08 Sep 2026', prosecutor: 'Adv. V. Pillai', defense: 'Adv. S. Khanna', summary: 'Bail allowed considering 6 months pre-trial detention and cooperation with investigation.' },
    { id: 'C-106', title: 'CBI vs Apex Infra', type: 'Corruption Trial', status: 'Pending', stage: 'Sanction Order Review', filingDate: '20 Nov 2025', nextHearing: '22 Sep 2026', prosecutor: 'Adv. R. Deshmukh', defense: 'Adv. T. Sen', summary: 'Pending formal statutory prosecution sanction from Competent Authority.' },
    { id: 'C-107', title: 'State vs Varma', type: 'NDPS Act Motion', status: 'Completed', stage: 'Judgement Pronounced', verdict: 'Acquitted', judgementSummary: 'Acquitted due to failure to prove verified chain of custody for seized narcotics sample.', verdictDate: '28 Aug 2026', prosecutor: 'Adv. A. Sharma', defense: 'Adv. N. Iyer', summary: 'Procedural violations under Section 50 NDPS Act observed during search.' },
    { id: 'C-108', title: 'Municipal Corp vs Resident Body', type: 'Writ Petition', status: 'Active', stage: 'Witness Cross-Exam', filingDate: '05 Mar 2026', nextHearing: '14 Sep 2026', prosecutor: 'Adv. G. Bhat', defense: 'Adv. C. Swamy', summary: 'Public interest litigation challenging commercial zoning conversion.' },
    { id: 'C-109', title: 'State vs Reddi', type: 'Arms Act Hearing', status: 'Completed', stage: 'Judgement Pronounced', verdict: 'Order Passed / Disposed', judgementSummary: 'Case disposed following plea bargain agreement and 100 hours mandatory community service.', verdictDate: '15 Aug 2026', prosecutor: 'Adv. S. Nair', defense: 'Adv. E. Kapoor', summary: 'Plea bargaining accepted by Bench upon consent of complaining officer.' },
    { id: 'C-110', title: 'State vs Mehra', type: 'Economic Offence', status: 'Active', stage: 'Framing Charges', filingDate: '18 Apr 2026', nextHearing: '16 Sep 2026', prosecutor: 'Adv. K. Singh', defense: 'Adv. P. Verma', summary: 'Framing of charges under PC Act and IPC Section 120B underway.' }
  ]);

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [selectedCaseForBrief, setSelectedCaseForBrief] = useState(null);
  const [selectedCaseForJudgement, setSelectedCaseForJudgement] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  // Counts
  const totalCount = casesList.length;
  const activeCount = casesList.filter(c => c.status === 'Active').length;
  const completedCount = casesList.filter(c => c.status === 'Completed').length;
  const pendingCount = casesList.filter(c => c.status === 'Pending').length;

  // Filter logic
  const filteredCases = casesList.filter(c => {
    // Tab filter
    if (activeTab === 'Active' && c.status !== 'Active') return false;
    if (activeTab === 'Completed' && c.status !== 'Completed') return false;
    if (activeTab === 'Pending' && c.status !== 'Pending') return false;

    // Category filter
    if (categoryFilter !== 'All' && c.type !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchType = c.type.toLowerCase().includes(q);
      const matchStage = c.stage.toLowerCase().includes(q);
      const matchVerdict = c.verdict ? c.verdict.toLowerCase().includes(q) : false;
      return matchId || matchTitle || matchType || matchStage || matchVerdict;
    }

    return true;
  });

  const handleSaveJudgement = (caseId, verdictType, judgementText) => {
    setCasesList(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'Completed',
          stage: 'Judgement Pronounced',
          verdict: verdictType,
          judgementSummary: judgementText,
          verdictDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return c;
    }));

    setSelectedCaseForJudgement(null);
    setNotification({
      isOpen: true,
      title: 'JUDGEMENT DELIVERED & RECORDED',
      message: `Judgement for Case ${caseId} (${verdictType}) has been officially pronounced, digitally signed, and logged into Hon. Justice Ramesh's docket.`,
      type: 'success'
    });
  };

  return (
    <div>
      <NotificationModal 
        isOpen={notification.isOpen} 
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      {/* Judgement Modal */}
      {selectedCaseForJudgement && (
        <JudgementModal
          caseItem={selectedCaseForJudgement}
          onClose={() => setSelectedCaseForJudgement(null)}
          onSave={handleSaveJudgement}
        />
      )}

      {/* Comprehensive Case Brief Modal matching user screenshot spec */}
      {selectedCaseForBrief && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setSelectedCaseForBrief(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '95%', maxWidth: '960px', maxHeight: '90vh', background: '#ffffff',
              borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
              border: '1px solid #1A1A1A', display: 'flex', flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div style={{ background: '#1A1A1A', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase' }}>
                  JUDICIAL CASE BRIEF & COMPLETE EVIDENCE DOCKET
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  CASE REFERENCE: {selectedCaseForBrief.id} · {selectedCaseForBrief.title}
                </div>
              </div>
              <button onClick={() => setSelectedCaseForBrief(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>

            {/* Scrollable Content Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* SECTION 1: COURT HEARINGS & TRIAL SCHEDULE STATUS */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 4, height: 16, background: '#c9a227', borderRadius: 2 }} />
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
                    COURT HEARINGS & TRIAL SCHEDULE STATUS ({selectedCaseForBrief.id})
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Completed Hearings</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#059669', marginTop: 4 }}>
                      <span style={{ fontSize: 20 }}>2</span> Hearings Done
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Upcoming Hearing Number</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', marginTop: 4 }}>3rd Hearing (Trial Hearing)</div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Next Hearing Date & Time</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>
                      {selectedCaseForBrief.nextHearing || '18 Sep 2026'} · 10:30 AM
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Assigned Court Room / Venue</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', marginTop: 4 }}>Court Room 2 - Special Criminal Bench</div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: CASE DATA & PARTICULARS */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 4, height: 16, background: '#c9a227', borderRadius: 2 }} />
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
                    CASE DATA & PARTICULARS
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 20px', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Case Reference ID</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)', fontFamily: 'JetBrains Mono, monospace' }}>{selectedCaseForBrief.id}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Crime Category</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{selectedCaseForBrief.type}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Investigation Officer</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{selectedCaseForBrief.officer || 'Inspector Sharma (Cyber Crime)'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Case Title / Investigation Title</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{selectedCaseForBrief.title}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Suspect Name</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{selectedCaseForBrief.suspect || 'Raj Kumar (ID: ACC-2024-0047)'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Victim Name</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{selectedCaseForBrief.victim || 'Suresh Sundaram'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Witness Details</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-ink)' }}>{selectedCaseForBrief.witness || 'Ramesh (Shopkeeper) & Security Guard Statement'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Incident Date</div>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{selectedCaseForBrief.incidentDate || '2026-09-12'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Incident Time</div>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{selectedCaseForBrief.incidentTime || '18:30'}</div>
                  </div>

                  <div style={{ gridColumn: 'span 3' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Incident Location</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{selectedCaseForBrief.location || 'Sector 4 Commercial Market, Main Road'}</div>
                  </div>
                </div>

                {/* Brief Incident Summary */}
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '12px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 4 }}>
                    Brief Incident Summary & Initial FIR Statement
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-ink)', lineHeight: 1.5 }}>
                    {selectedCaseForBrief.summary || 'The accused was found in possession of stolen property valued at ₹4,50,000. CCTV footage and witness statements corroborate the evidence collected at the scene. Initial FIR registered under theft sections.'}
                  </div>
                </div>
              </div>

              {/* SECTION 3: ASSOCIATED CASE DOCUMENTS & EVIDENCE CATEGORIES */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 4, height: 16, background: '#c9a227', borderRadius: 2 }} />
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
                    ASSOCIATED CASE DOCUMENTS & EVIDENCE CATEGORIES ({selectedCaseForBrief.id})
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    { title: 'FIRS', sub: 'First Information Reports & FIR copies', file: `FIR_${selectedCaseForBrief.id}_Certified_Copy.pdf`, size: '2.4 MB' },
                    { title: 'INVESTIGATION RECORDS', sub: 'Case dockets, logs & officer notes', file: `Investigation_Docket_${selectedCaseForBrief.id}.pdf`, size: '1.8 MB' },
                    { title: 'WITNESS STATEMENTS', sub: 'Depositions, audio transcripts & statements', file: `Witness_Deposition_${selectedCaseForBrief.id}.pdf`, size: '3.1 MB' },
                    { title: 'CHARGE SHEETS', sub: 'Draft & submitted final charge sheets', file: `Charge_Sheet_${selectedCaseForBrief.id}.pdf`, size: '4.2 MB' },
                    { title: 'EVIDENCE RECORDS', sub: 'Physical evidence photos, hashes & custody logs', file: `Evidence_Log_${selectedCaseForBrief.id}.pdf`, size: '1.5 MB' },
                    { title: 'FORENSIC REPORTS', sub: 'Lab analysis, cyber forensics & DNA reports', file: `Forensic_Lab_Report_${selectedCaseForBrief.id}.pdf`, size: '2.9 MB' }
                  ].map((doc, idx) => (
                    <div key={idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                          <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', textTransform: 'uppercase' }}>{doc.title}</div>
                          <span style={{ fontSize: 9, background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>ACTIVE</span>
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b', marginBottom: 10 }}>{doc.sub}</div>
                        <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#059669', fontWeight: 600, wordBreak: 'break-all', marginBottom: 12 }}>
                          ✓ {doc.file} <span style={{ color: '#64748b', fontWeight: 400 }}>({doc.size})</span>
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Opening ${doc.file} in Secure Document Reader...`)}
                        style={{ width: '100%', padding: '6px', background: '#1A1A1A', color: '#ffffff', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}
                      >
                        VIEW
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: PROSECUTION BRIEF LEGAL SUMMARY & ASSESSMENT */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 4, height: 16, background: '#c9a227', borderRadius: 2 }} />
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
                    PROSECUTION BRIEF LEGAL SUMMARY & ASSESSMENT
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '14px', fontSize: 12, color: 'var(--color-ink)', lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--primary)' }}>PRELIMINARY LEGAL ASSESSMENT BY STATE PROSECUTION:</div>
                  The prosecution has established a strong prima facie case supported by documentary evidence, cyber forensic log verification, and independent witness depositions. Chain of custody for physical exhibits has been verified under Section 65B Indian Evidence Act. Recommended proceed to trial hearing / verdict pronouncement.
                </div>
              </div>

              {/* SECTION 5: LAST HEARING JUDGEMENT & BENCH ORDERS */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 4, height: 16, background: '#c9a227', borderRadius: 2 }} />
                    <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
                      LAST HEARING JUDGEMENT & BENCH ORDERS ({selectedCaseForBrief.id})
                    </div>
                  </div>
                  {selectedCaseForBrief.verdict ? (
                    <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '3px 10px', borderRadius: 12, fontWeight: 700 }}>
                      ✓ JUDGEMENT DELIVERED ({selectedCaseForBrief.verdictDate || '10 Sep 2026'})
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '3px 10px', borderRadius: 12, fontWeight: 700 }}>
                      INTERIM PROCEEDINGS RECORDED
                    </span>
                  )}
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 16, marginBottom: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #cbd5e1' }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Last Hearing Date</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                        {selectedCaseForBrief.verdictDate || selectedCaseForBrief.lastHearingDate || '08 Sep 2026'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Last Hearing Stage</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', marginTop: 2 }}>
                        {selectedCaseForBrief.stage || selectedCaseForBrief.type}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Bench Verdict / Outcome</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: selectedCaseForBrief.verdict ? '#059669' : '#1e40af', marginTop: 2 }}>
                        {selectedCaseForBrief.verdict || 'Interim Order / Charges Framed'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 4 }}>
                      Judgement Text / Official Recorded Bench Summary
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-ink)', lineHeight: 1.6, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '12px 14px' }}>
                      {selectedCaseForBrief.judgementSummary || 
                        `UPON HEARING learned counsel in ${selectedCaseForBrief.title} (${selectedCaseForBrief.id}), this Bench recorded interim proceedings. Arguments heard in full and matter listed for further trial evidence.`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#059669', fontWeight: 700 }}>✓ Digital Judicial Bench Seal Verified</span> · Ref No: ORD-2026-{(selectedCaseForBrief.id || '').replace('-', '')}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => alert(`Opening Official Sealed Judgement Order Copy for ${selectedCaseForBrief.id}...`)}
                      style={{ padding: '6px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#1E293B', fontFamily: 'Oswald, sans-serif' }}
                    >
                      📄 VIEW OFFICIAL ORDER COPY
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 12, flexShrink: 0 }}>
              <button onClick={() => setSelectedCaseForBrief(null)} className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>
                Close Brief
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Metrics */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            Hon. Justice Ramesh — Assigned Docket & Judgements
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Comprehensive list of active proceedings, judgements delivered, and pending cases handled by your bench.
          </p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      {/* Docket Metrics Cards Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { id: 'ALL', title: 'Total Handled Cases', count: totalCount, color: '#1A1A1A', textCol: 'var(--color-ink)', subCol: 'var(--color-charcoal)' },
          { id: 'Active', title: 'Active Proceedings', count: activeCount, color: '#16a34a', textCol: '#15803d', subCol: '#166534' },
          { id: 'Completed', title: 'Judgements Delivered', count: completedCount, color: '#2563eb', textCol: '#1d4ed8', subCol: '#1e40af' },
          { id: 'Pending', title: 'Pending Action / Review', count: pendingCount, color: '#d97706', textCol: '#b45309', subCol: '#92400e' }
        ].map(card => {
          const isSelected = activeTab === card.id;
          const isHovered = hoveredCardId === card.id;
          return (
            <div
              key={card.id}
              onClick={() => setActiveTab(card.id)}
              onMouseEnter={() => setHoveredCardId(card.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              style={{
                background: '#ffffff',
                border: isSelected ? `2px solid ${card.color}` : '1px solid #cbd5e1',
                borderRadius: 8,
                padding: '14px 18px',
                borderLeft: `5px solid ${card.color}`,
                cursor: 'pointer',
                boxShadow: isHovered || isSelected ? '0 8px 20px -4px rgba(0, 0, 0, 0.12)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: card.subCol, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>{card.title}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: card.textCol, fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>{card.count}</div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="section-card" style={{ marginBottom: 16, padding: '16px 20px' }}>
        {/* Header with Gold Accent Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 4, height: 16, background: '#c9a227', borderRadius: 2 }} />
          <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
            SEARCH & FILTER MY CASES
          </div>
        </div>

        {/* 3-Column Inputs Grid: Search, All Statuses Dropdown, All Categories Dropdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'center' }}>
          {/* Search by Case ID, Title, or Category */}
          <div style={{ position: 'relative', width: '100%' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="field-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Case ID, Title, or Category..."
              style={{
                width: '100%',
                paddingLeft: 34,
                paddingRight: searchQuery ? 60 : 12,
                fontSize: 13,
                height: 38,
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#1e293b'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 4,
                  padding: '2px 6px',
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* All Statuses Dropdown */}
          <select
            className="field-input"
            value={activeTab}
            onChange={e => setActiveTab(e.target.value)}
            style={{ width: '100%', fontSize: 13, height: 38, border: '1px solid #cbd5e1', borderRadius: 6, color: '#1e293b' }}
          >
            <option value="ALL">All Statuses ({totalCount})</option>
            <option value="Active">Active ({activeCount})</option>
            <option value="Completed">Completed / Judgement Delivered ({completedCount})</option>
            <option value="Pending">Pending ({pendingCount})</option>
          </select>

          {/* All Categories Dropdown */}
          <select
            className="field-input"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{ width: '100%', fontSize: 13, height: 38, border: '1px solid #cbd5e1', borderRadius: 6, color: '#1e293b' }}
          >
            <option value="All">All Categories</option>
            <option value="Criminal Trial">Criminal Trial</option>
            <option value="Judicial Appeal">Judicial Appeal</option>
            <option value="Cyber Financial Fraud">Cyber Fraud</option>
            <option value="Criminal Motion">Criminal Motion</option>
            <option value="Corruption Trial">Corruption Trial</option>
            <option value="NDPS Act Motion">NDPS Motion</option>
            <option value="Writ Petition">Writ Petition</option>
            <option value="Arms Act Hearing">Arms Act Hearing</option>
            <option value="Economic Offence">Economic Offence</option>
          </select>
        </div>
      </div>

      {/* Main Cases Table */}
      <div className="section-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Case Ref</th>
              <th>Case Title & Parties</th>
              <th>Category</th>
              <th>Proceeding Stage</th>
              <th>Bench Status</th>
              <th>Verdict / Outcome</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-charcoal)', fontWeight: 500 }}>
                  No cases found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredCases.map(c => (
                <tr key={c.id}>
                  <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{c.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>
                    <div>{c.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 400, marginTop: 2 }}>
                      Prosecutor: {c.prosecutor || 'State Counsel'}
                    </div>
                  </td>
                  <td><span className="badge badge-done">{c.type}</span></td>
                  <td style={{ fontWeight: 500, color: 'var(--color-charcoal)', fontSize: 13 }}>{c.stage}</td>
                  <td>
                    <span className={`badge ${c.status === 'Active' ? 'badge-active' : c.status === 'Completed' ? 'badge-done' : 'badge-warning'}`}>
                      {c.status === 'Completed' ? 'Judgement Delivered' : c.status}
                    </span>
                  </td>
                  <td>
                    {c.verdict ? (
                      <div>
                        <span style={{ fontWeight: 700, color: c.verdict.includes('Acquitted') || c.verdict.includes('Granted') ? '#059669' : '#dc2626', fontSize: 12 }}>
                          {c.verdict}
                        </span>
                        <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'JetBrains Mono, monospace' }}>
                          Delivered: {c.verdictDate}
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--color-charcoal)', fontStyle: 'italic' }}>
                        Next Hearing: {c.nextHearing || 'Scheduled'}
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button 
                        onClick={() => setSelectedCaseForBrief(c)}
                        className="btn-secondary" 
                        style={{ padding: '5px 14px', fontSize: 12, fontWeight: 700 }}
                      >
                        View Brief
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HearingsDetailView({ onNav, hearingsList: propHearingsList, setHearingsList: propSetHearingsList }) {
  const [localHearingsList, setLocalHearingsList] = useState(todayHearings);
  const hearingsList = propHearingsList || localHearingsList;
  const setHearingsList = propSetHearingsList || setLocalHearingsList;

  const [filter, setFilter] = useState('ALL');
  const [selectedCaseForBrief, setSelectedCaseForBrief] = useState(null);
  const [selectedCaseForJudgement, setSelectedCaseForJudgement] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const filtered = hearingsList.filter(h => {
    if (filter === 'Hearing') return h.category === 'Hearing';
    if (filter === 'New Case') return h.category === 'New Case';
    return true;
  });

  const hearingCount = hearingsList.filter(h => h.category === 'Hearing').length;
  const newCount = hearingsList.filter(h => h.category === 'New Case').length;

  const handleSaveJudgement = (caseId, verdictType, judgementText) => {
    setHearingsList(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: verdictType.toLowerCase().includes('hearing') ? 'Scheduled' : 'Judgement Delivered',
          verdict: verdictType,
          judgementSummary: judgementText,
          verdictDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return c;
    }));

    setSelectedCaseForJudgement(null);
    setNotification({
      isOpen: true,
      title: 'JUDGEMENT DELIVERED & RECORDED',
      message: `Judgement for Case ${caseId} (${verdictType}) has been officially pronounced, digitally signed, and logged into Hon. Justice Ramesh's docket.`,
      type: 'success'
    });
  };

  return (
    <div>
      <NotificationModal 
        isOpen={notification.isOpen} 
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      {/* Judgement Modal */}
      {selectedCaseForJudgement && (
        <JudgementModal
          caseItem={selectedCaseForJudgement}
          onClose={() => setSelectedCaseForJudgement(null)}
          onSave={handleSaveJudgement}
        />
      )}

      {/* Case Brief Modal matching My Cases format */}
      {selectedCaseForBrief && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setSelectedCaseForBrief(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '95%', maxWidth: '960px', maxHeight: '90vh', background: '#ffffff',
              borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
              border: '1px solid #1A1A1A', display: 'flex', flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div style={{ background: '#1A1A1A', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase' }}>
                  JUDICIAL CASE BRIEF & COMPLETE EVIDENCE DOCKET
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  CASE REFERENCE: {selectedCaseForBrief.id} · {selectedCaseForBrief.title}
                </div>
              </div>
              <button onClick={() => setSelectedCaseForBrief(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>

            {/* Scrollable Content Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* SECTION 1: COURT HEARINGS & TRIAL SCHEDULE STATUS */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 4, height: 16, background: '#c9a227', borderRadius: 2 }} />
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
                    COURT HEARINGS & TRIAL SCHEDULE STATUS ({selectedCaseForBrief.id})
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Completed Hearings</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#059669', marginTop: 4 }}>
                      <span style={{ fontSize: 20 }}>2</span> Hearings Done
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Upcoming Hearing Number</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', marginTop: 4 }}>3rd Hearing (Trial Hearing)</div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Next Hearing Date & Time</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>
                      {selectedCaseForBrief.time || '10:30 AM'}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Assigned Court Room / Venue</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', marginTop: 4 }}>Court Room 2 - Special Criminal Bench</div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: CASE DATA & PARTICULARS */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 4, height: 16, background: '#c9a227', borderRadius: 2 }} />
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
                    CASE DATA & PARTICULARS
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 20px', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Case Reference ID</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)', fontFamily: 'JetBrains Mono, monospace' }}>{selectedCaseForBrief.id}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Crime Category</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{selectedCaseForBrief.type}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Investigation Officer</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{selectedCaseForBrief.officer || 'Inspector Sharma (Cyber Crime)'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Case Title / Investigation Title</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{selectedCaseForBrief.title}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Suspect Name</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{selectedCaseForBrief.suspect || 'Raj Kumar (ID: ACC-2024-0047)'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Victim Name</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{selectedCaseForBrief.victim || 'Suresh Sundaram'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Witness Details</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-ink)' }}>{selectedCaseForBrief.witness || 'Ramesh (Shopkeeper) & Security Guard Statement'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Incident Date</div>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{selectedCaseForBrief.incidentDate || '2026-09-12'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Incident Time</div>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{selectedCaseForBrief.incidentTime || '18:30'}</div>
                  </div>

                  <div style={{ gridColumn: 'span 3' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Incident Location</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{selectedCaseForBrief.location || 'Sector 4 Commercial Market, Main Road'}</div>
                  </div>
                </div>

                {/* Brief Incident Summary */}
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '12px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 4 }}>
                    Brief Incident Summary & Initial FIR Statement
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-ink)', lineHeight: 1.5 }}>
                    {selectedCaseForBrief.summary || 'The accused was found in possession of stolen property valued at ₹4,50,000. CCTV footage and witness statements corroborate the evidence collected at the scene. Initial FIR registered under theft sections.'}
                  </div>
                </div>
              </div>

              {/* SECTION 3: ASSOCIATED CASE DOCUMENTS & EVIDENCE CATEGORIES */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 4, height: 16, background: '#c9a227', borderRadius: 2 }} />
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
                    ASSOCIATED CASE DOCUMENTS & EVIDENCE CATEGORIES ({selectedCaseForBrief.id})
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    { title: 'FIRS', sub: 'First Information Reports & FIR copies', file: `FIR_${selectedCaseForBrief.id}_Certified_Copy.pdf`, size: '2.4 MB' },
                    { title: 'INVESTIGATION RECORDS', sub: 'Case dockets, logs & officer notes', file: `Investigation_Docket_${selectedCaseForBrief.id}.pdf`, size: '1.8 MB' },
                    { title: 'WITNESS STATEMENTS', sub: 'Depositions, audio transcripts & statements', file: `Witness_Deposition_${selectedCaseForBrief.id}.pdf`, size: '3.1 MB' },
                    { title: 'CHARGE SHEETS', sub: 'Draft & submitted final charge sheets', file: `Charge_Sheet_${selectedCaseForBrief.id}.pdf`, size: '4.2 MB' },
                    { title: 'EVIDENCE RECORDS', sub: 'Physical evidence photos, hashes & custody logs', file: `Evidence_Log_${selectedCaseForBrief.id}.pdf`, size: '1.5 MB' },
                    { title: 'FORENSIC REPORTS', sub: 'Lab analysis, cyber forensics & DNA reports', file: `Forensic_Lab_Report_${selectedCaseForBrief.id}.pdf`, size: '2.9 MB' }
                  ].map((doc, idx) => (
                    <div key={idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                          <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', textTransform: 'uppercase' }}>{doc.title}</div>
                          <span style={{ fontSize: 9, background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>ACTIVE</span>
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b', marginBottom: 10 }}>{doc.sub}</div>
                        <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#059669', fontWeight: 600, wordBreak: 'break-all', marginBottom: 12 }}>
                          ✓ {doc.file} <span style={{ color: '#64748b', fontWeight: 400 }}>({doc.size})</span>
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Opening ${doc.file} in Secure Document Reader...`)}
                        style={{ width: '100%', padding: '6px', background: '#1A1A1A', color: '#ffffff', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}
                      >
                        VIEW
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: PROSECUTION BRIEF LEGAL SUMMARY & ASSESSMENT */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 4, height: 16, background: '#c9a227', borderRadius: 2 }} />
                  <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
                    PROSECUTION BRIEF LEGAL SUMMARY & ASSESSMENT
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '14px', fontSize: 12, color: 'var(--color-ink)', lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--primary)' }}>PRELIMINARY LEGAL ASSESSMENT BY STATE PROSECUTION:</div>
                  The prosecution has established a strong prima facie case supported by documentary evidence, cyber forensic log verification, and independent witness depositions. Chain of custody for physical exhibits has been verified under Section 65B Indian Evidence Act. Recommended proceed to trial hearing / verdict pronouncement.
                </div>
              </div>

              {/* SECTION 5: LAST HEARING JUDGEMENT & BENCH ORDERS */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 4, height: 16, background: '#c9a227', borderRadius: 2 }} />
                    <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
                      LAST HEARING JUDGEMENT & BENCH ORDERS ({selectedCaseForBrief.id})
                    </div>
                  </div>
                  {selectedCaseForBrief.verdict ? (
                    <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '3px 10px', borderRadius: 12, fontWeight: 700 }}>
                      ✓ JUDGEMENT DELIVERED ({selectedCaseForBrief.verdictDate || '10 Sep 2026'})
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '3px 10px', borderRadius: 12, fontWeight: 700 }}>
                      INTERIM PROCEEDINGS RECORDED
                    </span>
                  )}
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 16, marginBottom: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #cbd5e1' }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Last Hearing Date</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                        {selectedCaseForBrief.verdictDate || selectedCaseForBrief.lastHearingDate || '08 Sep 2026'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Last Hearing Stage</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', marginTop: 2 }}>
                        {selectedCaseForBrief.stage || selectedCaseForBrief.type}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Bench Verdict / Outcome</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: selectedCaseForBrief.verdict ? '#059669' : '#1e40af', marginTop: 2 }}>
                        {selectedCaseForBrief.verdict || 'Interim Order / Charges Framed'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 4 }}>
                      Judgement Text / Official Recorded Bench Summary
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-ink)', lineHeight: 1.6, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '12px 14px' }}>
                      {selectedCaseForBrief.judgementSummary || 
                        `UPON HEARING learned counsel in ${selectedCaseForBrief.title} (${selectedCaseForBrief.id}), this Bench recorded interim proceedings. Arguments heard in full and matter listed for further trial evidence.`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#059669', fontWeight: 700 }}>✓ Digital Judicial Bench Seal Verified</span> · Ref No: ORD-2026-{(selectedCaseForBrief.id || '').replace('-', '')}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => alert(`Opening Official Sealed Judgement Order Copy for ${selectedCaseForBrief.id}...`)}
                      style={{ padding: '6px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#1E293B', fontFamily: 'Oswald, sans-serif' }}
                    >
                      📄 VIEW OFFICIAL ORDER COPY
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 12, flexShrink: 0 }}>
              <button onClick={() => setSelectedCaseForBrief(null)} className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>
                Close Brief
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            Daily Hearing Schedule & Today's Listed Cases
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Complete list of scheduled hearings ({hearingCount}) and newly listed cases ({newCount}) for today ({new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })})
          </p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="section-card" style={{ marginBottom: 16, padding: '12px 18px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { id: 'ALL', label: `ALL LISTED CASES (${hearingsList.length})` },
            { id: 'Hearing', label: `SCHEDULED HEARINGS (${hearingCount})` },
            { id: 'New Case', label: `TODAY'S NEW CASES (${newCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'Oswald, sans-serif',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                border: filter === tab.id ? '1px solid #1A1A1A' : '1px solid #e2e8f0',
                background: filter === tab.id ? '#1A1A1A' : '#ffffff',
                color: filter === tab.id ? '#ffffff' : 'var(--color-charcoal)',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Complete Table */}
      <div className="section-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Time</th>
              <th>Proceeding / Filing Type</th>
              <th>Parties Involved</th>
              <th>Category</th>
              <th>Status</th>
              <th>Judgement Verdict</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((h, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{h.id}</td>
                <td className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{h.time}</td>
                <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{h.type}</td>
                <td style={{ color: 'var(--color-charcoal)', fontWeight: 500 }}>{h.parties}</td>
                <td>
                  <span className={`badge ${h.category === 'New Case' ? 'badge-done' : 'badge-active'}`}>
                    {h.category}
                  </span>
                </td>
                <td>
                  <span className={`badge ${h.verdict ? 'badge-done' : h.status === 'In Progress' ? 'badge-active' : h.status === 'Newly Listed' ? 'badge-done' : 'badge-pending'}`}>
                    {h.verdict ? 'Judgement Delivered' : h.status}
                  </span>
                </td>
                <td>
                  {h.verdict ? (
                    <span style={{ fontWeight: 700, color: '#059669', fontSize: 12 }}>
                      {h.verdict}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--color-charcoal)', fontStyle: 'italic' }}>
                      Pending Order
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 6 }}>
                    <button
                      onClick={() => setSelectedCaseForBrief(h)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: 11 }}
                    >
                      View Brief
                    </button>
                    <button
                      onClick={() => setSelectedCaseForJudgement(h)}
                      className="btn-primary"
                      style={{
                        padding: '4px 12px',
                        fontSize: 11,
                        background: h.verdict ? '#059669' : '#1A1A1A',
                        borderColor: h.verdict ? '#059669' : '#1A1A1A'
                      }}
                    >
                      <span style={{ color: '#ffffff', fontWeight: 700 }}>
                        {h.verdict ? 'View Judgement' : 'Judgement'}
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersView({ hearingsList = [], onNav }) {
  const [selectedCaseForJudgement, setSelectedCaseForJudgement] = useState(null);
  const [uploadModalCase, setUploadModalCase] = useState(null);
  const [uploadedCopies, setUploadedCopies] = useState({});
  const [selectedFileName, setSelectedFileName] = useState('');
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  // Filter only cases where judgement was pronounced
  const pronouncedOrders = hearingsList.filter(c => Boolean(c.verdict || c.status === 'Judgement Delivered' || c.status === 'Completed'));

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadModalCase) return;
    const fileName = selectedFileName || `Signed_Judgement_Copy_${uploadModalCase.id}.pdf`;
    setUploadedCopies(prev => ({
      ...prev,
      [uploadModalCase.id]: {
        fileName,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }));
    setNotification({
      isOpen: true,
      title: 'JUDGEMENT COPY UPLOADED & ATTACHED',
      message: `Signed judgement copy (${fileName}) for Case ${uploadModalCase.id} has been cryptographically uploaded and permanently attached to the official judicial docket.`,
      type: 'success'
    });
    setUploadModalCase(null);
    setSelectedFileName('');
  };

  return (
    <div>
      <NotificationModal 
        isOpen={notification.isOpen} 
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      {selectedCaseForJudgement && (
        <JudgementModal
          caseItem={selectedCaseForJudgement}
          onClose={() => setSelectedCaseForJudgement(null)}
          onSave={() => {}}
        />
      )}

      {/* Upload Judgement Copy Modal */}
      {uploadModalCase && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setUploadModalCase(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '90%', maxWidth: '540px', background: '#ffffff',
              borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
              border: '1px solid #1A1A1A'
            }}
          >
            <div style={{ background: '#1A1A1A', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase' }}>
                  UPLOAD OFFICIAL SIGNED JUDGEMENT COPY
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  CASE {uploadModalCase.id} · {uploadModalCase.title || uploadModalCase.parties}
                </div>
              </div>
              <button onClick={() => setUploadModalCase(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ padding: '24px' }}>
              <div style={{ marginBottom: 16, background: '#f8fafc', padding: '12px 16px', borderRadius: 6, border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Pronounced Verdict</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#059669', marginTop: 2 }}>{uploadModalCase.verdict || 'Judgement Delivered'}</div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, color: 'var(--color-ink)', fontFamily: 'Oswald, sans-serif' }}>
                  Select Signed Judgement PDF Document *
                </label>
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: 8, padding: '20px', textAlign: 'center', background: '#fafafa' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    id="judgement-file-input"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label htmlFor="judgement-file-input" style={{ display: 'inline-block', padding: '8px 18px', background: '#1A1A1A', color: '#ffffff', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Oswald, sans-serif' }}>
                    CHOOSE PDF FILE
                  </label>
                  <div style={{ fontSize: 12, color: 'var(--color-ink)', fontWeight: 700, marginTop: 10 }}>
                    {selectedFileName || `Judgement_Order_${uploadModalCase.id}_Signed.pdf`}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>
                    Supported format: PDF, DOCX (Max 25MB)
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="seal-check" defaultChecked required style={{ width: 16, height: 16, cursor: 'pointer' }} />
                <label htmlFor="seal-check" style={{ fontSize: 12, color: 'var(--color-charcoal)', fontWeight: 600, cursor: 'pointer' }}>
                  I certify this document contains the official digital bench seal and signature of Hon. Justice Ramesh.
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setUploadModalCase(null)} className="btn-secondary" style={{ padding: '8px 18px', fontSize: 12 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 22px', fontSize: 12, background: '#059669', borderColor: '#059669', color: '#ffffff' }}>
                  Upload & Attach Copy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            Judgement Orders & Pronounced Bench Verdicts
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Official recorded judgement orders pronounced during today's courtroom hearings ({new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })})
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="badge badge-done" style={{ fontSize: 12, padding: '6px 14px', background: pronouncedOrders.length > 0 ? '#059669' : '#64748b', color: '#ffffff' }}>
            PRONOUNCED ORDERS: {pronouncedOrders.length} DELIVERED
          </div>
          {onNav && (
            <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
              ← BACK TO DASHBOARD
            </button>
          )}
        </div>
      </div>

      {pronouncedOrders.length === 0 ? (
        <div className="section-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>⚖️</div>
          <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '0.05em', marginBottom: 8, textTransform: 'uppercase' }}>
            NO PRONOUNCED JUDGEMENT ORDERS YET TODAY
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-charcoal)', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6, fontWeight: 500 }}>
            Judgement orders will appear here automatically once a verdict is pronounced on any case from the Daily Hearing Schedule.
          </div>
          {onNav && (
            <button 
              onClick={() => onNav('hearings')} 
              className="btn-primary" 
              style={{ padding: '10px 24px', fontSize: 13, background: '#1A1A1A', color: '#ffffff', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}
            >
              GO TO DAILY HEARINGS PAGE →
            </button>
          )}
        </div>
      ) : (
        <div className="section-card">
          <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>PRONOUNCED BENCH ORDERS ({pronouncedOrders.length})</span>
            <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 600 }}>Digitally Signed & Sealed Orders</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Case Ref</th>
                <th>Case Title & Parties</th>
                <th>Hearing Type</th>
                <th>Bench Status</th>
                <th>Judgement Verdict</th>
                <th>Pronounced Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pronouncedOrders.map(c => (
                <tr key={c.id}>
                  <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{c.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{c.title || c.parties}</td>
                  <td><span className="badge badge-done">{c.type}</span></td>
                  <td>
                    <span className="badge badge-done" style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}>
                      Judgement Delivered
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>
                      {c.verdict}
                    </span>
                  </td>
                  <td className="mono" style={{ fontSize: 12, fontWeight: 600 }}>
                    {c.verdictDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <button 
                        onClick={() => setSelectedCaseForJudgement(c)}
                        className="btn-secondary" 
                        style={{ padding: '5px 12px', fontSize: 11, fontWeight: 700 }}
                      >
                        View Judgement Order
                      </button>
                      <button 
                        onClick={() => {
                          setUploadModalCase(c);
                          setSelectedFileName(`Judgement_Order_${c.id}_Signed.pdf`);
                        }}
                        className="btn-primary" 
                        style={{ 
                          padding: '5px 14px', 
                          fontSize: 11, 
                          fontWeight: 700, 
                          background: uploadedCopies[c.id] ? '#059669' : '#1A1A1A',
                          borderColor: uploadedCopies[c.id] ? '#059669' : '#1A1A1A',
                          color: '#ffffff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <span style={{ color: '#ffffff', fontWeight: 700 }}>{uploadedCopies[c.id] ? '✓ Uploaded Copy' : 'Upload Judgement Copy'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function JudgementModal({ caseItem, onClose, onSave }) {
  const isAlreadyGiven = Boolean(caseItem.verdict || caseItem.status === 'Completed' || caseItem.status === 'Judgement Delivered');

  const [verdict, setVerdict] = useState(caseItem.verdict || 'Bail Granted');
  const [hearingDate, setHearingDate] = useState(
    caseItem.nextHearingDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  );
  const [summary, setSummary] = useState(
    caseItem.judgementSummary || 
    `UPON HEARING the learned council for the prosecution and defence in ${caseItem.title} (${caseItem.id}), this Bench finds sufficient legal grounds to order as follows:\n\n1. The applicant is granted relief subject to standard judicial conditions.\n2. Digital verification seal attached by Hon. Justice Ramesh.`
  );
  const [isDigitalSigned, setIsDigitalSigned] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAlreadyGiven) return;
    if (!verdict) return;
    const formattedDate = hearingDate ? new Date(hearingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
    const finalVerdict = verdict.toLowerCase().includes('hearing') && formattedDate
      ? `Next Hearing Scheduled (${formattedDate})`
      : verdict;
    onSave(caseItem.id, finalVerdict, summary, formattedDate);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '620px',
          background: '#ffffff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #1A1A1A'
        }}
      >
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2d2d30 100%)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#ffffff' }}>{isAlreadyGiven ? 'OFFICIAL RECORDED JUDGEMENT ORDER' : 'PRONOUNCE JUDGEMENT / BENCH ORDER'}</span>
              {isAlreadyGiven && (
                <span style={{ fontSize: 10, background: '#059669', color: '#ffffff', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                  VERDICT PRONOUNCED
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>
              CASE {caseItem.id} · {caseItem.title}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#ffffff', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ marginBottom: 18, background: '#f8fafc', padding: '12px 16px', borderRadius: 6, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Proceeding Type</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{caseItem.type}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Presiding Bench</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Hon. Justice Ramesh</div>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, color: 'var(--color-ink)', fontFamily: 'Oswald, sans-serif' }}>
              Judgement Verdict Decision {isAlreadyGiven ? '(Pronounced)' : '*'}
            </label>
            <select
              className="field-input"
              value={verdict}
              disabled={isAlreadyGiven}
              onChange={e => setVerdict(e.target.value)}
              style={{
                width: '100%',
                fontWeight: 600,
                fontSize: 14,
                padding: '10px 12px',
                background: isAlreadyGiven ? '#f1f5f9' : '#ffffff',
                color: isAlreadyGiven ? '#15803d' : 'var(--color-ink)',
                cursor: isAlreadyGiven ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="Bail Granted">Bail Granted</option>
              <option value="Guilty / Convicted">Guilty / Convicted</option>
              <option value="Acquitted / Case Dismissed">Acquitted / Case Dismissed</option>
              <option value="Interim Protection Order">Interim Protection Order</option>
              <option value="Remand Extended">Remand Extended</option>
              <option value="Next Hearing Scheduled">Next Hearing Scheduled</option>
              <option value="Hearing Adjourned / Next Date">Hearing Adjourned / Next Date</option>
            </select>

            {/* Date Picker appears when Hearing option is selected */}
            {verdict.toLowerCase().includes('hearing') && (
              <div style={{ marginTop: 12, padding: '12px 14px', background: '#f8fafc', border: '1px solid #c9a227', borderRadius: 6, animation: 'fadeIn 0.2s ease-out' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, color: 'var(--color-ink)', fontFamily: 'Oswald, sans-serif' }}>
                  Next Hearing Date
                </label>
                <input
                  type="date"
                  className="field-input"
                  value={hearingDate}
                  disabled={isAlreadyGiven}
                  onChange={e => setHearingDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', fontSize: 14, fontWeight: 600 }}
                  required
                />
                {hearingDate && (
                  <div style={{ fontSize: 11, color: '#15803d', fontWeight: 600, marginTop: 4 }}>
                    Next Scheduled Hearing: {new Date(hearingDate).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, color: 'var(--color-ink)', fontFamily: 'Oswald, sans-serif' }}>
              Bench Judgement Order & Rationale {isAlreadyGiven ? '(Official Record)' : '*'}
            </label>
            <textarea
              className="field-input"
              rows={4}
              value={summary}
              disabled={isAlreadyGiven}
              onChange={e => setSummary(e.target.value)}
              style={{
                width: '100%',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                lineHeight: 1.5,
                resize: 'vertical',
                background: isAlreadyGiven ? '#f8fafc' : '#ffffff',
                color: isAlreadyGiven ? '#1e293b' : 'var(--color-ink)'
              }}
              required
            />
          </div>

          {isAlreadyGiven ? (
            <div style={{ marginBottom: 20, padding: '12px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>Judgement Officially Pronounced & Cryptographically Sealed</div>
                <div style={{ fontSize: 11, color: '#15803d' }}>Signed by Hon. Justice Ramesh · Logged in High Court Vault Registry</div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f1f5f9', borderRadius: 6 }}>
              <input
                type="checkbox"
                id="digiSign"
                checked={isDigitalSigned}
                onChange={e => setIsDigitalSigned(e.target.checked)}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <label htmlFor="digiSign" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-ink)', cursor: 'pointer' }}>
                Attach Bench Digital Cryptographic Signature & Official Court Seal
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            {isAlreadyGiven ? (
              <button type="button" onClick={onClose} className="btn-primary" style={{ padding: '8px 24px', fontSize: 13, background: '#1A1A1A', color: '#ffffff', border: 'none', fontWeight: 700 }}>
                Close Judgement Order
              </button>
            ) : (
              <>
                <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '8px 18px', fontSize: 13 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 22px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, color: '#ffffff', background: '#1A1A1A', borderColor: '#1A1A1A' }}>
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>Issue & Sign Judgement</span>
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function PlaceholderView({ title, onNav }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, color: 'var(--color-body)' }}>
      <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px', color: 'var(--color-ink)' }}>{title}</h3>
      <p style={{ fontSize: 13, marginBottom: 16 }}>This module is active in the official deployment.</p>
      {onNav && (
        <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
          ← BACK TO DASHBOARD
        </button>
      )}
    </div>
  );
}

const allSystemCases = [
  // All System Investigation Cases (Handled by Police Officers & Benches)
  { id: 'C-1023', title: 'XYZ Investigation', type: 'Theft / Burglary', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', priority: 'High', updated: '12 Sep 2026', judgement: 'Pending - Hearing Scheduled', judgementDetail: 'Case listed for evidence presentation. Judgement reserved pending witness cross-examination.' },
  { id: 'C-1031', title: 'Financial Fraud Case', type: 'Banking Fraud', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', priority: 'Critical', updated: '11 Sep 2026', judgement: 'Verdict Reserved (Bail Decision Pending)', judgementDetail: 'Arguments heard from prosecution and defence. Orders reserved for bail decision on 15 Sep 2026.' },
  { id: 'C-1018', title: 'Cybercrime Incident', type: 'Phishing / Cybercrime', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Pending', priority: 'Medium', updated: '10 Sep 2026', judgement: 'Pending Forensic Audit Report', judgementDetail: 'Bench awaiting forensic hash report from Central Cyber Security Lab before framing final verdict.' },
  { id: 'C-1009', title: 'Assault Complaint', type: 'Physical Assault', officer: 'Inspector Sharma', division: 'Special Investigation', status: 'Closed', priority: 'Low', updated: '08 Sep 2026', judgement: 'Guilty / Convicted (2 Years Rigorous Imprisonment)', judgementDetail: 'Accused convicted under IPC Section 324. Sentence of 2 years imprisonment & ₹25,000 fine pronounced.' },
  { id: 'C-1044', title: 'Commercial Complex Burglary', type: 'Theft / Burglary', officer: 'Inspector K. Varma', division: 'Crime Branch Div-2', status: 'Active', priority: 'High', updated: '12 Sep 2026', judgement: 'Trial Proceedings Underway', judgementDetail: 'Prosecution witness statements being recorded under Section 161 CrPC.' },
  { id: 'C-1052', title: 'Crypto Wallet Exploitation', type: 'Phishing / Cybercrime', officer: 'Sub-Inspector Ramesh', division: 'Cyber Crime', status: 'Active', priority: 'Critical', updated: '12 Sep 2026', judgement: 'Interim Asset Freezing Order Passed', judgementDetail: 'Interim injunction granted ordering immediate freezing of suspect digital wallets.' },
  { id: 'C-2015', title: 'State vs. Raj Kumar Syndicate', type: 'Banking Fraud', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', priority: 'Critical', updated: '12 Sep 2026', judgement: 'Bail Application Rejected', judgementDetail: 'Bail rejected considering gravity of economic offence and flight risk of primary accused.' },
  { id: 'C-2022', title: 'Bank Money Laundering Indictment', type: 'Banking Fraud', officer: 'Inspector K. Varma', division: 'Crime Branch Div-2', status: 'Pending', priority: 'High', updated: '11 Sep 2026', judgement: 'Pending Statutory Prosecution Sanction', judgementDetail: 'Pending formal sanction under Section 197 CrPC from Competent Government Authority.' },
  { id: 'C-2038', title: 'Cyber Extortion Prosecution', type: 'Phishing / Cybercrime', officer: 'Sub-Inspector Ramesh', division: 'Cyber Crime', status: 'Pending', priority: 'Medium', updated: '10 Sep 2026', judgement: 'Chargesheet Review Pending', judgementDetail: 'Bench reviewing preliminary chargesheet filed by Special Investigation Cell.' },
  { id: 'C-2041', title: 'Industrial Theft Prosecution', type: 'Theft / Burglary', officer: 'Inspector Priya M.', division: 'Special Task Force', status: 'Active', priority: 'High', updated: '09 Sep 2026', judgement: 'Interim Relief Granted', judgementDetail: 'Interim protection against coercive action granted subject to weekly police station reporting.' },
  { id: 'C-3088', title: 'State vs. Metropolitan Bank', type: 'Banking Fraud', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', priority: 'Critical', updated: '12 Sep 2026', judgement: 'Bail Granted with Conditions', judgementDetail: 'Interim bail allowed upon deposit of ₹5,00,000 security bond and passport surrender.' },
  { id: 'C-3092', title: 'Bail Motion: Cyber Attack Case', type: 'Phishing / Cybercrime', officer: 'Sub-Inspector Ramesh', division: 'Cyber Crime', status: 'Pending', priority: 'High', updated: '11 Sep 2026', judgement: 'Arguments Scheduled', judgementDetail: 'Final bail arguments listed for hearing before Presiding Judicial Bench.' },
  { id: 'C-3105', title: 'Judicial Inquiry & Asset Seizure', type: 'Banking Fraud', officer: 'Inspector K. Varma', division: 'Crime Branch Div-2', status: 'Active', priority: 'Critical', updated: '10 Sep 2026', judgement: 'Judicial Inquiry Ordered', judgementDetail: 'Bench directed 3-member independent judicial panel to inspect seized financial records.' },
  { id: 'C-3118', title: 'Magistrate Verdict & Final Order', type: 'Physical Assault', officer: 'Inspector Priya M.', division: 'Special Task Force', status: 'Closed', priority: 'Low', updated: '08 Sep 2026', judgement: 'Acquitted (Benefit of Doubt)', judgementDetail: 'Accused acquitted due to material contradictions in eye-witness testimony.' }
];

function AllCasesView({ onNav }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedCaseForJudgement, setSelectedCaseForJudgement] = useState(null);

  const filteredCases = allSystemCases.filter(c => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.officer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.judgement.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.type === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div>
      {/* Modal for Judgement Details */}
      {selectedCaseForJudgement && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setSelectedCaseForJudgement(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '90%', maxWidth: '580px', background: '#ffffff',
              borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
              border: '1px solid #1A1A1A'
            }}
          >
            <div style={{ background: '#1A1A1A', padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase' }}>
                  JUDICIAL VERDICT & CASE JUDGEMENT SUMMARY
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  CASE {selectedCaseForJudgement.id} · {selectedCaseForJudgement.title}
                </div>
              </div>
              <button onClick={() => setSelectedCaseForJudgement(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18, background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Investigating Officer</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{selectedCaseForJudgement.officer}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-charcoal)' }}>{selectedCaseForJudgement.division}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Case Category</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedCaseForJudgement.type}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Case Status</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>
                    <span className={`badge ${selectedCaseForJudgement.status === 'Active' ? 'badge-active' : selectedCaseForJudgement.status === 'Closed' ? 'badge-done' : 'badge-warning'}`}>
                      {selectedCaseForJudgement.status}
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Last Order Date</div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{selectedCaseForJudgement.updated}</div>
                </div>
              </div>

              <div style={{ marginBottom: 16, background: '#f0fdf4', border: '1px solid #86efac', padding: '16px', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', color: '#166534', marginBottom: 4 }}>
                  PRONOUNCED JUDGEMENT / VERDICT
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#15803d', marginBottom: 8 }}>
                  {selectedCaseForJudgement.judgement}
                </div>
                <div style={{ fontSize: 13, color: '#166534', lineHeight: 1.5 }}>
                  {selectedCaseForJudgement.judgementDetail}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <button onClick={() => setSelectedCaseForJudgement(null)} className="btn-secondary" style={{ padding: '6px 18px', fontSize: 12 }}>
                  Close Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Central Department Cases & Judgements Registry</h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>Comprehensive Logged Cases & Judgement Verdicts across All Investigating Officers & Divisions</p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      {/* Filter & Search Controls Bar */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-card-header">Search & Filter All System Cases & Judgements</div>
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
              placeholder="Search by Case ID, Title, Officer, Category, or Judgement Verdict..."
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
              <option value="Closed">Closed / Judgement Delivered</option>
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
          <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 600 }}>Showing judgement outcomes & presiding verdicts</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Case Reference</th>
              <th>Case Title</th>
              <th>Category</th>
              <th>Handling Officer</th>
              <th>Case Status</th>
              <th>Judgement / Verdict Outcome</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map(c => (
              <tr key={c.id}>
                <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{c.id}</td>
                <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{c.title}</td>
                <td><span className="badge badge-done">{c.type}</span></td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: 13 }}>{c.officer}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-charcoal)' }}>{c.division}</div>
                </td>
                <td>
                  <span className={`badge ${c.status === 'Active' ? 'badge-active' : c.status === 'Pending' ? 'badge-warning' : 'badge-done'}`}>
                    {c.status === 'Closed' ? 'Closed' : c.status}
                  </span>
                </td>
                <td>
                  <div style={{ 
                    fontWeight: 700, 
                    fontSize: 12, 
                    color: c.judgement.includes('Convicted') || c.judgement.includes('Rejected') ? '#dc2626' : 
                           c.judgement.includes('Granted') || c.judgement.includes('Acquitted') ? '#059669' : '#d97706' 
                  }}>
                    {c.judgement}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-charcoal)', marginTop: 2 }}>
                    Updated: {c.updated}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={() => setSelectedCaseForJudgement(c)}
                    className="btn-primary" 
                    style={{ padding: '4px 10px', fontSize: 11, background: '#1A1A1A' }}
                  >
                    View Judgement
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

function JudgeProfileView({ onNav }) {
  const profileData = {
    name: 'Ramesh',
    title: 'Senior Presiding Judge & Additional Sessions Judge',
    benchId: 'BENCH-DEL-2015/094',
    serviceId: 'JUD-84920-DL',
    dob: '14 May 1974',
    age: '52 Years',
    experience: '18 Years in High Court & Criminal Judicial Bench',
    email: 'justice.ramesh@highcourt.gov.in',
    phone: '+91 98110 98765',
    courtRoom: 'Court Room 2 - Special Criminal Bench',
    officeAddress: 'Chamber 204, High Court Complex, New Delhi - 110001',
    disposalRate: '98.4%',
    totalDisposed: 32,
    activeProceedings: 18,
    deliveredOrders: 14
  };

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            JUDICIAL BENCH OFFICIAL PROFILE
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            High Court of Judicature · Bench Authority Credentials & Identity
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
          {/* Avatar / Badge Icon with Judge Portrait Photo */}
          <div style={{ width: 84, height: 84, borderRadius: '50%', overflow: 'hidden', border: '3px solid #c9a227', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', background: '#1A1A1A' }}>
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80" 
              alt="Hon. Justice Ramesh"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/officer_portrait.jpg";
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h3 style={{ fontSize: 20, fontFamily: 'Oswald, sans-serif', fontWeight: 700, margin: 0, color: 'var(--color-ink)', letterSpacing: '0.05em' }}>
                {profileData.name}
              </h3>
              <span style={{ fontSize: 10, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '2px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>
                ACTIVE PRESIDING JUDGE
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-charcoal)', fontWeight: 600, marginBottom: 8 }}>
              {profileData.title}
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--color-charcoal)' }}>
              <span>Bench ID: <strong className="mono" style={{ color: 'var(--color-ink)' }}>{profileData.benchId}</strong></span>
              <span>Service ID: <strong className="mono" style={{ color: 'var(--color-ink)' }}>{profileData.serviceId}</strong></span>
              <span>DOB / Age: <strong style={{ color: 'var(--color-ink)' }}>{profileData.dob} ({profileData.age})</strong></span>
              <span>Experience: <strong style={{ color: '#15803d', fontWeight: 700 }}>18 Years</strong></span>
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

        {/* Judicial Track Record & Metrics Card */}
        <div>
          <div className="section-card">
            <div className="section-card-header">JUDICIAL TRACK RECORD & METRICS</div>
            <div className="section-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>TOTAL CASES DISPOSED</div>
                  <div style={{ fontSize: 24, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--color-ink)' }}>{profileData.totalDisposed}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>JUDGEMENT DISPOSAL RATE</div>
                  <div style={{ fontSize: 24, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#15803d' }}>{profileData.disposalRate}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>ACTIVE PROCEEDINGS HANDLED</div>
                  <div style={{ fontSize: 24, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--primary)' }}>{profileData.activeProceedings}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>DELIVERED JUDGEMENT ORDERS</div>
                  <div style={{ fontSize: 24, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--color-ink)' }}>{profileData.deliveredOrders}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JudicialAlertsView({ onNav, alertsList: propAlerts, setAlertsList: propSetAlerts }) {
  const [localAlertsList, setLocalAlertsList] = useState([
    { id: 1, type: 'critical', title: 'Verdict Pronouncement Due Today', text: 'State vs Singh (Case #C-104) is scheduled for final judgment pronouncement at 03:30 PM today in Court Room 2.', time: '10 mins ago' },
    { id: 2, type: 'warning', title: 'Digital Signatures Pending', text: '2 Judicial Orders (ORD-2026-441 & ORD-2026-440) are draft-approved and await your e-Signature.', time: '1 hour ago' },
    { id: 3, type: 'info', title: 'High-Court Circular Issued', text: 'New High Court directive regarding expedited disposal of cyber financial fraud cases (>90 days).', time: '3 hours ago' },
    { id: 4, type: 'urgent', title: 'Aging Case Warning (>90 Days)', text: 'Case C-1009 (State vs Kumar) has reached 94 days in Evidence Stage without progress.', time: '5 hours ago' },
  ]);

  const alertsList = propAlerts !== undefined ? propAlerts : localAlertsList;
  const setAlertsList = propSetAlerts !== undefined ? propSetAlerts : setLocalAlertsList;

  const dismissAlert = (id) => {
    setAlertsList(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            CRITICAL JUDICIAL ALERTS & NOTIFICATIONS
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Live High-Court Directives, Urgent Bench Tasks, and Pronouncement Reminders
          </p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      <div className="section-card">
        <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>ACTIVE BENCH NOTIFICATIONS ({alertsList.length})</span>
          <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 600 }}>High Priority Bench Desk</span>
        </div>
        <div style={{ padding: 18 }}>
          {alertsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--color-charcoal)', fontWeight: 500 }}>
              ✓ All judicial alerts and notifications cleared.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {alertsList.map(a => (
                <div key={a.id} style={{ padding: '14px 16px', background: a.type === 'critical' ? '#fef2f2' : a.type === 'warning' ? '#fffbeb' : '#f0fdf4', border: `1px solid ${a.type === 'critical' ? '#fca5a5' : a.type === 'warning' ? '#fde68a' : '#86efac'}`, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: a.type === 'critical' ? '#dc2626' : a.type === 'warning' ? '#b45309' : '#15803d' }}>
                        {a.title}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--color-charcoal)', fontFamily: 'JetBrains Mono, monospace' }}>{a.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-ink)', lineHeight: 1.5 }}>
                      {a.text}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 16 }}>
                    <button onClick={() => dismissAlert(a.id)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AgingCasesView({ onNav }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [agingCasesList, setAgingCasesList] = useState([
    { id: 'C-1009', title: 'State vs Kumar', stage: 'Evidence Stage', pendingDays: 94, reason: 'Forensic Report Delayed', officer: 'Inspector K. Varma', prosecutor: 'Adv. S. Nair', escalated: false },
    { id: 'C-1018', title: 'Sharma vs State', stage: 'Arguments', pendingDays: 82, reason: 'Counsel Extension Request', officer: 'Inspector Sharma', prosecutor: 'Adv. P. Rao', escalated: false },
    { id: 'C-1031', title: 'Financial Fraud Case', stage: 'Witness Cross-Exam', pendingDays: 68, reason: 'Multiple Accused Hearing', officer: 'Inspector Priya M.', prosecutor: 'Adv. A. Sharma', escalated: false },
    { id: 'C-1045', title: 'CBI vs Infra Directors', stage: 'Sanction Order Review', pendingDays: 104, reason: 'Statutory Sanction Awaited', officer: 'DSP R. Deshmukh', prosecutor: 'Adv. R. Deshmukh', escalated: false },
    { id: 'C-1052', title: 'State vs Reddi', stage: 'Framing Charges', pendingDays: 78, reason: 'Accused Absence Motion', officer: 'SI Ramesh', prosecutor: 'Adv. K. Singh', escalated: false },
    { id: 'C-1064', title: 'State vs Mehta', stage: 'Pre-Trial Hearing', pendingDays: 45, reason: 'Document Discovery Pending', officer: 'SI Ramesh', prosecutor: 'Adv. G. Bhat', escalated: false }
  ]);

  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  const [escalatingCase, setEscalatingCase] = useState(null);

  const handleConfirmEscalation = (caseId) => {
    setAgingCasesList(prev => prev.map(c => c.id === caseId ? { ...c, escalated: true } : c));
    setEscalatingCase(null);
    setNotification({
      isOpen: true,
      title: 'CASE FORMALLY ESCALATED',
      message: `Case ${caseId} has been formally escalated to the High Court Registrar General for expedited intervention and priority listing.`,
      type: 'success'
    });
  };

  const metricCards = [
    { key: '30-60', range: '30-60 Days (Moderate)', count: 10, color: '#0284c7', status: 'Under Review' },
    { key: '60-90', range: '60-90 Days (Attention)', count: 5, color: '#d97706', status: 'Priority List' },
    { key: '>90', range: '> 90 Days (Critical Overdue)', count: 3, color: '#dc2626', status: 'Requires Escalation' },
  ];

  const filteredCasesList = agingCasesList
    .filter(c => c.pendingDays > 40)
    .filter(c => {
      if (activeFilter === '30-60') return c.pendingDays >= 30 && c.pendingDays <= 60;
      if (activeFilter === '60-90') return c.pendingDays > 60 && c.pendingDays <= 90;
      if (activeFilter === '>90') return c.pendingDays > 90;
      return true;
    });

  return (
    <div>
      <NotificationModal 
        isOpen={notification.isOpen} 
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      {escalatingCase && (
        <EscalationDialog
          caseItem={escalatingCase}
          onClose={() => setEscalatingCase(null)}
          onConfirm={() => handleConfirmEscalation(escalatingCase.id)}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            PENDING & AGING CASES ANALYSIS
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Comprehensive Bench Backlog Breakdown, Aging Distribution (&gt;90 Days), and High Court Escalation Desk
          </p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      {/* 3 Interactive Filter Card Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {metricCards.map(card => {
          const isSelected = activeFilter === card.key;
          return (
            <button
              key={card.key}
              onClick={() => setActiveFilter(isSelected ? 'all' : card.key)}
              style={{
                background: isSelected ? '#f8fafc' : '#ffffff',
                border: isSelected ? `2px solid ${card.color}` : '1px solid #cbd5e1',
                borderLeft: `6px solid ${card.color}`,
                borderRadius: 8,
                padding: '14px 18px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 4px 14px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.15s ease-in-out',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                outline: 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>
                  {card.range}
                </div>
                {isSelected && (
                  <span style={{ fontSize: 10, background: card.color, color: '#fff', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                    FILTER ACTIVE
                  </span>
                )}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: card.color, fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>
                {card.count}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: card.color, marginTop: 4 }}>
                {card.status} {isSelected ? '• Click to reset' : '• Click to filter'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Table of Aging Cases */}
      <div className="section-card">
        <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            BACKLOG & AGING CASES REPOSITORY ({filteredCasesList.length})
            {activeFilter !== 'all' && (
              <span style={{ fontSize: 12, marginLeft: 10, color: 'var(--primary)', fontWeight: 600 }}>
                [ Filtered by: {metricCards.find(c => c.key === activeFilter)?.range} ]
              </span>
            )}
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {activeFilter !== 'all' && (
              <button 
                onClick={() => setActiveFilter('all')} 
                className="btn-secondary" 
                style={{ fontSize: 11, padding: '3px 8px', background: '#f1f5f9' }}
              >
                Clear Filter ✕
              </button>
            )}
            <span className="badge badge-error" style={{ fontSize: 10 }}>HIGH COURT MONITORING DESK</span>
          </div>
        </div>
        
        {filteredCasesList.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
            No aging cases found matching the selected filter criteria.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Case Ref</th>
                <th>Case Title & Parties</th>
                <th>Current Stage</th>
                <th>Primary Delay Reason</th>
                <th>Prosecutor Counsel</th>
                <th>Aging Duration</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCasesList.map(c => (
                <tr key={c.id}>
                  <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{c.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{c.title}</td>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>{c.stage}</td>
                  <td style={{ color: 'var(--color-charcoal)', fontSize: 12 }}>{c.reason}</td>
                  <td style={{ color: 'var(--color-ink)', fontSize: 12, fontWeight: 600 }}>{c.prosecutor}</td>
                  <td>
                    <span className={`badge ${c.pendingDays > 90 ? 'badge-error' : c.pendingDays > 60 ? 'badge-warning' : 'badge-active'}`} style={{ fontSize: 11, fontWeight: 700 }}>
                      {c.pendingDays} DAYS AGING
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {c.escalated ? (
                      <span className="badge badge-done" style={{ fontSize: 11, background: '#dcfce7', color: '#15803d' }}>
                        Escalated to Registrar ✓
                      </span>
                    ) : (
                      <button 
                        onClick={() => setEscalatingCase(c)} 
                        className="btn-primary" 
                        style={{ padding: '5px 14px', fontSize: 11, background: '#dc2626', borderColor: '#dc2626', color: '#ffffff' }}
                      >
                        Escalate Case
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}



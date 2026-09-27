import { useState, useEffect } from 'react';
import Layout from './shared/Layout';
import NotificationModal from './shared/NotificationModal';

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'mycases', label: 'My Cases' },
  { id: 'allcases', label: 'Show All Cases', sub: '' },
  { id: 'createcase', label: 'Create New Case' },
  { id: 'versions', label: 'Version History', sub: '' },
  { id: 'activity', label: 'My Activity' },
  { id: 'profile', label: 'Profile' },
];

const myCases = [
  { id: 'C-1023', title: 'XYZ Investigation', type: 'Theft / Burglary', status: 'Active', priority: 'High', updated: '12 Sep 2026' },
  { id: 'C-1031', title: 'Financial Fraud Case', type: 'Banking Fraud', status: 'Active', priority: 'Critical', updated: '11 Sep 2026' },
  { id: 'C-1018', title: 'Cybercrime Incident', type: 'Phishing', status: 'Pending', priority: 'Medium', updated: '10 Sep 2026' },
  { id: 'C-1009', title: 'Assault Complaint', type: 'Physical Assault', status: 'Closed', priority: 'Low', updated: '08 Sep 2026' },
];

const officerActivities = [
  { id: 'C-1023', action: 'FIR Document Uploaded', module: 'Upload Portal', time: '12 Sep 2026, 10:32 AM', shortTime: '10:32', status: 'VERIFIED' },
  { id: 'C-1031', action: 'Forensic Evidence Tagged', module: 'Evidence Vault', time: '12 Sep 2026, 09:55 AM', shortTime: '09:55', status: 'VERIFIED' },
  { id: 'C-1018', action: 'Draft Charge Sheet Saved', module: 'Legal Section', time: '12 Sep 2026, 09:20 AM', shortTime: '09:20', status: 'VERIFIED' },
  { id: 'C-1023', action: 'Initial Report Submitted', module: 'Case Ingestion', time: '11 Sep 2026, 04:15 PM', shortTime: 'Yesterday', status: 'AUDITED' },
  { id: 'C-1009', action: 'Digital Signature Verified', module: 'Vault Security', time: '10 Sep 2026, 02:40 PM', shortTime: '10 Sep 2026', status: 'ENCRYPTED' },
  { id: 'C-1031', action: 'Prosecutor Review Requested', module: 'Legal Section', time: '08 Sep 2026, 03:50 PM', shortTime: '08 Sep 2026', status: 'AUDITED' },
];

const allOfficersCases = [
  // All System Investigation Cases (Handled by Police Officers)
  { id: 'C-1023', title: 'XYZ Investigation', type: 'Theft / Burglary', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', priority: 'High', updated: '12 Sep 2026' },
  { id: 'C-1031', title: 'Financial Fraud Case', type: 'Banking Fraud', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', priority: 'Critical', updated: '11 Sep 2026' },
  { id: 'C-1018', title: 'Cybercrime Incident', type: 'Phishing / Cybercrime', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Pending', priority: 'Medium', updated: '10 Sep 2026' },
  { id: 'C-1009', title: 'Assault Complaint', type: 'Physical Assault', officer: 'Inspector Sharma', division: 'Special Investigation', status: 'Closed', priority: 'Low', updated: '08 Sep 2026' },
  { id: 'C-1044', title: 'Commercial Complex Burglary', type: 'Theft / Burglary', officer: 'Inspector K. Varma', division: 'Crime Branch Div-2', status: 'Active', priority: 'High', updated: '12 Sep 2026' },
  { id: 'C-1052', title: 'Crypto Wallet Exploitation', type: 'Phishing / Cybercrime', officer: 'Sub-Inspector Ramesh', division: 'Cyber Crime', status: 'Active', priority: 'Critical', updated: '12 Sep 2026' },
  { id: 'C-1060', title: 'Highway Robbery Ingestion', type: 'Physical Assault', officer: 'Inspector Priya M.', division: 'Special Task Force', status: 'Pending', priority: 'High', updated: '11 Sep 2026' },
  { id: 'C-1075', title: 'Corporate Embezzlement Audit', type: 'Banking Fraud', officer: 'Inspector K. Varma', division: 'Crime Branch Div-2', status: 'Active', priority: 'Medium', updated: '10 Sep 2026' },
  { id: 'C-1088', title: 'Narcotics Seizure & Storage', type: 'Narcotics', officer: 'Sub-Inspector David', division: 'Anti-Narcotics Wing', status: 'Active', priority: 'Critical', updated: '09 Sep 2026' },
  { id: 'C-1092', title: 'ATM Skimming Syndicate', type: 'Banking Fraud', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', priority: 'High', updated: '09 Sep 2026' },
  { id: 'C-2015', title: 'State vs. Raj Kumar Syndicate', type: 'Banking Fraud', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', priority: 'Critical', updated: '12 Sep 2026' },
  { id: 'C-2022', title: 'Bank Money Laundering Indictment', type: 'Banking Fraud', officer: 'Inspector K. Varma', division: 'Crime Branch Div-2', status: 'Pending', priority: 'High', updated: '11 Sep 2026' },
  { id: 'C-2038', title: 'Cyber Extortion Prosecution', type: 'Phishing / Cybercrime', officer: 'Sub-Inspector Ramesh', division: 'Cyber Crime', status: 'Pending', priority: 'Medium', updated: '10 Sep 2026' },
  { id: 'C-2041', title: 'Industrial Theft Prosecution', type: 'Theft / Burglary', officer: 'Inspector Priya M.', division: 'Special Task Force', status: 'Active', priority: 'High', updated: '09 Sep 2026' },
  { id: 'C-3088', title: 'State vs. Metropolitan Bank', type: 'Banking Fraud', officer: 'Inspector Sharma', division: 'Cyber Crime', status: 'Active', priority: 'Critical', updated: '12 Sep 2026' },
  { id: 'C-3092', title: 'Bail Motion: Cyber Attack Case', type: 'Phishing / Cybercrime', officer: 'Sub-Inspector Ramesh', division: 'Cyber Crime', status: 'Pending', priority: 'High', updated: '11 Sep 2026' },
  { id: 'C-3105', title: 'Judicial Inquiry & Asset Seizure', type: 'Banking Fraud', officer: 'Inspector K. Varma', division: 'Crime Branch Div-2', status: 'Active', priority: 'Critical', updated: '10 Sep 2026' },
  { id: 'C-3118', title: 'Magistrate Verdict & Final Order', type: 'Physical Assault', officer: 'Inspector Priya M.', division: 'Special Task Force', status: 'Closed', priority: 'Low', updated: '08 Sep 2026' }
];

const initialAlertsList = [
  {
    id: 'ALT-901',
    caseId: 'C-1023',
    caseTitle: 'XYZ Investigation',
    category: 'URGENT',
    priority: 'CRITICAL',
    title: 'Public Prosecutor Action Required',
    message: 'Public Prosecutor requested additional witness statements and forensic hash verification before formal court submission.',
    time: 'Today, 10:45 AM',
    read: false,
    badgeColor: '#ef4444',
    badgeBg: '#fef2f2',
    badgeBorder: '#fca5a5'
  },
  {
    id: 'ALT-902',
    caseId: 'C-1031',
    caseTitle: 'Financial Fraud Case',
    category: 'VAULT',
    priority: 'VERIFIED',
    title: 'Government Vault Confirmation',
    message: 'All mandatory documents committed to Government Vault. SHA-256 integrity hash verification successfully completed.',
    time: 'Today, 09:30 AM',
    read: false,
    badgeColor: '#15803d',
    badgeBg: '#dcfce7',
    badgeBorder: '#86efac'
  },
  {
    id: 'ALT-903',
    caseId: 'C-1018',
    caseTitle: 'Cybercrime Incident',
    category: 'URGENT',
    priority: 'HIGH',
    title: 'Approaching Charge Sheet Submission Deadline',
    message: 'Charge sheet submission deadline approaching (15 Sep 2026). Missing document categories require uploading.',
    time: 'Yesterday, 04:15 PM',
    read: false,
    badgeColor: '#b45309',
    badgeBg: '#fef3c7',
    badgeBorder: '#fde68a'
  },
  {
    id: 'ALT-904',
    caseId: 'C-1009',
    caseTitle: 'Assault Complaint',
    category: 'SYSTEM',
    priority: 'CLOSED & ARCHIVED',
    title: 'Judicial Case Closure Notice',
    message: 'Case closed by Judicial Magistrate. All attachments locked under read-only vault protection.',
    time: '10 Sep 2026, 02:40 PM',
    read: true,
    badgeColor: '#475569',
    badgeBg: '#f1f5f9',
    badgeBorder: '#cbd5e1'
  }
];

export default function PoliceDashboard({ onLogout }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [selectedCase, setSelectedCase] = useState('C-1023');
  const [alertsList, setAlertsList] = useState(initialAlertsList);
  const [myCasesStatusFilter, setMyCasesStatusFilter] = useState('All');

  const unreadCount = alertsList.filter(a => !a.read).length;

  const handleNavWithFilter = (nav, filter = 'All') => {
    setMyCasesStatusFilter(filter);
    setActiveNav(nav);
  };

  return (
    <Layout title="Law Enforcement & Investigation Portal" titleIcon="🛡️" userLabel="Sharma K." userIcon=""
      navItems={navItems} activeNav={activeNav} onNavChange={(nav) => handleNavWithFilter(nav, 'All')} onLogout={onLogout} unreadCount={unreadCount}>
      {activeNav === 'dashboard' && <DashboardView unreadCount={unreadCount} onNav={handleNavWithFilter} onSelectCase={id => { setSelectedCase(id); setActiveNav('chargesheet'); }} />}
      {activeNav === 'mycases' && <MyCasesView cases={myCases} initialStatusFilter={myCasesStatusFilter} onSelect={id => { setSelectedCase(id); setActiveNav('chargesheet'); }} onNav={handleNavWithFilter} />}
      {activeNav === 'allcases' && <AllCasesView onSelect={id => { setSelectedCase(id); setActiveNav('chargesheet'); }} onNav={handleNavWithFilter} />}
      {activeNav === 'createcase' && <CreateCaseView onCreated={() => handleNavWithFilter('mycases', 'All')} onNav={handleNavWithFilter} />}
      {activeNav === 'chargesheet' && <ChargeSheetView caseId={selectedCase} onNav={handleNavWithFilter} />}
      {activeNav === 'upload' ? <UploadView onBack={() => handleNavWithFilter('dashboard', 'All')} /> : null}
      {activeNav === 'activity' && <MyActivityView onBack={() => handleNavWithFilter('dashboard', 'All')} />}
      {activeNav === 'profile' && <ProfileView onBack={() => handleNavWithFilter('dashboard', 'All')} />}
      {activeNav === 'versions' && <VersionHistoryView onSelectCase={id => { setSelectedCase(id); setActiveNav('chargesheet'); }} onNav={handleNavWithFilter} />}
      {activeNav === 'alerts' && <AlertsView alertsList={alertsList} setAlertsList={setAlertsList} onSelectCase={id => { setSelectedCase(id); setActiveNav('chargesheet'); }} onNav={handleNavWithFilter} />}
      {!['dashboard', 'mycases', 'allcases', 'createcase', 'chargesheet', 'upload', 'activity', 'profile', 'versions', 'alerts'].includes(activeNav) && (
        <PlaceholderView title={navItems.find(n => n.id === activeNav)?.label || activeNav} />
      )}
    </Layout>
  );
}

function DashboardView({ unreadCount, onNav, onSelectCase }) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Police Officer Investigation Dashboard</h2>
        <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>Investigating Officer: Inspector Sharma · Cyber Crime & Special Investigation Division</p>
      </div>

      {/* STAT CARDS - CLEAN WITHOUT EMOJIS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Assigned Cases', value: '8', target: 'mycases', filter: 'All' },
          { label: 'Under Active Investigation', value: '5', target: 'mycases', filter: 'Active' },
          { label: 'Pending Legal Review', value: '2', warn: true, target: 'mycases', filter: 'Pending' },
          { label: 'Action Alerts', value: unreadCount.toString(), warn: unreadCount > 0, target: 'alerts', filter: 'All' },
        ].map(s => (
          <div key={s.label} className="stat-card" onClick={() => onNav(s.target, s.filter)} title={`Navigate to ${s.label}`} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: 32, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: s.warn ? '#b45309' : 'var(--color-ink)', lineHeight: 1 }}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <div 
          className="section-card" 
          onClick={() => onNav('mycases')} 
          style={{ cursor: 'pointer' }}
          title="Click to view My Cases"
        >
          <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Active Cases Docket</span>
            <span style={{ fontSize: 11, color: 'var(--primary)', textTransform: 'none', fontWeight: 600 }}>View All My Cases →</span>
          </div>
          <div className="section-card-body" style={{ padding: 0 }}>
            {myCases.slice(0, 3).map(c => (
              <div key={c.id} style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                onClick={(e) => { e.stopPropagation(); onNav('mycases'); }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{c.id}</span>
                  <span className={`badge ${c.status === 'Active' ? 'badge-active' : c.status === 'Pending' ? 'badge-pending' : 'badge-done'}`}>{c.status}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 2 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: 'var(--color-ink)', fontWeight: 600 }}>{c.type} · <span style={{ color: '#000000', fontWeight: 700 }}>Updated {c.updated}</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-header">Pending Officer Action Items</div>
          <div className="section-card-body">
            {[
              { text: '1 charge sheet pending prosecutor submission' },
              { text: '3 evidence items need physical hash tagging' },
              { text: '2 forensic documents awaiting upload' },
              { text: 'FIR C-1031 requires digital signature' },
            ].map(a => (
              <div key={a.text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 14, color: 'var(--accent-gold)', fontWeight: 700 }}>•</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-card">
        <div
          className="section-card-header"
          onClick={() => onNav('activity')}
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          title="Click to view full Activity Log"
        >
          <span>Recent Investigation Activity Log</span>
          <span style={{ fontSize: 11, color: 'var(--accent-gold)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.06em', fontWeight: 700 }}>
            VIEW ALL MY ACTIVITY →
          </span>
        </div>
        <table className="data-table">
          <thead><tr><th>Case ID</th><th>Action Performed</th><th>Timestamp</th><th>Status</th></tr></thead>
          <tbody>
            {officerActivities.filter(a => myCases.some(c => c.id === a.id)).slice(0, 4).map((r, i) => (
              <tr key={i} onClick={() => onNav('activity')} style={{ cursor: 'pointer' }}>
                <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{r.id}</td>
                <td style={{ fontWeight: 500 }}>{r.action}</td>
                <td className="mono" style={{ fontSize: 12, color: '#000000', fontWeight: 700 }}>{r.shortTime || r.time}</td>
                <td><span className="badge badge-active">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MyCasesView({ cases, onSelect, onNav, initialStatusFilter = 'All' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    setStatusFilter(initialStatusFilter);
  }, [initialStatusFilter]);

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.type === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Investigating Cases Registry</h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>Assigned Investigation Cases for Inspector Sharma</p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      {/* Filter & Search Controls Bar */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-card-header">Search & Filter My Cases</div>
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
              placeholder="Search by Case ID, Title, or Category..."
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
              <option value="Phishing">Phishing</option>
              <option value="Physical Assault">Physical Assault</option>
            </select>
          </div>

        </div>
      </div>

      <div className="section-card">
        <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>My Assigned Cases ({filteredCases.length} Records)</span>
        </div>
        <table className="data-table">
          <thead><tr><th>Case Reference</th><th>Case Title</th><th>Crime Category</th><th>Status</th><th>Last Updated</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredCases.map(c => (
              <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(c.id)}>
                <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{c.id}</td>
                <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{c.title}</td>
                <td>{c.type}</td>
                <td><span className={`badge ${c.status === 'Active' ? 'badge-active' : c.status === 'Pending' ? 'badge-pending' : 'badge-done'}`}>{c.status}</span></td>
                <td className="mono" style={{ fontSize: 12, color: '#000000', fontWeight: 700 }}>{c.updated}</td>
                <td><button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 11 }}>Open Case</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const caseMetadataMap = {
  'C-1023': {
    title: 'XYZ Investigation',
    category: 'Theft / Burglary',
    suspect: 'Raj Kumar (ID: ACC-2024-0047)',
    victim: 'Suresh Sundaram',
    witness: 'Ramesh (Shopkeeper) & Security Guard Statement',
    incidentDate: '2026-09-12',
    incidentTime: '18:30',
    location: 'Sector 4 Commercial Market, Main Road',
    description: 'The accused was found in possession of stolen property valued at ₹4,50,000. CCTV footage and witness statements corroborate the evidence collected at the scene. Initial FIR registered under theft sections.'
  },
  'C-1031': {
    title: 'Financial Fraud Case',
    category: 'Banking Fraud',
    suspect: 'Manoj Verma & Unknown Associates',
    victim: 'City Bank Co-operative Branch',
    witness: 'Branch Manager & Audit Team',
    incidentDate: '2026-09-11',
    incidentTime: '14:15',
    location: 'Central Banking District, Hub Plaza',
    description: 'Unauthorized electronic fund transfers amounting to ₹12,80,000 detected across 3 accounts. IP trace leads to proxy server.'
  },
  'C-1018': {
    title: 'Cybercrime Incident',
    category: 'Phishing / Cybercrime',
    suspect: 'Unknown Cyber Syndicate',
    victim: 'Multiple Citizens (14 Complaints)',
    witness: 'Cyber Forensic Expert Team',
    incidentDate: '2026-09-10',
    incidentTime: '11:00',
    location: 'Online Phishing Portal Domain',
    description: 'Fake government relief site used to collect credentials and OTP numbers. Server domain frozen.'
  },
  'C-1009': {
    title: 'Assault Complaint',
    category: 'Physical Assault',
    suspect: 'Vicky @ Victor',
    victim: 'Karthik Raja',
    witness: 'Eyewitness Tea Stall Vendor',
    incidentDate: '2026-09-08',
    incidentTime: '21:45',
    location: 'Bus Stand Complex, South Gate',
    description: 'Physical altercation following verbal argument. Hospital medical examination report attached.'
  },
  'C-1044': {
    title: 'Commercial Complex Burglary',
    category: 'Theft / Burglary',
    suspect: 'Ganesh & Team',
    victim: 'Vanguard Retail Traders',
    witness: 'Night Security Officer',
    incidentDate: '2026-09-12',
    incidentTime: '03:15',
    location: 'Pollachi Commercial Hub',
    description: 'Broke into jewelry retail store after deactivating alarms. Digital footprint under verification.'
  },
  'C-1052': {
    title: 'Crypto Wallet Exploitation',
    category: 'Phishing / Cybercrime',
    suspect: 'Anonymous Hacker Group',
    victim: 'Digital Assets Owner',
    witness: 'Blockchain Audit Analyst',
    incidentDate: '2026-09-12',
    incidentTime: '19:40',
    location: 'Coimbatore Cyber Division',
    description: 'Phishing link disguised as wallet upgrade transferred 4.2 ETH into unhosted wallet address.'
  },
  'C-1060': {
    title: 'Highway Robbery Ingestion',
    category: 'Physical Assault',
    suspect: 'Highway Gang #4',
    victim: 'Logistics Truck Driver',
    witness: 'Toll Gate Supervisor',
    incidentDate: '2026-09-11',
    incidentTime: '23:10',
    location: 'Tirupur Highway Junction',
    description: 'Intercepted transport vehicle and physically assaulted driver before fleeing with cargo shipment.'
  },
  'C-1075': {
    title: 'Corporate Embezzlement Audit',
    category: 'Banking Fraud',
    suspect: 'Ex-Finance Director',
    victim: 'Apex Holdings Ltd',
    witness: 'Internal Forensic Auditor',
    incidentDate: '2026-09-10',
    incidentTime: '16:00',
    location: 'Erode Industrial Zone',
    description: 'Falsified invoices used to siphon funds into offshore shell company accounts over 6 months.'
  }
};

function ChargeSheetView({ caseId, onNav }) {
  const isMyCase = myCases.some(c => c.id === caseId);
  const matchedCase = allOfficersCases.find(c => c.id === caseId) || myCases.find(c => c.id === caseId);
  const loggedInOfficer = "Inspector Sharma";
  const caseOfficer = matchedCase ? matchedCase.officer : "Inspector Sharma";
  const isAssignedOfficer = caseOfficer.toLowerCase().includes("sharma");
  const caseStatus = matchedCase ? matchedCase.status : 'Active';
  const isClosed = caseStatus.toLowerCase() === 'closed';
  const canUpload = isAssignedOfficer && !isClosed;

  const caseData = caseMetadataMap[caseId] || {
    title: matchedCase ? matchedCase.title : ('Investigation Case ' + caseId),
    category: matchedCase ? matchedCase.type : 'General Investigation',
    suspect: 'Under Active Verification',
    victim: 'Complainant On Record',
    witness: 'Witness Statement Ingested',
    incidentDate: matchedCase ? matchedCase.updated : '2026-09-12',
    incidentTime: '18:30',
    location: matchedCase ? `${matchedCase.division}, Station Jurisdiction` : 'Metropolitan Area',
    description: `Official FIR docket registered under law enforcement system for ${matchedCase ? matchedCase.title : caseId}. Case currently under active investigation.`
  };

  const [summary, setSummary] = useState(caseData.description);
  const [selectedCategory, setSelectedCategory] = useState('FIRs');

  // Document presence tracking per category
  const [categoryDocs, setCategoryDocs] = useState({});

  useEffect(() => {
    if (isClosed) {
      // For CLOSED cases, all 6 documents MUST be uploaded and archived
      setCategoryDocs({
        'FIRs': { name: `FIR_${caseId}_Certified_Copy.pdf`, date: '12 Sep 2026', size: '2.4 MB', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
        'Investigation records': { name: `Investigation_Docket_${caseId}.pdf`, date: '11 Sep 2026', size: '1.8 MB', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
        'Witness statements': { name: `Witness_Deposition_${caseId}.pdf`, date: '10 Sep 2026', size: '3.1 MB', hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0' },
        'Charge sheets': { name: `Final_Charge_Sheet_${caseId}.pdf`, date: '09 Sep 2026', size: '5.2 MB', hash: 'b9434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327bb5' },
        'Evidence records': { name: `Evidence_Custody_Log_${caseId}.pdf`, date: '09 Sep 2026', size: '4.5 MB', hash: '7c9e6679b47401d67764f6480b801f489637c269bf96d91b2925b0f732b01f6f' },
        'Forensic reports': { name: `Forensic_Lab_Report_${caseId}.pdf`, date: '08 Sep 2026', size: '3.8 MB', hash: '98434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327cc6' },
      });
    } else {
      setCategoryDocs({
        'FIRs': { name: `FIR_${caseId}_Certified_Copy.pdf`, date: '12 Sep 2026', size: '2.4 MB', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
        'Investigation records': { name: `Investigation_Docket_${caseId}.pdf`, date: '11 Sep 2026', size: '1.8 MB', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
        'Witness statements': { name: `Witness_Deposition_${caseId}.pdf`, date: '10 Sep 2026', size: '3.1 MB', hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0' },
        'Charge sheets': null,
        'Evidence records': { name: `Evidence_Custody_Log_${caseId}.pdf`, date: '09 Sep 2026', size: '4.5 MB', hash: '7c9e6679b47401d67764f6480b801f489637c269bf96d91b2925b0f732b01f6f' },
        'Forensic reports': null,
      });
    }
  }, [caseId, isClosed]);

  const [viewingDocModal, setViewingDocModal] = useState(null);
  const [notif, setNotif] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const categories = [
    { id: 'FIRs', label: 'FIRs', desc: 'First Information Reports & FIR copies' },
    { id: 'Investigation records', label: 'Investigation records', desc: 'Case dockets, logs & officer notes' },
    { id: 'Witness statements', label: 'Witness statements', desc: 'Depositions, audio transcripts & statements' },
    { id: 'Charge sheets', label: 'Charge sheets', desc: 'Draft & submitted final charge sheets' },
    { id: 'Evidence records', label: 'Evidence records', desc: 'Physical evidence photos, hashes & custody logs' },
    { id: 'Forensic reports', label: 'Forensic reports', desc: 'Lab analysis, cyber forensics & DNA reports' },
  ];

  const handleUploadClick = (catId, e) => {
    e.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.png,.jpg';
    input.onchange = (evt) => {
      const file = evt.target.files?.[0];
      if (file) {
        const fileObj = {
          name: file.name,
          date: '12 Sep 2026',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          hash: '9a3f7c11b288c949afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        };
        setCategoryDocs(prev => ({
          ...prev,
          [catId]: fileObj
        }));
        setNotif({
          isOpen: true,
          title: 'Document Uploaded',
          message: `${file.name} uploaded successfully under ${catId}! VIEW button is now ENABLED.`,
          type: 'success'
        });
      }
    };
    input.click();
  };

  return (
    <div>
      {/* In-app Notification Modal */}
      <NotificationModal
        isOpen={notif.isOpen}
        onClose={() => setNotif(prev => ({ ...prev, isOpen: false }))}
        title={notif.title}
        message={notif.message}
        type={notif.type}
      />

      {/* Document Vault Viewer Modal */}
      {viewingDocModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#ffffff', border: '2px solid #1A1A1A', borderRadius: 8, width: '100%', maxWidth: 540, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)', overflow: 'hidden' }}>
            <div style={{ background: '#1A1A1A', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--accent-gold)' }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Government Law Enforcement Vault</div>
                <div style={{ fontSize: 16, color: '#ffffff', fontWeight: 700, margin: 0 }}>{viewingDocModal.category} Document Viewer</div>
              </div>
              <button onClick={() => setViewingDocModal(null)} style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: 18, cursor: 'pointer', fontWeight: 700 }}>✕</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', fontWeight: 700, marginBottom: 4 }}>Certified Ingested Document</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 10 }}>{viewingDocModal.name}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
                  <div><span style={{ color: '#64748b' }}>File Size:</span> <strong>{viewingDocModal.size}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Ingestion Date:</span> <strong>{viewingDocModal.date}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Case Reference:</span> <strong>{caseId}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Security Level:</span> <span style={{ color: '#15803d', fontWeight: 700 }}>RESTRICTED AUDITED</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button className="btn-secondary" onClick={() => setViewingDocModal(null)} style={{ fontSize: 12 }}>Close</button>
                <button className="btn-primary" onClick={() => { setNotif({ isOpen: true, title: 'Download Triggered', message: `Downloading ${viewingDocModal.name}...`, type: 'success' }); setViewingDocModal(null); }} style={{ fontSize: 12, background: '#1A1A1A', border: '1px solid var(--accent-gold)' }}>Download File</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Official Case Docket Details</h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>Case Reference {caseId} · {caseData.title}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {onNav && (
            <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => onNav('dashboard')}>
              ← BACK TO DASHBOARD
            </button>
          )}
        </div>
      </div>

      {/* Case Meta Data & Particulars Card (All fields collected during case creation) */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-card-header">Case Meta Data & Particulars</div>
        <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Row 1: Case Reference ID & Crime Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>Case Reference ID</div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{caseId}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>Crime Category</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{caseData.category}</div>
            </div>
          </div>

          {/* Row 2: Investigation Officer & Case Title */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>Investigation Officer</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{matchedCase ? `${matchedCase.officer} (${matchedCase.division})` : 'Inspector Sharma'}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>Case Title / Investigation Title</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{caseData.title}</div>
            </div>
          </div>

          {/* Row 3: Suspect Name, Victim Name, Witness Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>Suspect Name</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{caseData.suspect || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>Victim Name</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{caseData.victim || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>Witness Details</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{caseData.witness || 'N/A'}</div>
            </div>
          </div>

          {/* Row 4: Incident Date, Time & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>Incident Date</div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{caseData.incidentDate}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>Incident Time</div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>{caseData.incidentTime}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>Incident Location</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{caseData.location}</div>
            </div>
          </div>

          {/* Row 5: Brief Incident Summary & Initial FIR Statement (MY CASES ONLY) */}
          {isMyCase && (
            <div>
              <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>Brief Incident Summary & Initial FIR Statement</div>
              <div style={{ fontSize: 13, color: 'var(--color-ink)', background: '#f8fafc', padding: '12px 14px', borderRadius: 4, border: '1px solid #cbd5e1', lineHeight: 1.5 }}>
                {caseData.description}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 6 Document Category Selection Cards Grid (ONLY FOR MY CASES) */}
      {isMyCase && (
        <div className="section-card" style={{ marginBottom: 20 }}>
          <div className="section-card-header">Associated Case Documents & Evidence Categories ({caseId})</div>
          <div className="section-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
              {categories.map(cat => {
                const isActive = selectedCategory === cat.id;
                const docInfo = categoryDocs[cat.id];
                const hasDoc = !!docInfo;

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      border: isActive ? '2px solid var(--accent-gold)' : '1px solid #cbd5e1',
                      borderLeft: '4px solid var(--accent-gold)',
                      background: '#ffffff',
                      backgroundColor: '#ffffff',
                      borderRadius: 6,
                      padding: '14px',
                      boxShadow: isActive ? '0 4px 12px rgba(184, 134, 11, 0.22)' : '0 2px 4px rgba(0, 0, 0, 0.04)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 12
                    }}
                  >
                    {/* Top Portion: Title, Description & Active Badge */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div style={{ fontSize: 13, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-ink)', fontWeight: 700 }}>
                          {cat.label}
                        </div>
                        {isActive && (
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', textTransform: 'uppercase' }}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, lineHeight: 1.3 }}>
                        {cat.desc}
                      </div>

                      {/* Attached file status label */}
                      {hasDoc ? (
                        <div style={{ fontSize: 10, color: '#15803d', fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span>✓</span> {docInfo.name} ({docInfo.size})
                        </div>
                      ) : (
                        <div style={{ fontSize: 10, color: '#94a3b8', fontStyle: 'italic', marginTop: 6 }}>
                          No document attached
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Row: VIEW button & UPLOAD/REUPLOAD button */}
                    <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                      {/* VIEW BUTTON */}
                      <button
                        disabled={!hasDoc}
                        onClick={() => {
                          if (hasDoc) {
                            setViewingDocModal({ category: cat.label, ...docInfo });
                          }
                        }}
                        style={{
                          flex: 1,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '6px 10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          borderRadius: 4,
                          background: hasDoc ? '#1A1A1A' : '#f1f5f9',
                          color: hasDoc ? '#ffffff' : '#94a3b8',
                          border: hasDoc ? '1px solid var(--accent-gold)' : '1px solid #cbd5e1',
                          cursor: hasDoc ? 'pointer' : 'not-allowed',
                          opacity: hasDoc ? 1 : 0.6,
                          transition: 'all 0.15s'
                        }}
                        title={hasDoc ? `View ${cat.label} document` : `No ${cat.label} document attached`}
                      >
                        VIEW
                      </button>

                      {/* UPLOAD / RE-UPLOAD BUTTON (Only visible to assigned officer if case is NOT Closed) */}
                      {canUpload && (
                        <button
                          onClick={(e) => handleUploadClick(cat.id, e)}
                          style={{
                            flex: 1,
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '6px 10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            borderRadius: 4,
                            background: hasDoc ? '#f8fafc' : 'var(--primary)',
                            color: hasDoc ? '#1e293b' : '#ffffff',
                            border: hasDoc ? '1px solid #cbd5e1' : '1px solid var(--primary)',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          title={hasDoc ? `Re-upload ${cat.label} document` : `Upload ${cat.label} document`}
                        >
                          {hasDoc ? 'RE-UPLOAD' : 'UPLOAD'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-charcoal)' }}>Active Vault Category: </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{selectedCategory}</span>
              </div>
              {isClosed ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '3px 10px', borderRadius: 4, border: '1px solid #cbd5e1' }}>
                  🔒 CASE CLOSED & ARCHIVED (VIEW ONLY ACCESS)
                </span>
              ) : isAssignedOfficer ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '3px 10px', borderRadius: 4, border: '1px solid #86efac' }}>
                  ✓ AUTHORIZED INVESTIGATING OFFICER (FULL EDIT ACCESS)
                </span>
              ) : (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#b91c1c', background: '#fef2f2', padding: '3px 10px', borderRadius: 4, border: '1px solid #fca5a5' }}>
                  🔒 READ ONLY ACCESS (Assigned Officer: {caseOfficer})
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Row: Left Side SAVE DRAFT & COMMIT TO GOVERNMENT VAULT (ONLY FOR MY CASES) */}
      {isMyCase && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button
            className="btn-secondary"
            style={{ fontSize: 13, padding: '8px 18px', fontWeight: 700 }}
            onClick={() => setNotif({ isOpen: true, title: 'Draft Saved', message: `Case docket ${caseId} draft saved successfully.`, type: 'success' })}
          >
            SAVE DRAFT
          </button>
          <button
            className="btn-primary"
            style={{ fontSize: 13, padding: '8px 20px', fontWeight: 700 }}
            onClick={() => setNotif({ isOpen: true, title: 'Case Committed to Government Vault', message: `Case docket ${caseId} has been successfully committed and sealed in the government vault.`, type: 'success' })}
          >
            COMMIT TO GOVERNMENT VAULT
          </button>
        </div>
      )}

    </div>
  );
}

function UploadView({ onBack }) {
  const [selectedCategory, setSelectedCategory] = useState('FIRs');
  const [caseRef, setCaseRef] = useState('C-1023');
  const [dragOver, setDragOver] = useState(false);
  const [notif, setNotif] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'FIR_C1023_Certified_Copy.pdf', category: 'FIRs', caseId: 'C-1023', date: '12 Sep 2026', size: '2.4 MB' },
    { name: 'Forensic_Lab_Hash_Report.pdf', category: 'Forensic reports', caseId: 'C-1031', date: '11 Sep 2026', size: '4.1 MB' },
    { name: 'Witness_Statement_Ramesh.pdf', category: 'Witness statements', caseId: 'C-1018', date: '10 Sep 2026', size: '1.8 MB' },
  ]);

  const categories = [
    { id: 'FIRs', label: 'FIRs', desc: 'First Information Reports & FIR copies' },
    { id: 'Investigation records', label: 'Investigation records', desc: 'Case dockets, logs & officer notes' },
    { id: 'Witness statements', label: 'Witness statements', desc: 'Depositions, audio transcripts & statements' },
    { id: 'Charge sheets', label: 'Charge sheets', desc: 'Draft & submitted final charge sheets' },
    { id: 'Evidence records', label: 'Evidence records', desc: 'Physical evidence photos, hashes & custody logs' },
    { id: 'Forensic reports', label: 'Forensic reports', desc: 'Lab analysis, cyber forensics & DNA reports' },
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer?.files || []);
    if (files.length > 0) {
      const newItems = files.map(f => ({
        name: f.name,
        category: selectedCategory,
        caseId: caseRef,
        date: 'Today',
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`
      }));
      setUploadedFiles(prev => [...newItems, ...prev]);
      setNotif({
        isOpen: true,
        title: 'Document Ingestion Successful',
        message: `${files.length} File(s) uploaded successfully under ${selectedCategory}!`,
        type: 'success'
      });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Secure Document Upload Portal</h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>Upload official case records, witness statements, forensic reports & evidence files to government vault</p>
        </div>
        <button onClick={onBack} className="btn-secondary" style={{ fontSize: 12 }}>← BACK TO DASHBOARD</button>
      </div>

      {/* 6 Category Grid Selection Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {categories.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="stat-card"
              style={{
                border: isActive ? '2px solid var(--accent-gold)' : '1px solid #cbd5e1',
                background: '#ffffff',
                backgroundColor: '#ffffff',
                boxShadow: isActive ? '0 4px 12px rgba(184, 134, 11, 0.25)' : '0 2px 4px rgba(0, 0, 0, 0.04)',
                cursor: 'pointer',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-ink)', fontWeight: 700, marginBottom: 4 }}>
                    {cat.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 500 }}>
                    {cat.desc}
                  </div>
                </div>
                <span
                  className={`badge ${isActive ? 'badge-active' : 'badge-done'}`}
                  style={{ fontSize: 10, padding: '4px 10px', marginLeft: 8, flexShrink: 0 }}
                >
                  {isActive ? 'ACTIVE' : 'SELECT'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
        {/* Document Classification & Upload Form */}
        <div className="section-card">
          <div className="section-card-header">Upload Parameters — {selectedCategory}</div>
          <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Selected Document Category *</label>
              <select className="field-input" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Associated Case Reference ID *</label>
              <select className="field-input" value={caseRef} onChange={e => setCaseRef(e.target.value)}>
                {myCases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.title} ({c.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Document Title / Description *</label>
              <input className="field-input" type="text" placeholder={`${selectedCategory} - Reference File`} />
            </div>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div className="section-card">
          <div className="section-card-header">File Attachment Box ({selectedCategory})</div>
          <div className="section-card-body">
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFileUpload(e); }}
              style={{
                border: `2px dashed ${dragOver ? 'var(--primary)' : '#cbd5e1'}`,
                borderRadius: 8, padding: '36px 20px', textAlign: 'center',
                background: dragOver ? '#eff6ff' : '#f8fafc',
                transition: 'all 0.2s', cursor: 'pointer',
              }}>
              <div style={{ fontWeight: 700, marginBottom: 6, color: 'var(--color-ink)', fontSize: 14 }}>
                Drag & Drop {selectedCategory} file here
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-charcoal)', marginBottom: 14 }}>
                Supports PDF, DOCX, PNG, JPG, ZIP (Max 50MB)
              </div>
              <label style={{ cursor: 'pointer', display: 'inline-block' }}>
                <input type="file" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                <span className="btn-primary" style={{ display: 'inline-block', fontSize: 12 }}>
                  SELECT FILE FROM COMPUTER
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="section-card">
        <div className="section-card-header">Uploaded Case Document Vault ({uploadedFiles.length} Records)</div>
        <table className="data-table">
          <thead>
            <tr><th>Document Name</th><th>Category</th><th>Case ID</th><th>Size</th><th>Date Uploaded</th><th>Status</th></tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{file.name}</td>
                <td><span className="badge badge-done">{file.category}</span></td>
                <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{file.caseId}</td>
                <td className="mono" style={{ fontSize: 11, color: 'var(--color-charcoal)' }}>{file.size}</td>
                <td className="mono" style={{ fontSize: 12, color: '#000000', fontWeight: 700 }}>{file.date}</td>
                <td><span className="badge badge-active">ENCRYPTED VAULT</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => setNotif({
              isOpen: true,
              title: 'Draft Saved Successfully',
              message: 'Document upload progress saved to local draft storage.',
              type: 'success'
            })}
            className="btn-secondary"
          >
            SAVE DRAFT
          </button>
          <button
            onClick={() => setNotif({
              isOpen: true,
              title: 'Vault Commitment Notice',
              message: 'All uploaded case documents have been securely committed to the government vault.',
              type: 'success'
            })}
            className="btn-primary"
          >
            COMMIT ALL TO GOVERNMENT VAULT
          </button>
        </div>
        <button onClick={onBack} className="btn-secondary">CANCEL</button>
      </div>

      <NotificationModal
        isOpen={notif.isOpen}
        onClose={() => setNotif({ ...notif, isOpen: false })}
        title={notif.title}
        message={notif.message}
        type={notif.type}
      />
    </div>
  );
}

function PlaceholderView({ title }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, color: 'var(--color-body)' }}>
      <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px', color: 'var(--color-ink)' }}>{title}</h3>
      <p style={{ fontSize: 13 }}>This module is active in the official deployment.</p>
    </div>
  );
}

function CreateCaseView({ onCreated, onNav }) {
  const [autoCaseId] = useState(() => `C-${Math.floor(1000 + Math.random() * 9000)}`);
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [notif, setNotif] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  
  const [formData, setFormData] = useState({
    title: '',
    officer: 'Inspector Sharma',
    category: 'Theft / Burglary',
    suspect: '',
    victim: '',
    witness: '',
    location: '',
    incidentDate: '2026-09-12',
    incidentTime: '18:30',
    description: ''
  });

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files.map(f => f.name)]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotif({
      isOpen: true,
      title: 'Case Registration Successful',
      message: `New FIR / Investigation Case Registered Successfully!\n\nAuto-Generated Case ID: ${autoCaseId}\nAttached Documents: ${attachedFiles.length > 0 ? attachedFiles.join(', ') : 'None'}`,
      type: 'success'
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Create New Investigation Case (FIR)</h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>Official Case Registration & Initial FIR Docket Ingestion</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {onNav && (
            <button type="button" onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
              ← BACK TO DASHBOARD
            </button>
          )}
          <div style={{ background: '#1A1A1A', border: '1px solid var(--accent-gold)', borderRadius: 6, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--accent-gold)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>CASE ID:</span>
            <span className="mono" style={{ fontSize: 14, color: '#ffffff', fontWeight: 700 }}>{autoCaseId}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="section-card" style={{ marginBottom: 20 }}>
          <div className="section-card-header">Case Meta Data & Particulars</div>
          <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Auto-Generated Case ID & Crime Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Case ID (Auto-Generated) *</label>
                <input readOnly className="field-input mono" type="text" value={autoCaseId} style={{ background: '#f8fafc', fontWeight: 700, color: 'var(--primary)', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Crime Category *</label>
                <select className="field-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  <option>Theft / Burglary</option>
                  <option>Banking Fraud</option>
                  <option>Phishing / Cybercrime</option>
                  <option>Physical Assault</option>
                  <option>Homicide Investigation</option>
                </select>
              </div>
            </div>

            {/* Investigation Officer & Case Title (Side-by-Side) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Investigation Officer *</label>
                <input required className="field-input" type="text" value={formData.officer} onChange={e => setFormData({ ...formData, officer: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Case Title / Investigation Title *</label>
                <input required className="field-input" type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
            </div>

            {/* Suspect, Victim, Witness (Optional) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Suspect Name (Optional)</label>
                <input className="field-input" type="text" value={formData.suspect} onChange={e => setFormData({ ...formData, suspect: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Victim Name (Optional)</label>
                <input className="field-input" type="text" value={formData.victim} onChange={e => setFormData({ ...formData, victim: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Witness Details (Optional)</label>
                <input className="field-input" type="text" value={formData.witness} onChange={e => setFormData({ ...formData, witness: e.target.value })} />
              </div>
            </div>

            {/* Incident Date, Time & Location (Separate Date & Time Boxes) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Incident Date *</label>
                <input required className="field-input" type="date" value={formData.incidentDate || '2026-09-12'} onChange={e => setFormData({ ...formData, incidentDate: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Incident Time *</label>
                <input required className="field-input" type="time" value={formData.incidentTime || '18:30'} onChange={e => setFormData({ ...formData, incidentTime: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Incident Location *</label>
                <input required className="field-input" type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              </div>
            </div>

            {/* FIR Summary */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>Brief Incident Summary & Initial FIR Statement *</label>
              <textarea required className="field-input" rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ resize: 'vertical' }} />
            </div>

            {/* Attached files preview */}
            {attachedFiles.length > 0 && (
              <div style={{ padding: '10px 14px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6 }}>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-ink)', marginBottom: 6 }}>
                  Attached Documents ({attachedFiles.length}):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {attachedFiles.map((fn, idx) => (
                    <span key={idx} className="badge badge-done" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}>
                      {fn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Documents Drawer / Dialog inline toggle */}
        {showDocUpload && (
          <div className="section-card" style={{ marginBottom: 20, border: '2px dashed var(--accent-gold)' }}>
            <div className="section-card-header" style={{ background: '#fefce8' }}>
              Upload Official Case Documents & Evidence Files
            </div>
            <div className="section-card-body" style={{ textAlign: 'center', padding: '24px 20px' }}>
              <label style={{ cursor: 'pointer', display: 'inline-block' }}>
                <input type="file" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                <span className="btn-secondary" style={{ display: 'inline-block', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                  SELECT FILES TO ATTACH (PDF / IMG / DOC)
                </span>
              </label>
              <div style={{ fontSize: 12, color: 'var(--color-body)', marginTop: 8 }}>
                Select official FIR copies, witness statements, or forensic photos to link with case {autoCaseId}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left side: UPLOAD DOCUMENTS + REGISTER NEW CASE buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button type="button" onClick={() => onNav('upload')} className="btn-secondary" style={{ background: '#f8fafc', borderColor: '#cbd5e1', color: '#1A1A1A', fontWeight: 700 }}>
              UPLOAD DOCUMENTS
            </button>

            <button type="submit" className="btn-primary">REGISTER NEW CASE (FIR)</button>
          </div>

          {/* Right side: CANCEL button */}
          <button type="button" onClick={onCreated} className="btn-secondary">CANCEL</button>
        </div>
      </form>

      <NotificationModal
        isOpen={notif.isOpen}
        onClose={() => {
          setNotif({ ...notif, isOpen: false });
          onCreated();
        }}
        title={notif.title}
        message={notif.message}
        type={notif.type}
      />
    </div>
  );
}

function MyActivityView({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter activities strictly for cases assigned to this officer (myCases: C-1023, C-1031, C-1018, C-1009)
  const assignedCaseIds = myCases.map(c => c.id);
  const myAssignedActivities = officerActivities.filter(a => assignedCaseIds.includes(a.id));

  const filtered = myAssignedActivities.filter(a =>
    a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Officer Activity Log & Audit Trail</h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>Comprehensive Logged Actions strictly for Inspector Sharma's assigned cases ({assignedCaseIds.join(', ')})</p>
        </div>
        <button onClick={onBack} className="btn-secondary" style={{ fontSize: 12 }}>← BACK TO DASHBOARD</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ position: 'relative', width: 320 }}>
          <input
            className="field-input"
            type="text"
            placeholder="Search activity by Case ID or action..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-charcoal)', fontWeight: 600 }}>
          Showing {filtered.length} My Assigned Cases Activity Records
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-header">System Activity Trail (My Cases Only)</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Case Reference</th>
              <th>Action Performed</th>
              <th>System Module</th>
              <th>Timestamp</th>
              <th>Audit Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{r.id}</td>
                <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{r.action}</td>
                <td><span className="badge badge-done">{r.module}</span></td>
                <td className="mono" style={{ fontSize: 12, color: '#000000', fontWeight: 700 }}>{r.time}</td>
                <td><span className="badge badge-active">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfileView({ onBack }) {
  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Official Officer Profile & Service Record</h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>Law Enforcement Personnel Dossier · Ministry of Justice & Legal Affairs</p>
        </div>
        <button onClick={onBack} className="btn-secondary" style={{ fontSize: 12 }}>← BACK TO DASHBOARD</button>
      </div>

      {/* Main Grid: Left Column (Photo & Quick Stats) + Right Column (Detailed Particulars) */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        
        {/* Left Column: Photo Card & Quick Service Metrics */}
        <div>
          <div className="section-card" style={{ marginBottom: 18 }}>
            <div className="section-card-header">Officer Identity</div>
            <div className="section-card-body" style={{ textAlign: 'center', padding: '20px 16px' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
                <img
                  src="/officer_portrait.jpg"
                  alt="Officer Portrait"
                  style={{
                    width: 170,
                    height: 190,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '2px solid var(--accent-gold)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                  }}
                />
                <span className="badge badge-active" style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
                  ACTIVE DUTY
                </span>
              </div>

              <div style={{ marginTop: 12, fontSize: 18, fontWeight: 700, color: 'var(--color-ink)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}>
                Sharma K.
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: 10 }}>
                Badge ID: POL-78429-IND · Rank: Inspector of Police
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-body)', background: '#f8fafc', padding: '6px 10px', borderRadius: 4, border: '1px solid #cbd5e1', fontWeight: 600 }}>
                Central Cyber Crime & Special Investigation Division
              </div>
            </div>
          </div>

          {/* Quick Experience Metrics */}
          <div className="section-card">
            <div className="section-card-header">Service Summary Metrics</div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Total Experience</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', fontFamily: 'JetBrains Mono, monospace' }}>14 Years</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Cases Solved & Closed</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#15803d', fontFamily: 'JetBrains Mono, monospace' }}>428 Cases</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Judicial Conviction Rate</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-gold)', fontFamily: 'JetBrains Mono, monospace' }}>98.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Particulars (Personal, Posting, Past Stations, Certifications) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          
          {/* Personal Particulars */}
          <div className="section-card">
            <div className="section-card-header">Personal & Medical Particulars</div>
            <div className="section-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'Full Name', value: 'Sharma K.' },
                  { label: 'Position / Rank', value: 'Inspector of Police (Class-I)' },
                  { label: 'Date of Birth (DOB)', value: '14 August 1985' },
                  { label: 'Current Age', value: '41 Years' },
                  { label: 'Blood Group', value: 'O+ Positive' },
                  { label: 'Gender', value: 'Male' },
                  { label: 'Government Email', value: 'sharma.police@gov.in' },
                  { label: 'Official Mobile / Contact', value: '+91 98765 43210' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Working Station & Posting */}
          <div className="section-card">
            <div className="section-card-header">Current Station & Location Particulars</div>
            <div className="section-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {[
                  { label: 'Current Working Station', value: 'Central Cyber Crime & Special Investigation Police Station' },
                  { label: 'Station Physical Location & Address', value: 'District Police Complex, Ring Road, Sector-5, City Metro (Pincode: 600001)' },
                  { label: 'Station Jurisdiction / Zone', value: 'Zone-4 Metropolitan Headquarters' },
                  { label: 'Date of Current Posting', value: '15 January 2024 (2 Years 8 Months at Station)' },
                  { label: 'Reporting Authority Officer', value: 'DCP Crime Division (Shri A. K. Varma, IPS)' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Past Working Stations History */}
          <div className="section-card">
            <div className="section-card-header">Past Working Stations & Transfer History</div>
            <div className="section-card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Station Name</th>
                    <th>Station Area / Location</th>
                    <th>Designation / Post</th>
                    <th>Tenure Period</th>
                    <th>Key Accomplishment</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { station: 'North Town Police Station', area: 'Pollachi', role: 'Inspector in Charge', tenure: '2021 – 2024 (3 Years)', detail: 'Led organized theft & burglary taskforce' },
                    { station: 'Metro Crime Branch Division 4', area: 'Coimbatore', role: 'Sub-Inspector', tenure: '2017 – 2021 (4 Years)', detail: 'Handled high-value financial fraud cases' },
                    { station: 'Special Task Force (STF Anti-Fraud Wing)', area: 'Tirupur', role: 'Sub-Inspector', tenure: '2012 – 2017 (5 Years)', detail: 'Digital cyber surveillance & vault hashing' },
                    { station: 'Central Police Academy', area: 'Erode', role: 'Trainee Officer', tenure: '2010 – 2012 (2 Years)', detail: 'Gold medalist in Forensic Cyber Analysis' },
                  ].map((h, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 700, color: 'var(--color-ink)' }}>{h.station}</td>
                      <td style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-charcoal)' }}>{h.area}</td>
                      <td><span className="badge badge-done">{h.role}</span></td>
                      <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{h.tenure}</td>
                      <td style={{ fontSize: 12, color: 'var(--color-charcoal)' }}>{h.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function AllCasesView({ onSelect, onNav }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredCases = allOfficersCases.filter(c => {
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
              <option value="Narcotics">Narcotics</option>
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
              <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => onSelect && onSelect(c.id)}>
                <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{c.id}</td>
                <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{c.title}</td>
                <td>{c.type}</td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: 13 }}>{c.officer}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-charcoal)' }}>{c.division}</div>
                </td>
                <td><span className={`badge ${c.status === 'Active' ? 'badge-active' : c.status === 'Pending' ? 'badge-pending' : 'badge-done'}`}>{c.status}</span></td>
                <td className="mono" style={{ fontSize: 12, color: '#000000', fontWeight: 700 }}>{c.updated}</td>
                <td><button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 11 }}>Open Case</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VersionHistoryView({ onSelectCase, onNav }) {
  const [selectedCaseId, setSelectedCaseId] = useState('C-1023');
  const [notif, setNotif] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const assignedCases = myCases; // Strictly cases handled by logged-in officer (Inspector Sharma)

  const auditTrailData = {
    'C-1023': {
      title: 'XYZ Investigation',
      type: 'Theft / Burglary',
      status: 'Active',
      updated: '12 Sep 2026',
      totalVersions: 5,
      history: [
        { version: 'v2.4', time: '12 Sep 2026, 10:32 AM', module: 'FIR Ingestion Vault', action: 'Uploaded Certified FIR Document FIR_C1023_Certified_Copy.pdf (2.4 MB)', officer: 'Inspector Sharma', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', status: 'VERIFIED AUDITED' },
        { version: 'v2.3', time: '11 Sep 2026, 04:15 PM', module: 'Legal Findings', action: 'Updated Incident Particulars & Accused Identification (Raj Kumar)', officer: 'Inspector Sharma', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', status: 'VERIFIED' },
        { version: 'v2.2', time: '11 Sep 2026, 11:20 AM', module: 'Evidence Records', action: 'Tagged CCTV Footage & Property Recovery Custody Log', officer: 'Inspector Sharma', hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0', status: 'ENCRYPTED' },
        { version: 'v2.1', time: '10 Sep 2026, 02:40 PM', module: 'Case Ingestion', action: 'Witness Statement Ingested from Shopkeeper Ramesh & Security Guard', officer: 'Inspector Sharma', hash: '7c9e6679b47401d67764f6480b801f489637c269bf96d91b2925b0f732b01f6f', status: 'VERIFIED' },
        { version: 'v1.0', time: '09 Sep 2026, 09:15 AM', module: 'Central Registry', action: 'Initial Case Docket Registration under Section 379 IPC', officer: 'Inspector Sharma', hash: '98434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327cc6', status: 'AUDITED' },
      ]
    },
    'C-1031': {
      title: 'Financial Fraud Case',
      type: 'Banking Fraud',
      status: 'Active',
      updated: '11 Sep 2026',
      totalVersions: 4,
      history: [
        { version: 'v3.1', time: '12 Sep 2026, 09:55 AM', module: 'Evidence Vault', action: 'Forensic Evidence Hash Tagged for Banking Electronic Fund Transfer Logs', officer: 'Inspector Sharma', hash: 'f2a1b3c4d5e67890123456789abcdef0123456789abcdef0123456789abcdef0', status: 'VERIFIED AUDITED' },
        { version: 'v3.0', time: '11 Sep 2026, 03:50 PM', module: 'Legal Section', action: 'Prosecutor Review Requested for Bank Transfer Docket', officer: 'Inspector Sharma', hash: '6b5c4d3e2f1a0987654321fedcba0987654321fedcba0987654321fedcba0987', status: 'VERIFIED' },
        { version: 'v2.0', time: '10 Sep 2026, 01:10 PM', module: 'Investigation Records', action: 'Account Freeze Order Ingested for City Bank Co-operative Branch', officer: 'Inspector Sharma', hash: '3e2f1a0987654321fedcba0987654321fedcba0987654321fedcba0987654321', status: 'AUDITED' },
        { version: 'v1.0', time: '08 Sep 2026, 10:00 AM', module: 'FIR Ingestion', action: 'Initial Complaint Docket Ingested for Unauthorized Fund Transfer', officer: 'Inspector Sharma', hash: '1a0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedc', status: 'AUDITED' },
      ]
    },
    'C-1018': {
      title: 'Cybercrime Incident',
      type: 'Phishing',
      status: 'Pending',
      updated: '10 Sep 2026',
      totalVersions: 3,
      history: [
        { version: 'v2.0', time: '12 Sep 2026, 09:20 AM', module: 'Legal Section', action: 'Draft Charge Sheet Saved for Phishing Syndicate Case', officer: 'Inspector Sharma', hash: '0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba', status: 'VERIFIED' },
        { version: 'v1.5', time: '11 Sep 2026, 05:00 PM', module: 'Forensic Reports', action: 'Server Domain Freeze Report Attached by Cyber Forensic Team', officer: 'Inspector Sharma', hash: '87654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba09', status: 'VERIFIED AUDITED' },
        { version: 'v1.0', time: '10 Sep 2026, 11:00 AM', module: 'Central Registry', action: 'Cybercrime Complaint Ingested (14 Citizen Complaints)', officer: 'Inspector Sharma', hash: '7654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba098', status: 'AUDITED' },
      ]
    },
    'C-1009': {
      title: 'Assault Complaint',
      type: 'Physical Assault',
      status: 'Closed',
      updated: '08 Sep 2026',
      totalVersions: 3,
      history: [
        { version: 'v2.0', time: '10 Sep 2026, 02:40 PM', module: 'Vault Security', action: 'Digital Signature Verified & Case Finalized Closed Archived', officer: 'Inspector Sharma', hash: '654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987', status: 'ENCRYPTED ARCHIVED' },
        { version: 'v1.2', time: '09 Sep 2026, 06:15 PM', module: 'Forensic Reports', action: 'Hospital Medical Examination Report Attached', officer: 'Inspector Sharma', hash: '54321fedcba0987654321fedcba0987654321fedcba0987654321fedcba09876', status: 'VERIFIED' },
        { version: 'v1.0', time: '08 Sep 2026, 09:45 PM', module: 'FIR Ingestion', action: 'Initial Assault Complaint Registered at Bus Stand Complex Station', officer: 'Inspector Sharma', hash: '4321fedcba0987654321fedcba0987654321fedcba0987654321fedcba098765', status: 'AUDITED' },
      ]
    }
  };

  const selectedCaseData = auditTrailData[selectedCaseId] || auditTrailData['C-1023'];

  return (
    <div>
      <NotificationModal
        isOpen={notif.isOpen}
        onClose={() => setNotif(prev => ({ ...prev, isOpen: false }))}
        title={notif.title}
        message={notif.message}
        type={notif.type}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Case Version History & Audit Trail</h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>Comprehensive Chronological Version Logs for Inspector Sharma's Assigned Cases</p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      {/* Security Access Control Banner */}
      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid var(--accent-gold)', borderRadius: 6, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>🛡️</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-ink)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Authorized Officer Audit Registry</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Showing audit trails strictly for cases assigned to <strong>Inspector Sharma</strong></div>
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '3px 10px', borderRadius: 4, textTransform: 'uppercase' }}>
          AUTHENTICATED OFFICER
        </span>
      </div>

      {/* Case Selector Cards Bar */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-card-header">Select Assigned Case to View Version Audit Trail</div>
        <div className="section-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {assignedCases.map(c => {
              const isSelected = selectedCaseId === c.id;
              const caseAudit = auditTrailData[c.id];
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  style={{
                    border: isSelected ? '2px solid var(--accent-gold)' : '1px solid #cbd5e1',
                    borderLeft: '4px solid var(--accent-gold)',
                    background: isSelected ? '#ffffff' : '#f8fafc',
                    borderRadius: 6,
                    padding: '12px 14px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(184, 134, 11, 0.2)' : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{c.id}</span>
                    <span className={`badge ${c.status === 'Active' ? 'badge-active' : c.status === 'Pending' ? 'badge-pending' : 'badge-done'}`} style={{ fontSize: 9 }}>{c.status}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{caseAudit ? `${caseAudit.history.length} Audit Revisions` : 'Audit Logged'}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Audit Trail Timeline for Selected Case */}
      <div className="section-card">
        <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span>Audit Trail & Version History: <strong style={{ color: 'var(--primary)' }}>{selectedCaseId}</strong> ({selectedCaseData.title})</span>
          </div>
          <button className="btn-secondary" onClick={() => onSelectCase(selectedCaseId)} style={{ fontSize: 11, padding: '4px 12px' }}>
            Open Docket Details →
          </button>
        </div>
        <div className="section-card-body" style={{ padding: 20 }}>

          {/* Audit History Timeline Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {selectedCaseData.history.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderLeft: '4px solid var(--accent-gold)',
                  borderRadius: 6,
                  padding: '16px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ flex: 1, paddingRight: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, background: '#1A1A1A', color: '#ffffff', border: '1px solid var(--accent-gold)', padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
                      {item.version}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase' }}>
                      {item.module}
                    </span>
                    <span className="mono" style={{ fontSize: 11, color: '#64748b' }}>
                      • {item.time}
                    </span>
                  </div>

                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 8, lineHeight: 1.4 }}>
                    {item.action}
                  </div>

                  <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#64748b', flexWrap: 'wrap' }}>
                    <div>Officer: <strong style={{ color: 'var(--color-ink)' }}>{item.officer}</strong></div>
                    <div>Integrity Hash: <code style={{ fontSize: 10, background: '#f1f5f9', padding: '1px 6px', borderRadius: 3 }}>{item.hash.substring(0, 16)}...</code></div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                    {item.status}
                  </span>
                  <button
                    className="btn-secondary"
                    onClick={() => setNotif({ isOpen: true, title: 'Version Diff Inspection', message: `Comparing version ${item.version} against current master docket for case ${selectedCaseId}...`, type: 'success' })}
                    style={{ fontSize: 11, padding: '4px 10px' }}
                  >
                    Inspect Diff
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

function AlertsView({ alertsList, setAlertsList, onSelectCase, onNav }) {
  const [filter, setFilter] = useState('ALL');
  const [notifModal, setNotifModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const markAsRead = (id) => {
    setAlertsList(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    setNotifModal({ isOpen: true, title: 'Notification Updated', message: `Alert ${id} marked as read.`, type: 'success' });
  };

  const markAllRead = () => {
    setAlertsList(prev => prev.map(a => ({ ...a, read: true })));
    setNotifModal({ isOpen: true, title: 'Notifications Cleared', message: 'All action alerts marked as read.', type: 'success' });
  };

  const filteredAlerts = alertsList.filter(a => {
    if (filter === 'ALL') return true;
    if (filter === 'UNREAD') return !a.read;
    return a.category === filter;
  });

  const unreadCount = alertsList.filter(a => !a.read).length;

  return (
    <div>
      <NotificationModal
        isOpen={notifModal.isOpen}
        onClose={() => setNotifModal(prev => ({ ...prev, isOpen: false }))}
        title={notifModal.title}
        message={notifModal.message}
        type={notifModal.type}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            System Alerts & Officer Notifications
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Real-Time Action Items, Prosecutor Feedback & Government Vault Verification Logs for Inspector Sharma
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {onNav && (
            <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
              ← BACK TO DASHBOARD
            </button>
          )}
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-secondary" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              ✓ MARK ALL AS READ ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-gold)' }}>
          <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>Total Alerts</div>
          <div style={{ fontSize: 28, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--color-ink)' }}>{alertsList.length}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>Unread Alerts</div>
          <div style={{ fontSize: 28, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#b45309' }}>{unreadCount}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>Vault Confirmations</div>
          <div style={{ fontSize: 28, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#15803d' }}>1</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>Officer Assigned</div>
          <div style={{ fontSize: 15, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--color-ink)', textTransform: 'uppercase', marginTop: 8 }}>Inspector Sharma</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
        {[
          { key: 'ALL', label: `ALL NOTIFICATIONS (${alertsList.length})` },
          { key: 'UNREAD', label: `UNREAD (${unreadCount})` },
          { key: 'URGENT', label: 'URGENT ACTION' },
          { key: 'VAULT', label: 'VAULT LOGS' },
          { key: 'SYSTEM', label: 'SYSTEM NOTICES' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            style={{
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'Oswald, sans-serif',
              letterSpacing: '0.05em',
              borderRadius: 4,
              border: filter === t.key ? '1px solid var(--accent-gold)' : '1px solid #cbd5e1',
              background: filter === t.key ? '#1A1A1A' : '#ffffff',
              color: filter === t.key ? '#ffffff' : '#334155',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="section-card">
        <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Active Notifications Docket</span>
          <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'none', color: '#64748b' }}>Showing {filteredAlerts.length} items</span>
        </div>
        <div className="section-card-body" style={{ padding: 0 }}>
          {filteredAlerts.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
              No notifications found for this category.
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border)',
                  background: alert.read ? '#ffffff' : '#f8fafc',
                  borderLeft: alert.read ? '4px solid transparent' : '4px solid var(--accent-gold)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 16,
                  transition: 'background 0.15s'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span
                      onClick={() => onSelectCase(alert.caseId)}
                      style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                      className="mono"
                    >
                      {alert.caseId}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-ink)' }}>
                      • {alert.caseTitle}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        background: alert.badgeBg,
                        color: alert.badgeColor,
                        border: `1px solid ${alert.badgeBorder}`,
                        padding: '2px 8px',
                        borderRadius: 4,
                        textTransform: 'uppercase'
                      }}
                    >
                      {alert.priority}
                    </span>
                    {!alert.read && (
                      <span style={{ fontSize: 9, fontWeight: 800, background: '#ef4444', color: '#ffffff', padding: '1px 6px', borderRadius: 3, textTransform: 'uppercase' }}>
                        NEW
                      </span>
                    )}
                    <span className="mono" style={{ fontSize: 11, color: '#64748b', marginLeft: 'auto' }}>
                      {alert.time}
                    </span>
                  </div>

                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 4 }}>
                    {alert.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-charcoal)', lineHeight: 1.4 }}>
                    {alert.message}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
                  <button
                    className="btn-primary"
                    style={{ fontSize: 11, padding: '5px 12px' }}
                    onClick={() => onSelectCase(alert.caseId)}
                  >
                    OPEN CASE {alert.caseId}
                  </button>

                  {!alert.read && (
                    <button
                      className="btn-secondary"
                      style={{ fontSize: 11, padding: '4px 10px', background: '#ffffff', borderColor: '#cbd5e1' }}
                      onClick={() => markAsRead(alert.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


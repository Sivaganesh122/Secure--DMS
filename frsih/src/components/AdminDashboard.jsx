import { useState } from 'react';
import Layout from './shared/Layout';
import NotificationModal from './shared/NotificationModal';

function calculateAgeFromDOB(dobStr) {
  if (!dobStr) return '';
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) {
    const match = dobStr.match(/\d{4}/);
    if (match) {
      const year = parseInt(match[0], 10);
      const age = new Date().getFullYear() - year;
      return age > 0 ? `${age} Years` : '';
    }
    return '';
  }
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age > 0 ? `${age} Years` : '';
}

function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


const securityAlerts = [
  { type: 'Failed Authentication', count: 3, sev: 'warning' },
  { type: 'Access Violation', count: 1, sev: 'error' },
  { type: 'File Hash Warning', count: 2, sev: 'warning' },
  { type: 'Role Permissions Updated', count: 4, sev: 'done' },
];

const recentActivity = [
  { user: 'Sharma K.', posting: 'Inspector of Police (Cyber Crime)', action: 'FIR Document Upload', time: '10:32', status: 'SUCCESS', ok: true },
  { user: 'Anil Verma', posting: 'Senior System Administrator', action: 'Role Policy Updated', time: '10:35', status: 'SUCCESS', ok: true },
  { user: 'Officer Patel', posting: 'Sub-Inspector of Police', action: 'Failed Credentials Entry', time: '10:41', status: 'DENIED', ok: false },
  { user: 'Justice Ramesh', posting: 'Senior Presiding Judge', action: 'Digital Case Bench Review', time: '10:44', status: 'SUCCESS', ok: true },
  { user: 'Rajesh Sharma', posting: 'Senior Public Prosecutor', action: 'Charge Sheet Exported', time: '10:47', status: 'SUCCESS', ok: true },
  { user: 'Inspector K. Varma', posting: 'Crime Branch Division-2', action: 'Forensic Evidence Tagged', time: '10:52', status: 'SUCCESS', ok: true },
];

const initialUsers = [
  { 
    id: 'OFF001', 
    name: 'Sharma K.', 
    role: 'Police', 
    status: 'Active', 
    lastLogin: '10:32 today',
    badgeId: 'POL-78429-IND',
    rank: 'Inspector of Police (Class-I)',
    division: 'Central Cyber Crime & Special Investigation Division',
    dob: '1985-08-14',
    age: '41 Years',
    bloodGroup: 'O+ Positive',
    gender: 'Male',
    email: 'sharma.police@gov.in',
    phone: '+91 98765 43210',
    station: 'Central Cyber Crime Police Station',
    stationAddress: 'District Police Complex, Ring Road, Sector-5, City Metro (Pincode: 600001)',
    jurisdiction: 'Zone-4 Metropolitan Headquarters',
    postingDate: '15 January 2024 (2 Years 8 Months at Station)',
    reportingOfficer: 'DCP Crime Division (Shri A. K. Varma, IPS)',
    experience: '14 Years',
    solvedCases: '428 Cases',
    convictionRate: '98.4%'
  },
  { 
    id: 'ADM002', 
    name: 'Anil Verma', 
    role: 'Admin', 
    status: 'Active', 
    lastLogin: '09:15 today',
    badgeId: 'ADM002-IND',
    rank: 'Senior System Administrator & Chief Security Auditor',
    dob: '1982-08-14',
    age: '44 Years',
    bloodGroup: 'O+ Positive',
    gender: 'Male',
    email: 'admin.verma@justice.gov.in',
    phone: '+91 98112 34567',
    station: 'Central System Governance Headquarters / Metropolitan Cyber Directorate'
  },
  { 
    id: 'PRO003', 
    name: 'Rajesh Sharma', 
    role: 'Prosecutor', 
    status: 'Active', 
    lastLogin: '08:44 today',
    title: 'Senior Public Prosecutor & Chief Legal Counsel',
    barCouncilNo: 'BCI/DEL/2012/84920',
    serviceId: 'PROS-84920-DL',
    dob: '1988-08-18',
    email: 'r.sharma@prosecution.gov.in',
    phone: '+91 98100 45678',
    experience: '14 Years in High Court & Criminal Prosecution',
    courtRoom: 'Court Room 2 - Special Criminal Bench',
    officeAddress: 'Chamber 402, High Court Complex, New Delhi - 110001',
    totalCases: '5',
    successRate: '100%',
    activeTrials: '3',
    verifiedEvidences: '30'
  },
  { 
    id: 'JUD004', 
    name: 'Ramesh', 
    role: 'Judge', 
    status: 'Active', 
    lastLogin: 'Yesterday',
    title: 'Senior Presiding Judge & Additional Sessions Judge',
    benchId: 'BENCH-DEL-2015/094',
    serviceId: 'JUD-84920-DL',
    dob: '1974-05-14',
    email: 'justice.ramesh@highcourt.gov.in',
    phone: '+91 98110 98765',
    experience: '18 Years in High Court & Criminal Judicial Bench',
    courtRoom: 'Court Room 2 - Special Criminal Bench',
    officeAddress: 'Chamber 204, High Court Complex, New Delhi - 110001',
    totalCasesDisposed: '32',
    disposalRate: '98.4%',
    activeProceedings: '18',
    deliveredOrders: '14'
  },
  { 
    id: 'OFF005', 
    name: 'Officer Patel', 
    role: 'Police', 
    status: 'Suspended', 
    lastLogin: '3 days ago', 
    badgeId: 'POL-65102-IND', 
    rank: 'Sub-Inspector of Police', 
    division: 'Financial Fraud Wing',
    station: 'District West Police Station',
    email: 'patel.police@gov.in',
    phone: '+91 98765 11223'
  },
  {
    id: 'OFF006',
    name: 'Inspector Priya M.',
    role: 'Police',
    status: 'Active',
    lastLogin: '11:05 today',
    badgeId: 'POL-90412-IND',
    rank: 'Inspector of Police (Special Task Force)',
    station: 'Metropolitan Anti-Extortion & Cyber Cell',
    email: 'priya.m@police.gov.in',
    phone: '+91 98220 33445'
  },
  {
    id: 'PRO007',
    name: 'Adv. Sunita Deshmukh',
    role: 'Prosecutor',
    status: 'Active',
    lastLogin: '10:12 today',
    title: 'Public Prosecutor (Commercial & Cyber Benches)',
    barCouncilNo: 'BCI/MH/2015/90124',
    serviceId: 'PROS-90124-MH',
    email: 'sunita.d@prosecution.gov.in',
    phone: '+91 98334 55667',
    courtRoom: 'Court Room 1 - Cyber Special Court'
  },
  {
    id: 'JUD008',
    name: 'Justice A. K. Varma',
    role: 'Judge',
    status: 'Active',
    lastLogin: 'Yesterday',
    title: 'Chief Sessions Judge & Judicial Bench Magistrate',
    benchId: 'BENCH-DEL-2010/012',
    serviceId: 'JUD-01294-DL',
    email: 'ak.varma@highcourt.gov.in',
    phone: '+91 98101 22334',
    courtRoom: 'Court Room 1 - Chief Sessions Court'
  },
  {
    id: 'ADM009',
    name: 'Vikramaditya R. Singh',
    role: 'Admin',
    status: 'Active',
    lastLogin: '08:10 today',
    badgeId: 'ADM-SYS-99410',
    rank: 'Chief Security & Cryptographic Auditor',
    station: 'National Cyber Security Directorate - Sector 4',
    email: 'vikram.singh@justice.gov.in',
    phone: '+91 98112 34567'
  },
  {
    id: 'OFF010',
    name: 'Sub-Inspector Ramesh K.',
    role: 'Police',
    status: 'Active',
    lastLogin: '09:40 today',
    badgeId: 'POL-33019-IND',
    rank: 'Sub-Inspector of Police',
    station: 'Central Cyber Crime Police Station',
    email: 'ramesh.police@gov.in',
    phone: '+91 98445 66778'
  },
  {
    id: 'PRO011',
    name: 'Adv. Alok Nath',
    role: 'Prosecutor',
    status: 'Active',
    lastLogin: '2 days ago',
    title: 'Assistant Public Prosecutor (Financial Offences)',
    barCouncilNo: 'BCI/DEL/2018/34120',
    serviceId: 'PROS-34120-DL',
    email: 'alok.nath@prosecution.gov.in',
    phone: '+91 98556 77889',
    courtRoom: 'Court Room 3 - Economic Offences Bench'
  },
  {
    id: 'JUD012',
    name: 'Justice Meenakshi Sundaram',
    role: 'Judge',
    status: 'Active',
    lastLogin: 'Yesterday',
    title: 'Senior Judge (Commercial & Appellate Bench)',
    benchId: 'BENCH-TN-2012/045',
    serviceId: 'JUD-55102-TN',
    email: 'justice.meenakshi@highcourt.gov.in',
    phone: '+91 98667 88990',
    courtRoom: 'Court Room 4 - Appellate Bench'
  },
  {
    id: 'OFF013',
    name: 'Inspector K. Varma',
    role: 'Police',
    status: 'Active',
    lastLogin: '10:50 today',
    badgeId: 'POL-88120-IND',
    rank: 'Inspector of Police (Crime Branch)',
    station: 'Crime Branch Division 2',
    email: 'k.varma@police.gov.in',
    phone: '+91 98778 99001'
  },
  {
    id: 'ADM014',
    name: 'Radhika Kapoor',
    role: 'Admin',
    status: 'Active',
    lastLogin: '07:30 today',
    badgeId: 'ADM-GOV-44120',
    rank: 'System Role & Access Control Officer',
    station: 'Ministry of Justice IT Secretariat',
    email: 'radhika.k@justice.gov.in',
    phone: '+91 98889 00112'
  },
  {
    id: 'STF015',
    name: 'Suresh Kumar',
    role: 'Staff',
    status: 'Active',
    lastLogin: '09:00 today',
    badgeId: 'STF-88192-IND',
    rank: 'Chief Clerical Court Registrar',
    station: 'High Court Judicial Registry',
    email: 'suresh.registry@gov.in',
    phone: '+91 98990 11223'
  },
  {
    id: 'STF016',
    name: 'Dr. N. Iyer',
    role: 'Staff',
    status: 'Active',
    lastLogin: '11:15 today',
    badgeId: 'FSC-00129-IND',
    rank: 'Director of Forensic Data Analysis',
    station: 'Central Forensic Science Laboratory (CFSL)',
    email: 'dr.iyer@cfsl.gov.in',
    phone: '+91 99001 22334'
  },
  {
    id: 'OFF017',
    name: 'Sub-Inspector David R.',
    role: 'Police',
    status: 'Active',
    lastLogin: '08:20 today',
    badgeId: 'POL-55410-IND',
    rank: 'Sub-Inspector of Police (Narcotics Control)',
    station: 'Anti-Narcotics Division - HQ',
    email: 'david.r@police.gov.in',
    phone: '+91 98119 22334'
  },
  {
    id: 'OFF018',
    name: 'DSP Anand Varma',
    role: 'Police',
    status: 'Active',
    lastLogin: '11:45 today',
    badgeId: 'POL-11002-IPS',
    rank: 'Deputy Superintendent of Police',
    station: 'Special Investigation Team (SIT)',
    email: 'anand.varma@police.gov.in',
    phone: '+91 98776 54321'
  },
  {
    id: 'PRO019',
    name: 'Adv. Meera Nair',
    role: 'Prosecutor',
    status: 'Active',
    lastLogin: '10:00 today',
    title: 'Special Public Prosecutor (Cyber Crime & IP)',
    barCouncilNo: 'BCI/KA/2016/77890',
    serviceId: 'PROS-77890-KA',
    email: 'meera.nair@prosecution.gov.in',
    phone: '+91 98441 55667',
    courtRoom: 'Court Room 5 - Cyber & IP Bench'
  },
  {
    id: 'JUD020',
    name: 'Justice Harish Chandra',
    role: 'Judge',
    status: 'Active',
    lastLogin: 'Yesterday',
    title: 'Metropolitan Chief Magistrate',
    benchId: 'BENCH-DEL-2018/112',
    serviceId: 'JUD-11200-DL',
    email: 'justice.harish@highcourt.gov.in',
    phone: '+91 98109 88776',
    courtRoom: 'Court Room 3 - Metropolitan Bench'
  },
  {
    id: 'ADM021',
    name: 'Ananya Roy',
    role: 'Admin',
    status: 'Active',
    lastLogin: '12:10 today',
    badgeId: 'ADM-SEC-99012',
    rank: 'Network Governance & Data Privacy Auditor',
    station: 'Central Cyber Directorate',
    email: 'ananya.roy@justice.gov.in',
    phone: '+91 98200 11998'
  },
  {
    id: 'STF022',
    name: 'Rajesh Kannan',
    role: 'Staff',
    status: 'Active',
    lastLogin: '08:45 today',
    badgeId: 'STF-44109-IND',
    rank: 'Senior Judicial Case Record Keeper',
    station: 'High Court Record Room & Archive Division',
    email: 'rajesh.kannan@registry.gov.in',
    phone: '+91 98332 11009'
  },
  {
    id: 'OFF023',
    name: 'Inspector Vikram Singh',
    role: 'Police',
    status: 'Active',
    lastLogin: '09:30 today',
    badgeId: 'POL-66712-IND',
    rank: 'Inspector of Police (Traffic & Highway Security)',
    station: 'Highway Patrol Division - Metro',
    email: 'vikram.singh@police.gov.in',
    phone: '+91 98114 55667'
  },
  {
    id: 'PRO024',
    name: 'Adv. Vikramaditya Sen',
    role: 'Prosecutor',
    status: 'Active',
    lastLogin: '3 days ago',
    title: 'Senior Standing Counsel (Economic Benches)',
    barCouncilNo: 'BCI/WB/2010/44510',
    serviceId: 'PROS-44510-WB',
    email: 'vikram.sen@prosecution.gov.in',
    phone: '+91 98301 22998',
    courtRoom: 'Court Room 4 - Financial Benches'
  },
  {
    id: 'JUD025',
    name: 'Justice S. K. Mukherjee',
    role: 'Judge',
    status: 'Active',
    lastLogin: 'Yesterday',
    title: 'Principal District & Sessions Judge',
    benchId: 'BENCH-WB-2008/001',
    serviceId: 'JUD-00100-WB',
    email: 'justice.mukherjee@highcourt.gov.in',
    phone: '+91 98311 00223',
    courtRoom: 'Court Room 1 - Principal Bench'
  }
];

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Users' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'audit', label: 'Audit Logs' },
  { id: 'security', label: 'Security Center', sub: '' },
  { id: 'docs', label: 'Document Governance', sub: '' },
  { id: 'profile', label: 'Admin Profile', sub: '' },
];

export default function AdminDashboard({ onLogout, sharedVaultDocs, setSharedVaultDocs }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [userList, setUserList] = useState(() => initialUsers.filter(u => u.role !== 'Staff'));
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [isNewUserMode, setIsNewUserMode] = useState(false);
  const [security24hCategory, setSecurity24hCategory] = useState('ALL');

  const handleOpen24hAudit = (category = 'ALL') => {
    setSecurity24hCategory(category);
    setActiveNav('security-24h');
  };

  const handleOpenParticulars = (user, isNew = false) => {
    setSelectedOfficer(user);
    setIsNewUserMode(isNew);
    const roleStr = (user.role || '').toLowerCase();
    if (roleStr.includes('prosecutor')) {
      setActiveNav('prosecutor-particulars');
    } else if (roleStr.includes('judge')) {
      setActiveNav('judge-particulars');
    } else if (roleStr.includes('admin')) {
      setActiveNav('admin-particulars');
    } else {
      setActiveNav('officer-particulars');
    }
  };

  return (
    <Layout title="System Governance & Administration Portal" titleIcon="🛡️" userLabel="Admin"
      navItems={navItems} activeNav={activeNav} onNavChange={setActiveNav} onLogout={onLogout}>

      {activeNav === 'dashboard' && <DashboardView onNav={setActiveNav} onOpen24hAudit={handleOpen24hAudit} userList={userList} />}
      {activeNav === 'users' && (
        <UsersView 
          userList={userList} 
          setUserList={setUserList} 
          onNav={setActiveNav} 
          onOpenParticulars={handleOpenParticulars} 
        />
      )}
      {activeNav === 'admin-particulars' && (
        <AdminParticularsView 
          admin={selectedOfficer} 
          isNew={isNewUserMode}
          onBack={() => setActiveNav('users')}
          onSave={(updatedAdmin) => {
            setUserList(prev => {
              const exists = prev.some(u => u.id === updatedAdmin.id);
              return exists ? prev.map(u => u.id === updatedAdmin.id ? { ...u, ...updatedAdmin } : u) : [...prev, updatedAdmin];
            });
            setActiveNav('users');
          }}
        />
      )}
      {activeNav === 'officer-particulars' && (
        <OfficerParticularsView 
          officer={selectedOfficer} 
          isNew={isNewUserMode}
          onBack={() => setActiveNav('users')}
          onSave={(updatedOfficer) => {
            setUserList(prev => {
              const exists = prev.some(u => u.id === updatedOfficer.id);
              return exists ? prev.map(u => u.id === updatedOfficer.id ? { ...u, ...updatedOfficer } : u) : [...prev, updatedOfficer];
            });
            setActiveNav('users');
          }}
        />
      )}
      {activeNav === 'prosecutor-particulars' && (
        <ProsecutorParticularsView 
          prosecutor={selectedOfficer} 
          isNew={isNewUserMode}
          onBack={() => setActiveNav('users')}
          onSave={(updatedProsecutor) => {
            setUserList(prev => {
              const exists = prev.some(u => u.id === updatedProsecutor.id);
              return exists ? prev.map(u => u.id === updatedProsecutor.id ? { ...u, ...updatedProsecutor } : u) : [...prev, updatedProsecutor];
            });
            setActiveNav('users');
          }}
        />
      )}
      {activeNav === 'judge-particulars' && (
        <JudgeParticularsView 
          judge={selectedOfficer} 
          isNew={isNewUserMode}
          onBack={() => setActiveNav('users')}
          onSave={(updatedJudge) => {
            setUserList(prev => {
              const exists = prev.some(u => u.id === updatedJudge.id);
              return exists ? prev.map(u => u.id === updatedJudge.id ? { ...u, ...updatedJudge } : u) : [...prev, updatedJudge];
            });
            setActiveNav('users');
          }}
        />
      )}
      {activeNav === 'audit' && <AuditView onNav={setActiveNav} />}
      {activeNav === 'alerts' && <AlertsView onNav={setActiveNav} sharedVaultDocs={sharedVaultDocs} setSharedVaultDocs={setSharedVaultDocs} />}
      {activeNav === 'docs' && <DocGovernanceView onNav={setActiveNav} sharedVaultDocs={sharedVaultDocs} setSharedVaultDocs={setSharedVaultDocs} />}
      {activeNav === 'security' && <SecurityView onNav={setActiveNav} userList={userList} setUserList={setUserList} />}
      {activeNav === 'security-24h' && <SecurityActivity24hView onNav={setActiveNav} initialFilter={security24hCategory} />}
      {activeNav === 'profile' && <AdminProfileView admin={userList.find(u => u.role === 'Admin') || userList[1]} onNav={setActiveNav} />}
      {!['dashboard', 'users', 'alerts', 'docs', 'admin-particulars', 'officer-particulars', 'prosecutor-particulars', 'judge-particulars', 'audit', 'security', 'security-24h', 'profile'].includes(activeNav) && (
        <PlaceholderView title={navItems.find(n => n.id === activeNav)?.label || activeNav} onNav={setActiveNav} />
      )}
    </Layout>
  );
}

function DashboardView({ onNav, onOpen24hAudit, userList = [] }) {
  const userCount = userList.length;

  const depts = [
    { dept: 'Police Officers', roleKey: 'Police' },
    { dept: 'Public Prosecutors', roleKey: 'Prosecutor' },
    { dept: 'Judicial Bench', roleKey: 'Judge' },
    { dept: 'System Admins', roleKey: 'Admin' },
  ];

  const totalUsers = userList.length || 1;
  const usersSummary = depts.map(d => {
    const count = userList.filter(u => u.role === d.roleKey).length;
    const pct = Math.round((count / totalUsers) * 100);
    return { dept: d.dept, count, pct };
  });

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Administration & Governance Console</h2>
        <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>System performance, user directory, and security audit metrics</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Cases Registered', value: '1,245', delta: '+12 today', target: 'audit' },
          { label: 'Registered Users', value: userCount, delta: '+2 this week', target: 'users' },
          { label: 'Active Sessions Now', value: '183', delta: 'Online now', target: 'audit' },
          { label: 'Security Audit Flag', value: '12', delta: '3 critical', warn: true, target: 'security' },
        ].map(s => (
          <div key={s.label} className="stat-card" onClick={() => onNav(s.target)} title={`Navigate to ${s.label}`} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: s.warn ? '#b91c1c' : 'var(--color-ink)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: s.warn ? '#b91c1c' : 'var(--color-body)', marginTop: 6, fontWeight: 600 }}>{s.delta}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        {/* System Overview / Departmental User Distribution */}
        <div 
          className="section-card" 
          onClick={() => onNav('users')} 
          style={{ cursor: 'pointer' }}
          title="Click to view User Provisioning & Particulars Page"
        >
          <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Departmental User Distribution</span>
            <span style={{ fontSize: 11, color: 'var(--primary)', textTransform: 'none', fontWeight: 600 }}>Manage Users →</span>
          </div>
          <div className="section-card-body">
            {usersSummary.map(u => (
              <div key={u.dept} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{u.dept}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>{u.count} ({u.pct}%)</span>
                </div>
                <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${u.pct}%`, background: 'var(--primary)', borderRadius: 3 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--color-charcoal)', fontWeight: 600 }}>Total Active Users</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--primary)', fontWeight: 700 }}>{userCount}</span>
            </div>
          </div>
        </div>

        {/* Security Activity */}
        <div className="section-card" style={{ cursor: 'pointer' }}>
          <div 
            className="section-card-header" 
            onClick={() => onOpen24hAudit ? onOpen24hAudit('ALL') : onNav('security-24h')}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            title="Click to view 24-Hour Security Audit Trail Page"
          >
            <span>Security Activity Log (24 Hours)</span>
            <span style={{ fontSize: 11, color: 'var(--primary)', textTransform: 'none', fontWeight: 600 }}>View 24h Audit Page →</span>
          </div>
          <div className="section-card-body" style={{ padding: '8px 16px' }}>
            {securityAlerts.map(a => (
              <div 
                key={a.type} 
                onClick={() => {
                  let cat = 'ALL';
                  if (a.type === 'Failed Authentication') cat = 'FAILED_LOGIN';
                  else if (a.type === 'Access Violation') cat = 'UNAUTHORIZED';
                  else if (a.type === 'File Hash Warning') cat = 'HASH_WARNING';
                  else if (a.type === 'Role Permissions Updated') cat = 'ROLE_POLICY';

                  if (onOpen24hAudit) {
                    onOpen24hAudit(cat);
                  } else {
                    onNav('security-24h');
                  }
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px 8px', 
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  borderRadius: 4,
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                title={`Click to open 24h Audit Trail for ${a.type}`}
              >
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{a.type}</span>
                  <div style={{ fontSize: 10, color: 'var(--color-charcoal)', marginTop: 2 }}>Last 24 Hours Activity Flag</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`badge badge-${a.sev}`}>{a.count}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-charcoal)', fontWeight: 700 }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section-card">
        <div className="section-card-header">Real-Time Access Log</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Action Description</th>
                <th>Timestamp</th>
                <th>Source IP</th>
                <th>Authentication Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((r, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{r.user}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 500 }}>{r.posting}</div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{r.action}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--color-body)' }}>Today {r.time}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--color-body)' }}>10.141.{i + 1}.{(i + 1) * 12}</td>
                  <td><span className={`badge ${r.ok ? 'badge-active' : 'badge-warning'}`}>{r.ok ? 'SUCCESS' : 'DENIED'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UsersView({ userList, setUserList, onNav, onOpenParticulars }) {
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Provision Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Police');

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    const deletedName = userToDelete.name;
    const deletedId = userToDelete.id;

    setUserList(prev => prev.filter(u => u.id !== userToDelete.id));
    setUserToDelete(null);

    setNotification({
      isOpen: true,
      title: 'USER ACCOUNT DELETED',
      message: `User account for ${deletedName} (${deletedId}) has been permanently purged from system directory records.`,
      type: 'info'
    });
  };

  const handleProvisionSubmit = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const rolePrefix = newUserRole === 'Police' ? 'OFF' : newUserRole === 'Admin' ? 'ADM' : newUserRole === 'Prosecutor' ? 'PRO' : newUserRole === 'Judge' ? 'JUD' : 'STF';
    const nextNum = (userList.length + 1).toString().padStart(3, '0');
    const newId = `${rolePrefix}${nextNum}`;

    const newUser = {
      id: newId,
      name: newUserName.trim(),
      role: newUserRole,
      status: 'Active',
      lastLogin: 'Just now',
      badgeId: `${rolePrefix}-${Math.floor(10000 + Math.random() * 90000)}-IND`,
      rank: newUserRole === 'Police' ? 'Inspector of Police (Class-I)' : `${newUserRole} Officer`,
      station: 'Central System Governance Headquarters',
      photo: ''
    };

    setIsProvisionModalOpen(false);
    setNewUserName('');
    setNewUserRole('Police');

    // Automatically navigate to Particulars Registration Page for the role with isNew = true
    onOpenParticulars(newUser, true);
  };

  const handleToggleStatus = (userId) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        setNotification({
          isOpen: true,
          title: nextStatus === 'Suspended' ? 'USER ACCESS REVOKED & SUSPENDED' : 'USER ACCESS RESTORED',
          message: nextStatus === 'Suspended'
            ? `Credentials and access token for ${u.name} (${u.id}) have been REVOKED and set to SUSPENDED status.`
            : `Access credentials for ${u.name} (${u.id}) have been RESTORED to ACTIVE status.`,
          type: nextStatus === 'Suspended' ? 'info' : 'success'
        });
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Filtered Users List
  const filteredUsers = userList.filter(u => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      u.name.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.rank && u.rank.toLowerCase().includes(q)) ||
      (u.station && u.station.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
    return matchesRole && matchesSearch;
  });

  const getRoleIcon = () => '';

  const roleCounts = {
    All: userList.filter(u => u.role !== 'Staff').length,
    Police: userList.filter(u => u.role === 'Police').length,
    Prosecutor: userList.filter(u => u.role === 'Prosecutor').length,
    Judge: userList.filter(u => u.role === 'Judge').length,
    Admin: userList.filter(u => u.role === 'Admin').length,
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

      {/* Provision New User Modal */}
      {isProvisionModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#ffffff', width: '90%', maxWidth: '500px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)', border: '1px solid #cbd5e1' }}>
            <div style={{ background: '#1A1A1A', padding: '16px 20px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Oswald, sans-serif', color: '#ffffff', letterSpacing: '0.04em' }}>+ PROVISION NEW SYSTEM USER</div>
              </div>
              <button onClick={() => setIsProvisionModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={handleProvisionSubmit} style={{ padding: '20px' }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4 }}>Full Name</label>
                <input className="field-input" required type="text" placeholder="" value={newUserName} onChange={e => setNewUserName(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4 }}>Assigned Role</label>
                <select className="field-input" value={newUserRole} onChange={e => setNewUserRole(e.target.value)} style={{ width: '100%' }}>
                  <option value="Police">Police (Officer)</option>
                  <option value="Prosecutor">Prosecutor (Legal Counsel)</option>
                  <option value="Judge">Judge (Judicial Bench)</option>
                  <option value="Admin">Admin (System Governance)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setIsProvisionModalOpen(false)} className="btn-secondary" style={{ padding: '6px 16px', fontSize: 12 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '6px 18px', fontSize: 12 }}>Proceed to Particulars →</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '480px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)', border: '1px solid #cbd5e1' }}>
            <div style={{ background: '#dc2626', padding: '16px 20px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.04em' }}>
                PERMANENT USER DELETION
              </div>
              <button onClick={() => setUserToDelete(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: 14, color: 'var(--color-ink)', marginBottom: 12, lineHeight: 1.5 }}>
                Are you sure you want to permanently delete user account <strong>{userToDelete.name}</strong> (<span className="mono" style={{ fontWeight: 700, color: '#dc2626' }}>{userToDelete.id}</span>)?
              </div>
              
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, padding: '10px 14px', fontSize: 12, color: '#991b1b', marginBottom: 20 }}>
                <strong>WARNING:</strong> This action will revoke all system credentials, delete user particulars, and permanently remove the account from government directory records. This action cannot be undone.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button onClick={() => setUserToDelete(null)} className="btn-secondary" style={{ padding: '6px 16px', fontSize: 12 }}>
                  Cancel
                </button>
                <button onClick={handleDeleteConfirm} className="btn-primary" style={{ background: '#dc2626', borderColor: '#b91c1c', padding: '6px 18px', fontSize: 12, fontWeight: 700 }}>
                  Confirm Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            User Directory & Access Controls
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Master directory of all registered Police Officers, Public Prosecutors, Judicial Judges, and Admins
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button 
            onClick={() => setIsProvisionModalOpen(true)} 
            style={{ 
              background: '#000000', 
              color: '#ffffff', 
              border: '1px solid #000000', 
              fontSize: 11, 
              fontWeight: 700, 
              fontFamily: 'Oswald, sans-serif', 
              letterSpacing: '0.08em',
              padding: '8px 18px',
              borderRadius: '4px',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            + PROVISION NEW USER
          </button>
          {onNav && (
            <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
              ← BACK TO DASHBOARD
            </button>
          )}
        </div>
      </div>

      {/* Role Filter Tabs & Search Bar */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          
          {/* Role Filter Buttons */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'All', label: 'All Users' },
              { id: 'Police', label: 'Police Officers' },
              { id: 'Prosecutor', label: 'Public Prosecutors' },
              { id: 'Judge', label: 'Presiding Judges' },
              { id: 'Admin', label: 'System Admins' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 4,
                  border: `1.5px solid ${roleFilter === tab.id ? 'var(--primary)' : 'var(--border)'}`,
                  background: roleFilter === tab.id ? 'var(--primary)' : '#f8fafc',
                  color: roleFilter === tab.id ? '#ffffff' : 'var(--color-charcoal)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s'
                }}
              >
                {tab.label}
                <span 
                  style={{ 
                    fontSize: 10, 
                    padding: '1px 6px', 
                    borderRadius: 10, 
                    background: roleFilter === tab.id ? 'rgba(255,255,255,0.25)' : '#e2e8f0', 
                    color: roleFilter === tab.id ? '#ffffff' : 'var(--color-ink)',
                    fontWeight: 700 
                  }}
                >
                  {roleCounts[tab.id] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: 280 }}>
            <input
              className="field-input"
              type="text"
              placeholder="Search by Name, ID, Rank, Station..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', fontSize: 12 }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 14 }}
              >
                ✕
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Directory Table */}
      <div className="section-card">
        <div style={{ padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 600 }}>
          <span>REGISTERED USERS DIRECTORY</span>
          <span>Showing <strong>{filteredUsers.length}</strong> of <strong>{userList.length}</strong> User Accounts</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name & Rank</th>
                <th>Official Role</th>
                <th>Station / Department</th>
                <th>Status</th>
                <th>Last Login</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{u.id}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-ink)', fontSize: 13 }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-body)' }}>{u.rank || u.title || `${u.role} Personnel`}</div>
                    </td>
                    <td>
                      <span className="badge badge-done" style={{ fontWeight: 700 }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--color-charcoal)', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {u.station || u.officeAddress || u.courtRoom || 'Central Directorate'}
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'Active' ? 'badge-active' : 'badge-error'}`} style={{ fontWeight: 700 }}>
                        {u.status === 'Active' ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td className="mono" style={{ fontSize: 11, color: 'var(--color-body)' }}>{u.lastLogin}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button onClick={() => onOpenParticulars(u, false)} className="btn-secondary" style={{ padding: '4px 12px', fontSize: 11, fontWeight: 700, color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                          Edit Details & Particulars
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(u.id)} 
                          className="btn-secondary" 
                          style={{ 
                            padding: '4px 10px', 
                            fontSize: 11, 
                            borderColor: u.status === 'Active' ? '#f59e0b' : '#16a34a', 
                            color: u.status === 'Active' ? '#d97706' : '#16a34a',
                            fontWeight: 700
                          }}
                        >
                          {u.status === 'Active' ? 'Revoke' : 'Restore'}
                        </button>
                        <button 
                          onClick={() => setUserToDelete(u)} 
                          className="btn-secondary" 
                          style={{ 
                            padding: '4px 10px', 
                            fontSize: 11, 
                            borderColor: '#ef4444', 
                            color: '#dc2626',
                            background: '#fff5f5',
                            fontWeight: 700
                          }}
                          title="Delete User Account"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-body)' }}>
                    🔍 No registered personnel found matching "<strong>{searchQuery}</strong>" for role <strong>{roleFilter}</strong>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

{/* Full Page View: Police Officer Service Particulars & Registration Record */}
function OfficerParticularsView({ officer, isNew = false, onBack, onSave }) {
  const [formData, setFormData] = useState({
    name: officer?.name || '',
    rank: officer?.rank || '',
    badgeId: officer?.badgeId || '',
    division: officer?.division || '',
    dob: officer?.dob || '',
    age: officer?.age || '',
    bloodGroup: officer?.bloodGroup || '',
    gender: officer?.gender || '',
    email: officer?.email || '',
    phone: officer?.phone || '',
    station: officer?.station || '',
    stationAddress: officer?.stationAddress || '',
    jurisdiction: officer?.jurisdiction || '',
    postingDate: officer?.postingDate || '',
    reportingOfficer: officer?.reportingOfficer || '',
    experience: officer?.experience || '',
    solvedCases: officer?.solvedCases || '',
    convictionRate: officer?.convictionRate || '',
    photo: officer?.photo || officer?.avatar || ''
  });

  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const requiredFields = [
      'name', 'rank', 'dob', 'age', 'bloodGroup', 'gender', 'email', 'phone',
      'station', 'stationAddress', 'jurisdiction', 'postingDate', 'reportingOfficer',
      'experience', 'solvedCases', 'convictionRate'
    ];

    const missingFields = requiredFields.filter(f => !formData[f] || !formData[f].trim());
    
    if (missingFields.length > 0 || !formData.photo) {
      setNotification({
        isOpen: true,
        title: 'COMPULSORY FIELDS MISSING',
        message: `All fields and Officer Photo are compulsory! Please upload a photo and fill in all required input boxes before saving.`,
        type: 'error'
      });
      return;
    }

    setNotification({
      isOpen: true,
      title: 'OFFICER PARTICULAR RECORD SAVED',
      message: `Official service particulars and station jurisdiction for ${formData.name} have been permanently committed to government personnel records.`,
      type: 'success'
    });
    setTimeout(() => {
      onSave({ ...officer, ...formData, avatar: formData.photo });
    }, 1200);
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

      {/* Top Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            OFFICER SERVICE PARTICULARS & REGISTRATION RECORD
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Official Law Enforcement Identity, Station Jurisdiction, Medical Particulars, and Service Metrics Entry
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO USER DIRECTORY
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column (Identity + Metrics), Right Column (Particulars + Station + History) */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          
          {/* Identity Card */}
          <div className="section-card" style={{ textCenter: 'center', padding: '24px 18px' }}>
            <div className="section-card-header" style={{ marginBottom: 16 }}>
              OFFICER IDENTITY <span style={{ color: '#ef4444' }}>*</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 140, height: 160, borderRadius: 8, overflow: 'hidden', border: '3px solid #c9a227', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', background: '#1A1A1A' }}>
                {formData.photo ? (
                  <img 
                    src={formData.photo} 
                    alt="Officer Identity" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#a3a3a3' }}>
                    <span style={{ fontSize: 36, marginBottom: 4 }}>📷</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>NO PHOTO</span>
                  </div>
                )}
                
                <label 
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: formData.photo ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    opacity: formData.photo ? 0 : 1, 
                    transition: 'opacity 0.2s', 
                    cursor: 'pointer' 
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => formData.photo && (e.currentTarget.style.opacity = 0)}
                >
                  <span style={{ color: '#fff', fontSize: 22, marginBottom: 2 }}>📷</span>
                  <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: 'rgba(0,0,0,0.7)', padding: '3px 8px', borderRadius: 4 }}>
                    {formData.photo ? 'CHANGE PHOTO' : 'UPLOAD PHOTO *'}
                  </span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ marginTop: 16, fontSize: 20, fontWeight: 700, color: 'var(--color-ink)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}>
                <input 
                  className="field-input" 
                  type="text" 
                  placeholder=""
                  required
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  style={{ textAlign: 'center', fontWeight: 700 }}
                />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: 10, marginTop: 4 }}>
                Badge ID: {formData.badgeId || 'POL-78429-IND'}
              </div>
            </div>
          </div>

          {/* Service Summary Metrics */}
          <div className="section-card">
            <div className="section-card-header">Service Summary Metrics</div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>
                  Total Experience <span style={{ color: '#ef4444' }}>*</span>
                </span>
                <input className="field-input" required type="text" placeholder="" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} style={{ width: 100, fontSize: 12, fontWeight: 700 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>
                  Cases Solved <span style={{ color: '#ef4444' }}>*</span>
                </span>
                <input className="field-input" required type="text" placeholder="" value={formData.solvedCases} onChange={e => setFormData({ ...formData, solvedCases: e.target.value })} style={{ width: 100, fontSize: 12, fontWeight: 700 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>
                  Conviction Rate <span style={{ color: '#ef4444' }}>*</span>
                </span>
                <input className="field-input" required type="text" placeholder="" value={formData.convictionRate} onChange={e => setFormData({ ...formData, convictionRate: e.target.value })} style={{ width: 100, fontSize: 12, fontWeight: 700 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          
          {/* Personal & Medical Particulars */}
          <div className="section-card">
            <div className="section-card-header">Personal & Medical Particulars</div>
            <div className="section-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'Full Name', field: 'name' },
                  { label: 'Position / Rank', field: 'rank' },
                  { label: 'Date of Birth (DOB)', field: 'dob', type: 'date' },
                  { label: 'Current Age', field: 'age', readOnly: true },
                  { label: 'Blood Group', field: 'bloodGroup' },
                  { label: 'Gender', field: 'gender' },
                  { label: 'Government Email', field: 'email' },
                  { label: 'Official Mobile / Contact', field: 'phone' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>
                      {item.label} <span style={{ color: '#ef4444' }}>*</span>
                    </div>
                    <input 
                      className="field-input" 
                      required={!item.readOnly}
                      readOnly={item.readOnly}
                      type={item.type || 'text'} 
                      placeholder=""
                      value={item.field === 'dob' ? formatDateForInput(formData.dob) : item.field === 'age' ? (calculateAgeFromDOB(formData.dob) || formData.age || '') : (formData[item.field] || '')} 
                      onChange={e => {
                        if (item.field === 'dob') {
                          const newDob = e.target.value;
                          const newAge = calculateAgeFromDOB(newDob);
                          setFormData({ ...formData, dob: newDob, age: newAge });
                        } else {
                          setFormData({ ...formData, [item.field]: e.target.value });
                        }
                      }} 
                      style={{ width: '100%', fontSize: 12, fontWeight: 600, background: item.readOnly ? '#f1f5f9' : undefined, color: item.readOnly ? 'var(--primary)' : undefined }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Working Station & Location Particulars */}
          <div className="section-card">
            <div className="section-card-header">Current Station & Location Particulars</div>
            <div className="section-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {[
                  { label: 'Current Working Station', field: 'station' },
                  { label: 'Station Physical Location & Address', field: 'stationAddress' },
                  { label: 'Station Jurisdiction / Zone', field: 'jurisdiction' },
                  { label: 'Date of Current Posting', field: 'postingDate' },
                  { label: 'Reporting Authority Officer', field: 'reportingOfficer' },
                ].map(item => (
                  <div key={item.label} style={{ gridColumn: item.field === 'stationAddress' ? 'span 2' : 'span 1' }}>
                    <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>
                      {item.label} <span style={{ color: '#ef4444' }}>*</span>
                    </div>
                    <input 
                      className="field-input" 
                      required
                      type="text" 
                      placeholder=""
                      value={formData[item.field] || ''} 
                      onChange={e => setFormData({ ...formData, [item.field]: e.target.value })} 
                      style={{ width: '100%', fontSize: 12, fontWeight: 600 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Save Action Bar */}
      <div style={{ 
        marginTop: 24, 
        padding: '16px 24px', 
        background: '#ffffff', 
        border: '1px solid var(--border)', 
        borderRadius: 8, 
        display: 'flex', 
        justify: 'flex-end', 
        alignItems: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
      }}>
        <button onClick={handleSave} className="btn-primary" style={{ fontSize: 14, padding: '12px 28px', background: '#16a34a', borderColor: '#16a34a', fontWeight: 700 }}>
          {isNew ? 'CREATE NEW USER' : 'SAVE PARTICULARS RECORD'}
        </button>
      </div>
    </div>
  );
}

{/* Full Page View: System Administrator Particulars & Registration Record */}
function AdminParticularsView({ admin, isNew = false, onBack, onSave }) {
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    rank: admin?.rank || 'System Administrator',
    badgeId: admin?.badgeId || admin?.id || 'ADM-002-IND',
    dob: admin?.dob || '',
    age: admin?.age || '',
    bloodGroup: admin?.bloodGroup || '',
    gender: admin?.gender || '',
    email: admin?.email || '',
    phone: admin?.phone || '',
    station: admin?.station || '',
    photo: admin?.photo || admin?.avatar || ''
  });

  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const requiredFields = [
      'name', 'rank', 'dob', 'age', 'bloodGroup', 'gender', 'email', 'phone', 'station'
    ];

    const missingFields = requiredFields.filter(f => !formData[f] || !formData[f].trim());

    if (missingFields.length > 0 || !formData.photo) {
      setNotification({
        isOpen: true,
        title: 'COMPULSORY FIELDS MISSING',
        message: `All personal details, position, current working station, and Admin photo are compulsory! Please upload a photo and fill in all required fields before saving.`,
        type: 'error'
      });
      return;
    }

    setNotification({
      isOpen: true,
      title: 'ADMINISTRATOR PARTICULARS RECORD SAVED',
      message: `Official governance credentials and station particulars for Admin ${formData.name} have been committed to government database records.`,
      type: 'success'
    });
    setTimeout(() => {
      onSave({ ...admin, ...formData, avatar: formData.photo });
    }, 1200);
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

      {/* Top Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            SYSTEM ADMINISTRATOR SERVICE PARTICULARS & REGISTRATION RECORD
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Official Governance Identity, Personal Particulars, Position & Current Station Assignment
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO USER DIRECTORY
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column (Identity), Right Column (Personal Details + Current Station) */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        
        {/* Left Column - Identity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="section-card" style={{ padding: '24px 18px' }}>
            <div className="section-card-header" style={{ marginBottom: 16 }}>
              ADMINISTRATOR IDENTITY <span style={{ color: '#ef4444' }}>*</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 140, height: 160, borderRadius: 8, overflow: 'hidden', border: '3px solid #c9a227', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', background: '#1A1A1A' }}>
                {formData.photo ? (
                  <img 
                    src={formData.photo} 
                    alt="Admin Identity" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#a3a3a3' }}>
                    <span style={{ fontSize: 36, marginBottom: 4 }}>🛡️</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>NO PHOTO</span>
                  </div>
                )}
                
                <label 
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: formData.photo ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    opacity: formData.photo ? 0 : 1, 
                    transition: 'opacity 0.2s', 
                    cursor: 'pointer' 
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => formData.photo && (e.currentTarget.style.opacity = 0)}
                >
                  <span style={{ color: '#fff', fontSize: 22, marginBottom: 2 }}>📷</span>
                  <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: 'rgba(0,0,0,0.7)', padding: '3px 8px', borderRadius: 4 }}>
                    {formData.photo ? 'CHANGE PHOTO' : 'UPLOAD PHOTO *'}
                  </span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ marginTop: 16, width: '100%' }}>
                <input 
                  className="field-input" 
                  type="text" 
                  placeholder="Full Name"
                  required
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}
                />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: 10, marginTop: 8 }}>
                Admin ID: {formData.badgeId}
              </div>
              <span className="badge badge-done" style={{ fontWeight: 700, textTransform: 'uppercase' }}>
                🛡️ SYSTEM ADMIN
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Personal Details & Current Station */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          
          {/* Personal Particulars */}
          <div className="section-card">
            <div className="section-card-header">Personal Particulars</div>
            <div className="section-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'Full Name', field: 'name' },
                  { label: 'Position / Rank', field: 'rank' },
                  { label: 'Date of Birth (DOB)', field: 'dob', type: 'date' },
                  { label: 'Current Age', field: 'age', readOnly: true },
                  { label: 'Blood Group', field: 'bloodGroup' },
                  { label: 'Gender', field: 'gender' },
                  { label: 'Government Email', field: 'email', type: 'email' },
                  { label: 'Official Mobile / Contact', field: 'phone' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>
                      {item.label} <span style={{ color: '#ef4444' }}>*</span>
                    </div>
                    <input 
                      className="field-input" 
                      required={!item.readOnly}
                      readOnly={item.readOnly}
                      type={item.type || 'text'} 
                      placeholder=""
                      value={item.field === 'dob' ? formatDateForInput(formData.dob) : item.field === 'age' ? (calculateAgeFromDOB(formData.dob) || formData.age || '') : (formData[item.field] || '')} 
                      onChange={e => {
                        if (item.field === 'dob') {
                          const newDob = e.target.value;
                          const newAge = calculateAgeFromDOB(newDob);
                          setFormData({ ...formData, dob: newDob, age: newAge });
                        } else {
                          setFormData({ ...formData, [item.field]: e.target.value });
                        }
                      }} 
                      style={{ width: '100%', fontSize: 12, fontWeight: 600, background: item.readOnly ? '#f1f5f9' : undefined, color: item.readOnly ? 'var(--primary)' : undefined }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Working Station Particulars */}
          <div className="section-card">
            <div className="section-card-header">Current Station Particulars</div>
            <div className="section-card-body">
              <div>
                <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                  Current Working Station / Department <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <input 
                  className="field-input" 
                  required
                  type="text" 
                  placeholder="e.g. Central System Governance Headquarters / Metropolitan Cyber Directorate"
                  value={formData.station} 
                  onChange={e => setFormData({ ...formData, station: e.target.value })} 
                  style={{ width: '100%', fontSize: 13, fontWeight: 600 }}
                />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Save Action Bar */}
      <div style={{ 
        marginTop: 24, 
        padding: '16px 24px', 
        background: '#ffffff', 
        border: '1px solid var(--border)', 
        borderRadius: 8, 
        display: 'flex', 
        justify: 'flex-end', 
        alignItems: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
      }}>
        <button onClick={handleSave} className="btn-primary" style={{ fontSize: 14, padding: '12px 28px', background: '#16a34a', borderColor: '#16a34a', fontWeight: 700 }}>
          {isNew ? 'CREATE NEW USER' : 'SAVE ADMIN RECORD'}
        </button>
      </div>
    </div>
  );
}

{/* Full Page View: Public Prosecutor Particulars & Registration Record (Matching User Screenshot Spec) */}
function ProsecutorParticularsView({ prosecutor, isNew = false, onBack, onSave }) {
  const [formData, setFormData] = useState({
    name: prosecutor?.name || '',
    title: prosecutor?.title || '',
    barCouncilNo: prosecutor?.barCouncilNo || '',
    serviceId: prosecutor?.serviceId || '',
    dob: prosecutor?.dob || '',
    email: prosecutor?.email || '',
    phone: prosecutor?.phone || '',
    experience: prosecutor?.experience || '',
    courtRoom: prosecutor?.courtRoom || '',
    officeAddress: prosecutor?.officeAddress || '',
    totalCases: prosecutor?.totalCases || '',
    successRate: prosecutor?.successRate || '',
    activeTrials: prosecutor?.activeTrials || '',
    verifiedEvidences: prosecutor?.verifiedEvidences || '',
    photo: prosecutor?.photo || prosecutor?.avatar || ''
  });

  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const requiredFields = [
      'name', 'barCouncilNo', 'serviceId', 'dob', 'email', 'phone',
      'experience', 'courtRoom', 'officeAddress', 'totalCases', 'successRate',
      'activeTrials', 'verifiedEvidences'
    ];

    const missingFields = requiredFields.filter(f => !formData[f] || !formData[f].trim());

    if (missingFields.length > 0 || !formData.photo) {
      setNotification({
        isOpen: true,
        title: 'COMPULSORY FIELDS MISSING',
        message: `All fields and Prosecutor Photo are compulsory! Please upload an official photo and fill in all required input boxes before saving.`,
        type: 'error'
      });
      return;
    }

    setNotification({
      isOpen: true,
      title: 'PROSECUTOR PARTICULAR RECORD SAVED',
      message: `Official credentials and court venue particulars for Prosecutor ${formData.name} have been committed to judicial system records.`,
      type: 'success'
    });
    setTimeout(() => {
      onSave({ ...prosecutor, ...formData, avatar: formData.photo });
    }, 1200);
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

      {/* Top Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            PUBLIC PROSECUTOR CREDENTIALS & SERVICE PARTICULARS RECORD
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Official Legal Counsel Credentials, Court Bench Venue, and Bar Council Particulars Entry
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO USER DIRECTORY
          </button>
        </div>
      </div>

      {/* Main Top Header Banner Matching Screenshot Spec */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-card-body" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '20px' }}>
          {/* Avatar / Badge Icon with Upload */}
          <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '50%', background: '#1A1A1A', border: '3px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
            {formData.photo ? (
              <img src={formData.photo} alt="Prosecutor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ fontSize: 32, color: '#ffffff' }}>⚖️</div>
            )}
            <label 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                background: formData.photo ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                opacity: formData.photo ? 0 : 1, 
                transition: 'opacity 0.2s', 
                cursor: 'pointer' 
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => formData.photo && (e.currentTarget.style.opacity = 0)}
            >
              <span style={{ color: '#fff', fontSize: 18 }}>📷</span>
              <span style={{ color: '#fff', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', marginTop: 2, background: 'rgba(0,0,0,0.7)', padding: '1px 5px', borderRadius: 3 }}>
                {formData.photo ? 'CHANGE' : 'UPLOAD *'}
              </span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <input
                className="field-input"
                required
                type="text"
                placeholder=""
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Oswald, sans-serif', maxWidth: 360, color: 'var(--color-ink)' }}
              />
              <span style={{ fontSize: 10, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '4px 10px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>
                ACTIVE PROSECUTOR
              </span>
            </div>



            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 2 }}>
                  Bar Council ID <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <input
                  className="field-input"
                  required
                  type="text"
                  placeholder=""
                  value={formData.barCouncilNo}
                  onChange={e => setFormData({ ...formData, barCouncilNo: e.target.value })}
                  style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', width: '100%' }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 2 }}>
                  Service ID <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <input
                  className="field-input"
                  required
                  type="text"
                  placeholder=""
                  value={formData.serviceId}
                  onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
                  style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', width: '100%' }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 2 }}>
                  Practice Experience <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <input
                  className="field-input"
                  required
                  type="text"
                  placeholder=""
                  value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  style={{ fontSize: 11, fontWeight: 700, color: '#15803d', width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns Matching Screenshot Spec */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        
        {/* Left Column: OFFICIAL CREDENTIALS & CONTACT INFO */}
        <div className="section-card">
          <div className="section-card-header">OFFICIAL CREDENTIALS & CONTACT INFO</div>
          <div className="section-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Row 1: Full Name (Left) | DOB & Age (Right) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                    FULL NAME <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', fontSize: 12, fontWeight: 700 }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                    DATE OF BIRTH & AGE <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      className="field-input"
                      required
                      type="date"
                      value={formatDateForInput(formData.dob)}
                      onChange={e => {
                        const newDob = e.target.value;
                        const newAge = calculateAgeFromDOB(newDob);
                        setFormData(prev => ({ ...prev, dob: newDob, age: newAge }));
                      }}
                      style={{ flex: 1, fontSize: 12, fontWeight: 700 }}
                    />
                    <input
                      className="field-input"
                      readOnly
                      type="text"
                      value={calculateAgeFromDOB(formData.dob) || formData.age || ''}
                      placeholder="Calculated Age"
                      style={{ width: 110, fontSize: 12, fontWeight: 700, background: '#f1f5f9', color: 'var(--primary)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email (Left) | Phone (Right) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                    OFFICIAL EMAIL ADDRESS <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                    OFFICIAL PHONE NUMBER <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}
                  />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                  LEGAL PRACTICE EXPERIENCE <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <input
                  className="field-input"
                  required
                  type="text"
                  placeholder=""
                  value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  style={{ width: '100%', fontSize: 12, fontWeight: 700 }}
                />
              </div>

              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                  ASSIGNED COURT BENCH / VENUE <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <input
                  className="field-input"
                  required
                  type="text"
                  placeholder=""
                  value={formData.courtRoom}
                  onChange={e => setFormData({ ...formData, courtRoom: e.target.value })}
                  style={{ width: '100%', fontSize: 12, fontWeight: 700 }}
                />
              </div>

              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                  OFFICE CHAMBER ADDRESS <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <input
                  className="field-input"
                  required
                  type="text"
                  placeholder=""
                  value={formData.officeAddress}
                  onChange={e => setFormData({ ...formData, officeAddress: e.target.value })}
                  style={{ width: '100%', fontSize: 12, fontWeight: 600 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: PROSECUTION TRACK RECORD & METRICS */}
        <div>
          <div className="section-card">
            <div className="section-card-header">PROSECUTION TRACK RECORD & METRICS</div>
            <div className="section-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
                    TOTAL CASES PROSECUTED <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.totalCases}
                    onChange={e => setFormData({ ...formData, totalCases: e.target.value })}
                    style={{ width: '100%', fontSize: 20, fontWeight: 800, fontFamily: 'Oswald, sans-serif' }}
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
                    TRIAL SUCCESS RATE <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.successRate}
                    onChange={e => setFormData({ ...formData, successRate: e.target.value })}
                    style={{ width: '100%', fontSize: 20, fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: '#15803d' }}
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
                    ACTIVE TRIALS HANDLED <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.activeTrials}
                    onChange={e => setFormData({ ...formData, activeTrials: e.target.value })}
                    style={{ width: '100%', fontSize: 20, fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: 'var(--primary)' }}
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
                    VERIFIED EVIDENCES <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.verifiedEvidences}
                    onChange={e => setFormData({ ...formData, verifiedEvidences: e.target.value })}
                    style={{ width: '100%', fontSize: 20, fontWeight: 800, fontFamily: 'Oswald, sans-serif' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Save Action Bar */}
      <div style={{ 
        marginTop: 24, 
        padding: '16px 24px', 
        background: '#ffffff', 
        border: '1px solid var(--border)', 
        borderRadius: 8, 
        display: 'flex', 
        justify: 'flex-end', 
        alignItems: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
      }}>
        <button onClick={handleSave} className="btn-primary" style={{ fontSize: 14, padding: '12px 28px', background: '#16a34a', borderColor: '#16a34a', fontWeight: 700 }}>
          {isNew ? 'CREATE NEW USER' : 'SAVE PROSECUTOR RECORD'}
        </button>
      </div>
    </div>
  );
}

{/* Full Page View: Presiding Judge Credentials & Service Particulars Record (Matching User Screenshot Spec) */}
function JudgeParticularsView({ judge, isNew = false, onBack, onSave }) {
  const [formData, setFormData] = useState({
    name: judge?.name || '',
    title: judge?.title || '',
    benchId: judge?.benchId || '',
    serviceId: judge?.serviceId || '',
    dob: judge?.dob || '',
    email: judge?.email || '',
    phone: judge?.phone || '',
    experience: judge?.experience || '',
    courtRoom: judge?.courtRoom || '',
    officeAddress: judge?.officeAddress || '',
    totalCasesDisposed: judge?.totalCasesDisposed || '',
    disposalRate: judge?.disposalRate || '',
    activeProceedings: judge?.activeProceedings || '',
    deliveredOrders: judge?.deliveredOrders || '',
    photo: judge?.photo || judge?.avatar || ''
  });

  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const requiredFields = [
      'name', 'benchId', 'serviceId', 'dob', 'email', 'phone',
      'experience', 'courtRoom', 'officeAddress', 'totalCasesDisposed', 'disposalRate',
      'activeProceedings', 'deliveredOrders'
    ];

    const missingFields = requiredFields.filter(f => !formData[f] || !formData[f].trim());

    if (missingFields.length > 0 || !formData.photo) {
      setNotification({
        isOpen: true,
        title: 'COMPULSORY FIELDS MISSING',
        message: `All fields and Presiding Judge Photo are compulsory! Please upload an official photo and fill in all required input boxes before saving.`,
        type: 'error'
      });
      return;
    }

    setNotification({
      isOpen: true,
      title: 'JUDICIAL BENCH RECORD SAVED',
      message: `Official credentials and bench particulars for Judge ${formData.name} have been committed to high court judiciary records.`,
      type: 'success'
    });
    setTimeout(() => {
      onSave({ ...judge, ...formData, avatar: formData.photo });
    }, 1200);
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

      {/* Top Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            HIGH COURT OF JUDICATURE - PRESIDING JUDGE CREDENTIALS & SERVICE PARTICULARS
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Official Bench Authority Credentials, Judicial Bench Venue, and Service Particulars Entry
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO USER DIRECTORY
          </button>
        </div>
      </div>

      {/* Main Top Header Banner Matching Screenshot Spec */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-card-body" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '20px' }}>
          {/* Avatar / Badge Icon with Photo Upload */}
          <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '50%', background: '#1A1A1A', border: '3px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
            {formData.photo ? (
              <img src={formData.photo} alt="Judge Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ fontSize: 32, color: '#ffffff' }}>👨‍⚖️</div>
            )}
            <label 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                background: formData.photo ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                opacity: formData.photo ? 0 : 1, 
                transition: 'opacity 0.2s', 
                cursor: 'pointer' 
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => formData.photo && (e.currentTarget.style.opacity = 0)}
            >
              <span style={{ color: '#fff', fontSize: 18 }}>📷</span>
              <span style={{ color: '#fff', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', marginTop: 2, background: 'rgba(0,0,0,0.7)', padding: '1px 5px', borderRadius: 3 }}>
                {formData.photo ? 'CHANGE' : 'UPLOAD *'}
              </span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <input
                className="field-input"
                required
                type="text"
                placeholder=""
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Oswald, sans-serif', maxWidth: 360, color: 'var(--color-ink)' }}
              />
              <span style={{ fontSize: 10, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '4px 10px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>
                ACTIVE PRESIDING JUDGE
              </span>
            </div>



            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 2 }}>
                  Bench ID <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <input
                  className="field-input"
                  required
                  type="text"
                  placeholder=""
                  value={formData.benchId}
                  onChange={e => setFormData({ ...formData, benchId: e.target.value })}
                  style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', width: '100%' }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 2 }}>
                  Service ID <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <input
                  className="field-input"
                  required
                  type="text"
                  placeholder=""
                  value={formData.serviceId}
                  onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
                  style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', width: '100%' }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', marginBottom: 2 }}>
                  Practice Experience <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <input
                  className="field-input"
                  required
                  type="text"
                  placeholder=""
                  value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  style={{ fontSize: 11, fontWeight: 700, color: '#15803d', width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns Matching Screenshot Spec */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        
        {/* Left Column: OFFICIAL CREDENTIALS & CONTACT INFO */}
        <div className="section-card">
          <div className="section-card-header">OFFICIAL CREDENTIALS & CONTACT INFO</div>
          <div className="section-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Row 1: Full Name (Left) | DOB & Age (Right) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                    FULL NAME <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', fontSize: 12, fontWeight: 700 }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                    DATE OF BIRTH & AGE <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      className="field-input"
                      required
                      type="date"
                      value={formatDateForInput(formData.dob)}
                      onChange={e => {
                        const newDob = e.target.value;
                        const newAge = calculateAgeFromDOB(newDob);
                        setFormData(prev => ({ ...prev, dob: newDob, age: newAge }));
                      }}
                      style={{ flex: 1, fontSize: 12, fontWeight: 700 }}
                    />
                    <input
                      className="field-input"
                      readOnly
                      type="text"
                      value={calculateAgeFromDOB(formData.dob) || formData.age || ''}
                      placeholder="Calculated Age"
                      style={{ width: 110, fontSize: 12, fontWeight: 700, background: '#f1f5f9', color: 'var(--primary)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email (Left) | Phone (Right) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                    OFFICIAL EMAIL ADDRESS <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                    OFFICIAL PHONE NUMBER <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}
                  />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                  LEGAL PRACTICE EXPERIENCE <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <input
                  className="field-input"
                  required
                  type="text"
                  placeholder=""
                  value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  style={{ width: '100%', fontSize: 12, fontWeight: 700 }}
                />
              </div>

              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                  ASSIGNED COURT BENCH / VENUE <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <input
                  className="field-input"
                  required
                  type="text"
                  placeholder=""
                  value={formData.courtRoom}
                  onChange={e => setFormData({ ...formData, courtRoom: e.target.value })}
                  style={{ width: '100%', fontSize: 12, fontWeight: 700 }}
                />
              </div>

              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 700 }}>
                  OFFICE CHAMBER ADDRESS <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <input
                  className="field-input"
                  required
                  type="text"
                  placeholder=""
                  value={formData.officeAddress}
                  onChange={e => setFormData({ ...formData, officeAddress: e.target.value })}
                  style={{ width: '100%', fontSize: 12, fontWeight: 600 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: JUDICIAL TRACK RECORD & METRICS */}
        <div>
          <div className="section-card">
            <div className="section-card-header">JUDICIAL TRACK RECORD & METRICS</div>
            <div className="section-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
                    TOTAL CASES DISPOSED <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.totalCasesDisposed}
                    onChange={e => setFormData({ ...formData, totalCasesDisposed: e.target.value })}
                    style={{ width: '100%', fontSize: 20, fontWeight: 800, fontFamily: 'Oswald, sans-serif' }}
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
                    JUDGEMENT DISPOSAL RATE <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.disposalRate}
                    onChange={e => setFormData({ ...formData, disposalRate: e.target.value })}
                    style={{ width: '100%', fontSize: 20, fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: '#15803d' }}
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
                    ACTIVE PROCEEDINGS HANDLED <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.activeProceedings}
                    onChange={e => setFormData({ ...formData, activeProceedings: e.target.value })}
                    style={{ width: '100%', fontSize: 20, fontWeight: 800, fontFamily: 'Oswald, sans-serif', color: 'var(--primary)' }}
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', color: 'var(--color-charcoal)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
                    DELIVERED JUDGEMENT ORDERS <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <input
                    className="field-input"
                    required
                    type="text"
                    placeholder=""
                    value={formData.deliveredOrders}
                    onChange={e => setFormData({ ...formData, deliveredOrders: e.target.value })}
                    style={{ width: '100%', fontSize: 20, fontWeight: 800, fontFamily: 'Oswald, sans-serif' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Save Action Bar */}
      <div style={{ 
        marginTop: 24, 
        padding: '16px 24px', 
        background: '#ffffff', 
        border: '1px solid var(--border)', 
        borderRadius: 8, 
        display: 'flex', 
        justify: 'flex-end', 
        alignItems: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
      }}>
        <button onClick={handleSave} className="btn-primary" style={{ fontSize: 14, padding: '12px 28px', background: '#16a34a', borderColor: '#16a34a', fontWeight: 700 }}>
          {isNew ? 'CREATE NEW USER' : 'SAVE JUDICIAL BENCH RECORD'}
        </button>
      </div>
    </div>
  );
}

{/* Full Page View: Official System Administrator Profile */}
function AdminProfileView({ admin, onNav }) {
  const getCleanName = (raw) => {
    if (!raw) return 'Anil Verma';
    if (raw === 'Admin Verma' || raw === 'Admin') return 'Anil Verma';
    if (raw.toLowerCase().startsWith('admin ')) return raw.replace(/^admin\s+/i, '');
    return raw;
  };

  const profileData = {
    name: getCleanName(admin?.name),
    rank: admin?.rank || 'Senior System Administrator & Chief Security Auditor',
    badgeId: admin?.badgeId || admin?.id || 'ADM002',
    dob: admin?.dob || '14 August 1982',
    age: admin?.age || '44 Years',
    bloodGroup: admin?.bloodGroup || 'O+ Positive',
    gender: admin?.gender || 'Male',
    email: admin?.email ? admin.email.replace(/^admin\./i, 'anil.') : 'anil.verma@justice.gov.in',
    phone: admin?.phone || '+91 98112 34567',
    station: admin?.station || 'Central System Governance Headquarters',
    stationAddress: admin?.stationAddress || 'Ministry of Justice Complex, Tower-A, 4th Floor, Sector-1 (Pincode: 110001)',
    clearanceLevel: 'Level 4 (Top Secret / Full Audit Authority)',
    supervisorId: 'SUP-GOV-9012 (Cabinet Secretariat)',
    mfaStatus: 'Enforced (TOTP Hardware Key YubiKey-8839)',
    encryption: 'AES-256 Bit GCM Encrypted',
    lastLogin: admin?.lastLogin || '09:15 Today',
    photo: admin?.photo || admin?.avatar || ''
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            OFFICIAL SYSTEM ADMINISTRATOR PROFILE & GOVERNANCE RECORD
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Classified System Governance Identity · Government of India · Ministry of Justice
          </p>
        </div>
        <div>
          {onNav && (
            <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
              ← BACK TO DASHBOARD
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        
        {/* Left Column: Admin Photo & Governance Identity */}
        <div>
          <div className="section-card" style={{ marginBottom: 18 }}>
            <div className="section-card-header">Administrator Identity</div>
            <div className="section-card-body" style={{ textAlign: 'center', padding: '24px 18px' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
                <div style={{ position: 'relative', width: 150, height: 170, borderRadius: 8, overflow: 'hidden', border: '3px solid var(--accent-gold)', boxShadow: '0 8px 16px rgba(0,0,0,0.15)', background: '#1A1A1A', margin: '0 auto' }}>
                  {profileData.photo ? (
                    <img
                      src={profileData.photo}
                      alt="Admin Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#a3a3a3' }}>
                      <span style={{ fontSize: 42, marginBottom: 4 }}>🛡️</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>NO PHOTO</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 8, fontSize: 20, fontWeight: 700, color: 'var(--color-ink)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}>
                {profileData.name}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: 12, marginTop: 4 }}>
                Admin ID: <span className="mono" style={{ color: 'var(--primary)', fontWeight: 700 }}>{profileData.badgeId}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--primary)', background: '#f8fafc', padding: '8px 12px', borderRadius: 4, border: '1px solid #cbd5e1', fontWeight: 700 }}>
                🛡️ {profileData.rank}
              </div>
            </div>
          </div>

          {/* Quick System Governance Metrics */}
          <div className="section-card">
            <div className="section-card-header">System Governance Summary</div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Clearance Tier</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#b8860b' }}>Top Secret (L4)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Managed Personnel</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', fontFamily: 'JetBrains Mono, monospace' }}>248 Accounts</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Audit Logged Actions</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#15803d', fontFamily: 'JetBrains Mono, monospace' }}>14,290 Events</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>System Status</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#15803d' }}>🟢 Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Particulars (Personal, Station & Security Credentials) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          
          {/* Personal Particulars */}
          <div className="section-card">
            <div className="section-card-header">Personal Particulars</div>
            <div className="section-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'Full Name', field: 'name' },
                  { label: 'Position / Rank', field: 'rank' },
                  { label: 'Date of Birth (DOB)', field: 'dob' },
                  { label: 'Current Age', field: 'age' },
                  { label: 'Blood Group', field: 'bloodGroup' },
                  { label: 'Gender', field: 'gender' },
                  { label: 'Government Email', field: 'email' },
                  { label: 'Official Mobile / Contact', field: 'phone' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>
                      {profileData[item.field]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Working Station Particulars */}
          <div className="section-card">
            <div className="section-card-header">Current Station Particulars</div>
            <div className="section-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>
                    Current Working Station / Department
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>
                    {profileData.station}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>
                    Office Physical Address
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>
                    {profileData.stationAddress}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Access Credentials */}
          <div className="section-card">
            <div className="section-card-header">Security Credentials & Compliance</div>
            <div className="section-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>
                    Clearance Tier & Authority
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#b8860b' }}>
                    {profileData.clearanceLevel}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>
                    Multi-Factor Authentication
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>
                    {profileData.mfaStatus}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 4, fontWeight: 700 }}>
                    Encryption Standard
                  </div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>
                    {profileData.encryption}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function AuditView({ onNav }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('All Security Actions');
  const [filterTime, setFilterTime] = useState('Today');

  const logs = [
    { time: '10:30', name: 'Sharma K.', posting: 'Inspector of Police (Cyber Crime)', action: 'Document Upload', details: 'Uploaded FIR Charge Sheet (FIR_ChargeSheet_C1020.pdf)', res: 'C-1020', ok: true },
    { time: '10:31', name: 'Rajesh Sharma', posting: 'Senior Public Prosecutor (Criminal Division)', action: 'Case Access', details: 'Accessed Case Docket & Remand Hearing Records', res: 'C-1021', ok: true },
    { time: '10:32', name: 'Officer Patel', posting: 'Sub-Inspector of Police (Special Task Force)', action: 'Login', details: 'Attempted SSO Login via Police Portal (Failed Passcode)', res: 'C-1022', ok: false },
    { time: '10:33', name: 'Anil Verma', posting: 'Senior System Administrator (Cyber Directorate)', action: 'Role Change', details: 'Promoted Officer to Senior Public Prosecutor Role', res: 'C-1023', ok: true },
    { time: '10:34', name: 'Justice Ramesh', posting: 'Senior Presiding Judge (High Court Bench)', action: 'File Download', details: 'Downloaded Forensic Audit Ledger (Bank_Ledger_v1.0.pdf)', res: 'C-1024', ok: true },
    { time: '10:35', name: 'Inspector K. Varma', posting: 'Crime Branch Division-2 Officer', action: 'Evidence Upload', details: 'Uploaded Seizure Witness Video (Seizure_C1025.mp4)', res: 'C-1025', ok: true },
    { time: '10:36', name: 'Adv. Meera Nair', posting: 'Special Public Prosecutor (Cyber & IP)', action: 'Report View', details: 'Viewed Final Investigation Summary Report', res: 'C-1026', ok: true },
    { time: '10:37', name: 'Sub-Inspector David R.', posting: 'Anti-Narcotics Division Officer', action: 'Profile Update', details: 'Attempted PKI Certificate Key Renewal (Denied Clearance)', res: 'C-1027', ok: false },
    { time: '10:38', name: 'Justice Harish Chandra', posting: 'Metropolitan Chief Magistrate', action: 'Search', details: 'Searched Query: "Narcotics Seizure Audit Ledger"', res: 'C-1028', ok: true },
    { time: '10:39', name: 'Ananya Roy', posting: 'Data Privacy & Security Auditor', action: 'Logout', details: 'Session Terminated & User Logged Out', res: 'C-1029', ok: true }
  ];

  const filteredLogs = logs.filter(log => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || (
      log.name.toLowerCase().includes(q) ||
      log.posting.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.res.toLowerCase().includes(q)
    );

    const matchesAction = filterAction === 'All Security Actions' ||
      (filterAction === 'Login Events' && (log.action === 'Login' || log.action === 'Logout')) ||
      (filterAction === 'Document Access' && (log.action.includes('Document') || log.action.includes('File') || log.action.includes('Evidence') || log.action.includes('Case') || log.action.includes('Report'))) ||
      (filterAction === 'Role Changes' && log.action === 'Role Change');

    return matchesQuery && matchesAction;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Security Audit Trail</h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>Immutable system access logs, authentication events, and audit trail</p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', width: 320 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            className="field-input" 
            type="text" 
            placeholder="Search audit logs by User / Action / Resource..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 32 }} 
          />
        </div>
        <select className="field-input" value={filterAction} onChange={e => setFilterAction(e.target.value)} style={{ maxWidth: 180 }}>
          <option>All Security Actions</option>
          <option>Login Events</option>
          <option>Document Access</option>
          <option>Role Changes</option>
        </select>
        <select className="field-input" value={filterTime} onChange={e => setFilterTime(e.target.value)} style={{ maxWidth: 160 }}>
          <option>Today</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>

      <div className="section-card">
        <table className="data-table">
          <thead><tr><th>Timestamp</th><th>User Name & Posting</th><th>Action Performed & Details</th><th>Resource Reference</th><th>Result</th></tr></thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, i) => (
                <tr key={i}>
                  <td className="mono" style={{ fontSize: 11, color: 'var(--color-body)', fontWeight: 600 }}>2026-09-12 {log.time}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--color-ink)', fontSize: 12 }}>{log.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 500 }}>{log.posting}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--color-ink)', fontSize: 12 }}>{log.action}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 500, marginTop: 2 }}>{log.details}</div>
                  </td>
                  <td className="mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>{log.res}</td>
                  <td><span className={`badge ${!log.ok ? 'badge-error' : 'badge-active'}`}>{!log.ok ? 'DENIED' : 'SUCCESS'}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-body)' }}>
                  No security audit logs found matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SecurityView({ onNav, userList, setUserList }) {
  const [selectedTab, setSelectedTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  // Initial Security Threat & Monitor Events covering required security areas
  const [securityEvents, setSecurityEvents] = useState([
    {
      id: 'SEC-101',
      category: 'FAILED_LOGIN',
      icon: '',
      title: '5 Consecutive Failed Login / Password Attempts',
      user: 'Officer Patel',
      userId: 'OFF005',
      role: 'Police (Sub-Inspector)',
      badgeId: 'POL-65102-IND',
      ip: '10.0.2.11 (Metro Police Subnet)',
      time: '2026-09-13 10:41 AM',
      severity: 'CRITICAL',
      details: '5 consecutive failed password attempts detected within 120 seconds. Automated brute-force protection triggered.',
      status: 'LOCKED',
      accountLocked: true,
      actionNeeded: 'Account Passcode & Lock Review'
    },
    {
      id: 'SEC-102',
      category: 'HASH_MISMATCH',
      icon: '',
      title: 'Cryptographic Document Hash Signature Mismatch',
      user: 'Sub-Inspector David R.',
      userId: 'OFF017',
      role: 'Police (Anti-Narcotics)',
      badgeId: 'POL-55410-IND',
      ip: '10.0.5.26 (External VPN Node)',
      time: '2026-09-13 09:45 AM',
      severity: 'CRITICAL',
      details: 'File checksum for Bank_Ledger_Forensic_C1025.pdf failed SHA-256 validation against master ledger version v1.0.',
      status: 'SUSPECTED',
      accountLocked: true,
      actionNeeded: 'Ledger Rollback & Forensic Review'
    },
    {
      id: 'SEC-103',
      category: 'UNAUTHORIZED_ACCESS',
      icon: '',
      title: 'Unauthorized Case Docket Access Attempt',
      user: 'Unknown Session Token (POL-SUSPECT-89)',
      userId: 'UNAUTH-99',
      role: 'Unassigned Role',
      badgeId: 'UNAUTHORIZED-AUTH',
      ip: '192.168.1.104 (Unregistered Subnet)',
      time: '2026-09-13 14:22 PM',
      severity: 'HIGH',
      details: 'Attempted to access restricted High Court Remand Order (C-1023) without valid RBAC clearance token.',
      status: 'BLOCKED',
      accountLocked: false,
      actionNeeded: 'Access Denied & Flagged'
    },
    {
      id: 'SEC-104',
      category: 'INVALID_SIGNATURE',
      icon: '',
      title: 'Invalid Digital Signature Certificate Alert',
      user: 'Adv. Alok Nath',
      userId: 'PRO011',
      role: 'Prosecutor',
      badgeId: 'PROS-34120-DL',
      ip: '10.0.7.36 (High Court Legal Wing)',
      time: '2026-09-13 11:15 AM',
      severity: 'HIGH',
      details: 'Digital signature token for Case C-1026 charge sheet export returned expired key signature (PKI-REVOKED-09).',
      status: 'UNRESOLVED',
      accountLocked: false,
      actionNeeded: 'PKI Certificate Renewal'
    },
    {
      id: 'SEC-105',
      category: 'PERMISSION_VIOLATION',
      icon: '',
      title: 'Privilege Escalation Permission Violation',
      user: 'Rajesh Kannan',
      userId: 'STF022',
      role: 'Staff (Case Record Keeper)',
      badgeId: 'STF-44109-IND',
      ip: '10.0.8.41 (Court Archive Room)',
      time: '2026-09-12 16:10 PM',
      severity: 'MEDIUM',
      details: 'Attempted to modify judicial bench access policy settings without System Admin master clearance token.',
      status: 'FLAGGED',
      accountLocked: false,
      actionNeeded: 'Role Audit & Warning'
    }
  ]);

  // Lock or Unlock User Account in System Database
  const handleToggleAccountLock = (userId, targetUserName) => {
    if (setUserList) {
      setUserList(prev => prev.map(u => {
        if (u.id === userId || u.name === targetUserName) {
          const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          return { ...u, status: nextStatus };
        }
        return u;
      }));
    }

    setSecurityEvents(prev => prev.map(ev => {
      if (ev.userId === userId || ev.user === targetUserName) {
        const nextLock = !ev.accountLocked;
        return {
          ...ev,
          accountLocked: nextLock,
          status: nextLock ? 'LOCKED' : 'RESOLVED'
        };
      }
      return ev;
    }));

    const isNowLocked = !securityEvents.find(e => e.userId === userId || e.user === targetUserName)?.accountLocked;

    setNotification({
      isOpen: true,
      title: isNowLocked ? 'USER ACCOUNT LOCKED & SUSPENDED' : 'USER ACCOUNT UNLOCKED & RESTORED',
      message: isNowLocked
        ? `Account for ${targetUserName} (${userId}) has been LOCKED and suspended due to security violation.`
        : `Access credentials for ${targetUserName} (${userId}) have been UNLOCKED and restored to active status.`,
      type: isNowLocked ? 'info' : 'success'
    });
  };

  const handleResolveThreat = (threatId) => {
    setSecurityEvents(prev => prev.map(ev => ev.id === threatId ? { ...ev, status: 'RESOLVED', severity: 'LOW' } : ev));
    if (selectedThreat && selectedThreat.id === threatId) {
      setSelectedThreat(prev => ({ ...prev, status: 'RESOLVED', severity: 'LOW' }));
    }
    setNotification({
      isOpen: true,
      title: 'SECURITY INCIDENT RESOLVED',
      message: `Threat incident ${threatId} has been resolved and archived.`,
      type: 'success'
    });
  };

  // Filtered Events
  const filteredEvents = securityEvents.filter(ev => {
    const matchesCategory = selectedTab === 'ALL' ||
      (selectedTab === 'FAILED_LOGIN' && ev.category === 'FAILED_LOGIN') ||
      (selectedTab === 'UNAUTHORIZED' && ev.category === 'UNAUTHORIZED_ACCESS') ||
      (selectedTab === 'PERMISSIONS' && ev.category === 'PERMISSION_VIOLATION') ||
      (selectedTab === 'INTEGRITY' && (ev.category === 'HASH_MISMATCH' || ev.category === 'INVALID_SIGNATURE')) ||
      (selectedTab === 'LOCKED' && ev.accountLocked);

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      ev.id.toLowerCase().includes(q) ||
      ev.user.toLowerCase().includes(q) ||
      ev.title.toLowerCase().includes(q) ||
      ev.details.toLowerCase().includes(q) ||
      ev.ip.toLowerCase().includes(q)
    );
    return matchesCategory && matchesSearch;
  });

  const lockedAccountsCount = securityEvents.filter(e => e.accountLocked).length;
  const hashMismatchCount = securityEvents.filter(e => e.category === 'HASH_MISMATCH' || e.category === 'INVALID_SIGNATURE').length;
  const failedLoginCount = securityEvents.filter(e => e.category === 'FAILED_LOGIN').length;
  const unauthorizedCount = securityEvents.filter(e => e.category === 'UNAUTHORIZED_ACCESS').length;

  return (
    <div>
      <NotificationModal 
        isOpen={notification.isOpen} 
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      {/* Threat Forensic Investigation Modal */}
      {selectedThreat && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '720px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', border: '1px solid #cbd5e1' }}>
            <div style={{ background: '#dc2626', padding: '16px 20px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Security Incident Forensic Investigation</div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Oswald, sans-serif' }}>
                  {selectedThreat.id}: {selectedThreat.title}
                </div>
              </div>
              <button onClick={() => setSelectedThreat(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', fontWeight: 700 }}>×</button>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
                  <div><strong>Category:</strong> {selectedThreat.category}</div>
                  <div><strong>Severity Level:</strong> <span className={`badge badge-${selectedThreat.severity === 'CRITICAL' || selectedThreat.severity === 'HIGH' ? 'error' : 'warning'}`}>{selectedThreat.severity}</span></div>
                  <div><strong>User / Account Involved:</strong> <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{selectedThreat.user} ({selectedThreat.userId})</span></div>
                  <div><strong>Official Role & Badge:</strong> {selectedThreat.role} ({selectedThreat.badgeId})</div>
                  <div><strong>Event Timestamp:</strong> <span className="mono" style={{ fontSize: 11 }}>{selectedThreat.time}</span></div>
                  <div><strong>Current Lock Status:</strong> <span className={`badge ${selectedThreat.accountLocked ? 'badge-error' : 'badge-active'}`}>{selectedThreat.accountLocked ? 'LOCKED' : 'UNLOCKED'}</span></div>
                  <div><strong>Action Needed:</strong> <span style={{ fontWeight: 700, color: '#dc2626' }}>{selectedThreat.actionNeeded}</span></div>
                </div>
              </div>

              <div style={{ background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 8, padding: 14, fontSize: 13, color: '#7f1d1d', marginBottom: 20 }}>
                <strong>INCIDENT FORENSIC DESCRIPTION:</strong><br />
                {selectedThreat.details}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
                {selectedThreat.category === 'HASH_MISMATCH' && (
                  <button onClick={() => { setSelectedThreat(null); onNav('docs'); }} className="btn-secondary" style={{ fontSize: 11, fontWeight: 700, color: '#b8860b', borderColor: '#b8860b' }}>
                    Inspect Vault Rollback →
                  </button>
                )}
                <button 
                  onClick={() => handleToggleAccountLock(selectedThreat.userId, selectedThreat.user)} 
                  className="btn-secondary" 
                  style={{ 
                    padding: '6px 14px', 
                    fontSize: 12, 
                    borderColor: selectedThreat.accountLocked ? '#16a34a' : '#dc2626', 
                    color: selectedThreat.accountLocked ? '#16a34a' : '#dc2626',
                    fontWeight: 700 
                  }}
                >
                  {selectedThreat.accountLocked ? 'Unlock User Account' : 'Lock User Account'}
                </button>
                {selectedThreat.status !== 'RESOLVED' && (
                  <button onClick={() => handleResolveThreat(selectedThreat.id)} className="btn-primary" style={{ background: '#16a34a', borderColor: '#15803d', fontSize: 12, fontWeight: 700 }}>
                    Mark Incident Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            Security Operations & Threat Defense Center
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Real-time threat monitoring, failed login tracking, account lock governance, and document hash integrity defense
          </p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      {/* Top Overview Cards Covering Security Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <div 
          className="stat-card" 
          onClick={() => setSelectedTab('FAILED_LOGIN')}
          style={{ cursor: 'pointer', border: selectedTab === 'FAILED_LOGIN' ? '2px solid var(--primary)' : undefined }}
        >
          <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>
            Failed Logins & Password Flags
          </div>
          <div style={{ fontSize: 28, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: failedLoginCount > 0 ? '#dc2626' : '#15803d', lineHeight: 1 }}>
            {failedLoginCount} Flags
          </div>
          <div style={{ fontSize: 11, color: failedLoginCount > 0 ? '#dc2626' : '#15803d', marginTop: 6, fontWeight: 600 }}>
            Password & SSO Failures
          </div>
        </div>

        <div 
          className="stat-card" 
          onClick={() => setSelectedTab('UNAUTHORIZED')}
          style={{ cursor: 'pointer', border: selectedTab === 'UNAUTHORIZED' ? '2px solid var(--primary)' : undefined }}
        >
          <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>
            Unauthorized Access Attempts
          </div>
          <div style={{ fontSize: 28, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: unauthorizedCount > 0 ? '#d97706' : '#15803d', lineHeight: 1 }}>
            {unauthorizedCount} Intercepted
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-body)', marginTop: 6, fontWeight: 600 }}>
            Docket & Role Violations
          </div>
        </div>

        <div 
          className="stat-card" 
          onClick={() => setSelectedTab('INTEGRITY')}
          style={{ cursor: 'pointer', border: selectedTab === 'INTEGRITY' ? '2px solid var(--primary)' : undefined }}
        >
          <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>
            Hash & Digital Signature Integrity
          </div>
          <div style={{ fontSize: 28, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: hashMismatchCount > 0 ? '#dc2626' : '#15803d', lineHeight: 1 }}>
            {hashMismatchCount} Alerts
          </div>
          <div style={{ fontSize: 11, color: hashMismatchCount > 0 ? '#dc2626' : '#15803d', marginTop: 6, fontWeight: 600 }}>
            Checksum & PKI Certificate Flags
          </div>
        </div>

        <div 
          className="stat-card" 
          onClick={() => setSelectedTab('LOCKED')}
          style={{ cursor: 'pointer', border: selectedTab === 'LOCKED' ? '2px solid #dc2626' : undefined, background: lockedAccountsCount > 0 ? '#fff5f5' : undefined }}
        >
          <div style={{ fontSize: 11, color: lockedAccountsCount > 0 ? '#b91c1c' : 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>
            Account Lock & Suspension Status
          </div>
          <div style={{ fontSize: 28, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: lockedAccountsCount > 0 ? '#dc2626' : '#15803d', lineHeight: 1 }}>
            {lockedAccountsCount} Locked
          </div>
          <div style={{ fontSize: 11, color: lockedAccountsCount > 0 ? '#dc2626' : '#15803d', marginTop: 6, fontWeight: 600 }}>
            Suspended User Credentials
          </div>
        </div>
      </div>

      {/* Category Filter Tabs & Search Bar */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Security Events' },
            { id: 'FAILED_LOGIN', label: 'Failed Logins' },
            { id: 'UNAUTHORIZED', label: 'Unauthorized Access' },
            { id: 'PERMISSIONS', label: 'Permission Violations' },
            { id: 'INTEGRITY', label: 'Hash & Signature Alerts' },
            { id: 'LOCKED', label: 'Account Locks' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 4,
                border: `1.5px solid ${selectedTab === tab.id ? 'var(--primary)' : 'var(--border)'}`,
                background: selectedTab === tab.id ? 'var(--primary)' : '#f8fafc',
                color: selectedTab === tab.id ? '#ffffff' : 'var(--color-charcoal)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <input
            className="field-input"
            type="text"
            placeholder="Search Security Log by User / Details..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', fontSize: 12 }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✕</button>
          )}
        </div>
      </div>

      {/* Main Security Incident Monitoring Table */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div style={{ padding: '12px 18px', background: '#f8fafc', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
              REAL-TIME SECURITY INCIDENT MONITORING ({filteredEvents.length} Events)
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-charcoal)', marginTop: 2 }}>
              Monitoring failed logins, unauthorized access, hash mismatches, and invalid digital signatures
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Reference</th>
                <th>Target User & Role</th>
                <th>Security Violation Description</th>
                <th>Severity</th>
                <th>Lock / Security Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map(ev => (
                  <tr key={ev.id} style={{ background: ev.severity === 'CRITICAL' ? '#fff5f5' : undefined }}>
                    <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>
                      {ev.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-ink)', fontSize: 13 }}>{ev.user}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-charcoal)' }}>{ev.role} ({ev.badgeId})</div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--color-ink)', maxWidth: 280 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: ev.severity === 'CRITICAL' ? '#dc2626' : 'var(--color-ink)' }}>{ev.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-charcoal)', marginTop: 2 }}>{ev.details}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${ev.severity === 'CRITICAL' || ev.severity === 'HIGH' ? 'error' : 'warning'}`} style={{ fontWeight: 800 }}>
                        {ev.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${ev.accountLocked ? 'badge-error' : ev.status === 'RESOLVED' ? 'badge-active' : 'badge-warning'}`} style={{ fontWeight: 700 }}>
                        {ev.accountLocked ? 'LOCKED' : ev.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button 
                          onClick={() => setSelectedThreat(ev)} 
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: 11, fontWeight: 700, color: 'var(--primary)', borderColor: 'var(--primary)' }}
                        >
                          Investigate
                        </button>
                        <button 
                          onClick={() => handleToggleAccountLock(ev.userId, ev.user)} 
                          className="btn-secondary" 
                          style={{ 
                            padding: '4px 10px', 
                            fontSize: 11, 
                            borderColor: ev.accountLocked ? '#16a34a' : '#dc2626', 
                            color: ev.accountLocked ? '#16a34a' : '#dc2626',
                            fontWeight: 700 
                          }}
                        >
                          {ev.accountLocked ? 'Unlock' : 'Lock Account'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-body)' }}>
                    No security violation events found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Lock Status Panel */}
      <div className="section-card">
        <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>LOCKED / SUSPENDED USER ACCOUNTS</span>
          <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 700 }}>{lockedAccountsCount} Active Locks</span>
        </div>
        <div className="section-card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User & Badge</th>
                <th>Lock Reason</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {securityEvents.filter(e => e.accountLocked).length > 0 ? (
                securityEvents.filter(e => e.accountLocked).map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--color-ink)' }}>{item.user}</div>
                      <div style={{ fontSize: 10, color: 'var(--color-charcoal)' }}>{item.role}</div>
                    </td>
                    <td style={{ fontSize: 11, color: '#dc2626', fontWeight: 600 }}>
                      {item.title}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => handleToggleAccountLock(item.userId, item.user)} 
                        className="btn-secondary" 
                        style={{ padding: '3px 10px', fontSize: 11, borderColor: '#16a34a', color: '#16a34a', fontWeight: 700 }}
                      >
                        Unlock Account
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: '#15803d', fontWeight: 600 }}>
                    All user accounts are currently active with zero security locks.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}


function SecurityActivity24hView({ onNav, initialFilter = 'ALL' }) {
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLogRecord, setSelectedLogRecord] = useState(null);

  const logs24h = [
    {
      id: 'SEC-24H-001',
      category: 'FAILED_LOGIN',
      categoryLabel: 'Failed Authentication',
      title: '3 Consecutive Invalid Password Entries',
      user: 'Officer Patel',
      role: 'Police (Financial Fraud Wing)',
      badgeId: 'POL-65102-IND',
      ip: '10.141.3.36 (District West Station)',
      time: 'Today, 10:41 AM',
      severity: 'HIGH',
      details: 'Multiple invalid credential attempts detected from workstation IP. Account temporarily locked pending admin review.',
      status: 'LOCKED',
      actionTaken: 'Account Locked & Warning Flagged'
    },
    {
      id: 'SEC-24H-002',
      category: 'FAILED_LOGIN',
      categoryLabel: 'Failed Authentication',
      title: 'Token Expiration Re-Authentication Failure',
      user: 'Inspector Priya M.',
      role: 'Police (Special Task Force)',
      badgeId: 'POL-90412-IND',
      ip: '192.168.1.110 (STF Remote VPN)',
      time: 'Today, 08:15 AM',
      severity: 'MEDIUM',
      details: 'Session token expired during active evidence upload. Automatic re-authentication handshake failed.',
      status: 'RESOLVED',
      actionTaken: 'Session Re-authenticated'
    },
    {
      id: 'SEC-24H-003',
      category: 'FAILED_LOGIN',
      categoryLabel: 'Failed Authentication',
      title: 'Session Key Revocation Challenge Failure',
      user: 'Adv. Sunita Deshmukh',
      role: 'Prosecutor',
      badgeId: 'PROS-90124-MH',
      ip: '10.141.1.12 (High Court Network)',
      time: 'Yesterday, 11:30 PM',
      severity: 'LOW',
      details: 'Revoked session key used during off-hours query. System rejected token.',
      status: 'CLOSED',
      actionTaken: 'Token Purged'
    },
    {
      id: 'SEC-24H-004',
      category: 'UNAUTHORIZED',
      categoryLabel: 'Access Violation',
      title: 'Unauthorized Master Root Escalation Attempt',
      user: 'Unknown Token (POL-SUSPECT-89)',
      role: 'Unassigned Role',
      badgeId: 'UNAUTH-99',
      ip: '192.168.1.104 (Unregistered Subnet)',
      time: 'Today, 14:22 PM',
      severity: 'CRITICAL',
      details: 'Multiple invalid token exchanges detected from IP 192.168.1.104 attempting root governance bypass.',
      status: 'BLOCKED',
      actionTaken: 'IP Banned & Flagged'
    },
    {
      id: 'SEC-24H-005',
      category: 'HASH_WARNING',
      categoryLabel: 'File Hash Warning',
      title: 'High-Volume Cryptographic Hash Mismatch',
      user: 'Sub-Inspector David R.',
      role: 'Police (Anti-Narcotics)',
      badgeId: 'POL-55410-IND',
      ip: '10.0.5.26 (Vault Ledger Service)',
      time: 'Today, 09:45 AM',
      severity: 'CRITICAL',
      details: 'Case C-1025 attachment hash verification returned flag code 0x88F. Checksum failed SHA-256 validation against master ledger version v1.0.',
      status: 'MISMATCH_FLAGGED',
      actionTaken: 'Forensic Re-hash Scheduled'
    },
    {
      id: 'SEC-24H-006',
      category: 'HASH_WARNING',
      categoryLabel: 'File Hash Warning',
      title: 'Forensic Ledger Checksum Verification Anomaly',
      user: 'Inspector K. Varma',
      role: 'Police (Crime Branch)',
      badgeId: 'POL-78429-IND',
      ip: '10.0.8.41 (Storage Node #3)',
      time: 'Today, 07:20 AM',
      severity: 'HIGH',
      details: 'Case C-1018 charge sheet checksum mismatch flag code 0x41A. System scheduled secondary integrity verification.',
      status: 'INVESTIGATING',
      actionTaken: 'Integrity Check Queued'
    },
    {
      id: 'SEC-24H-007',
      category: 'ROLE_POLICY',
      categoryLabel: 'Role Permissions Updated',
      title: 'Judicial Bench Access Privileges Modified',
      user: 'Anil Verma',
      role: 'System Administrator',
      badgeId: 'ADM002-IND',
      ip: '10.0.1.1 (RBAC Policy Engine)',
      time: 'Yesterday, 16:10 PM',
      severity: 'INFO',
      details: 'Admin user updated judicial signature verification tokens for Bench Room 3.',
      status: 'LOGGED',
      actionTaken: 'RBAC Policy Applied'
    },
    {
      id: 'SEC-24H-008',
      category: 'ROLE_POLICY',
      categoryLabel: 'Role Permissions Updated',
      title: 'Charge Sheet Export Clearance Granted',
      user: 'Anil Verma',
      role: 'System Administrator',
      badgeId: 'ADM002-IND',
      ip: '10.0.1.1 (RBAC Policy Engine)',
      time: 'Today, 10:47 AM',
      severity: 'INFO',
      details: 'Granted elevated charge sheet export clearance to Senior Public Prosecutor Rajesh Sharma for Case C-1023.',
      status: 'LOGGED',
      actionTaken: 'Privilege Updated'
    },
    {
      id: 'SEC-24H-009',
      category: 'ROLE_POLICY',
      categoryLabel: 'Role Permissions Updated',
      title: 'Case Docket Clearance Policy Updated',
      user: 'Anil Verma',
      role: 'System Administrator',
      badgeId: 'ADM002-IND',
      ip: '10.0.1.1 (RBAC Policy Engine)',
      time: 'Today, 09:00 AM',
      severity: 'INFO',
      details: 'RBAC policy engine updated case docket view privileges for Special Task Force Officers across Zone 4.',
      status: 'LOGGED',
      actionTaken: 'Policy Sync Complete'
    },
    {
      id: 'SEC-24H-010',
      category: 'ROLE_POLICY',
      categoryLabel: 'Role Permissions Updated',
      title: 'Bench Room 2 Judicial Access Modified',
      user: 'Anil Verma',
      role: 'System Administrator',
      badgeId: 'ADM002-IND',
      ip: '10.0.1.1 (RBAC Policy Engine)',
      time: 'Yesterday, 17:45 PM',
      severity: 'INFO',
      details: 'Updated Bench Room 2 judicial signature verification clearance key.',
      status: 'LOGGED',
      actionTaken: 'Bench Token Updated'
    }
  ];

  const filteredLogs = logs24h.filter(log => {
    const matchesFilter = selectedFilter === 'ALL' || log.category === selectedFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || log.user.toLowerCase().includes(q) || log.id.toLowerCase().includes(q) || log.details.toLowerCase().includes(q) || log.title.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Detail Modal */}
      {selectedLogRecord && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '680px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', border: '1px solid #cbd5e1' }}>
            <div style={{ background: '#1A1A1A', padding: '16px 20px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--accent-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>24-Hour Forensic Audit Record</div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Oswald, sans-serif', color: '#ffffff', letterSpacing: '0.04em' }}>
                  {selectedLogRecord.id}: {selectedLogRecord.title}
                </div>
              </div>
              <button onClick={() => setSelectedLogRecord(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', fontWeight: 700 }}>×</button>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
                  <div><strong>Event Reference:</strong> <span className="mono" style={{ color: 'var(--primary)', fontWeight: 700 }}>{selectedLogRecord.id}</span></div>
                  <div><strong>Incident Category:</strong> {selectedLogRecord.categoryLabel}</div>
                  <div><strong>Target User / Actor:</strong> {selectedLogRecord.user}</div>
                  <div><strong>Official Badge / Role:</strong> {selectedLogRecord.role} ({selectedLogRecord.badgeId})</div>
                  <div><strong>Source IP Node:</strong> <span className="mono">{selectedLogRecord.ip}</span></div>
                  <div><strong>Timestamp:</strong> {selectedLogRecord.time}</div>
                  <div><strong>Risk Severity:</strong> <span className={`badge badge-${selectedLogRecord.severity === 'CRITICAL' || selectedLogRecord.severity === 'HIGH' ? 'error' : selectedLogRecord.severity === 'MEDIUM' ? 'warning' : 'done'}`}>{selectedLogRecord.severity}</span></div>
                  <div><strong>Audit Action Taken:</strong> <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{selectedLogRecord.actionTaken}</span></div>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', color: 'var(--color-charcoal)', fontWeight: 700, marginBottom: 4 }}>Full Audit Incident Description</div>
                <div style={{ fontSize: 13, color: 'var(--color-ink)', lineHeight: 1.5 }}>
                  {selectedLogRecord.details}
                </div>
              </div>

              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                {selectedLogRecord.category === 'HASH_WARNING' && (
                  <button onClick={() => { setSelectedLogRecord(null); onNav('alerts'); }} className="btn-primary" style={{ background: '#dc2626', borderColor: '#b91c1c', fontSize: 12 }}>
                    Open Hash Mismatch Alert →
                  </button>
                )}
                <button onClick={() => setSelectedLogRecord(null)} className="btn-secondary" style={{ fontSize: 12 }}>
                  Close Audit View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            24-Hour Security Activity & Incident Audit Trail
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Dedicated forensic log tracking security events, failed authentications, access violations, and hash warnings over the past 24 hours
          </p>
        </div>
        <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
          ← BACK TO DASHBOARD
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Failed Authentication', count: 3, filter: 'FAILED_LOGIN', color: '#b45309', bg: '#fef3c7' },
          { label: 'Access Violation', count: 1, filter: 'UNAUTHORIZED', color: '#dc2626', bg: '#fef2f2' },
          { label: 'File Hash Warning', count: 2, filter: 'HASH_WARNING', color: '#b91c1c', bg: '#fff1f2' },
          { label: 'Role Permissions Updated', count: 4, filter: 'ROLE_POLICY', color: '#15803d', bg: '#f0fdf4' },
        ].map(card => (
          <div 
            key={card.label} 
            onClick={() => setSelectedFilter(card.filter)}
            style={{ 
              background: selectedFilter === card.filter ? card.bg : '#ffffff', 
              border: `1.5px solid ${selectedFilter === card.filter ? card.color : 'var(--border)'}`, 
              borderRadius: 8, 
              padding: 16, 
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-charcoal)', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>{card.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'Oswald, sans-serif', color: card.color, marginTop: 4 }}>{card.count}</div>
            <div style={{ fontSize: 10, color: 'var(--color-body)', marginTop: 4 }}>Filter 24h Log Category →</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs & Search */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All 24h Events (10)' },
            { id: 'FAILED_LOGIN', label: 'Failed Authentication (3)' },
            { id: 'UNAUTHORIZED', label: 'Access Violation (1)' },
            { id: 'HASH_WARNING', label: 'File Hash Warning (2)' },
            { id: 'ROLE_POLICY', label: 'Role Permissions (4)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 4,
                border: `1.5px solid ${selectedFilter === tab.id ? 'var(--primary)' : 'var(--border)'}`,
                background: selectedFilter === tab.id ? 'var(--primary)' : '#f8fafc',
                color: selectedFilter === tab.id ? '#ffffff' : 'var(--color-charcoal)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <input
            className="field-input"
            type="text"
            placeholder="Search 24h Log by User / IP / Details..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', fontSize: 12 }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✕</button>
          )}
        </div>
      </div>

      {/* 24-Hour Forensic Audit Trail Table */}
      <div className="section-card">
        <div style={{ padding: '12px 18px', background: '#f8fafc', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
              24-HOUR FORENSIC INCIDENT LOG ({filteredLogs.length} Records)
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-charcoal)', marginTop: 2 }}>
              Immutably logged events recorded within the last 24 hours
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Reference</th>
                <th>Target User & Role</th>
                <th>Incident Description</th>
                <th>Source IP / Node</th>
                <th>Timestamp</th>
                <th>Severity</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id} style={{ background: log.severity === 'CRITICAL' ? '#fff5f5' : undefined }}>
                    <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>
                      {log.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-ink)', fontSize: 13 }}>{log.user}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-charcoal)' }}>{log.role}</div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--color-ink)', maxWidth: 300 }}>
                      <div style={{ fontWeight: 700, color: log.severity === 'CRITICAL' ? '#dc2626' : 'var(--color-ink)' }}>{log.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-charcoal)', marginTop: 2 }}>{log.details}</div>
                    </td>
                    <td className="mono" style={{ fontSize: 11, color: 'var(--color-body)' }}>
                      {log.ip}
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {log.time}
                    </td>
                    <td>
                      <span className={`badge badge-${log.severity === 'CRITICAL' || log.severity === 'HIGH' ? 'error' : log.severity === 'MEDIUM' ? 'warning' : 'done'}`} style={{ fontWeight: 800 }}>
                        {log.severity}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => setSelectedLogRecord(log)}
                        className="btn-secondary"
                        style={{ padding: '4px 12px', fontSize: 11, fontWeight: 700, color: 'var(--primary)', borderColor: 'var(--primary)' }}
                      >
                        Inspect Log Record
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-body)' }}>
                    No 24-hour security incident logs found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


function AlertsView({ onNav, sharedVaultDocs, setSharedVaultDocs }) {
  const [selectedAuditDoc, setSelectedAuditDoc] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const initialDocs = [
    {
      id: 'DOC-1005',
      caseId: 'C-1025',
      caseTitle: 'Financial Fraud Case',
      filename: 'Bank_Ledger_Forensic_C1025.pdf',
      category: 'Police Forensic Audit',
      source: 'Police Department',
      uploadedBy: 'Inspector K. Varma (Crime Branch)',
      timestamp: '2026-09-13 09:10 AM',
      size: '4.5 MB',
      vaultPath: '/sec-vault/c1025/bank_ledger.pdf',
      hash: '0x88F9A2B3C4D5E6F708192A3B4C5D6E7F8091A2B3C4D5E6F708192A3B4C5D6E7F',
      originalHash: '0x11A2B3C4D5E6F708192A3B4C5D6E7F8091A2B3C4D5E6F708192A3B4C5D6E7F',
      isMismatch: true,
      tamperActor: 'Sub-Inspector David R. (Account: POL-SUSPECT-89)',
      history: [
        { version: 'v1.0', time: '2026-09-13 09:10 AM', actor: 'Inspector K. Varma (Crime Branch)', action: 'Initial Ledger Upload', hash: '0x11A2B3C4D5E6F708192A3B4C5D6E7F8091A2B3C4D5E6F708192A3B4C5D6E7F', status: 'VERIFIED' },
        { version: 'v1.1 (UNAUTHORIZED MODIFICATION)', time: '2026-09-13 09:45 AM', actor: 'Sub-Inspector David R. (Account: POL-SUSPECT-89)', action: 'Unauthorized Vault Checksum Alteration', hash: '0x88F9A2B3C4D5E6F708192A3B4C5D6E7F8091A2B3C4D5E6F708192A3B4C5D6E7F', status: 'MISMATCH_FLAGGED' }
      ]
    }
  ];

  const vaultDocsList = sharedVaultDocs || initialDocs;
  const mismatchAlerts = vaultDocsList.filter(d => d.isMismatch);

  const handleRollback = (docToRollback) => {
    const updateFn = (prev) => prev.map(d => {
      if (d.id === docToRollback.id) {
        const restoredHistory = [
          ...d.history,
          {
            version: `v1.2 (ADMIN ROLLBACK)`,
            time: 'Just Now',
            actor: 'System Admin (Master Governance Token)',
            action: 'Cryptographic Rollback to Untampered v1.0 Ledger State',
            hash: d.originalHash,
            status: 'RESTORED'
          }
        ];
        return {
          ...d,
          hash: d.originalHash,
          isMismatch: false,
          history: restoredHistory
        };
      }
      return d;
    });

    if (setSharedVaultDocs) {
      setSharedVaultDocs(updateFn);
    }

    if (selectedAuditDoc && selectedAuditDoc.id === docToRollback.id) {
      setSelectedAuditDoc(prev => ({
        ...prev,
        hash: prev.originalHash,
        isMismatch: false,
        history: [
          ...prev.history,
          {
            version: `v1.2 (ADMIN ROLLBACK)`,
            time: 'Just Now',
            actor: 'System Admin (Master Governance Token)',
            action: 'Cryptographic Rollback to Untampered v1.0 Ledger State',
            hash: prev.originalHash,
            status: 'RESTORED'
          }
        ]
      }));
    }

    setNotification({
      isOpen: true,
      title: 'CRYPTOGRAPHIC ROLLBACK SUCCESSFUL',
      message: `Document ${docToRollback.filename} (Case ${docToRollback.caseId}) has been successfully rolled back to the untampered ledger version (v1.0)! Vault SHA-256 hash verified clean.`,
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

      {/* Case Audit Trail & Forensic Rollback Modal */}
      {selectedAuditDoc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '780px', maxHeight: '90vh', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#1A1A1A', padding: '16px 20px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--accent-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Government Cryptographic Ledger Audit</div>
                <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Oswald, sans-serif', color: '#ffffff', letterSpacing: '0.04em' }}>
                  CASE AUDIT TRAIL: {selectedAuditDoc.caseId} ({selectedAuditDoc.filename})
                </div>
              </div>
              <button onClick={() => setSelectedAuditDoc(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', fontWeight: 700 }}>×</button>
            </div>

            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 16, marginBottom: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
                  <div><strong>Case Reference:</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{selectedAuditDoc.caseId}</span></div>
                  <div><strong>Document Name:</strong> {selectedAuditDoc.filename}</div>
                  <div><strong>Category:</strong> {selectedAuditDoc.category}</div>
                  <div><strong>Upload Source:</strong> {selectedAuditDoc.source}</div>
                  <div><strong>Original Uploader:</strong> {selectedAuditDoc.uploadedBy}</div>
                  <div><strong>Vault File Path:</strong> <span className="mono" style={{ fontSize: 11 }}>{selectedAuditDoc.vaultPath}</span></div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <strong>Current Active Hash:</strong> <span className="mono" style={{ fontSize: 11, color: selectedAuditDoc.isMismatch ? '#dc2626' : 'var(--primary)', fontWeight: 700, wordBreak: 'break-all' }}>{selectedAuditDoc.hash}</span>
                  </div>
                </div>
              </div>

              {selectedAuditDoc.isMismatch && (
                <div style={{ background: '#fff5f5', border: '2px solid #ef4444', borderRadius: 8, padding: 16, marginBottom: 20, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span className="badge badge-error" style={{ fontSize: 11, fontWeight: 800 }}>CRITICAL HASH MISMATCH DETECTED</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#991b1b' }}>Checksum Failed Against Ledger</span>
                  </div>
                  
                  <div style={{ fontSize: 12, color: '#7f1d1d', marginBottom: 12, background: '#fee2e2', padding: '10px 12px', borderRadius: 6, border: '1px solid #fca5a5' }}>
                    <strong>UNAUTHORIZED ACTOR TRACKING:</strong><br />
                    Tampered by: <strong>{selectedAuditDoc.tamperActor}</strong> at <strong>2026-09-13 09:45 AM</strong>.<br />
                    <em>Description: Cryptographic checksum modified in storage node without master private key authorization.</em>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button 
                      onClick={() => handleRollback(selectedAuditDoc)} 
                      className="btn-primary" 
                      style={{ background: '#16a34a', borderColor: '#15803d', padding: '8px 18px', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}
                    >
                      ROLLBACK TO UNTAMPERED LEDGER VERSION (v1.0)
                    </button>
                  </div>
                </div>
              )}

              <div>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em', color: 'var(--color-ink)', textTransform: 'uppercase', marginBottom: 12 }}>
                  IMMUTABLE AUDIT TRAIL & VERSION CHRONOLOGY
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedAuditDoc.history.map((ver, idx) => (
                    <div key={idx} style={{ border: `1px solid ${ver.status === 'MISMATCH_FLAGGED' ? '#fca5a5' : ver.status === 'RESTORED' ? '#86efac' : '#cbd5e1'}`, background: ver.status === 'MISMATCH_FLAGGED' ? '#fef2f2' : ver.status === 'RESTORED' ? '#f0fdf4' : '#ffffff', borderRadius: 8, padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div>
                          <span style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--color-ink)', marginRight: 10 }}>
                            {ver.version}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-charcoal)' }}>
                            {ver.action}
                          </span>
                        </div>
                        <span className={`badge ${ver.status === 'MISMATCH_FLAGGED' ? 'badge-error' : 'badge-active'}`} style={{ fontSize: 10 }}>
                          {ver.status}
                        </span>
                      </div>

                      <div style={{ fontSize: 11, color: 'var(--color-charcoal)', marginBottom: 4 }}>
                        <strong>Actor / User:</strong> {ver.actor} | <strong>Timestamp:</strong> {ver.time}
                      </div>

                      <div className="mono" style={{ fontSize: 10, color: ver.status === 'MISMATCH_FLAGGED' ? '#b91c1c' : 'var(--color-body)', wordBreak: 'break-all' }}>
                        <strong>Checksum Hash:</strong> {ver.hash}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            Document Governance Hash Mismatch Alerts
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Real-time cryptographic SHA-256 ledger mismatch flags and vault integrity violations
          </p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {mismatchAlerts.length > 0 ? (
          mismatchAlerts.map(item => (
            <div key={item.id} className="section-card" style={{ padding: 18, borderLeft: '5px solid #dc2626', background: '#fff5f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{item.id}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}>
                      Cryptographic Document Hash Mismatch
                    </span>
                    <span className="badge badge-error">CRITICAL HASH MISMATCH</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-ink)' }}>
                    {item.filename} (Case {item.caseId})
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {item.timestamp}
                </div>
              </div>

              <div style={{ fontSize: 13, color: 'var(--color-charcoal)', marginBottom: 14, background: '#ffffff', padding: '12px 16px', borderRadius: 6, border: '1px solid #fca5a5' }}>
                <div><strong>Category:</strong> {item.category} | <strong>Upload Source:</strong> {item.source} ({item.uploadedBy})</div>
                <div style={{ marginTop: 4, color: '#dc2626', fontWeight: 700 }}>
                  <strong>Tamper Actor:</strong> {item.tamperActor || 'Unauthorized Actor'}
                </div>
                <div className="mono" style={{ fontSize: 11, color: '#7f1d1d', marginTop: 6, wordBreak: 'break-all' }}>
                  <strong>Vault Active Hash:</strong> {item.hash}<br />
                  <strong>Master Ledger Hash:</strong> {item.originalHash}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button 
                  onClick={() => setSelectedAuditDoc(item)} 
                  className="btn-primary" 
                  style={{ background: '#dc2626', borderColor: '#b91c1c', fontSize: 11, fontWeight: 700, padding: '6px 16px' }}
                >
                  TRIGGER TAMPER ALERT
                </button>
                <button onClick={() => onNav('docs')} className="btn-secondary" style={{ fontSize: 11, padding: '6px 14px' }}>
                  Inspect Vault Governance →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="section-card" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#15803d', fontFamily: 'Oswald, sans-serif' }}>
              ALL DOCUMENT VAULT RECORDS ARE 100% CLEAN
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-charcoal)', marginTop: 4 }}>
              Zero SHA-256 checksum mismatches detected in Document Governance.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DocGovernanceView({ onNav, sharedVaultDocs, setSharedVaultDocs }) {
  const [selectedCaseId, setSelectedCaseId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState('ALL');
  const [selectedAuditDoc, setSelectedAuditDoc] = useState(null);
  const [onlyShowMismatch, setOnlyShowMismatch] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const casesList = [
    { id: 'C-1023', title: 'XYZ Investigation (Theft Case)' },
    { id: 'C-1024', title: 'Cyber Security Breach (Phishing)' },
    { id: 'C-1025', title: 'Financial Fraud Case (Bank Embezzlement)' },
    { id: 'C-1026', title: 'Commercial Burglary (Store Break-in)' }
  ];

  const initialVaultDocs = [
    {
      id: 'DOC-1001',
      caseId: 'C-1023',
      caseTitle: 'XYZ Investigation',
      filename: 'FIR_Primary_Record_C1023.pdf',
      category: 'First Information Report (FIR)',
      source: 'Police Department',
      uploadedBy: 'Inspector Sharma K. (Police)',
      timestamp: '2026-09-12 10:32 AM',
      size: '2.4 MB',
      vaultPath: '/sec-vault/c1023/fir_primary.pdf',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      originalHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      isMismatch: false,
      tamperActor: null,
      history: [
        { version: 'v1.0', time: '2026-09-12 10:32 AM', actor: 'Inspector Sharma K. (Police)', action: 'Original Vault Commit', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', status: 'VERIFIED' }
      ]
    },
    {
      id: 'DOC-1002',
      caseId: 'C-1023',
      caseTitle: 'XYZ Investigation',
      filename: 'Judicial_Remand_Order_C1023.pdf',
      category: 'Court Remand Order',
      source: 'Judicial Court',
      uploadedBy: 'Justice Ramesh (High Court Bench)',
      timestamp: '2026-09-12 11:15 AM',
      size: '1.8 MB',
      vaultPath: '/sec-vault/c1023/remand_order.pdf',
      hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
      originalHash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
      isMismatch: false,
      tamperActor: null,
      history: [
        { version: 'v1.0', time: '2026-09-12 11:15 AM', actor: 'Justice Ramesh (High Court Bench)', action: 'Judicial Order Sealed', hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e', status: 'VERIFIED' }
      ]
    },
    {
      id: 'DOC-1003',
      caseId: 'C-1024',
      caseTitle: 'Cyber Security Breach',
      filename: 'Cyber_Forensic_IP_Trace_C1024.pdf',
      category: 'Forensic Audit Report',
      source: 'Police Department',
      uploadedBy: 'Inspector Sharma K. (Police)',
      timestamp: '2026-09-12 14:05 PM',
      size: '3.9 MB',
      vaultPath: '/sec-vault/c1024/forensic_ip.pdf',
      hash: '7d793037a0760186574b0282f2f435e768c67a76d3e8e19e7a83d7a8f8876c12',
      originalHash: '7d793037a0760186574b0282f2f435e768c67a76d3e8e19e7a83d7a8f8876c12',
      isMismatch: false,
      tamperActor: null,
      history: [
        { version: 'v1.0', time: '2026-09-12 14:05 PM', actor: 'Inspector Sharma K. (Police)', action: 'Cyber Audit Hash Tagged', hash: '7d793037a0760186574b0282f2f435e768c67a76d3e8e19e7a83d7a8f8876c12', status: 'VERIFIED' }
      ]
    },
    {
      id: 'DOC-1004',
      caseId: 'C-1024',
      caseTitle: 'Cyber Security Breach',
      filename: 'Bail_Hearing_Order_C1024.pdf',
      category: 'Court Bench Order',
      source: 'Judicial Court',
      uploadedBy: 'Justice Harish Chandra (Magistrate)',
      timestamp: '2026-09-12 15:40 PM',
      size: '1.2 MB',
      vaultPath: '/sec-vault/c1024/bail_order.pdf',
      hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      originalHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      isMismatch: false,
      tamperActor: null,
      history: [
        { version: 'v1.0', time: '2026-09-12 15:40 PM', actor: 'Justice Harish Chandra (Magistrate)', action: 'Bail Bench Ruling Sealed', hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', status: 'VERIFIED' }
      ]
    },
    {
      id: 'DOC-1005',
      caseId: 'C-1025',
      caseTitle: 'Financial Fraud Case',
      filename: 'Bank_Ledger_Forensic_C1025.pdf',
      category: 'Police Forensic Audit',
      source: 'Police Department',
      uploadedBy: 'Inspector K. Varma (Crime Branch)',
      timestamp: '2026-09-13 09:10 AM',
      size: '4.5 MB',
      vaultPath: '/sec-vault/c1025/bank_ledger.pdf',
      hash: '0x88F9A2B3C4D5E6F708192A3B4C5D6E7F8091A2B3C4D5E6F708192A3B4C5D6E7F',
      originalHash: '0x11A2B3C4D5E6F708192A3B4C5D6E7F8091A2B3C4D5E6F708192A3B4C5D6E7F',
      isMismatch: true,
      tamperActor: 'Sub-Inspector David R. (Account: POL-SUSPECT-89)',
      history: [
        { version: 'v1.0', time: '2026-09-13 09:10 AM', actor: 'Inspector K. Varma (Crime Branch)', action: 'Initial Ledger Upload', hash: '0x11A2B3C4D5E6F708192A3B4C5D6E7F8091A2B3C4D5E6F708192A3B4C5D6E7F', status: 'VERIFIED' },
        { version: 'v1.1 (UNAUTHORIZED MODIFICATION)', time: '2026-09-13 09:45 AM', actor: 'Sub-Inspector David R. (Account: POL-SUSPECT-89)', action: 'Unauthorized Vault Checksum Alteration', hash: '0x88F9A2B3C4D5E6F708192A3B4C5D6E7F8091A2B3C4D5E6F708192A3B4C5D6E7F', status: 'MISMATCH_FLAGGED' }
      ]
    },
    {
      id: 'DOC-1006',
      caseId: 'C-1025',
      caseTitle: 'Financial Fraud Case',
      filename: 'Property_Seizure_Warrant_C1025.pdf',
      category: 'Judicial Warrant Order',
      source: 'Judicial Court',
      uploadedBy: 'Justice Ramesh (High Court Bench)',
      timestamp: '2026-09-13 10:00 AM',
      size: '2.1 MB',
      vaultPath: '/sec-vault/c1025/seizure_warrant.pdf',
      hash: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b',
      originalHash: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b',
      isMismatch: false,
      tamperActor: null,
      history: [
        { version: 'v1.0', time: '2026-09-13 10:00 AM', actor: 'Justice Ramesh (High Court Bench)', action: 'High Court Warrant Sealed', hash: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b', status: 'VERIFIED' }
      ]
    },
    {
      id: 'DOC-1007',
      caseId: 'C-1026',
      caseTitle: 'Commercial Burglary',
      filename: 'CCTV_Seizure_Memo_C1026.pdf',
      category: 'Evidence Seizure Memo',
      source: 'Police Department',
      uploadedBy: 'Sub-Inspector Ramesh (Police)',
      timestamp: '2026-09-13 11:20 AM',
      size: '3.1 MB',
      vaultPath: '/sec-vault/c1026/cctv_seizure.pdf',
      hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      originalHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      isMismatch: false,
      tamperActor: null,
      history: [
        { version: 'v1.0', time: '2026-09-13 11:20 AM', actor: 'Sub-Inspector Ramesh (Police)', action: 'Seizure Memo Vaulted', hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', status: 'VERIFIED' }
      ]
    }
  ];

  const [localVaultDocs, setLocalVaultDocs] = useState(initialVaultDocs);
  const vaultDocsList = sharedVaultDocs || localVaultDocs;

  const filteredDocs = vaultDocsList.filter(doc => {
    if (onlyShowMismatch) return doc.isMismatch;
    const matchesCase = selectedCaseId === 'ALL' || doc.caseId === selectedCaseId;
    const matchesSource = filterSource === 'ALL' || 
      (filterSource === 'POLICE' && doc.source === 'Police Department') || 
      (filterSource === 'COURT' && doc.source === 'Judicial Court');
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      doc.filename.toLowerCase().includes(q) || 
      doc.caseId.toLowerCase().includes(q) || 
      doc.uploadedBy.toLowerCase().includes(q) || 
      doc.hash.toLowerCase().includes(q);
    return matchesCase && matchesSource && matchesSearch;
  });

  const mismatchCount = vaultDocsList.filter(d => d.isMismatch).length;

  const handleRollback = (docToRollback) => {
    const updateFn = (prev) => prev.map(d => {
      if (d.id === docToRollback.id) {
        const restoredHistory = [
          ...d.history,
          {
            version: `v1.2 (ADMIN ROLLBACK)`,
            time: 'Just Now',
            actor: 'System Admin (Master Governance Token)',
            action: 'Cryptographic Rollback to Untampered v1.0 Ledger State',
            hash: d.originalHash,
            status: 'RESTORED'
          }
        ];
        return {
          ...d,
          hash: d.originalHash,
          isMismatch: false,
          history: restoredHistory
        };
      }
      return d;
    });

    if (setSharedVaultDocs) {
      setSharedVaultDocs(updateFn);
    } else {
      setLocalVaultDocs(updateFn);
    }

    if (selectedAuditDoc && selectedAuditDoc.id === docToRollback.id) {
      setSelectedAuditDoc(prev => ({
        ...prev,
        hash: prev.originalHash,
        isMismatch: false,
        history: [
          ...prev.history,
          {
            version: `v1.2 (ADMIN ROLLBACK)`,
            time: 'Just Now',
            actor: 'System Admin (Master Governance Token)',
            action: 'Cryptographic Rollback to Untampered v1.0 Ledger State',
            hash: prev.originalHash,
            status: 'RESTORED'
          }
        ]
      }));
    }

    setNotification({
      isOpen: true,
      title: 'CRYPTOGRAPHIC ROLLBACK SUCCESSFUL',
      message: `Document ${docToRollback.filename} (Case ${docToRollback.caseId}) has been successfully rolled back to the untampered ledger version (v1.0)! Vault SHA-256 hash verified clean.`,
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

      {/* Case Audit Trail & Forensic Rollback Modal */}
      {selectedAuditDoc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '780px', maxHeight: '90vh', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#1A1A1A', padding: '16px 20px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', color: 'var(--accent-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Government Cryptographic Ledger Audit</div>
                <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Oswald, sans-serif', color: '#ffffff', letterSpacing: '0.04em' }}>
                  CASE AUDIT TRAIL: {selectedAuditDoc.caseId} ({selectedAuditDoc.filename})
                </div>
              </div>
              <button onClick={() => setSelectedAuditDoc(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', fontWeight: 700 }}>×</button>
            </div>

            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
              {/* Document Master Particulars Card */}
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 16, marginBottom: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
                  <div><strong>Case Reference:</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{selectedAuditDoc.caseId}</span></div>
                  <div><strong>Document Name:</strong> {selectedAuditDoc.filename}</div>
                  <div><strong>Category:</strong> {selectedAuditDoc.category}</div>
                  <div><strong>Upload Source:</strong> {selectedAuditDoc.source}</div>
                  <div><strong>Original Uploader:</strong> {selectedAuditDoc.uploadedBy}</div>
                  <div><strong>Vault File Path:</strong> <span className="mono" style={{ fontSize: 11 }}>{selectedAuditDoc.vaultPath}</span></div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <strong>Current Active Hash:</strong> <span className="mono" style={{ fontSize: 11, color: selectedAuditDoc.isMismatch ? '#dc2626' : 'var(--primary)', fontWeight: 700, wordBreak: 'break-all' }}>{selectedAuditDoc.hash}</span>
                  </div>
                </div>
              </div>

              {/* HASH MISMATCH WARNING & ROLLBACK CONTROL BOX */}
              {selectedAuditDoc.isMismatch && (
                <div style={{ background: '#fff5f5', border: '2px solid #ef4444', borderRadius: 8, padding: 16, marginBottom: 20, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span className="badge badge-error" style={{ fontSize: 11, fontWeight: 800 }}>CRITICAL HASH MISMATCH DETECTED</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#991b1b' }}>Checksum Failed Against Ledger</span>
                  </div>
                  
                  <div style={{ fontSize: 12, color: '#7f1d1d', marginBottom: 12, background: '#fee2e2', padding: '10px 12px', borderRadius: 6, border: '1px solid #fca5a5' }}>
                    <strong>UNAUTHORIZED ACTOR TRACKING:</strong><br />
                    Tampered by: <strong>{selectedAuditDoc.tamperActor}</strong> at <strong>2026-09-13 09:45 AM</strong>.<br />
                    <em>Description: Cryptographic checksum modified in storage node without master private key authorization.</em>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button 
                      onClick={() => handleRollback(selectedAuditDoc)} 
                      className="btn-primary" 
                      style={{ background: '#16a34a', borderColor: '#15803d', padding: '8px 18px', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}
                    >
                      ROLLBACK TO UNTAMPERED LEDGER VERSION (v1.0)
                    </button>
                  </div>
                </div>
              )}

              {/* VERSION HISTORY & AUDIT TRAIL LOG */}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em', color: 'var(--color-ink)', textTransform: 'uppercase', marginBottom: 12 }}>
                  IMMUTABLE AUDIT TRAIL & VERSION CHRONOLOGY
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedAuditDoc.history.map((ver, idx) => (
                    <div key={idx} style={{ border: `1px solid ${ver.status === 'MISMATCH_FLAGGED' ? '#fca5a5' : ver.status === 'RESTORED' ? '#86efac' : '#cbd5e1'}`, background: ver.status === 'MISMATCH_FLAGGED' ? '#fef2f2' : ver.status === 'RESTORED' ? '#f0fdf4' : '#ffffff', borderRadius: 8, padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div>
                          <span style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--color-ink)', marginRight: 10 }}>
                            {ver.version}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-charcoal)' }}>
                            {ver.action}
                          </span>
                        </div>
                        <span className={`badge ${ver.status === 'MISMATCH_FLAGGED' ? 'badge-error' : 'badge-active'}`} style={{ fontSize: 10 }}>
                          {ver.status}
                        </span>
                      </div>

                      <div style={{ fontSize: 11, color: 'var(--color-charcoal)', marginBottom: 4 }}>
                        <strong>Actor / User:</strong> {ver.actor} | <strong>Timestamp:</strong> {ver.time}
                      </div>

                      <div className="mono" style={{ fontSize: 10, color: ver.status === 'MISMATCH_FLAGGED' ? '#b91c1c' : 'var(--color-body)', wordBreak: 'break-all' }}>
                        <strong>Checksum Hash:</strong> {ver.hash}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>
            Cryptographic Document Vault & Governance
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0, fontWeight: 500 }}>
            Central repository for police investigation records & court order documents with real-time SHA-256 hash integrity validation
          </p>
        </div>
        {onNav && (
          <button onClick={() => onNav('dashboard')} className="btn-secondary" style={{ fontSize: 12 }}>
            ← BACK TO DASHBOARD
          </button>
        )}
      </div>

      {/* HASH MISMATCH ALERT BANNER */}
      {mismatchCount > 0 && (
        <div style={{ background: '#fef2f2', border: '2px solid #ef4444', borderRadius: 8, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ background: '#ef4444', color: '#ffffff', fontWeight: 800, padding: '6px 12px', borderRadius: 4, fontSize: 12, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.06em' }}>
              CRITICAL HASH MISMATCH ALERT
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#991b1b' }}>
                {mismatchCount} Vault Document(s) Flagged for Hash Signature Mismatch!
              </div>
              <div style={{ fontSize: 12, color: '#7f1d1d', marginTop: 2 }}>
                Document checksum differs from immutable system ledger! Potential unauthorized file modification detected.
              </div>
            </div>
          </div>
          <button onClick={() => onNav('alerts')} className="btn-primary" style={{ background: '#dc2626', borderColor: '#b91c1c', fontSize: 11, padding: '6px 16px' }}>
            Inspect Flagged Alerts →
          </button>
        </div>
      )}

      {/* Vault Statistics Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <div 
          className="stat-card" 
          onClick={() => { setFilterSource('ALL'); setSelectedCaseId('ALL'); setOnlyShowMismatch(false); }}
          title="Click to view all vault records"
          style={{ cursor: 'pointer', border: !onlyShowMismatch && filterSource === 'ALL' && selectedCaseId === 'ALL' ? '2px solid var(--primary)' : undefined }}
        >
          <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Total Vault Records</div>
          <div style={{ fontSize: 28, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1 }}>{vaultDocsList.length}</div>
          <div style={{ fontSize: 11, color: 'var(--color-body)', marginTop: 6, fontWeight: 600 }}>Police & Court Uploads</div>
        </div>

        <div 
          className="stat-card" 
          onClick={() => { setFilterSource('POLICE'); setOnlyShowMismatch(false); }}
          title="Click to filter by Police Department Uploads"
          style={{ cursor: 'pointer', border: !onlyShowMismatch && filterSource === 'POLICE' ? '2px solid var(--primary)' : undefined }}
        >
          <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Police Uploaded Docs</div>
          <div style={{ fontSize: 28, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{vaultDocsList.filter(d => d.source === 'Police Department').length}</div>
          <div style={{ fontSize: 11, color: '#15803d', marginTop: 6, fontWeight: 600 }}>FIR, Forensics & Seizures</div>
        </div>

        <div 
          className="stat-card" 
          onClick={() => { setFilterSource('COURT'); setOnlyShowMismatch(false); }}
          title="Click to filter by Judicial Court Orders"
          style={{ cursor: 'pointer', border: !onlyShowMismatch && filterSource === 'COURT' ? '2px solid var(--primary)' : undefined }}
        >
          <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Court Bench Orders</div>
          <div style={{ fontSize: 28, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{vaultDocsList.filter(d => d.source === 'Judicial Court').length}</div>
          <div style={{ fontSize: 11, color: '#15803d', marginTop: 6, fontWeight: 600 }}>Remands, Warrants & Bails</div>
        </div>

        <div 
          className="stat-card" 
          onClick={() => { setOnlyShowMismatch(true); setSelectedCaseId('ALL'); }}
          title="Click to filter by Hash Integrity Mismatch Alert"
          style={{ cursor: 'pointer', borderColor: onlyShowMismatch ? '#dc2626' : mismatchCount > 0 ? '#ef4444' : undefined, background: onlyShowMismatch || mismatchCount > 0 ? '#fff5f5' : undefined, borderWidth: onlyShowMismatch ? 2 : 1 }}
        >
          <div style={{ fontSize: 11, color: mismatchCount > 0 ? '#b91c1c' : 'var(--color-charcoal)', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Hash Integrity Check</div>
          <div style={{ fontSize: 28, fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: mismatchCount > 0 ? '#dc2626' : '#15803d', lineHeight: 1 }}>
            {mismatchCount > 0 ? `${mismatchCount} ALERT` : '100% OK'}
          </div>
          <div style={{ fontSize: 11, color: mismatchCount > 0 ? '#dc2626' : '#15803d', marginTop: 6, fontWeight: 600 }}>
            {mismatchCount > 0 ? 'Hash Mismatch Flagged' : 'SHA-256 Validated'}
          </div>
        </div>
      </div>

      {/* Case Selector & Filters Bar */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-ink)' }}>
            FILTER BY CASE REFERENCE:
          </span>
          <select 
            className="field-input" 
            value={selectedCaseId} 
            onChange={e => setSelectedCaseId(e.target.value)}
            style={{ width: 260, fontSize: 12, fontWeight: 700 }}
          >
            <option value="ALL">All Vault Cases (C-1023 to C-1026)</option>
            {casesList.map(c => (
              <option key={c.id} value={c.id}>{c.id} - {c.title}</option>
            ))}
          </select>

          <span style={{ fontSize: 11, fontFamily: 'Oswald, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-ink)', marginLeft: 10 }}>
            SOURCE:
          </span>
          <select 
            className="field-input" 
            value={filterSource} 
            onChange={e => setFilterSource(e.target.value)}
            style={{ width: 180, fontSize: 12, fontWeight: 700 }}
          >
            <option value="ALL">All Upload Sources</option>
            <option value="POLICE">Police Department</option>
            <option value="COURT">Judicial Court</option>
          </select>
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <input 
            className="field-input" 
            type="text" 
            placeholder="Search by Document / Hash / Uploader..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', fontSize: 12 }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✕</button>
          )}
        </div>
      </div>

      {/* Case-by-Case Vault Document Records Table */}
      <div className="section-card">
        <div style={{ padding: '12px 18px', background: '#f8fafc', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
              ENCRYPTED EVIDENCE & COURT ORDER VAULT RECORDS {selectedCaseId !== 'ALL' ? `(${selectedCaseId})` : ''}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-charcoal)', marginTop: 2 }}>
              Showing {filteredDocs.length} vault document(s) protected by cryptographic SHA-256 signatures (Click Case ID to view Audit Trail)
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Case Reference</th>
                <th>Document Name & Category</th>
                <th>Upload Source & Officer</th>
                <th>Upload Timestamp</th>
                <th>Vault Integrity Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length > 0 ? (
                filteredDocs.map(doc => (
                  <tr key={doc.id} style={{ background: doc.isMismatch ? '#fff5f5' : undefined }}>
                    <td className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>
                      <button
                        onClick={() => setSelectedAuditDoc(doc)}
                        style={{ background: 'none', border: 'none', padding: 0, color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit' }}
                        title="Click to view Case Audit Trail & History"
                      >
                        {doc.caseId}
                      </button>
                    </td>
                    <td>
                      <div 
                        onClick={() => setSelectedAuditDoc(doc)}
                        style={{ fontWeight: 700, color: doc.isMismatch ? '#b91c1c' : 'var(--color-ink)', fontSize: 13, cursor: 'pointer' }}
                        title="Click to view Document Version History"
                      >
                        {doc.filename}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-charcoal)' }}>
                        {doc.category} ({doc.size})
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-ink)' }}>
                        {doc.uploadedBy}
                      </div>
                      <span className={`badge ${doc.source === 'Police Department' ? 'badge-done' : 'badge-active'}`} style={{ fontSize: 9, marginTop: 2 }}>
                        {doc.source}
                      </span>
                    </td>
                    <td className="mono" style={{ fontSize: 11, color: 'var(--color-body)' }}>
                      {doc.timestamp}
                    </td>
                    <td>
                      {doc.isMismatch ? (
                        <div 
                          onClick={() => onNav('alerts')}
                          style={{ display: 'flex', flexDirection: 'column', gap: 2, cursor: 'pointer' }}
                          title="Click to view Alert Page"
                        >
                          <span className="badge badge-error" style={{ fontWeight: 800, padding: '4px 8px' }}>
                            HASH MISMATCH ALERT!
                          </span>
                          <span style={{ fontSize: 10, color: '#dc2626', fontWeight: 700 }}>
                            Checksum Failed (Click to view Alert Page)
                          </span>
                        </div>
                      ) : (
                        <span className="badge badge-active" style={{ fontWeight: 700 }}>
                          ✓ HASH MATCHED
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => doc.isMismatch ? onNav('alerts') : setSelectedAuditDoc(doc)} 
                        className={doc.isMismatch ? "btn-primary" : "btn-secondary"}
                        style={{ 
                          background: doc.isMismatch ? '#dc2626' : undefined, 
                          borderColor: doc.isMismatch ? '#b91c1c' : undefined, 
                          padding: '4px 12px', 
                          fontSize: 11, 
                          fontWeight: 700 
                        }}
                        title={doc.isMismatch ? "Click to view Alert Page" : "Click to view Vault Record Audit Trail"}
                      >
                        {doc.isMismatch ? 'TRIGGER TAMPER ALERT' : 'INSPECT VAULT RECORD'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-body)' }}>
                    No vault records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

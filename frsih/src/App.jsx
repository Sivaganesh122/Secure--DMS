import { useState } from 'react';
import LoginPage from './components/LoginPage';
import AdminRegisterPage from './components/AdminRegisterPage';
import AdminDashboard from './components/AdminDashboard';
import PoliceDashboard from './components/PoliceDashboard';
import ProsecutorDashboard from './components/ProsecutorDashboard';
import JudgeDashboard from './components/JudgeDashboard';

export default function App() {
  const [state, setState] = useState({ screen: 'login' });
  const [sharedVaultDocs, setSharedVaultDocs] = useState([
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
  ]);

  const handleLogin = (role) => setState({ screen: 'dashboard', role });
  const handleLogout = () => setState({ screen: 'login' });
  const handleNavigateToRegister = () => setState({ screen: 'register' });
  const handleNavigateToLogin = () => setState({ screen: 'login' });
  
  const handleRegisterSuccess = (userData) => {
    setState({ screen: 'dashboard', role: userData.role || 'admin' });
  };

  if (state.screen === 'register') {
    return (
      <AdminRegisterPage
        onNavigateToLogin={handleNavigateToLogin}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  if (state.screen === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onNavigateToRegister={handleNavigateToRegister}
      />
    );
  }

  switch (state.role) {
    case 'admin': return <AdminDashboard onLogout={handleLogout} sharedVaultDocs={sharedVaultDocs} setSharedVaultDocs={setSharedVaultDocs} />;
    case 'police': return <PoliceDashboard onLogout={handleLogout} sharedVaultDocs={sharedVaultDocs} setSharedVaultDocs={setSharedVaultDocs} />;
    case 'prosecutor': return <ProsecutorDashboard onLogout={handleLogout} sharedVaultDocs={sharedVaultDocs} setSharedVaultDocs={setSharedVaultDocs} />;
    case 'judge': return <JudgeDashboard onLogout={handleLogout} sharedVaultDocs={sharedVaultDocs} setSharedVaultDocs={setSharedVaultDocs} />;
    default: return <LoginPage onLogin={handleLogin} onNavigateToRegister={handleNavigateToRegister} />;
  }
}

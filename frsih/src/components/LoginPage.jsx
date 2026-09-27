import { useState } from 'react';

export default function LoginPage({ onLogin, onNavigateToRegister }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [step, setStep] = useState('credentials');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [error, setError] = useState('');

  const handleCredentials = (e) => {
    e.preventDefault();
    if (!userId || !password) { setError('All fields are required.'); return; }
    setError('');
    setStep('mfa');
  };

  const handleMfa = (e) => {
    e.preventDefault();
    if (!mfaCode) { setError('Enter the MFA code.'); return; }
    onLogin(selectedRole);
  };

  const roles = [
    { id: 'admin', label: 'Administrator' },
    { id: 'police', label: 'Police Officer' },
    { id: 'prosecutor', label: 'Prosecutor' },
    { id: 'judge', label: 'Judge' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header - National Portal Style */}
      <div style={{ background: 'var(--primary)', borderBottom: '3px solid var(--accent-gold)', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.15)', border: '1.5px solid var(--accent-gold)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            🛡️
          </div>
          <div>
            <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase' }}>
              National Legal & Investigation Portal
            </div>
            <div style={{ fontSize: 11, color: 'var(--accent-gold)', letterSpacing: '0.05em', fontWeight: 600 }}>
              GOVERNMENT OF INDIA · MINISTRY OF JUSTICE
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, background: 'var(--primary)', border: '2px solid var(--accent-gold)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 12, boxShadow: '0 4px 12px rgba(10,37,64,0.2)' }}>
              🛡️
            </div>
            <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 24, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-ink)', margin: '0 0 4px' }}>
              Official Single Sign-On
            </h1>
            <p style={{ fontSize: 13, color: 'var(--color-charcoal)', letterSpacing: '0.02em', margin: 0, fontWeight: 500 }}>
              Classified Access for Authorized Personnel Only
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
            {/* Gold top strip */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #1A1A1A, var(--accent-gold), #1A1A1A)' }} />

            <div style={{ padding: 28 }}>
              {step === 'credentials' ? (
                <form onSubmit={handleCredentials}>
                  {/* Role selector */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 8, fontWeight: 700 }}>
                      Select Official Role
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {roles.map(r => (
                        <button key={r.id} type="button" onClick={() => setSelectedRole(r.id)}
                          style={{
                            padding: '10px 12px',
                            background: selectedRole === r.id ? 'var(--primary)' : '#f8fafc',
                            border: `1px solid ${selectedRole === r.id ? 'var(--primary)' : 'var(--border)'}`,
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                            color: selectedRole === r.id ? '#ffffff' : 'var(--color-charcoal)',
                            fontSize: 13,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s'
                          }}>
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                      Official User ID / Government Email
                    </label>
                    <input className="field-input" type="text" placeholder="e.g. GOV-OFFICER-904" value={userId} onChange={e => setUserId(e.target.value)} />
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                      Secure Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input className="field-input" type={showPassword ? 'text' : 'password'} placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: 50 }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)', fontSize: 11, fontWeight: 700 }}>
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }} />

                  {error && (
                    <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 4, padding: '9px 12px', fontSize: 13, color: '#b91c1c', marginBottom: 14, fontWeight: 600 }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px 24px', fontSize: 15 }}>
                    AUTHENTICATE & ENTER
                  </button>
                </form>
              ) : (
                <form onSubmit={handleMfa}>
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 18, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px', color: 'var(--color-ink)' }}>Multi-Factor Verification</h3>
                    <p style={{ fontSize: 12, color: 'var(--color-body)', margin: 0 }}>Enter the 6-digit verification code from your security token</p>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <input className="field-input mono" type="text" placeholder="000000" maxLength={6} value={mfaCode} onChange={e => setMfaCode(e.target.value.replace(/\D/g, ''))} style={{ textAlign: 'center', fontSize: 24, letterSpacing: '0.3em', fontWeight: 700 }} />
                  </div>
                  {error && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 4, padding: '9px 12px', fontSize: 13, color: '#b91c1c', marginBottom: 14, fontWeight: 600 }}>{error}</div>}
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px 24px', fontSize: 15 }}>VERIFY TOKEN & ENTER</button>
                  <button type="button" onClick={() => setStep('credentials')} className="btn-secondary" style={{ width: '100%', marginTop: 8, fontSize: 13 }}>← RETURN TO LOGIN</button>
                </form>
              )}
            </div>

            <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, color: 'var(--color-body)', fontWeight: 600 }}>AES-256 Encrypted</span>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span style={{ fontSize: 11, color: 'var(--color-body)', fontWeight: 600 }}>MFA Enforced</span>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span style={{ fontSize: 11, color: 'var(--color-body)', fontWeight: 600 }}>Government Audited</span>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-mute)', marginTop: 20, lineHeight: 1.4 }}>
            Notice: Unauthorized access or misuse of this Government Portal is strictly prohibited under the Information Technology Act. All activities are logged with IP & Geolocation tracking.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function AdminRegisterPage({ onNavigateToLogin, onRegisterSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'admin',
    serviceId: '',
    designation: '',
    gender: 'Male',
    dob: '',
    email: '',
    phone: '',
    department: 'Metropolitan Cyber & Crime Security Directorate',
    clearanceLevel: 'Level 4 (Top Secret / Admin)',
    supervisorId: 'SUP-GOV-9012',
    password: '',
    confirmPassword: '',
    mfaType: 'totp',
    tokenSerial: '',
    idCardFile: null,
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [assignedAdminId, setAssignedAdminId] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { id: 'admin', label: 'System Administrator', icon: '🛡️', desc: 'Full system management, audit controls, and security policies' },
    { id: 'police', label: 'Police Officer', icon: '👮', desc: 'FIR filing, evidence upload, forensic logs, and suspect records' },
    { id: 'prosecutor', label: 'Public Prosecutor', icon: '⚖️', desc: 'Case charge-sheets, evidence review, and legal court filings' },
    { id: 'judge', label: 'Presiding Judge', icon: '👨‍⚖️', desc: 'Warrant authorization, judicial orders, and trial verdicts' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: '#d4d4d8' };
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;

    if (score <= 25) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 50) return { score, label: 'Moderate', color: '#f59e0b' };
    if (score <= 75) return { score, label: 'Strong', color: '#3b82f6' };
    return { score, label: 'Classified Grade (Very Strong)', color: '#10b981' };
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full official name is required';
      if (!formData.serviceId.trim()) newErrors.serviceId = 'Government Badge / Service ID is required';
      if (!formData.designation.trim()) newErrors.designation = 'Official designation is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
    } else if (step === 2) {
      if (!formData.email.trim()) {
        newErrors.email = 'Government email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Enter a valid email address';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Mobile number is required';
      if (!formData.department.trim()) newErrors.department = 'Department is required';
    } else if (step === 3) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the Classified Conduct & NDA terms';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleQuickFill = () => {
    setFormData({
      fullName: 'Vikramaditya R. Singh',
      role: 'admin',
      serviceId: 'ADM-SYS-99410',
      designation: 'Senior System Administrator & Chief Security Auditor',
      gender: 'Male',
      dob: '1987-05-12',
      email: 'vikram.singh@justice.gov.in',
      phone: '+91 98112 34567',
      department: 'National Cyber Security Directorate - Sector 4',
      clearanceLevel: 'Level 4 (Top Secret / Admin)',
      supervisorId: 'SUP-GOV-9012',
      password: 'AdminSecurePass2026!',
      confirmPassword: 'AdminSecurePass2026!',
      mfaType: 'totp',
      tokenSerial: 'KEY-8839-4402',
      idCardFile: 'GOV_ID_CARD_SCAN.pdf',
      termsAccepted: true
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `ADM-${Math.floor(10000 + Math.random() * 90000)}`;
      setAssignedAdminId(generatedId);
      setIsSubmitting(false);
      setRegistrationComplete(true);
    }, 1200);
  };

  const pwdStrength = calculatePasswordStrength(formData.password);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Banner */}
      <div style={{ background: 'var(--primary)', borderBottom: '3px solid var(--accent-gold)', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, background: '#ffffff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
            🛡️
          </div>
          <div>
            <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase' }}>
              National Legal & Investigation Portal
            </div>
            <div style={{ fontSize: 11, color: 'var(--accent-gold)', letterSpacing: '0.05em', fontWeight: 600 }}>
              GOVERNMENT OF INDIA · MINISTRY OF JUSTICE · OFFICIAL PERSONNEL REGISTRATION
            </div>
          </div>
        </div>

        <button 
          onClick={onNavigateToLogin}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          🔑 Back to Login
        </button>
      </div>

      {/* Main Registration Area */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '30px 20px' }}>
        <div style={{ width: '100%', maxWidth: 760 }}>
          
          {/* Header Card */}
          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 8, padding: 24, marginBottom: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 24 }}>🏛️</span>
                  <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Official Personnel & Administrator Enrollment
                  </h1>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-charcoal)', margin: 0 }}>
                  Provision new verified accounts for System Administrators, Police, Prosecutors, and Judicial Benches.
                </p>
              </div>

              <button
                type="button"
                onClick={handleQuickFill}
                style={{
                  background: '#fef3c7',
                  border: '1px solid #f59e0b',
                  color: '#92400e',
                  padding: '6px 14px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                ⚡ Quick Fill Demo Data
              </button>
            </div>

            {/* Stepper Progress Bar */}
            {!registrationComplete && (
              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[
                  { step: 1, title: '1. Identity & Role', desc: 'Service ID & Designation' },
                  { step: 2, title: '2. Clearance & Contact', desc: 'Govt Dept & Security Level' },
                  { step: 3, title: '3. Credentials & Consent', desc: 'Passwords, MFA & Conduct' },
                ].map(s => (
                  <div 
                    key={s.step} 
                    style={{
                      padding: '10px 14px',
                      borderRadius: 6,
                      background: currentStep === s.step ? 'var(--primary)' : currentStep > s.step ? '#ecfdf5' : '#f8fafc',
                      border: `1px solid ${currentStep === s.step ? 'var(--primary)' : currentStep > s.step ? '#10b981' : 'var(--border)'}`,
                      color: currentStep === s.step ? '#ffffff' : 'var(--color-ink)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em', color: currentStep === s.step ? '#ffffff' : 'var(--color-ink)' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.8, color: currentStep === s.step ? 'var(--accent-gold)' : 'var(--color-body)' }}>
                      {s.desc}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Container */}
          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg, #1A1A1A, var(--accent-gold), #1A1A1A)' }} />

            <div style={{ padding: 28 }}>
              {registrationComplete ? (
                /* Success View */
                <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                  <div style={{ width: 72, height: 72, background: '#ecfdf5', border: '2px solid #10b981', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 16 }}>
                    ✅
                  </div>

                  <h2 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 24, fontWeight: 700, margin: '0 0 8px', letterSpacing: '0.05em', color: '#065f46' }}>
                    OFFICIAL ACCOUNT ENROLLED SUCCESSFULLY
                  </h2>
                  <p style={{ fontSize: 14, color: 'var(--color-charcoal)', maxWidth: 540, margin: '0 auto 24px' }}>
                    Your official registration details have been encrypted and submitted to the Central Ministry of Justice Directory.
                  </p>

                  <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 6, padding: 20, maxWidth: 520, margin: '0 auto 24px', textAlign: 'left' }}>
                    <div style={{ fontSize: 12, fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: 12 }}>
                      📋 OFFICIAL PROVISIONING SUMMARY
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                      <div>
                        <span style={{ color: 'var(--color-body)', display: 'block', fontSize: 11 }}>Official User ID:</span>
                        <strong className="mono" style={{ fontSize: 15, color: 'var(--primary)' }}>{assignedAdminId}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-body)', display: 'block', fontSize: 11 }}>Assigned Role:</span>
                        <strong>{roles.find(r => r.id === formData.role)?.label}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-body)', display: 'block', fontSize: 11 }}>Official Name:</span>
                        <strong>{formData.fullName}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-body)', display: 'block', fontSize: 11 }}>Government Email:</span>
                        <strong>{formData.email}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-body)', display: 'block', fontSize: 11 }}>Clearance Tier:</span>
                        <strong style={{ color: '#b8860b' }}>{formData.clearanceLevel}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-body)', display: 'block', fontSize: 11 }}>MFA Status:</span>
                        <strong style={{ color: '#10b981' }}>Enforced (TOTP Ready)</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button
                      onClick={onNavigateToLogin}
                      className="btn-primary"
                      style={{ padding: '12px 28px', fontSize: 15 }}
                    >
                      🔐 Proceed to Official Login
                    </button>
                    {onRegisterSuccess && (
                      <button
                        onClick={() => onRegisterSuccess(formData)}
                        className="btn-secondary"
                        style={{ padding: '12px 24px', fontSize: 15 }}
                      >
                        ⚡ Log In Immediately
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>

                  {/* STEP 1: IDENTITY & ROLE */}
                  {currentStep === 1 && (
                    <div>
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 10, fontWeight: 700 }}>
                          1. Select Official System Role
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          {roles.map(r => (
                            <div
                              key={r.id}
                              onClick={() => handleInputChange('role', r.id)}
                              style={{
                                padding: 14,
                                background: formData.role === r.id ? '#f4f4f5' : '#ffffff',
                                border: `2px solid ${formData.role === r.id ? 'var(--primary)' : 'var(--border)'}`,
                                borderRadius: 6,
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: 20 }}>{r.icon}</span>
                                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-ink)' }}>{r.label}</span>
                              </div>
                              <p style={{ fontSize: 11, color: 'var(--color-body)', margin: 0, lineHeight: 1.3 }}>
                                {r.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                            👤 Full Official Name *
                          </label>
                          <input
                            className="field-input"
                            type="text"
                            placeholder="e.g. Vikramaditya R. Singh"
                            value={formData.fullName}
                            onChange={e => handleInputChange('fullName', e.target.value)}
                          />
                          {errors.fullName && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>⚠️ {errors.fullName}</div>}
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                            🎖️ Govt Service ID / Badge / Bar No *
                          </label>
                          <input
                            className="field-input mono"
                            type="text"
                            placeholder="e.g. ADM-SYS-99410"
                            value={formData.serviceId}
                            onChange={e => handleInputChange('serviceId', e.target.value)}
                          />
                          {errors.serviceId && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>⚠️ {errors.serviceId}</div>}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                            📜 Designation / Title *
                          </label>
                          <input
                            className="field-input"
                            type="text"
                            placeholder="e.g. Senior Auditor"
                            value={formData.designation}
                            onChange={e => handleInputChange('designation', e.target.value)}
                          />
                          {errors.designation && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>⚠️ {errors.designation}</div>}
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                            📅 Date of Birth *
                          </label>
                          <input
                            className="field-input"
                            type="date"
                            value={formData.dob}
                            onChange={e => handleInputChange('dob', e.target.value)}
                          />
                          {errors.dob && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>⚠️ {errors.dob}</div>}
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                            ⚧ Gender
                          </label>
                          <select
                            className="field-input"
                            value={formData.gender}
                            onChange={e => handleInputChange('gender', e.target.value)}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: CLEARANCE & CONTACT */}
                  {currentStep === 2 && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                            📧 Govt Email Address (*.gov.in) *
                          </label>
                          <input
                            className="field-input"
                            type="email"
                            placeholder="e.g. officer@justice.gov.in"
                            value={formData.email}
                            onChange={e => handleInputChange('email', e.target.value)}
                          />
                          {errors.email && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>⚠️ {errors.email}</div>}
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                            📱 Mobile Phone Number *
                          </label>
                          <input
                            className="field-input mono"
                            type="text"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={e => handleInputChange('phone', e.target.value)}
                          />
                          {errors.phone && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>⚠️ {errors.phone}</div>}
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                          🏢 Department / Police Station / Judicial Bench Assignment *
                        </label>
                        <input
                          className="field-input"
                          type="text"
                          placeholder="e.g. Metropolitan Cyber & Crime Security Directorate"
                          value={formData.department}
                          onChange={e => handleInputChange('department', e.target.value)}
                        />
                        {errors.department && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>⚠️ {errors.department}</div>}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                            🔒 Requested Security Clearance Tier
                          </label>
                          <select
                            className="field-input"
                            value={formData.clearanceLevel}
                            onChange={e => handleInputChange('clearanceLevel', e.target.value)}
                          >
                            <option value="Level 1 (Restricted Access)">Level 1 (Restricted Access)</option>
                            <option value="Level 2 (Confidential Operational)">Level 2 (Confidential Operational)</option>
                            <option value="Level 3 (Secret Investigation)">Level 3 (Secret Investigation)</option>
                            <option value="Level 4 (Top Secret / Admin)">Level 4 (Top Secret / Admin)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                            👨‍💼 Supervisor Reference ID
                          </label>
                          <input
                            className="field-input mono"
                            type="text"
                            placeholder="e.g. SUP-GOV-9012"
                            value={formData.supervisorId}
                            onChange={e => handleInputChange('supervisorId', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: CREDENTIALS & CONSENT */}
                  {currentStep === 3 && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                            🔒 Password *
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input
                              className="field-input"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••••••"
                              value={formData.password}
                              onChange={e => handleInputChange('password', e.target.value)}
                              style={{ paddingRight: 40 }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
                            >
                              {showPassword ? '🙈' : '👁'}
                            </button>
                          </div>
                          {errors.password && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>⚠️ {errors.password}</div>}
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                            🔒 Confirm Password *
                          </label>
                          <input
                            className="field-input"
                            type="password"
                            placeholder="••••••••••••"
                            value={formData.confirmPassword}
                            onChange={e => handleInputChange('confirmPassword', e.target.value)}
                          />
                          {errors.confirmPassword && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>⚠️ {errors.confirmPassword}</div>}
                        </div>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div style={{ marginBottom: 16, padding: 10, background: '#f8fafc', borderRadius: 6, border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                            <span>Password Security Standard:</span>
                            <span style={{ color: pwdStrength.color }}>{pwdStrength.label}</span>
                          </div>
                          <div style={{ width: '100%', height: 6, background: '#e4e4e7', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${pwdStrength.score}%`, height: '100%', background: pwdStrength.color, transition: 'all 0.3s' }} />
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                            🔑 Preferred MFA Method
                          </label>
                          <select
                            className="field-input"
                            value={formData.mfaType}
                            onChange={e => handleInputChange('mfaType', e.target.value)}
                          >
                            <option value="totp">Authenticator App (TOTP Code)</option>
                            <option value="hardware">Hardware Security Key (YubiKey)</option>
                            <option value="sms">Government SMS OTP</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: 6, fontWeight: 700 }}>
                            🏷️ Security Key / Hardware Serial (Optional)
                          </label>
                          <input
                            className="field-input mono"
                            type="text"
                            placeholder="e.g. KEY-8839-4402"
                            value={formData.tokenSerial}
                            onChange={e => handleInputChange('tokenSerial', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* NDA Terms Box */}
                      <div style={{ marginBottom: 16, background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 6, padding: 14 }}>
                        <label style={{ display: 'flex', gap: 10, cursor: 'pointer', alignItems: 'flex-start' }}>
                          <input
                            type="checkbox"
                            checked={formData.termsAccepted}
                            onChange={e => handleInputChange('termsAccepted', e.target.checked)}
                            style={{ marginTop: 3 }}
                          />
                          <span style={{ fontSize: 12, color: '#78350f', lineHeight: 1.4 }}>
                            <strong>Official Conduct & Classified Data Declaration:</strong> I solemnly affirm that I am an authorized government official. All data accessed or registered will be handled according to the Official Secrets Act & IT Act 2000. Unauthorized distribution is punishable by law.
                          </span>
                        </label>
                        {errors.termsAccepted && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6, fontWeight: 600 }}>⚠️ {errors.termsAccepted}</div>}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="btn-secondary"
                        style={{ padding: '10px 20px', fontSize: 14 }}
                      >
                        ← Back
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onNavigateToLogin}
                        className="btn-secondary"
                        style={{ padding: '10px 20px', fontSize: 14 }}
                      >
                        Cancel
                      </button>
                    )}

                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="btn-primary"
                        style={{ padding: '10px 24px', fontSize: 14 }}
                      >
                        Continue to Step {currentStep + 1} →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary"
                        style={{ padding: '10px 28px', fontSize: 14, background: 'var(--primary)' }}
                      >
                        {isSubmitting ? '⌛ SUBMITTING ENROLLMENT...' : '🛡️ ENROLL & CREATE ACCOUNT'}
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Strip */}
            <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, color: 'var(--color-body)', fontWeight: 600 }}>🔒 256-Bit Encrypted Form</span>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span style={{ fontSize: 11, color: 'var(--color-body)', fontWeight: 600 }}>🛡️ Super-Admin Verified</span>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span style={{ fontSize: 11, color: 'var(--color-body)', fontWeight: 600 }}>🏛️ Govt IT Standard v4.2</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

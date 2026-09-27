import React from 'react';

export default function NotificationModal({ isOpen, onClose, title = "System Notification", message, type = "success" }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '460px',
          background: '#ffffff',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.15)',
          border: '1px solid #1A1A1A',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1A1A1A 0%, #2d2d30 100%)',
            borderBottom: '1px solid #334155',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: '#334155', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              🛡️
            </div>
            <div>
              <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase' }}>
                {title}
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>
                GOVERNMENT OF INDIA · OFFICIAL VAULT NOTICE
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#ffffff',
              width: 28,
              height: 28,
              borderRadius: '50%',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 24px 20px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: type === 'success' ? '#dcfce7' : '#fef3c7',
              border: type === 'success' ? '1px solid #86efac' : '1px solid #fde68a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0
            }}>
              {type === 'success' ? '✓' : 'ℹ️'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.5, marginBottom: 8, whiteSpace: 'pre-line' }}>
                {message}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 500 }}>
                Timestamp: {new Date().toLocaleTimeString()} · Status: Verified & Encrypted
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div
          style={{
            padding: '12px 24px 18px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button
            onClick={onClose}
            className="btn-primary"
            style={{
              padding: '8px 24px',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#1A1A1A',
              color: '#ffffff',
              border: '1px solid #1A1A1A',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              cursor: 'pointer'
            }}
          >
            <span style={{ color: '#ffffff', fontWeight: 700 }}>OK</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function Layout({ title, titleIcon = '🛡️', userLabel, userIcon, navItems, activeNav, onNavChange, onLogout, unreadCount = 0, children, accentColor = 'var(--accent-gold)' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeItem = navItems.find(item => item.id === activeNav) || navItems[0];

  const handleNavItemClick = (id) => {
    onNavChange(id);
    setSidebarOpen(false); // Hide sidebar when a menu item is clicked
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', position: 'relative' }}>
      {/* Top Banner - Official Government Header with 3-Lines Toggle */}
      <div style={{ height: 52, background: 'var(--primary)', borderBottom: '3px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 30 }}>
        
        {/* Left Side: 3-Lines Button + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* 3-Lines Toggle Button (Just 3 lines, no text) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            style={{
              background: sidebarOpen ? 'var(--accent-gold)' : 'rgba(255,255,255,0.15)',
              border: `1px solid ${sidebarOpen ? 'var(--accent-gold)' : 'rgba(255,255,255,0.3)'}`,
              borderRadius: 4,
              width: 36,
              height: 36,
              cursor: 'pointer',
              color: sidebarOpen ? '#000000' : '#ffffff',
              fontSize: 18,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: sidebarOpen ? '0 0 10px rgba(184,134,11,0.5)' : 'none'
            }}
          >
            ☰
          </button>

          <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,0.2)' }} />

          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.15)', border: '1.5px solid var(--accent-gold)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              🛡️
            </div>
            <div>
              <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: '#ffffff', textTransform: 'uppercase', lineHeight: 1.1 }}>
                {title}
              </div>
              <div style={{ fontSize: 10, color: 'var(--accent-gold)', letterSpacing: '0.08em', fontWeight: 600 }}>
                GOVERNMENT OF INDIA · MINISTRY OF JUSTICE & LEGAL AFFAIRS
              </div>
            </div>
          </div>
        </div>

        {/* Center: Current Active View Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: 20 }}>
          <span style={{ fontSize: 11, color: 'var(--accent-gold)', fontWeight: 700, fontFamily: 'Oswald, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {activeItem?.label || 'DASHBOARD'}
          </span>
        </div>

        {/* Right Side Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 11, color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })} · {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>

          <button
            onClick={() => onNavChange('alerts')}
            title="View Alerts & Notifications"
            style={{ background: activeNav === 'alerts' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '5px 10px', cursor: 'pointer', color: activeNav === 'alerts' ? '#000000' : '#ffffff', position: 'relative' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', borderRadius: '50%', minWidth: 15, height: 15, padding: '0 3px', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                {unreadCount}
              </span>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 4, color: 'var(--color-ink)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-ink)' }}>{userLabel}</span>
          </div>

          <button onClick={onLogout} style={{ background: '#b91c1c', border: '1px solid #991b1b', borderRadius: 4, padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#ffffff', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#ffffff' }}>LOGOUT</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', color: '#ffffff' }}>
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
              <line x1="12" y1="2" x2="12" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Body with Smooth Push / Shrink Transition */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        
        {/* Collapsible Sidebar (Pushes/resizes side-by-side, NO disabling backdrop overlay) */}
        <div
          style={{
            width: sidebarOpen ? 240 : 0,
            minWidth: sidebarOpen ? 240 : 0,
            background: '#ffffff',
            borderRight: sidebarOpen ? '2px solid var(--accent-gold)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0,
            opacity: sidebarOpen ? 1 : 0
          }}
        >
          {/* Sidebar Header */}
          <div style={{ padding: '12px 14px', background: '#1A1A1A', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', whitespace: 'nowrap' }}>
                EXPLORER MENU
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: 16, cursor: 'pointer', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>

          {/* Navigation Items List */}
          <div style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
            {navItems.map(item => (
              <div
                key={item.id}
                className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => handleNavItemClick(item.id)}
              >
                {item.icon && <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>}
                <div>
                  <div style={{ lineHeight: 1.2, fontWeight: 600 }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize: 10, color: 'var(--color-body)', lineHeight: 1 }}>{item.sub}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', background: '#f8fafc', flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: 'var(--color-body)', fontFamily: 'JetBrains Mono, monospace', textAlign: 'center', fontWeight: 600, whitespace: 'nowrap' }}>
              GOV PORTAL v2.4.1
            </div>
          </div>
        </div>

        {/* Main Content Area (Shrinks smoothly when sidebar opens, stays fully active!) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: 'var(--background)', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function HashChainModal({
  isOpen,
  onClose,
  caseData,
  integrityData,
  onReaudit,
  onRestore,
  onSimulate,
  verifying = false,
}) {
  if (!isOpen) return null;

  const isTampered = integrityData?.tamper_detected;
  const blocks = integrityData?.chain || [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          border: isTampered ? '2px solid #ef4444' : '2px solid #1A1A1A',
          borderRadius: 8,
          width: '100%',
          maxWidth: 860,
          maxHeight: '90vh',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: isTampered ? '#7f1d1d' : '#1A1A1A',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: isTampered ? '2px solid #ef4444' : '2px solid var(--accent-gold)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontFamily: 'Oswald, sans-serif',
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
              }}
            >
              Non-Repudiation Custody & Cryptographic Verification Ledger
            </div>
            <div style={{ fontSize: 18, color: '#ffffff', fontWeight: 700, margin: '2px 0 0' }}>
              Evidentiary Hash Chain: {caseData?.case_number}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onReaudit}
              disabled={verifying}
              className="btn-secondary"
              style={{
                background: '#ffffff',
                color: '#1A1A1A',
                fontWeight: 700,
                fontSize: 11,
                padding: '6px 14px',
              }}
            >
              {verifying ? 'AUDITING...' : '🔄 RE-VERIFY CHAIN'}
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: 20,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
          {/* Status summary banner */}
          <div
            style={{
              background: isTampered ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${isTampered ? '#fca5a5' : '#86efac'}`,
              borderRadius: 6,
              padding: 16,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>{isTampered ? '🚨' : '🛡️'}</span>
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: isTampered ? '#b91c1c' : '#15803d',
                  }}
                >
                  {isTampered
                    ? `TAMPERING DETECTED: ${integrityData?.tampered_blocks_count || 1} COMPROMISED RECORD(S)`
                    : 'CRYPTOGRAPHIC INTEGRITY VERIFIED · 100% INTACT'}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: isTampered ? '#991b1b' : '#166534',
                    marginTop: 2,
                  }}
                >
                  {isTampered
                    ? 'One or more evidence document files on disk have been altered or the chain sequence was disrupted.'
                    : 'Every document SHA-256 matches disk contents, and all sequential hash pointers are cryptographically valid.'}
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#64748b',
                fontFamily: 'Oswald, sans-serif',
                textAlign: 'right',
              }}
            >
              <div>TOTAL CHAIN BLOCKS: <strong>{blocks.length}</strong></div>
              <div>ALGORITHM: <strong>SHA-256 SEQUENTIAL</strong></div>
            </div>
          </div>

          {/* Mathematical Hash Chain Visualization */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Genesis Anchor Block */}
            <div
              style={{
                background: '#1A1A1A',
                color: '#ffffff',
                border: '1px solid #334155',
                borderRadius: 6,
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>⚓</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-gold)' }}>
                    BLOCK #0 · GENESIS ANCHOR
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    Immutable Case Docket Root: {caseData?.case_number}
                  </div>
                </div>
              </div>
              <div className="mono" style={{ fontSize: 10, color: '#94a3b8' }}>
                PREV_HASH: 0000000000000000000000000000000000000000000000000000000000000000
              </div>
            </div>

            {blocks.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: 30,
                  background: '#ffffff',
                  borderRadius: 6,
                  border: '1px dashed #cbd5e1',
                  color: '#64748b',
                }}
              >
                No evidence documents uploaded yet to form blocks.
              </div>
            ) : (
              blocks.map((block, idx) => {
                const blockTampered = !block.is_valid;
                return (
                  <React.Fragment key={block.block_index}>
                    {/* Cryptographic Link Arrow */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        color: blockTampered ? '#ef4444' : '#64748b',
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: 'Oswald, sans-serif',
                        letterSpacing: '0.06em',
                      }}
                    >
                      <span>↓</span>
                      <span>
                        {blockTampered
                          ? '⚠️ BROKEN CRYPTOGRAPHIC POINTER'
                          : `LINKED VIA SHA-256 POINTER (PREV_HASH MATCHES BLOCK #${idx})`}
                      </span>
                      <span>↓</span>
                    </div>

                    {/* Block Card */}
                    <div
                      style={{
                        background: '#ffffff',
                        border: blockTampered ? '2px solid #ef4444' : '1px solid #cbd5e1',
                        borderRadius: 6,
                        padding: 16,
                        boxShadow: blockTampered
                          ? '0 4px 12px rgba(239, 68, 68, 0.15)'
                          : '0 1px 3px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: 10,
                          paddingBottom: 8,
                          borderBottom: '1px solid #f1f5f9',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                              style={{
                                background: blockTampered ? '#ef4444' : '#1A1A1A',
                                color: '#ffffff',
                                padding: '2px 8px',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                fontFamily: 'Oswald, sans-serif',
                              }}
                            >
                              BLOCK #{block.block_index}
                            </span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-ink)' }}>
                              {block.filename}
                            </span>
                            <span
                              className={`badge ${blockTampered ? 'badge-warning' : 'badge-active'}`}
                              style={{
                                background: blockTampered ? '#fee2e2' : undefined,
                                color: blockTampered ? '#b91c1c' : undefined,
                                borderColor: blockTampered ? '#fca5a5' : undefined,
                              }}
                            >
                              {blockTampered ? '🚨 TAMPERED' : '✅ INTACT & VERIFIED'}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                            Category: <strong>{block.subtab?.replace(/_/g, ' ')}</strong> · Ingested:{' '}
                            <strong>{new Date(block.timestamp).toLocaleString('en-IN')}</strong> · Operator:{' '}
                            <strong>{block.operator || 'Investigating Officer'}</strong>
                          </div>
                        </div>

                        {/* Interactive tamper testing actions */}
                        <div style={{ display: 'flex', gap: 6 }}>
                          {blockTampered ? (
                            <button
                              onClick={() => onRestore(block.document_id)}
                              className="btn-secondary"
                              style={{
                                padding: '4px 10px',
                                fontSize: 11,
                                background: '#f0fdf4',
                                color: '#166534',
                                borderColor: '#86efac',
                                fontWeight: 700,
                              }}
                            >
                              ↺ RESTORE ORIGINAL FILE
                            </button>
                          ) : (
                            <button
                              onClick={() => onSimulate(block.document_id)}
                              className="btn-secondary"
                              style={{
                                padding: '4px 10px',
                                fontSize: 11,
                                color: '#dc2626',
                                borderColor: '#fca5a5',
                              }}
                              title="Corrupts a byte in this file to test tamper detection"
                            >
                              🧪 TEST TAMPER DETECTION
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Cryptographic Details Grid */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 10,
                          fontSize: 11,
                          background: blockTampered ? '#fef2f2' : '#f8fafc',
                          padding: 10,
                          borderRadius: 4,
                          border: `1px solid ${blockTampered ? '#fecaca' : '#e2e8f0'}`,
                        }}
                      >
                        <div>
                          <span style={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                            Registered File SHA-256:
                          </span>
                          <div className="mono" style={{ color: '#0f172a', fontWeight: 600, wordBreak: 'break-all' }}>
                            {block.file_hash}
                          </div>
                        </div>

                        <div>
                          <span style={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                            Current File SHA-256 On Disk:
                          </span>
                          <div
                            className="mono"
                            style={{
                              color: block.current_disk_hash === block.file_hash ? '#15803d' : '#b91c1c',
                              fontWeight: 700,
                              wordBreak: 'break-all',
                            }}
                          >
                            {block.current_disk_hash || 'FILE MISSING FROM DISK'}
                          </div>
                        </div>

                        <div>
                          <span style={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                            Previous Block Hash (prev_hash):
                          </span>
                          <div className="mono" style={{ color: '#475569', wordBreak: 'break-all' }}>
                            {block.prev_hash}
                          </div>
                        </div>

                        <div>
                          <span style={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                            Canonical Block Hash (block_hash):
                          </span>
                          <div className="mono" style={{ color: '#475569', wordBreak: 'break-all' }}>
                            {block.block_hash}
                          </div>
                        </div>
                      </div>

                      {/* Tamper Error Note if any */}
                      {block.tamper_reason && (
                        <div
                          style={{
                            marginTop: 10,
                            padding: '8px 12px',
                            background: '#fee2e2',
                            border: '1px solid #f87171',
                            borderRadius: 4,
                            color: '#991b1b',
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          ⚠️ Breached: {block.tamper_reason}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 12, color: '#64748b' }}>
            Audited at: <strong>{new Date(integrityData?.verified_at || Date.now()).toLocaleTimeString()}</strong> · Standard: BNS / CrPC Digital Evidence Non-Repudiation
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 20px' }}>
            CLOSE LEDGER
          </button>
        </div>
      </div>
    </div>
  );
}

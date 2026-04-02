// filepath: src/pages/PeerLend/LendPanel.jsx
/**
 * LendPanel — modal dialog for participating in a loan
 *
 * Props:
 *   isOpen  {boolean}  - whether the modal is visible
 *   onClose {function} - close callback
 *   loan    {object}   - the loan being funded
 *
 * Features:
 *   - Quantity selector (ETH amount to lend, max = loan.amount)
 *   - Payment method selector
 *   - Estimated returns preview
 *   - Transaction simulation (4 steps + fake TX hash)
 */

import { useState, useRef, useEffect } from 'react'
import { useWallet } from '../../context/WalletContext'

const PAYMENT_METHODS = ['ETH', 'USDC', 'USDT']

const TX_STAGES = [
  { icon: '✍️', label: 'Awaiting wallet signature...'  },
  { icon: '🔐', label: 'Simulating escrow deposit...'   },
  { icon: '⛓️', label: 'Waiting for confirmation...'   },
  { icon: '✅', label: 'Lending position confirmed!'    },
]

function LendPanel({ isOpen, onClose, loan }) {
  const { isConnected, connect, showToast } = useWallet()
  const [amount,   setAmount]   = useState(0.1)
  const [payment,  setPayment]  = useState('ETH')
  const [txStage,  setTxStage]  = useState(-1)
  const [txDone,   setTxDone]   = useState(false)
  const timerRef = useRef(null)

  // Reset when loan changes
  useEffect(() => {
    if (isOpen) {
      setAmount(0.1)
      setPayment('ETH')
      setTxStage(-1)
      setTxDone(false)
    }
  }, [isOpen, loan?.id])

  useEffect(() => {
    if (!isOpen) clearTimeout(timerRef.current)
  }, [isOpen])

  if (!isOpen || !loan) return null

  // Calculate estimated return
  const interest      = loan.interest / 100
  const dailyRate     = interest / 365
  const totalReturn   = +(amount * dailyRate * loan.duration).toFixed(4)
  const totalAmount   = +(amount + totalReturn).toFixed(4)
  const annualReturn  = +(amount * interest).toFixed(4)

  const handleConfirm = () => {
    if (!isConnected) { connect('PeerLend'); return }

    let stage = 0
    const advance = () => {
      setTxStage(stage)
      if (stage < TX_STAGES.length - 1) {
        stage++
        timerRef.current = setTimeout(advance, 900)
      } else {
        setTimeout(() => {
          setTxDone(true)
          const hash = '0x' + Math.random().toString(16).slice(2, 12)
          showToast(`💰 Lending confirmed! TX: ${hash}`)
        }, 800)
      }
    }
    advance()
  }

  const handleClose = () => {
    clearTimeout(timerRef.current)
    onClose()
  }

  const inProgress = txStage >= 0 && !txDone

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <span className="modal-title">
            {txDone ? '✅ Lending Confirmed' : `Lend ETH to Grade-${loan.grade} Pool`}
          </span>
          <button className="modal-close" onClick={handleClose}>✕</button>
        </div>

        {txDone ? (
          /* ── Success screen ── */
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🤝</div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
              {amount} ETH lent successfully!
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
              Estimated return: <strong style={{ color: 'var(--green)' }}>{totalReturn} ETH</strong> after {loan.duration} days
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '1.75rem' }}>
              Demo position recorded in UI. Repayments are simulated for this prototype.
            </p>
            <button className="btn-primary" onClick={handleClose}>Done</button>
          </div>
        ) : (
          <>
            {/* Loan summary */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Borrower Purpose</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{loan.purpose}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>APR</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--green)' }}>{loan.interest}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Duration</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{loan.duration} days</span>
              </div>
            </div>

            {/* Amount control */}
            <div className="qty-row" style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Lend Amount</span>
              <div className="qty-controls">
                <button
                  className="qty-btn"
                  onClick={() => setAmount((a) => +(Math.max(0.1, a - 0.1)).toFixed(2))}
                  disabled={inProgress}
                >−</button>
                <span className="qty-value" style={{ fontSize: '1.3rem', minWidth: '3.5rem' }}>
                  {amount}
                </span>
                <button
                  className="qty-btn"
                  onClick={() => setAmount((a) => +(Math.min(loan.amount, a + 0.1)).toFixed(2))}
                  disabled={inProgress}
                >+</button>
              </div>
              <span className="qty-total">ETH</span>
            </div>

            {/* Payment method */}
            <p className="payment-label">Pay with</p>
            <div className="payment-selector" style={{ marginBottom: '1.25rem' }}>
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m}
                  className={`payment-option${payment === m ? ' active' : ''}`}
                  onClick={() => setPayment(m)}
                  disabled={inProgress}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Returns preview */}
            <div className="returns-preview">
              <div className="return-item">
                <div className="return-label">You Lend</div>
                <div className="return-value">{amount} ETH</div>
              </div>
              <div className="return-arrow">→</div>
              <div className="return-item">
                <div className="return-label">Interest Earned</div>
                <div className="return-value positive">+{totalReturn} ETH</div>
              </div>
              <div className="return-arrow">→</div>
              <div className="return-item">
                <div className="return-label">You Receive</div>
                <div className="return-value">{totalAmount} ETH</div>
              </div>
            </div>

            {/* TX steps (while processing) */}
            {txStage >= 0 && (
              <div className="tx-steps">
                {TX_STAGES.map((s, i) => (
                  <div
                    key={i}
                    className={`tx-step${i === txStage ? ' active' : i < txStage ? ' done' : ''}`}
                  >
                    {i === txStage && !txDone
                      ? <span className="spinner" />
                      : <span className="tx-step-icon">{i < txStage ? '✓' : s.icon}</span>}
                    {s.label}
                  </div>
                ))}
              </div>
            )}

            {/* Confirm */}
            {txStage < 0 && (
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={handleConfirm}
              >
                {isConnected ? `Lend ${amount} ETH` : 'Connect Wallet First'}
              </button>
            )}

            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.85rem' }}>
              Demo only · No real funds transferred · Annual return {annualReturn} ETH at {loan.interest}% APR
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default LendPanel

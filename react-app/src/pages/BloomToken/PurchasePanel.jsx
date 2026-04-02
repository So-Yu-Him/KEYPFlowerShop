// filepath: src/pages/BloomToken/PurchasePanel.jsx
/**
 * PurchasePanel — modal dialog for purchasing a BloomToken product
 *
 * Props:
 *   isOpen   {boolean}  - whether the modal is visible
 *   onClose  {function} - called when user closes the modal
 *   product  {object}   - the product being purchased (from FLOWER_PRODUCTS)
 *
 * Transaction simulation:
 *   Clicking "Confirm Purchase" steps through 4 stages with timeouts,
 *   then shows a toast with a fake TX hash — no real contract call.
 */

import { useState, useRef, useEffect } from 'react'
import { useWallet } from '../../context/WalletContext'

const PAYMENT_METHODS = ['eHKD', 'USDC', 'ETH', 'FPS']

/* Four transaction stages */
const TX_STAGES = [
  { icon: '✍️', label: 'Awaiting wallet signature...' },
  { icon: '📡', label: 'Broadcasting transaction...'  },
  { icon: '⛓️', label: 'Waiting for confirmation...'  },
  { icon: '✅', label: 'Transaction complete!'          },
]

function PurchasePanel({ isOpen, onClose, product }) {
  const { isConnected, connect, showToast } = useWallet()
  const [qty,         setQty]         = useState(1)
  const [payment,     setPayment]     = useState('eHKD')
  const [txStage,     setTxStage]     = useState(-1) // -1 = not started
  const [txDone,      setTxDone]      = useState(false)
  const timerRef = useRef(null)

  // Reset internal state when modal opens for a new product
  useEffect(() => {
    if (isOpen) {
      setQty(1)
      setPayment('eHKD')
      setTxStage(-1)
      setTxDone(false)
    }
  }, [isOpen, product?.id])

  // Clean up any running timer when modal closes
  useEffect(() => {
    if (!isOpen) clearTimeout(timerRef.current)
  }, [isOpen])

  if (!isOpen || !product) return null

  const totalEth = (product.price * qty).toFixed(4)
  const totalUsd = (product.priceUsd * qty).toLocaleString()

  // ── Simulate on-chain transaction ──────────────────────────
  const handleConfirm = async () => {
    if (!isConnected) {
      await connect('BloomToken')
      return
    }

    // Step through each stage with a delay
    let stage = 0
    const advanceStage = () => {
      setTxStage(stage)
      if (stage < TX_STAGES.length - 1) {
        stage++
        timerRef.current = setTimeout(advanceStage, 900)
      } else {
        // Final stage — mark done
        setTimeout(() => {
          setTxDone(true)
          const hash = '0x' + Math.random().toString(16).slice(2, 12)
          showToast(`🎉 Purchase confirmed! TX: ${hash}`)
        }, 800)
      }
    }
    advanceStage()
  }

  const handleClose = () => {
    clearTimeout(timerRef.current)
    onClose()
  }

  const inProgress = txStage >= 0 && !txDone

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-content">
        {/* ── Header ── */}
        <div className="modal-header">
          <span className="modal-title">
            {txDone ? '🎉 Purchase Complete' : `Purchase ${product.emoji} ${product.name}`}
          </span>
          <button className="modal-close" onClick={handleClose} aria-label="Close">✕</button>
        </div>

        {txDone ? (
          /* ── Success screen ── */
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌸</div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
              {qty} × {product.name}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.75rem' }}>
              Your BloomToken NFT has been minted to your wallet.
              A redemption code will arrive via email within 2 hours.
            </p>
            <button className="btn-primary" onClick={handleClose}>Done</button>
          </div>
        ) : (
          /* ── Purchase form ── */
          <>
            {/* Product summary */}
            <div style={{
              display: 'flex', gap: '0.85rem', alignItems: 'center',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '0.85rem', marginBottom: '1.5rem',
            }}>
              <span style={{ fontSize: '2.5rem' }}>{product.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{product.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  {product.price} ETH each · ≈ ${product.priceUsd} USD
                </div>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="qty-row">
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Quantity</span>
              <div className="qty-controls">
                <button
                  className="qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={inProgress}
                >−</button>
                <span className="qty-value">{qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  disabled={inProgress}
                >+</button>
              </div>
              <span className="qty-total">{totalEth} ETH</span>
            </div>

            {/* Payment method */}
            <p className="payment-label">Pay with</p>
            <div className="payment-selector" style={{ marginBottom: '1.5rem' }}>
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

            {/* Amount summary */}
            <div style={{
              background: 'rgba(var(--primary-rgb),0.06)',
              border: '1px solid rgba(var(--primary-rgb),0.15)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.4rem',
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Total ({qty} token{qty > 1 ? 's' : ''})</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem' }}>
                {totalEth} ETH <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.78rem' }}>≈ ${totalUsd}</span>
              </span>
            </div>

            {/* Transaction step indicator (visible while processing) */}
            {txStage >= 0 && (
              <div className="tx-steps">
                {TX_STAGES.map((stage, i) => (
                  <div
                    key={i}
                    className={`tx-step${i === txStage ? ' active' : i < txStage ? ' done' : ''}`}
                  >
                    {i === txStage && !txDone
                      ? <span className="spinner" />
                      : <span className="tx-step-icon">{i < txStage ? '✓' : stage.icon}</span>
                    }
                    {stage.label}
                  </div>
                ))}
              </div>
            )}

            {/* Confirm button */}
            {txStage < 0 && (
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={handleConfirm}
              >
                {isConnected ? 'Confirm Purchase' : 'Connect Wallet First'}
              </button>
            )}

            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.85rem' }}>
              Demo only — no real funds will be moved. By proceeding you agree to the FloreX PoC terms.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default PurchasePanel

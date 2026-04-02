// filepath: src/pages/Trovex/ItemDetail.jsx
/**
 * ItemDetail — Trovex item detail page
 *
 * URL: /marketplace/:id
 *
 * Features:
 *   - Breadcrumb: Home > Trovex > [item title]
 *   - Left: large emoji display with rarity glow + ribbon
 *   - Right: title, price, seller info with star rating
 *   - "Buy Now" + "Place Bid" CTAs → inline transaction modal
 *   - Transaction history (mocked chain event log style)
 *   - Similar items from same category
 */

import { useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar       from '../../components/Navbar'
import Footer       from '../../components/Footer'
import Toast        from '../../components/Toast'
import { LISTINGS } from './index'
import { useWallet } from '../../context/WalletContext'

const TX_STAGES = [
  { icon: '✍️', label: 'Awaiting wallet signature...' },
  { icon: '🔐', label: 'Running demo escrow step...'   },
  { icon: '⛓️', label: 'Waiting for confirmation...'  },
  { icon: '✅', label: 'Purchase complete!'             },
]

const RARITY_COLOR = {
  Common:    '#9ca3af',
  Uncommon:  '#10b981',
  Rare:      '#8b5cf6',
  Legendary: '#f59e0b',
}

function Stars({ rating }) {
  const full = Math.floor(parseFloat(rating))
  return (
    <span style={{ color: 'var(--amber)', fontSize: '0.85rem' }}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}{' '}
      <strong style={{ fontSize: '0.8rem' }}>{rating}</strong>
    </span>
  )
}

function ItemDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { isConnected, connect, showToast } = useWallet()

  const [txStage,   setTxStage]   = useState(-1)
  const [txDone,    setTxDone]    = useState(false)
  const [txType,    setTxType]    = useState('')      // 'buy' or 'bid'
  const [showModal, setShowModal] = useState(false)
  const [bidAmt,    setBidAmt]    = useState('')
  const timerRef = useRef(null)

  const item = LISTINGS.find((l) => l.id === parseInt(id, 10))
  const similar = item
    ? LISTINGS.filter((l) => l.category === item.category && l.id !== item.id).slice(0, 2)
    : []

  if (!item) {
    return (
      <div className="page-wrapper theme-trovex">
        <Navbar />
        <div className="detail-container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
          <p style={{ fontSize: '4rem' }}>📦</p>
          <h2>Item not found</h2>
          <Link to="/marketplace" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            ← Back to Trovex
          </Link>
        </div>
      </div>
    )
  }

  // Simulate transaction
  const simulateTx = (type) => {
    if (!isConnected) { connect('Trovex'); return }
    setTxType(type)
    setShowModal(true)
    setTxStage(0)
    setTxDone(false)

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
          showToast(`✅ ${type === 'buy' ? 'Purchase' : 'Bid'} confirmed! TX: ${hash}`)
        }, 800)
      }
    }
    advance()
  }

  const closeModal = () => {
    clearTimeout(timerRef.current)
    setShowModal(false)
    setTxStage(-1)
    setTxDone(false)
  }

  const rarityColor = RARITY_COLOR[item.rarity] || '#9ca3af'

  return (
    <div className="page-wrapper theme-trovex">
      <Navbar />

      <div className="detail-page">
        <div className="detail-container">
          {/* ── Breadcrumb ── */}
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/marketplace">Trovex</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{item.title}</span>
          </nav>

          {/* ── Detail grid ── */}
          <div className="detail-grid">
            {/* Left */}
            <div>
              <div
                className={`detail-img-wrap ${item.imgClass}`}
                style={{ border: `1px solid ${rarityColor}40` }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(circle at 50% 60%, ${rarityColor}30 0%, transparent 65%)`,
                }} />
                {/* Rarity ribbon */}
                <div className={`rarity-ribbon ${item.rarity.toLowerCase()}`}
                  style={{ position: 'absolute', top: 12, right: 0 }}>
                  {item.rarity}
                </div>
                <span style={{ fontSize: '8rem', position: 'relative', zIndex: 1 }}>
                  {item.emoji}
                </span>
              </div>

              {/* NFT details */}
              <div style={{
                display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap',
              }}>
                {[
                  { label: 'Token ID', value: item.nft       },
                  { label: 'Network',  value: 'Demo Network' },
                  { label: 'Standard', value: 'ERC-721'      },
                  { label: 'Category', value: item.category  },
                ].map((x) => (
                  <div key={x.label} style={{
                    flex: '1 1 auto',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.6rem 0.75rem',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{x.label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{x.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="detail-info">
              <div style={{ marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: `${rarityColor}1a`, color: rarityColor, fontSize: '0.75rem', padding: '0.28rem 0.8rem' }}>
                  {item.rarity}
                </span>
              </div>

              <h1 className="detail-name">{item.title}</h1>

              <div className="detail-price-row">
                <span className="detail-eth-price" style={{ fontSize: '1.75rem' }}>{item.price}</span>
                <span className="detail-usd-price">· {item.trvx}</span>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                {item.retail}
              </p>

              <hr className="detail-divider" />

              {/* Seller info */}
              <div className="seller-row">
                <div className="seller-avatar">👤</div>
                <div className="seller-info">
                  <div className="seller-label">Seller</div>
                  <div className="seller-addr">{item.sellerFull}</div>
                </div>
                <div className="seller-rating">
                  <Stars rating={item.rating} />
                </div>
              </div>

              {/* Condition */}
              <div style={{
                display: 'flex', gap: '0.6rem', marginBottom: '1.5rem',
              }}>
                <span className={`condition-tag ${item.condClass}`} style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
                  {item.condition}
                </span>
                <span className="meta-badge meta-green" style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}>
                  ✓ Demo Verification
                </span>
              </div>

              {/* CTAs */}
              <div className="cta-row">
                <button className="btn-primary btn-lg" onClick={() => simulateTx('buy')}>
                  🛍️ Buy Now
                </button>
                <button className="btn-secondary" style={{ padding: '1rem 1.25rem' }}
                  onClick={() => simulateTx('bid')}>
                  🏷️ Place Bid
                </button>
              </div>

              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                Simulated escrow flow · No real funds are locked or transferred
              </p>
            </div>
          </div>

          {/* ── Transaction History ── */}
          <div className="tx-history" style={{ marginTop: '3rem' }}>
            <h4>🧾 Activity History (Demo)</h4>
            {item.history.map((h, i) => (
              <div key={i} className="tx-history-item">
                <span className="tx-event-label">{h.event}</span>
                <span className="tx-event-by">{h.by}</span>
                <span className="tx-event-date">{h.date}</span>
                <span className="tx-event-price">{h.price}</span>
              </div>
            ))}
          </div>

          {/* ── Similar items ── */}
          {similar.length > 0 && (
            <div style={{ marginTop: '2.5rem' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                Similar {item.category} Items
              </h3>
              <div className="similar-grid">
                {similar.map((rel) => (
                  <div
                    key={rel.id}
                    className="listing-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/marketplace/${rel.id}`)}
                  >
                    <div className={`listing-img-wrap ${rel.imgClass}`} style={{ height: '90px', fontSize: '2.5rem' }}>
                      {rel.emoji}
                    </div>
                    <div className="listing-body" style={{ padding: '0.75rem' }}>
                      <div className="listing-title">{rel.title}</div>
                      <div className="listing-price">{rel.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Transaction modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !txStage >= 0 && closeModal()}>
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">
                {txDone
                  ? `✅ ${txType === 'buy' ? 'Purchase' : 'Bid'} Confirmed`
                  : txType === 'buy' ? `Buy ${item.emoji} ${item.title}` : `Place Bid on ${item.title}`}
              </span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {txDone ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
                  {txType === 'buy' ? 'Item is now yours!' : 'Bid placed successfully!'}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.75rem' }}>
                  {txType === 'buy'
                    ? 'Demo ownership status updated in the UI. Seller shipping is shown as a sample workflow.'
                    : 'Your demo bid was submitted in the UI flow. Seller response is simulated.'}
                </p>
                <button className="btn-primary" onClick={closeModal}>Done</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
                    <span style={{ fontSize: '2rem' }}>{item.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '0.15rem' }}>{item.price} · {item.trvx}</div>
                    </div>
                  </div>
                </div>

                {txType === 'bid' && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <p className="payment-label">Your bid amount (HKD)</p>
                    <input
                      type="number"
                      className="form-input"
                      placeholder={`Max ${item.priceHKD}`}
                      value={bidAmt}
                      onChange={(e) => setBidAmt(e.target.value)}
                    />
                  </div>
                )}

                <div className="tx-steps">
                  {TX_STAGES.map((s, i) => (
                    <div
                      key={i}
                      className={`tx-step${i === txStage ? ' active' : i < txStage ? ' done' : ''}`}
                    >
                      {i === txStage
                        ? <span className="spinner" />
                        : <span className="tx-step-icon">{i < txStage ? '✓' : s.icon}</span>}
                      {s.label}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
      <Toast />
    </div>
  )
}

export default ItemDetail

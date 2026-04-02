// filepath: src/pages/BloomToken/ProductDetail.jsx
/**
 * ProductDetail — individual flower product page
 *
 * URL: /bloomtoken/:id
 *
 * Features:
 *   - Breadcrumb navigation: Home > BloomToken > [product name]
 *   - Left: emoji showcase area with radial glow
 *   - Right: name, rarity badge, ETH price + USD, description, stock bar, tags
 *   - "Buy Now" → PurchasePanel modal
 *   - Related products (same rarity, excluding current)
 */

import { useState }                 from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar         from '../../components/Navbar'
import Footer         from '../../components/Footer'
import Toast          from '../../components/Toast'
import PurchasePanel  from './PurchasePanel'
import { FLOWER_PRODUCTS } from './index'
import { useWallet }  from '../../context/WalletContext'

const RARITY_BADGE = {
  Common:    'badge-common',
  Uncommon:  'badge-uncommon',
  Rare:      'badge-rare',
  Legendary: 'badge-legendary',
}

const RARITY_DESC = {
  Common:    'Widely available — redeem anytime.',
  Uncommon:  'Limited batch — moves fast.',
  Rare:      'Very limited — only a few left.',
  Legendary: 'One of a kind — auction style.',
}

function ProductDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { isConnected, connect } = useWallet()
  const [showModal, setShowModal] = useState(false)

  const product  = FLOWER_PRODUCTS.find((p) => p.id === parseInt(id, 10))
  const related  = FLOWER_PRODUCTS.filter(
    (p) => p.rarity === product?.rarity && p.id !== product?.id
  ).slice(0, 2)

  // 404 state
  if (!product) {
    return (
      <div className="page-wrapper theme-bloomtoken">
        <Navbar />
        <div className="detail-container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
          <p style={{ fontSize: '4rem' }}>🌿</p>
          <h2>Product not found</h2>
          <Link to="/bloomtoken" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            ← Back to BloomToken
          </Link>
        </div>
      </div>
    )
  }

  const stockPct = Math.round((product.stock / product.totalStock) * 100)

  const handleBuy = () => {
    if (!isConnected) {
      connect('BloomToken')
    } else {
      setShowModal(true)
    }
  }

  return (
    <div className="page-wrapper theme-bloomtoken">
      <Navbar />

      <div className="detail-page">
        <div className="detail-container">
          {/* ── Breadcrumb ── */}
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/bloomtoken">BloomToken</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{product.name}</span>
          </nav>

          {/* ── Main detail grid ── */}
          <div className="detail-grid">
            {/* Left: emoji + glow */}
            <div>
              <div className="detail-img-wrap">
                <div className="detail-img-glow" />
                <span style={{ fontSize: '9rem', position: 'relative', zIndex: 1 }}>
                  {product.emoji}
                </span>
              </div>

              {/* Token info cards */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Token',    value: 'BLMT'           },
                  { label: 'Network',  value: 'Polygon'        },
                  { label: 'Standard', value: 'ERC-20'         },
                  { label: 'Valid',    value: '12 months'      },
                ].map((item) => (
                  <div key={item.label} style={{
                    flex: '1 1 auto',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.6rem 0.75rem',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: details */}
            <div className="detail-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                <span className={`badge ${RARITY_BADGE[product.rarity]}`} style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }}>
                  {product.rarity}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{RARITY_DESC[product.rarity]}</span>
              </div>

              <h1 className="detail-name">{product.name}</h1>

              <div className="detail-price-row">
                <span className="detail-eth-price">{product.price} ETH</span>
                <span className="detail-usd-price">≈ ${product.priceUsd.toLocaleString()} USD</span>
              </div>

              <p className="detail-desc">{product.description}</p>

              <hr className="detail-divider" />

              {/* Stock indicator */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="stock-bar-label" style={{ marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Availability
                  </span>
                  <span style={{ fontSize: '0.8rem', color: stockPct > 50 ? 'var(--green)' : stockPct > 20 ? 'var(--amber)' : 'var(--red)' }}>
                    {product.stock} / {product.totalStock} remaining
                  </span>
                </div>
                <div className="stock-bar-bg" style={{ height: '8px' }}>
                  <div
                    className="stock-bar-fill"
                    style={{ width: `${stockPct}%` }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="product-tags" style={{ marginBottom: '1.75rem' }}>
                {product.tags.map((t) => (
                  <span key={t} className="product-tag">#{t}</span>
                ))}
              </div>

              {/* CTA */}
              <div className="cta-row">
                <button
                  className="btn-primary btn-lg"
                  onClick={handleBuy}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0
                    ? '🚫 Sold Out'
                    : isConnected
                    ? '🛍️ Buy Now'
                    : '🔗 Connect to Buy'}
                </button>
                <button className="btn-secondary" style={{ padding: '1rem 1.25rem' }}
                  onClick={() => navigate('/bloomtoken')}
                >
                  ← Back
                </button>
              </div>

              {/* Fee note */}
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                Platform fee 2.5% · Gas on Polygon (~$0.001)
              </p>
            </div>
          </div>

          {/* ── Related products ── */}
          {related.length > 0 && (
            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                Similar {product.rarity} Items
              </h3>
              <div className="similar-grid">
                {related.map((rel) => (
                  <div
                    key={rel.id}
                    className="product-card"
                    onClick={() => navigate(`/bloomtoken/${rel.id}`)}
                  >
                    <div className="product-img-wrap" style={{ height: '100px', fontSize: '2.75rem' }}>
                      <div className="product-glow" />
                      <span style={{ position: 'relative' }}>{rel.emoji}</span>
                    </div>
                    <div className="product-body" style={{ padding: '0.75rem 1rem 1rem' }}>
                      <div className="product-name">{rel.name}</div>
                      <div className="product-price">{rel.price} ETH</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Purchase modal ── */}
      <PurchasePanel
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={product}
      />

      <Footer />
      <Toast />
    </div>
  )
}

export default ProductDetail

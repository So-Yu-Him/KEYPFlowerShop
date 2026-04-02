// filepath: src/pages/BloomToken/index.jsx
/**
 * BloomToken — Flower product listing page
 *
 * Split-screen scroll layout (CSS scroll-snap, 3 sections):
 *   Snap 1 — Hero + progress bar
 *   Snap 2 — Product grid with rarity filter
 *   Snap 3 — How It Works steps
 *   Footer  — snaps to start
 *
 * All text is in English.
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar   from '../../components/Navbar'
import Footer   from '../../components/Footer'
import Toast    from '../../components/Toast'
import { useWallet } from '../../context/WalletContext'

/* ── Product data (shared with ProductDetail) ────────────────── */
export const FLOWER_PRODUCTS = [
  {
    id: 1,
    name: 'Crimson Rose Bundle',
    emoji: '🌹',
    price: 0.05,
    priceUsd: 180,
    stock: 42,
    totalStock: 50,
    rarity: 'Common',
    tags: ['romantic', 'fresh'],
    description: '12 hand-picked crimson roses with a moisture-lock wrap and a handwritten card. Sourced daily from local Hong Kong growers. Redeem within 12 months of purchase.',
  },
  {
    id: 2,
    name: 'White Lily Elegance',
    emoji: '🌸',
    price: 0.08,
    priceUsd: 290,
    stock: 18,
    totalStock: 20,
    rarity: 'Uncommon',
    tags: ['elegant', 'wedding'],
    description: '6 premium white lilies symbolising purity and elegance. Perfect for weddings, anniversaries, and luxury gifting. Delivery scheduling available at redemption.',
  },
  {
    id: 3,
    name: 'Sunflower Joy Pack',
    emoji: '🌻',
    price: 0.03,
    priceUsd: 110,
    stock: 60,
    totalStock: 60,
    rarity: 'Common',
    tags: ['cheerful', 'gift'],
    description: '10 vibrant sunflowers bursting with warmth — ideal for birthdays, housewarming, and celebrations. Expert packaging keeps blooms fresh for 5–7 days.',
  },
  {
    id: 4,
    name: 'Midnight Orchid NFT',
    emoji: '🌺',
    price: 0.25,
    priceUsd: 900,
    stock: 5,
    totalStock: 5,
    rarity: 'Rare',
    tags: ['rare', 'collectible'],
    description: 'Only 5 on-chain orchid NFT vouchers minted worldwide. Redeem for a hand-cultivated Phalaenopsis orchid, or hold as a premium digital collectible. Artist-signed certificate included.',
  },
  {
    id: 5,
    name: 'Spring Tulip Set',
    emoji: '💐',
    price: 0.04,
    priceUsd: 145,
    stock: 35,
    totalStock: 40,
    rarity: 'Common',
    tags: ['spring', 'colorful'],
    description: '15 mixed-colour spring tulips in red, yellow, and pink. Seasonal limited stock — vibrant, beautifully packaged, and ready to gift on any occasion.',
  },
  {
    id: 6,
    name: 'Golden Genesis Rose',
    emoji: '🥀',
    price: 0.6,
    priceUsd: 2160,
    stock: 1,
    totalStock: 1,
    rarity: 'Legendary',
    tags: ['legendary', 'auction'],
    description: 'The genesis legendary collectible. 1 of 1 worldwide. Gold-preservation process, mounted in a custom crystal display box. Ships with an on-chain certificate of authenticity and a physical notarised copy.',
  },
]

const RARITIES = ['All', 'Common', 'Uncommon', 'Rare', 'Legendary']

const RARITY_BADGE = {
  Common:    'badge-common',
  Uncommon:  'badge-uncommon',
  Rare:      'badge-rare',
  Legendary: 'badge-legendary',
}

const RARITY_RIBBON = {
  Common:    'common',
  Uncommon:  'uncommon',
  Rare:      'rare',
  Legendary: 'legendary',
}

/* Floating petal decoration (BloomToken brand effect) */
const PETAL_EMOJIS = ['🌸', '🌹', '🌺', '🌷', '💐']

function PetalFall() {
  return (
    <div className="petal-container" aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left:              `${(i * 10 + 3) % 100}%`,
            animationDelay:    `${(i * 0.8) % 6}s`,
            animationDuration: `${7 + (i % 5)}s`,
            fontSize:          `${1.2 + (i % 3) * 0.4}rem`,
          }}
        >
          {PETAL_EMOJIS[i % PETAL_EMOJIS.length]}
        </span>
      ))}
    </div>
  )
}

function BloomToken() {
  const navigate = useNavigate()
  const { isConnected, connect } = useWallet()
  const [activeRarity, setActiveRarity] = useState('All')

  const filtered = activeRarity === 'All'
    ? FLOWER_PRODUCTS
    : FLOWER_PRODUCTS.filter((p) => p.rarity === activeRarity)

  return (
    <div className="page-wrapper theme-bloomtoken">
      <Navbar />
      <PetalFall />

      <div className="snap-page">

        {/* ══════════════════════════════════════════
            SNAP 1 — Hero + Token Progress
        ══════════════════════════════════════════ */}
        <section className="snap-section hero">
          <div className="hero-badge">🌹 Web3 Florist · ERC-20 Prepaid Coupon Token</div>
          <h1>Bloom<span>Token</span></h1>
          <p className="hero-tagline">
            Pre-purchase flower coupon tokens and redeem a dozen fresh blooms
            anytime within 12 months — secured by smart contracts on Polygon.
          </p>

          <button
            className={`hero-connect-btn${isConnected ? ' connected' : ''}`}
            onClick={() =>
              isConnected
                ? document.querySelector('.snap-page').scrollBy({ top: window.innerHeight, behavior: 'smooth' })
                : connect('BloomToken')
            }
          >
            {isConnected ? '✓ Connected — Browse Flowers ↓' : 'Connect Wallet to Purchase'}
          </button>

          {/* Token stats */}
          <div className="hero-stats" style={{ marginTop: '3rem', marginBottom: '2.5rem' }}>
            {[
              { value: '100',    label: 'Total Tokens'  },
              { value: 'From $15', label: 'Per Token'  },
              { value: '$1,500', label: 'Goal'          },
              { value: '12 mo',  label: 'Validity'      },
            ].map((s) => (
              <div key={s.label} className="stat">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Inline token sale progress */}
          <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
            <div className="progress-labels">
              <span>34 tokens sold</span>
              <span>66 remaining</span>
            </div>
            <div className="progress-bar-bg" style={{ marginTop: '0.5rem' }}>
              <div className="progress-bar-fill" style={{ '--bar-width': '34%' }} />
            </div>
            <p className="progress-text" style={{ marginTop: '0.5rem' }}>
              $510 raised of $1,500 goal · 34%
            </p>
          </div>

          <p style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            scroll to browse ↓
          </p>
        </section>

        {/* ══════════════════════════════════════════
            SNAP 2 — Product Grid
        ══════════════════════════════════════════ */}
        <section className="snap-section section" id="products" style={{ justifyContent: 'flex-start', paddingTop: '5rem' }}>
          <div style={{ width: '100%' }}>
            <div className="section-header">
              <h2>🌸 Available Flowers</h2>
              <p>Each token is redeemable for fresh flowers · Minted on Polygon</p>
            </div>

            {/* Rarity filter */}
            <div className="filter-bar">
              {RARITIES.map((r) => (
                <button
                  key={r}
                  className={`filter-pill${activeRarity === r ? ' active' : ''}`}
                  onClick={() => setActiveRarity(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => navigate(`/bloomtoken/${product.id}`)}
                >
                  <div className="product-img-wrap">
                    <div className="product-glow" />
                    <span style={{ position: 'relative' }}>{product.emoji}</span>
                    <div className={`rarity-ribbon ${RARITY_RIBBON[product.rarity]}`}>
                      {product.rarity}
                    </div>
                  </div>

                  <div className="product-body">
                    <div className="product-top-row">
                      <span className={`badge ${RARITY_BADGE[product.rarity]}`}>
                        {product.rarity}
                      </span>
                    </div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">{product.price} ETH</div>
                    <div className="product-price-usd">≈ ${product.priceUsd} USD</div>

                    <div className="product-tags">
                      {product.tags.map((t) => (
                        <span key={t} className="product-tag">#{t}</span>
                      ))}
                    </div>

                    <div className="stock-bar-wrap">
                      <div className="stock-bar-label">
                        <span>Stock</span>
                        <span>{product.stock}/{product.totalStock}</span>
                      </div>
                      <div className="stock-bar-bg">
                        <div
                          className="stock-bar-fill"
                          style={{ width: `${(product.stock / product.totalStock) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="empty-state">
                <span className="empty-state-icon">🌿</span>
                <p>No products found for this rarity.</p>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SNAP 3 — How It Works
        ══════════════════════════════════════════ */}
        <section className="snap-section section section-alt">
          <div style={{ width: '100%' }}>
            <div className="section-header">
              <h2>How It Works</h2>
              <p>Three simple steps to support your local florist and receive beautiful blooms</p>
            </div>
            <div className="steps-grid">
              {[
                { icon: '💳', step: 'Step 1', title: 'Connect & Buy',      desc: 'Connect your MetaMask and purchase BloomTokens using eHKD, USDC, Bitcoin, or FPS. AML screening runs on your public key.' },
                { icon: '🌹', step: 'Step 2', title: 'Redeem Anytime',    desc: 'Ready for your flowers? Redeem a token and the smart contract automatically routes payment to the supplier, courier, and florist.' },
                { icon: '🚚', step: 'Step 3', title: 'Delivered to You',  desc: 'After delivery is confirmed via oracle, remaining funds are released to the florist. Unused tokens auto-settle after 12 months.' },
              ].map((s) => (
                <div key={s.step} className="step-card">
                  <span className="step-icon">{s.icon}</span>
                  <div className="step-number">{s.step}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="snap-footer">
          <Footer />
        </div>

      </div>

      <Toast />
    </div>
  )
}

export default BloomToken

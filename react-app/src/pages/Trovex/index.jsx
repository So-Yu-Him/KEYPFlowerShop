// filepath: src/pages/Trovex/index.jsx
/**
 * Trovex — C2C second-hand / NFT marketplace (listing page)
 *
 * Split-screen scroll layout (CSS scroll-snap, 3 sections):
 *   Snap 1 — Hero + progress bar
 *   Snap 2 — Real-time search + listing grid
 *   Snap 3 — How It Works + List an Item
 *   Footer  — snaps to start
 *
 * All text is in English.
 * Search uses onChange → real-time front-end filter (not onSubmit).
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar        from '../../components/Navbar'
import Footer        from '../../components/Footer'
import Toast         from '../../components/Toast'
import ListingCard   from './ListingCard'
import ListItemPanel from './ListItemPanel'
import { useWallet } from '../../context/WalletContext'

/* ── Listings data (shared with ItemDetail) ──────────────────── */
export const LISTINGS = [
  {
    id: 1,
    imgClass: 'img-electronics',
    emoji: '📱',
    condition: 'Like New',
    condClass: 'cond-like-new',
    nft: 'NFT #0041',
    title: 'iPhone 14 Pro 256GB',
    price: 'HK$3,200',
    trvx: '64 TRVX',
    priceHKD: 3200,
    retail: 'Retail: HK$8,799 · Save 64%',
    rating: '4.9',
    seller: '0x7f2e...b3a4',
    sellerFull: '0x7f2e4a8bcd12ef56789012345678901234b3a4',
    category: 'Electronics',
    rarity: 'Uncommon',
    history: [
      { event: 'Listed',        by: '0x7f2e...b3a4', date: '2024-03-10', price: 'HK$3,200' },
      { event: 'Price Changed', by: '0x7f2e...b3a4', date: '2024-03-05', price: 'HK$3,500' },
      { event: 'NFT Minted',   by: '0x7f2e...b3a4', date: '2024-02-28', price: '—'         },
    ],
  },
  {
    id: 2,
    imgClass: 'img-computer',
    emoji: '💻',
    condition: 'Like New',
    condClass: 'cond-like-new',
    nft: 'NFT #0039',
    title: 'MacBook Air M2 13"',
    price: 'HK$6,800',
    trvx: '136 TRVX',
    priceHKD: 6800,
    retail: 'Retail: HK$10,999 · Save 38%',
    rating: '5.0',
    seller: '0x891c...7B2e',
    sellerFull: '0x891c4a7b2e1234abcdef567890123456787B2e',
    category: 'Electronics',
    rarity: 'Rare',
    history: [
      { event: 'Listed',     by: '0x891c...7B2e', date: '2024-03-12', price: 'HK$6,800' },
      { event: 'NFT Minted', by: '0x891c...7B2e', date: '2024-03-01', price: '—'         },
    ],
  },
  {
    id: 3,
    imgClass: 'img-fashion',
    emoji: '👟',
    condition: 'Good',
    condClass: 'cond-good',
    nft: 'NFT #0028',
    title: 'Nike Air Jordan 1 Retro',
    price: 'HK$2,100',
    trvx: '42 TRVX',
    priceHKD: 2100,
    retail: 'Retail: HK$1,299 · +62%',
    rating: '4.7',
    seller: '0x3fa8...9Dc1',
    sellerFull: '0x3fa8c1d2e3f456789012abcdef345678909Dc1',
    category: 'Fashion',
    rarity: 'Uncommon',
    history: [
      { event: 'Listed',        by: '0x3fa8...9Dc1', date: '2024-03-08', price: 'HK$2,100' },
      { event: 'Price Changed', by: '0x3fa8...9Dc1', date: '2024-03-02', price: 'HK$2,400' },
      { event: 'NFT Minted',   by: '0x3fa8...9Dc1', date: '2024-02-20', price: '—'         },
    ],
  },
  {
    id: 4,
    imgClass: 'img-photo',
    emoji: '📷',
    condition: 'Good',
    condClass: 'cond-good',
    nft: 'NFT #0017',
    title: 'Sony A7 III Full Frame',
    price: 'HK$9,500',
    trvx: '190 TRVX',
    priceHKD: 9500,
    retail: 'Retail: HK$17,800 · Save 47%',
    rating: '4.8',
    seller: '0xbd4a...F91c',
    sellerFull: '0xbd4a12c3d4e5f67890abcdef123456789F91c',
    category: 'Electronics',
    rarity: 'Rare',
    history: [
      { event: 'Listed',     by: '0xbd4a...F91c', date: '2024-03-11', price: 'HK$9,500' },
      { event: 'NFT Minted', by: '0xbd4a...F91c', date: '2024-03-03', price: '—'         },
    ],
  },
  {
    id: 5,
    imgClass: 'img-gaming',
    emoji: '🎮',
    condition: 'Like New',
    condClass: 'cond-like-new',
    nft: 'NFT #0055',
    title: 'PlayStation 5 Digital',
    price: 'HK$2,800',
    trvx: '56 TRVX',
    priceHKD: 2800,
    retail: 'Retail: HK$3,980 · Save 30%',
    rating: '4.9',
    seller: '0xc21d...4Ab5',
    sellerFull: '0xc21d8e9f0a1b2c3d4e5f6789012345674Ab5',
    category: 'Electronics',
    rarity: 'Common',
    history: [
      { event: 'Listed',     by: '0xc21d...4Ab5', date: '2024-03-14', price: 'HK$2,800' },
      { event: 'NFT Minted', by: '0xc21d...4Ab5', date: '2024-03-10', price: '—'         },
    ],
  },
  {
    id: 6,
    imgClass: 'img-fashion',
    emoji: '👖',
    condition: 'Good',
    condClass: 'cond-good',
    nft: 'NFT #0063',
    title: "Levi's 501 Original Jeans",
    price: 'HK$320',
    trvx: '6.4 TRVX',
    priceHKD: 320,
    retail: 'Retail: HK$699 · Save 54%',
    rating: '4.6',
    seller: '0xf78b...3Ee7',
    sellerFull: '0xf78b2c3d4e5f6789012abcdef12345678903Ee7',
    category: 'Fashion',
    rarity: 'Common',
    history: [
      { event: 'Listed',     by: '0xf78b...3Ee7', date: '2024-03-09', price: 'HK$320' },
      { event: 'NFT Minted', by: '0xf78b...3Ee7', date: '2024-03-05', price: '—'       },
    ],
  },
  {
    id: 7,
    imgClass: 'img-electronics',
    emoji: '🎧',
    condition: 'Like New',
    condClass: 'cond-like-new',
    nft: 'NFT #0071',
    title: 'AirPods Pro 2nd Gen',
    price: 'HK$1,100',
    trvx: '22 TRVX',
    priceHKD: 1100,
    retail: 'Retail: HK$1,899 · Save 42%',
    rating: '4.8',
    seller: '0xaa3c...8Bf0',
    sellerFull: '0xaa3c5d6e7f890123456789abcdef012348Bf0',
    category: 'Electronics',
    rarity: 'Common',
    history: [
      { event: 'Listed',     by: '0xaa3c...8Bf0', date: '2024-03-15', price: 'HK$1,100' },
      { event: 'NFT Minted', by: '0xaa3c...8Bf0', date: '2024-03-12', price: '—'         },
    ],
  },
  {
    id: 8,
    imgClass: 'img-misc',
    emoji: '🌀',
    condition: 'Like New',
    condClass: 'cond-like-new',
    nft: 'NFT #0080',
    title: 'Dyson V15 Detect Vacuum',
    price: 'HK$3,600',
    trvx: '72 TRVX',
    priceHKD: 3600,
    retail: 'Retail: HK$6,499 · Save 45%',
    rating: '4.9',
    seller: '0xd55e...2Ca3',
    sellerFull: '0xd55e6f7a8b9c0d1e2f3456789abcdef12Ca3',
    category: 'Appliances',
    rarity: 'Uncommon',
    history: [
      { event: 'Listed',     by: '0xd55e...2Ca3', date: '2024-03-13', price: 'HK$3,600' },
      { event: 'NFT Minted', by: '0xd55e...2Ca3', date: '2024-03-08', price: '—'         },
    ],
  },
]

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Appliances']

function Trovex() {
  const navigate = useNavigate()
  const { isConnected, connect } = useWallet()
  const [query,    setQuery]    = useState('')
  const [category, setCategory] = useState('All')
  const [showList, setShowList] = useState(false)

  /* Real-time front-end filter — runs on every keystroke */
  const filtered = LISTINGS.filter((item) => {
    const q = query.toLowerCase()
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.nft.toLowerCase().includes(q)
    const matchesCat = category === 'All' || item.category === category
    return matchesQuery && matchesCat
  })

  return (
    <div className="page-wrapper theme-trovex">
      <Navbar />

      <div className="snap-page">

        {/* ══════════════════════════════════════════
            SNAP 1 — Hero + Progress
        ══════════════════════════════════════════ */}
        <section className="snap-section hero">
          <div className="hero-badge">💎 NFT-Backed · Trovex C2C Marketplace</div>
          <h1>Trade <span>Smarter</span></h1>
          <p className="hero-tagline">
            Every item is a blockchain-verified NFT ownership certificate.
            Buy and sell second-hand goods with escrow protection — peer-to-peer on Polygon.
          </p>

          <button
            className={`hero-connect-btn${isConnected ? ' connected' : ''}`}
            onClick={() =>
              isConnected
                ? document.querySelector('.snap-page').scrollBy({ top: window.innerHeight, behavior: 'smooth' })
                : connect('Trovex')
            }
          >
            {isConnected ? '✓ Connected — Browse Listings ↓' : 'Connect to Start Trading'}
          </button>

          <div className="hero-stats" style={{ marginTop: '3rem', marginBottom: '2.5rem' }}>
            {[
              { value: '1,200+', label: 'Items Listed'    },
              { value: 'HK$0',   label: 'Platform Fees'   },
              { value: '50 TRVX', label: 'Per HK$1 Spent' },
              { value: 'NFT',    label: 'Every Item'       },
            ].map((s) => (
              <div key={s.label} className="stat">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
            <div className="progress-labels">
              <span>240 items sold this week</span>
              <span>HK$48,000 volume</span>
            </div>
            <div className="progress-bar-bg" style={{ marginTop: '0.5rem' }}>
              <div className="progress-bar-fill" style={{ '--bar-width': '62%' }} />
            </div>
            <p className="progress-text" style={{ marginTop: '0.5rem' }}>
              Weekly target: 62% · 240 / 385 items sold
            </p>
          </div>

          <p style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            scroll to browse ↓
          </p>
        </section>

        {/* ══════════════════════════════════════════
            SNAP 2 — Search + Listing Grid
        ══════════════════════════════════════════ */}
        <section className="snap-section listings-section" id="listings" style={{ justifyContent: 'flex-start', paddingTop: '5rem' }}>
          <div style={{ width: '100%' }}>
            <div className="listings-header">
              <h2>🛍️ Browse Listings</h2>
              <p>All items are NFT-certified · Escrow-protected transactions</p>
            </div>

            {/* Real-time search — onChange filter, not form submit */}
            <div className="search-bar-wrap">
              <input
                className="search-input"
                type="text"
                placeholder="Search by name, category, NFT ID…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Category filter pills */}
            <div className="filter-bar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill${category === cat ? ' active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filtered.length > 0 ? (
              <div className="listing-grid">
                {filtered.map((item) => (
                  <ListingCard
                    key={item.id}
                    item={item}
                    onView={() => navigate(`/marketplace/${item.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state-icon">🔍</span>
                <p>No listings match "{query}". Try a different search.</p>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SNAP 3 — How It Works + List an Item
        ══════════════════════════════════════════ */}
        <section className="snap-section section section-alt" style={{ justifyContent: 'flex-start', paddingTop: '5rem' }}>
          <div style={{ width: '100%' }}>
            <div className="section-header">
              <h2>How Trovex Works</h2>
              <p>Trustless peer-to-peer trading with smart contract escrow</p>
            </div>
            <div className="steps-grid">
              {[
                { icon: '📸', step: 'Step 1', title: 'List & Mint',       desc: 'Upload photos and set your price. The item is minted as a Trovex NFT on Polygon. AML-verified sellers only.' },
                { icon: '🤝', step: 'Step 2', title: 'Buyer Purchases',   desc: 'Buyer sends TRVX to escrow. Smart contract holds funds until the courier confirms delivery via oracle.' },
                { icon: '🚚', step: 'Step 3', title: 'Deliver & Settle',  desc: 'Ship the item. After confirmed delivery, escrow releases TRVX to seller. On-chain dispute resolution available.' },
              ].map((s) => (
                <div key={s.step} className="step-card">
                  <span className="step-icon">{s.icon}</span>
                  <div className="step-number">{s.step}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>

            {/* List an Item */}
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Ready to sell?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Mint your item as an NFT and reach 8,000+ active buyers
              </p>
              {showList ? (
                <ListItemPanel />
              ) : (
                <button
                  className="btn-primary btn-lg"
                  onClick={() => isConnected ? setShowList(true) : connect('Trovex')}
                >
                  {isConnected ? '+ List an Item' : 'Connect Wallet to List'}
                </button>
              )}
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

export default Trovex

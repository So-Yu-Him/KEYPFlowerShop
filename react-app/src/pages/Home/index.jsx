// filepath: src/pages/Home/index.jsx
/**
 * Home — Main landing page for FloreX
 *
 * Split-screen scroll layout (CSS scroll-snap, 4 sections):
 *   Snap 1 — Brand Hero: logo, title, tagline, CTA
 *   Snap 2 — Platform Cards: 3 sub-brand entry points
 *   Snap 3 — Stats: animated number count-up
 *   Snap 4 — How to Start: 3-step guide
 *   Footer  — non-snap, snaps to start
 *
 * All text is in English.
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar    from '../../components/Navbar'
import Footer    from '../../components/Footer'
import Toast     from '../../components/Toast'
import BrandLogo from '../../components/BrandLogo'
import { useWallet } from '../../context/WalletContext'

/* ── Animated number hook ────────────────────────────────────── */
function useCountUp(target, duration = 2200, decimals = 0) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let startTime = null

    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed  = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setValue(+(target * eased).toFixed(decimals))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [target, duration, decimals]) // eslint-disable-line

  return value
}

/* ── Platform card data ──────────────────────────────────────── */
const PLATFORMS = [
  {
    path:     '/bloomtoken',
    icon:     '🌸',
    title:    'BloomToken',
    desc:     'Mint ERC-721 bouquet NFTs on Base. Redeem fresh blooms anytime within 12 months.',
    cta:      'Explore Flowers →',
    color:    '#f43f5e',
    gradient: 'linear-gradient(90deg, #f43f5e, #fb7185)',
    border:   'rgba(244,63,94,0.35)',
    shadow:   'rgba(244,63,94,0.15)',
  },
  {
    path:     '/marketplace',
    icon:     '💎',
    title:    'Trovex',
    desc:     'Buy and sell second-hand goods peer-to-peer in a demo flow. Each item includes NFT-style ownership metadata.',
    cta:      'Browse Market →',
    color:    '#f97316',
    gradient: 'linear-gradient(90deg, #f97316, #fbbf24)',
    border:   'rgba(249,115,22,0.35)',
    shadow:   'rgba(249,115,22,0.15)',
  },
  {
    path:     '/lending',
    icon:     '🤝',
    title:    'PeerLend',
    desc:     'Explore lending scenarios with graded borrowers and simulated returns in a prototype interface.',
    cta:      'Start Lending →',
    color:    '#4f46e5',
    gradient: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
    border:   'rgba(79,70,229,0.35)',
    shadow:   'rgba(79,70,229,0.15)',
  },
]

/* ── How-to-start steps ──────────────────────────────────────── */
const HOW_STEPS = [
  { num: '01', icon: '🦊', title: 'Connect Wallet',   desc: 'Link your MetaMask. Sign a message to verify ownership — no password needed.' },
  { num: '02', icon: '🎯', title: 'Choose a Service', desc: 'Pick BloomToken, Trovex, or PeerLend. Each has its own demo workflow and feature set.' },
  { num: '03', icon: '⚡', title: 'Try Demo Flows',   desc: 'Buy tokens, list items, or fund loans through simulated transaction steps in the UI.' },
]

/* ── Stats data ──────────────────────────────────────────────── */
const STATS = [
  { target: 2.4,  suffix: 'M',  prefix: '$', label: 'Total Volume',    decimals: 1 },
  { target: 8200, suffix: '+',  prefix: '',  label: 'Active Users',    decimals: 0 },
  { target: 3,    suffix: '',   prefix: '',  label: 'Smart Contracts', decimals: 0 },
  { target: 892,  suffix: '',   prefix: '',  label: 'Trades Settled',  decimals: 0 },
]

function StatItem({ target, suffix, prefix, label, decimals }) {
  const count = useCountUp(target, 2200, decimals)
  return (
    <div className="stat-item">
      <span className="stat-number">{prefix}{count.toLocaleString()}{suffix}</span>
      <p className="stat-desc">{label}</p>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────────── */
function Home() {
  const navigate = useNavigate()
  const { isConnected, connect } = useWallet()

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="snap-page">

        {/* ══════════════════════════════════════════
            SNAP 1 — Brand Hero
        ══════════════════════════════════════════ */}
        <section className="snap-section home-hero">
          <div className="home-hero-logo">
            <BrandLogo size={88} />
          </div>
          <h1>FloreX</h1>
          <p className="home-hero-sub">On-Chain Blooms · Decentralised Beauty</p>
          <p className="home-hero-tagline">
            A Web3 platform uniting flower commerce, peer-to-peer trading,
            and decentralised lending — presented through conceptual smart-contract flows.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="btn-primary btn-lg"
              onClick={() => isConnected ? navigate('/bloomtoken') : connect('FloreX')}
            >
              {isConnected ? 'Enter App →' : 'Connect Wallet →'}
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '1rem 2rem', fontSize: '1rem', borderRadius: 'var(--radius-lg)' }}
              onClick={() => navigate('/bloomtoken')}
            >
              Explore
            </button>
          </div>

          {/* Subtle scroll hint */}
          <p style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.08em', animation: 'pulse-dot 2s infinite' }}>
            scroll to discover ↓
          </p>
        </section>

        {/* ══════════════════════════════════════════
            SNAP 2 — Platform Cards
        ══════════════════════════════════════════ */}
        <section className="snap-section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }}>
            <div className="section-header" style={{ marginBottom: '2.5rem' }}>
              <h2>Choose Your Platform</h2>
              <p>Three independent Web3 products — one connected ecosystem</p>
            </div>
            <div className="platform-cards">
              {PLATFORMS.map((p) => (
                <div
                  key={p.path}
                  className="platform-card"
                  onClick={() => navigate(p.path)}
                  style={{
                    '--card-gradient': p.gradient,
                    '--card-border':   p.border,
                    '--card-shadow':   p.shadow,
                    '--card-color':    p.color,
                  }}
                >
                  <span className="platform-card-icon">{p.icon}</span>
                  <h3 className="platform-card-title">{p.title}</h3>
                  <p className="platform-card-desc">{p.desc}</p>
                  <div className="platform-card-cta">{p.cta}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SNAP 3 — Platform Stats
        ══════════════════════════════════════════ */}
        <section className="snap-section stats-section" style={{ borderTop: '1px solid var(--border)' }}>
          <div style={{ width: '100%' }}>
            <div className="section-header" style={{ marginBottom: '2.5rem' }}>
              <h2>Platform at a Glance</h2>
              <p>Sample metrics for this demo experience</p>
            </div>
            <div className="stats-grid" style={{ maxWidth: '800px', margin: '0 auto' }}>
              {STATS.map((s) => (
                <StatItem key={s.label} {...s} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SNAP 4 — How to Get Started
        ══════════════════════════════════════════ */}
        <section className="snap-section how-section" style={{ borderTop: '1px solid var(--border)' }}>
          <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div className="section-header" style={{ marginBottom: '3rem' }}>
              <h2>How to Get Started</h2>
              <p>Three steps to explore the product demos in under 2 minutes</p>
            </div>
            <div className="how-steps">
              {HOW_STEPS.map((s) => (
                <div key={s.num} className="how-step">
                  <div className="how-step-num">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button className="btn-primary btn-lg" onClick={() => navigate('/bloomtoken')}>
                Start with BloomToken →
              </button>
            </div>
          </div>
        </section>

        {/* Footer — snaps to start, not forced full-height */}
        <div className="snap-footer">
          <Footer />
        </div>

      </div>

      <Toast />
    </div>
  )
}

export default Home

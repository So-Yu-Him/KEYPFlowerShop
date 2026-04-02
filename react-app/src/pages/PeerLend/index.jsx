// filepath: src/pages/PeerLend/index.jsx
/**
 * PeerLend — P2P lending marketplace (loan listing page)
 *
 * Split-screen scroll layout (CSS scroll-snap, 3 sections):
 *   Snap 1 — Hero + progress bar
 *   Snap 2 — Active loan listings with grade filter
 *   Snap 3 — How PeerLend Works + Risk Management
 *   Footer  — snaps to start
 *
 * All text is in English.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar   from '../../components/Navbar'
import Footer   from '../../components/Footer'
import Toast    from '../../components/Toast'
import { useWallet } from '../../context/WalletContext'

/* ── Loan listings data (shared with LoanDetail) ─────────────── */
export const LOAN_LISTINGS = [
  {
    id: 1,
    borrower: '0x742d...3F4a',
    borrowerFull: '0x742d8e9f0a1b2c3d4e5f6789012345673F4a',
    amount: 2.5,
    currency: 'ETH',
    interest: 8.5,
    duration: 30,
    funded: 67,
    grade: 'A',
    purpose: 'Flower Shop Inventory Restocking',
    collateral: 'BLMT x 500',
    repaymentType: 'Monthly',
    description: 'For seasonal bulk purchasing at the flower wholesale market. Borrower is a registered floral retailer with 12 months of on-chain repayment history. Collateral: 500 BloomTokens locked in escrow.',
    repayHistory: [
      { month: 'Jan', repaid: true  },
      { month: 'Feb', repaid: true  },
      { month: 'Mar', repaid: false },
    ],
  },
  {
    id: 2,
    borrower: '0x891c...7B2e',
    borrowerFull: '0x891c4a7b2e1234abcdef567890123456787B2e',
    amount: 1.0,
    currency: 'ETH',
    interest: 12.0,
    duration: 14,
    funded: 30,
    grade: 'B',
    purpose: 'NFT Flip Arbitrage',
    collateral: 'Trovex Item #42',
    repaymentType: 'Bullet',
    description: 'Purchasing NFT assets for short-term arbitrage resale. Higher risk is reflected in the interest rate. Collateral: Trovex NFT #42 locked in on-chain escrow contract.',
    repayHistory: [],
  },
  {
    id: 3,
    borrower: '0x3fa8...9Dc1',
    borrowerFull: '0x3fa8c1d2e3f456789012abcdef345678909Dc1',
    amount: 5.0,
    currency: 'ETH',
    interest: 6.5,
    duration: 60,
    funded: 85,
    grade: 'A+',
    purpose: 'DeFi Liquidity Provision',
    collateral: 'ETH x 2',
    repaymentType: 'Monthly',
    description: 'Capital for a Uniswap V3 liquidity pool. Borrower has 24 months of DeFi history with an A+ credit grade. Over-collateralised at 200% — extremely low risk profile.',
    repayHistory: [
      { month: 'Oct', repaid: true },
      { month: 'Nov', repaid: true },
      { month: 'Dec', repaid: true },
      { month: 'Jan', repaid: true },
    ],
  },
]

const GRADE_BADGE = {
  'A+': 'badge-a-plus',
  'A':  'badge-a',
  'B':  'badge-b',
  'C':  'badge-c',
}

const GRADES = ['All', 'A+', 'A', 'B']

function PeerLend() {
  const navigate = useNavigate()
  const { isConnected, connect } = useWallet()
  const [activeGrade, setActiveGrade] = useState('All')

  const filtered = activeGrade === 'All'
    ? LOAN_LISTINGS
    : LOAN_LISTINGS.filter((l) => l.grade === activeGrade)

  return (
    <div className="page-wrapper theme-peerlend">
      <Navbar />

      <div className="snap-page">

        {/* ══════════════════════════════════════════
            SNAP 1 — Hero + Progress
        ══════════════════════════════════════════ */}
        <section className="snap-section hero">
          <div className="hero-badge">🤝 DeFi Lending · Smart Contract Escrow</div>
          <h1>Peer<span>Lend</span></h1>
          <p className="hero-tagline">
            Earn up to 12% APR by lending ETH to verified borrowers.
            Smart contracts handle repayments, collateral, and dispute resolution automatically.
          </p>

          <button
            className={`hero-connect-btn${isConnected ? ' connected' : ''}`}
            onClick={() =>
              isConnected
                ? document.querySelector('.snap-page').scrollBy({ top: window.innerHeight, behavior: 'smooth' })
                : connect('PeerLend')
            }
          >
            {isConnected ? '✓ Connected — Browse Loans ↓' : 'Connect to Start Lending'}
          </button>

          <div className="hero-stats" style={{ marginTop: '3rem', marginBottom: '2.5rem' }}>
            {[
              { value: '8.5%',  label: 'Avg APR'          },
              { value: '$340K', label: 'Total Lent'        },
              { value: '98.2%', label: 'Repayment Rate'    },
              { value: '200%',  label: 'Avg Collateral'    },
            ].map((s) => (
              <div key={s.label} className="stat">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
            <div className="progress-labels">
              <span>8.5 ETH funded this round</span>
              <span>Target: 10 ETH</span>
            </div>
            <div className="progress-bar-bg" style={{ marginTop: '0.5rem' }}>
              <div className="progress-bar-fill shimmer" style={{ '--bar-width': '85%' }} />
            </div>
            <p className="progress-text" style={{ marginTop: '0.5rem' }}>
              85% funded · 3 active requests · Closes in 48 hrs
            </p>
          </div>

          <p style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            scroll to browse ↓
          </p>
        </section>

        {/* ══════════════════════════════════════════
            SNAP 2 — Active Loan Listings
        ══════════════════════════════════════════ */}
        <section className="snap-section section" id="loans" style={{ justifyContent: 'flex-start', paddingTop: '5rem' }}>
          <div style={{ width: '100%' }}>
            <div className="section-header">
              <h2>📋 Active Loan Requests</h2>
              <p>Grade-rated borrowers · Collateral locked on-chain · Automated repayments</p>
            </div>

            {/* Grade filter */}
            <div className="filter-bar">
              {GRADES.map((g) => (
                <button
                  key={g}
                  className={`filter-pill${activeGrade === g ? ' active' : ''}`}
                  onClick={() => setActiveGrade(g)}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="loan-listings-grid">
              {filtered.map((loan) => (
                <div
                  key={loan.id}
                  className="loan-list-card"
                  onClick={() => navigate(`/lending/${loan.id}`)}
                >
                  <div className="loan-list-top">
                    <div className="loan-grade-badge">{loan.grade}</div>
                    <div className="loan-list-info">
                      <div className="loan-list-purpose">{loan.purpose}</div>
                      <div className="loan-list-borrower">{loan.borrower}</div>
                      <div className="loan-list-badges">
                        <span className={`badge ${GRADE_BADGE[loan.grade] || 'badge-blue'}`}>Grade {loan.grade}</span>
                        <span className="badge badge-blue">{loan.currency}</span>
                        <span className="badge badge-green">{loan.repaymentType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="loan-metrics">
                    <div>
                      <div className="loan-metric-label">Amount</div>
                      <div className="loan-metric-value">{loan.amount} ETH</div>
                    </div>
                    <div>
                      <div className="loan-metric-label">APR</div>
                      <div className="loan-metric-value" style={{ color: 'var(--green)' }}>{loan.interest}%</div>
                    </div>
                    <div>
                      <div className="loan-metric-label">Duration</div>
                      <div className="loan-metric-value">{loan.duration}d</div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      <span>Funded</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{loan.funded}%</span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '5px' }}>
                      <div className="progress-bar-fill shimmer" style={{ '--bar-width': `${loan.funded}%` }} />
                    </div>
                  </div>

                  <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Collateral: <span style={{ color: 'var(--text-secondary)' }}>{loan.collateral}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SNAP 3 — How It Works + Risk
        ══════════════════════════════════════════ */}
        <section className="snap-section section section-alt" style={{ justifyContent: 'flex-start', paddingTop: '5rem' }}>
          <div style={{ width: '100%' }}>
            <div className="section-header">
              <h2>How PeerLend Works</h2>
              <p>Fully automated by smart contracts — no human intermediary</p>
            </div>
            <div className="steps-grid" style={{ marginBottom: '3rem' }}>
              {[
                { icon: '🎯', step: 'Step 1', title: 'Borrower Requests',    desc: 'Submit a loan request with amount, rate, duration, and collateral. Chainlink Oracle verifies credit grade.' },
                { icon: '💰', step: 'Step 2', title: 'Lenders Fund Pool',    desc: 'Lenders deposit ETH into the escrow contract. Funds are held until the round closes.' },
                { icon: '✅', step: 'Step 3', title: 'Automated Repayments', desc: 'Monthly repayments pull from the borrower\'s pre-approved wallet. Default triggers automatic collateral liquidation.' },
              ].map((s) => (
                <div key={s.step} className="step-card">
                  <span className="step-icon">{s.icon}</span>
                  <div className="step-number">{s.step}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Risk cards */}
            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Risk Management</h2>
            </div>
            <div className="risk-grid">
              {[
                { icon: '🔒', title: 'Collateral Lock',   desc: 'All loans require 150–300% over-collateralisation. Assets are liquidated automatically on default.' },
                { icon: '📊', title: 'Credit Scoring',    desc: 'Chainlink-powered oracle grades borrowers A+ to C based on on-chain history. Only A–B requests are listed.' },
                { icon: '🛡️', title: 'Insurance Pool',   desc: '1% of interest funds a community insurance pool, covering up to 10% of pool value in edge-case defaults.' },
                { icon: '⚖️', title: 'DAO Arbitration',  desc: 'PLDT token holders vote on disputes. Neutral on-chain governance resolves cases within 72 hours.' },
              ].map((r) => (
                <div key={r.title} className="risk-card">
                  <span className="risk-icon">{r.icon}</span>
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
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

export default PeerLend

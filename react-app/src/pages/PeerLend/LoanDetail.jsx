// filepath: src/pages/PeerLend/LoanDetail.jsx
/**
 * LoanDetail — individual loan request detail page
 *
 * URL: /lending/:id
 *
 * Features:
 *   - Breadcrumb: Home > PeerLend > [purpose]
 *   - Left: grade badge + borrower info + funding progress with shimmer
 *   - Right: loan parameters, collateral details
 *   - Repayment schedule table (calculated on-the-fly, first 3 shown)
 *   - Risk metrics: collateral ratio, historical repayment bar chart (CSS)
 *   - "Fund This Loan" → LendPanel modal
 */

import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar    from '../../components/Navbar'
import Footer    from '../../components/Footer'
import Toast     from '../../components/Toast'
import LendPanel from './LendPanel'
import { LOAN_LISTINGS } from './index'
import { useWallet } from '../../context/WalletContext'

const GRADE_BADGE = {
  'A+': 'badge-a-plus',
  'A':  'badge-a',
  'B':  'badge-b',
  'C':  'badge-c',
}

/* Generate a simple repayment schedule (monthly) */
function generateSchedule(principal, aprPct, months) {
  const r = aprPct / 100 / 12
  if (r === 0) return []
  const pmt = (principal * r) / (1 - Math.pow(1 + r, -months))
  let balance = principal
  return Array.from({ length: months }, (_, i) => {
    const interest    = +(balance * r).toFixed(4)
    const principalPay = +(pmt - interest).toFixed(4)
    balance           = +Math.max(0, balance - principalPay).toFixed(4)
    return { month: i + 1, payment: +pmt.toFixed(4), principal: principalPay, interest, balance }
  })
}

/* CSS bar chart data — mock repayment activity */
const BAR_DATA = [
  { label: 'Oct', height: 70 },
  { label: 'Nov', height: 85 },
  { label: 'Dec', height: 60 },
  { label: 'Jan', height: 95 },
  { label: 'Feb', height: 80 },
  { label: 'Mar', height: 90 },
]

function LoanDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { isConnected, connect } = useWallet()
  const [showModal, setShowModal] = useState(false)

  const loan = LOAN_LISTINGS.find((l) => l.id === parseInt(id, 10))

  if (!loan) {
    return (
      <div className="page-wrapper theme-peerlend">
        <Navbar />
        <div className="detail-container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
          <p style={{ fontSize: '4rem' }}>📋</p>
          <h2>Loan not found</h2>
          <Link to="/lending" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            ← Back to PeerLend
          </Link>
        </div>
      </div>
    )
  }

  const handleFund = () => {
    if (!isConnected) { connect('PeerLend'); return }
    setShowModal(true)
  }

  /* Repayment schedule — only first 3 rows shown */
  const durationMonths = Math.round(loan.duration / 30)
  const schedule = generateSchedule(loan.amount, loan.interest, durationMonths).slice(0, 3)
  const collateralRatio = loan.collateral.startsWith('ETH')
    ? Math.round((parseFloat(loan.collateral.split(' x ')[1] || 1) * loan.amount * 100) / loan.amount)
    : 150

  return (
    <div className="page-wrapper theme-peerlend">
      <Navbar />

      <div className="detail-page">
        <div className="detail-container">
          {/* ── Breadcrumb ── */}
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/lending">PeerLend</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{loan.purpose}</span>
          </nav>

          {/* ── Detail grid ── */}
          <div className="detail-grid">
            {/* Left panel */}
            <div>
              {/* Grade + borrower card */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                marginBottom: '1.25rem',
                boxShadow: '0 0 30px rgba(var(--primary-rgb),0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="loan-grade-circle" style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}>
                    {loan.grade}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{loan.purpose}</div>
                    <div style={{ fontFamily: 'Courier New, monospace', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{loan.borrower}</div>
                    <div style={{ marginTop: '0.4rem' }}>
                      <span className={`badge ${GRADE_BADGE[loan.grade] || 'badge-blue'}`}>Grade {loan.grade}</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  {loan.description}
                </p>

                {/* Funded progress */}
                <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Funding Progress</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{loan.funded}%</span>
                </div>
                <div className="progress-bar-bg" style={{ height: '8px', marginBottom: '0.4rem' }}>
                  <div
                    className="progress-bar-fill shimmer"
                    style={{ '--bar-width': `${loan.funded}%` }}
                  />
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {loan.funded}% · {((loan.amount * loan.funded) / 100).toFixed(2)} / {loan.amount} ETH funded
                </p>
              </div>

              {/* Collateral info */}
              <div style={{
                background: 'rgba(var(--primary-rgb),0.06)',
                border: '1px solid rgba(var(--primary-rgb),0.15)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
              }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  Collateral Locked
                </p>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                  {loan.collateral}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Collateral ratio: <strong style={{ color: 'var(--green)' }}>{collateralRatio}%</strong> ·
                  Liquidated automatically on default
                </p>
              </div>

              {/* Fund CTA */}
              <button
                className="btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1.25rem' }}
                onClick={handleFund}
              >
                {isConnected ? '💰 Fund This Loan' : '🔗 Connect to Fund'}
              </button>
              <button
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                onClick={() => navigate('/lending')}
              >
                ← Back to all loans
              </button>
            </div>

            {/* Right panel */}
            <div>
              {/* Loan parameters */}
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Loan Parameters
              </h3>
              <div className="info-grid" style={{ marginBottom: '2rem' }}>
                {[
                  { label: 'Amount',     value: `${loan.amount} ${loan.currency}`, sub: '~ HKD equivalent' },
                  { label: 'APR',        value: `${loan.interest}%`,               sub: 'Fixed rate'        },
                  { label: 'Duration',   value: `${loan.duration} days`,           sub: loan.repaymentType  },
                  { label: 'Borrower',   value: loan.grade,                        sub: 'Credit grade'      },
                ].map((x) => (
                  <div key={x.label} className="info-card">
                    <div className="info-card-label">{x.label}</div>
                    <div className="info-card-value">{x.value}</div>
                    <div className="info-card-sub">{x.sub}</div>
                  </div>
                ))}
              </div>

              {/* Repayment schedule */}
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Repayment Schedule
              </h3>
              <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                <table className="repay-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Payment</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((row, i) => (
                      <tr key={row.month} className={i === 0 ? 'highlight' : ''}>
                        <td>Month {row.month}</td>
                        <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{row.payment} ETH</td>
                        <td>{row.principal} ETH</td>
                        <td style={{ color: 'var(--green)' }}>{row.interest} ETH</td>
                        <td>{row.balance} ETH</td>
                      </tr>
                    ))}
                    {durationMonths > 3 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          … {durationMonths - 3} more months
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Risk metrics */}
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Historical Repayment Rate
              </h3>
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}>
                <div className="bar-chart">
                  {BAR_DATA.map((d) => (
                    <div key={d.label} className="bar-item">
                      <div className="bar-fill" style={{ height: `${d.height}%` }} />
                      <span className="bar-label">{d.label}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
                  On-time repayments by month (%) · Platform average: 98.2%
                </p>
              </div>

              {/* Risk summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { label: 'Collateral Ratio', value: `${collateralRatio}%`,    good: true  },
                  { label: 'Repayment Rate',   value: '98.2%',                  good: true  },
                  { label: 'Default History',  value: '0 defaults',             good: true  },
                  { label: 'Credit Grade',     value: `Grade ${loan.grade}`,    good: loan.grade !== 'C' },
                ].map((x) => (
                  <div key={x.label} style={{
                    background: 'var(--bg-card)',
                    border: `1px solid ${x.good ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                  }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{x.label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: x.good ? 'var(--green)' : 'var(--red)' }}>{x.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LendPanel modal */}
      <LendPanel
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        loan={loan}
      />

      <Footer />
      <Toast />
    </div>
  )
}

export default LoanDetail

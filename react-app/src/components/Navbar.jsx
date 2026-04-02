// filepath: src/components/Navbar.jsx
/**
 * Navbar — shared top navigation bar (redesigned for Web3 dark theme)
 *
 * Features:
 *   - BrandLogo + "FloreX" text → click to go home
 *   - Navigation links for all 4 routes (highlighted by useLocation)
 *   - Wallet button: green pulse dot + truncated address when connected
 *   - "Install MetaMask" link when window.ethereum is missing
 *   - Mobile: hamburger icon → slide-in drawer
 */

import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { useWallet } from '../context/WalletContext'

const NAV_LINKS = [
  { path: '/',            label: 'Home',       end: true },
  { path: '/bloomtoken',  label: 'BloomToken', end: false },
  { path: '/marketplace', label: 'Trovex',     end: false },
  { path: '/lending',     label: 'PeerLend',   end: false },
]

function Navbar() {
  const { isConnected, address, networkName, truncateAddress, connect } = useWallet()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Check if MetaMask is available
  const hasMetaMask = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'

  const handleConnectClick = () => {
    if (!hasMetaMask) {
      window.open('https://metamask.io/download/', '_blank')
      return
    }
    connect('FloreX')
  }

  return (
    <>
      <nav className="navbar">
        {/* ── Brand ── */}
        <Link to="/" className="nav-brand-link">
          <BrandLogo size={32} />
          <span className="nav-brand-text">FloreX</span>
        </Link>

        {/* ── Desktop navigation links ── */}
        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* ── Wallet area (right side) ── */}
        <div className="nav-right">
          {isConnected && networkName && (
            <span className="network-badge">{networkName}</span>
          )}

          {isConnected ? (
            // Connected state: green dot + address
            <div className="wallet-connected-pill">
              <span className="wallet-dot" />
              <span className="wallet-address">{truncateAddress(address)}</span>
            </div>
          ) : (
            // Not connected: Connect / Install MetaMask button
            <button className="btn-primary btn-sm" onClick={handleConnectClick}>
              {hasMetaMask ? 'Connect Wallet' : 'Install MetaMask'}
            </button>
          )}

          {/* Hamburger (mobile only) */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ── Mobile overlay ── */}
      {menuOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div className={`mobile-drawer${menuOpen ? ' open' : ''}`}>
        <div className="drawer-header">
          <BrandLogo size={28} />
          <span className="nav-brand-text">FloreX</span>
          <button
            className="drawer-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="drawer-links">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) => `drawer-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="drawer-wallet">
          {isConnected ? (
            <div className="wallet-connected-pill">
              <span className="wallet-dot" />
              <span className="wallet-address">{truncateAddress(address)}</span>
            </div>
          ) : (
            <button className="btn-primary" onClick={handleConnectClick} style={{ width: '100%' }}>
              {hasMetaMask ? 'Connect Wallet' : 'Install MetaMask'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar

// filepath: src/components/Footer.jsx
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <BrandLogo size={28} />
          <span className="footer-brand-name">FloreX</span>
          <p className="footer-slogan">Bloom Commerce · Web3 Demo Experience</p>
        </div>

        {/* Links */}
        <div className="footer-links-group">
          <span className="footer-group-title">Products</span>
          <Link to="/bloomtoken" className="footer-link">BloomToken</Link>
          <Link to="/marketplace" className="footer-link">Trovex</Link>
          <Link to="/lending" className="footer-link">PeerLend</Link>
        </div>

        <div className="footer-links-group">
          <span className="footer-group-title">Resources</span>
          <a href="https://thirdweb.com" target="_blank" rel="noreferrer" className="footer-link">Thirdweb</a>
          <a href="https://base.org" target="_blank" rel="noreferrer" className="footer-link">Base</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">GitHub</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 <strong>FloreX</strong> · Powered by Thirdweb · Base-inspired concept</p>
        <p className="footer-disclaimer">
          Proof of Concept · Academic purposes only · Not financial advice · SBIF Assignment
        </p>
      </div>
    </footer>
  )
}

export default Footer

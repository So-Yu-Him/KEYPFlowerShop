// filepath: src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { WalletProvider } from './context/WalletContext'

// Pages
import Home           from './pages/Home'
import BloomToken     from './pages/BloomToken'
import ProductDetail  from './pages/BloomToken/ProductDetail'
import Trovex         from './pages/Trovex'
import ItemDetail     from './pages/Trovex/ItemDetail'
import PeerLend       from './pages/PeerLend'
import LoanDetail     from './pages/PeerLend/LoanDetail'

/**
 * App — root component
 *
 * Route map:
 *   /                 → Home (main landing page with 3 sub-brand entry cards)
 *   /bloomtoken       → BloomToken product list
 *   /bloomtoken/:id   → BloomToken product detail + purchase modal
 *   /marketplace      → Trovex C2C listing grid (with real-time search)
 *   /marketplace/:id  → Trovex item detail + buy/bid
 *   /lending          → PeerLend loan listings
 *   /lending/:id      → PeerLend loan detail + lend modal
 */
function App() {
  return (
    <WalletProvider>
      <Routes>
        <Route path="/"                 element={<Home />}          />
        <Route path="/bloomtoken"       element={<BloomToken />}    />
        <Route path="/bloomtoken/:id"   element={<ProductDetail />} />
        <Route path="/marketplace"      element={<Trovex />}        />
        <Route path="/marketplace/:id"  element={<ItemDetail />}    />
        <Route path="/lending"          element={<PeerLend />}      />
        <Route path="/lending/:id"      element={<LoanDetail />}    />
        {/* Redirect any unknown path to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </WalletProvider>
  )
}

export default App

/**
 * ListItemPanel.jsx — form panel shown on Trovex after wallet connects
 *
 * Lets the seller:
 *   1. Enter item name
 *   2. Choose category (pill selector)
 *   3. Choose condition (pill selector)
 *   4. Set asking price (auto-converts to TRVX, shows AI price suggestion)
 *   5. Click "Create Demo Listing"
 */

import { useState } from 'react'
import { useWallet } from '../../context/WalletContext'

const TRVX_RATE = 50  // 1 TRVX = HK$50

const CATEGORIES = ['📱 Electronics', '💻 Computers', '👗 Fashion', '🎮 Gaming', '🏠 Home', '📚 Books']
const CONDITIONS  = ['✨ Like New', '👍 Good', '⚡ Fair']

// AI suggested price range by category (simulated)
const AI_PRICE_RANGES = {
  '📱 Electronics': [800,  5000],
  '💻 Computers':   [2000, 12000],
  '👗 Fashion':     [80,   1500],
  '🎮 Gaming':      [200,  3000],
  '🏠 Home':        [50,   2000],
  '📚 Books':       [20,   300],
}

function ListItemPanel() {
  const { isConnected, showToast } = useWallet()

  const [itemName,  setItemName]  = useState('')
  const [category,  setCategory]  = useState('📱 Electronics')
  const [condition, setCondition] = useState('✨ Like New')
  const [price,     setPrice]     = useState('')

  // Derived values
  const trvxEquiv   = price ? (parseFloat(price) / TRVX_RATE).toFixed(1) : null
  const aiRange     = AI_PRICE_RANGES[category] || [100, 5000]
  const priceNum    = parseFloat(price)
  const aiSuggested = !isNaN(priceNum) && priceNum > 0
    ? Math.max(aiRange[0], Math.min(aiRange[1], Math.round(priceNum * 0.92)))
    : null

  const handleList = () => {
    if (!isConnected) {
      showToast('Please connect your wallet first!')
      return
    }
    if (!itemName.trim()) {
      showToast('⚠️ Please enter an item name')
      return
    }
    if (!priceNum || priceNum <= 0) {
      showToast('⚠️ Please enter a valid price')
      return
    }
    const trvx = (priceNum / TRVX_RATE).toFixed(1)
    showToast(`🧪 Creating demo listing for "${itemName}" at HK$${priceNum} (${trvx} TRVX)…`)

    // ── TODO: Real Thirdweb NFT mint + listing call ───────
    // const sdk         = new ThirdwebSDK("polygon")
    // const nftContract = await sdk.getContract("NFT_ADDRESS", "nft-collection")
    // await nftContract.mintTo(userAddress, { name: itemName, price: priceNum })
    // ────────────────────────────────────────────────────

    setTimeout(() => showToast('✅ Demo listing created! Item is now visible on Trovex'), 2200)
  }

  return (
    <div className="list-section">
      <h3>📦 List Your Item</h3>
      <p className="list-sub">Describe your item · AI estimates price · Generate a demo NFT-style listing</p>

      {/* Item name */}
      <div className="form-group">
        <label className="form-label">Item Name</label>
        <input
          className="form-input"
          type="text"
          placeholder="e.g. iPhone 14 Pro 256GB Space Black"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>

      {/* Category pills */}
      <div className="form-group">
        <label className="form-label">Category</label>
        <div className="pill-selector">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={'pill-option' + (category === cat ? ' active' : '')}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Condition pills */}
      <div className="form-group">
        <label className="form-label">Condition</label>
        <div className="pill-selector">
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              className={'pill-option' + (condition === cond ? ' active' : '')}
              onClick={() => setCondition(cond)}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Price + TRVX conversion */}
      <div className="form-group">
        <label className="form-label">Your Asking Price (eHKD)</label>
        <div className="price-input-row">
          <input
            className="form-input"
            type="number"
            placeholder="e.g. 3200"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <div className="trvx-equiv">
            {trvxEquiv ? `≈ ${trvxEquiv} TRVX` : '≈ — TRVX'}
          </div>
        </div>

        {/* AI price suggestion — only shown when a price is entered */}
        {aiSuggested && (
          <div className="ai-suggestion">
            🤖 AI suggests: HK${aiSuggested.toLocaleString()} based on recent demo marketplace data
          </div>
        )}
      </div>

      <div className="fee-note">
        💡 Example fee model for demo only: 1.5% platform fee · 1.5% dispute reserve ·
        97% seller payout in the simulated settlement flow.
      </div>

      <button className="action-btn" onClick={handleList}>
        Create Demo Listing →
      </button>
    </div>
  )
}

export default ListItemPanel

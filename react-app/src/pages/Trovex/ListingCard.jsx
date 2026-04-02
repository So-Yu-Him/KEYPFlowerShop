// filepath: src/pages/Trovex/ListingCard.jsx
/**
 * ListingCard — upgraded product card for Trovex marketplace
 *
 * New in this version:
 *   - Rarity ribbon in top-right corner
 *   - Star rating display
 *   - "View" button routes to detail page instead of toast
 *   - Hover glow effect via CSS
 *
 * Props:
 *   item   {object}   - listing data object
 *   onView {function} - called when user clicks the card / view button
 */

const RARITY_RIBBON_CLASS = {
  Common:    'common',
  Uncommon:  'uncommon',
  Rare:      'rare',
  Legendary: 'legendary',
}

function Stars({ rating }) {
  const full = Math.floor(parseFloat(rating))
  return (
    <span style={{ color: 'var(--amber)', fontSize: '0.72rem' }}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}{' '}
      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{rating}</span>
    </span>
  )
}

function ListingCard({ item, onView }) {
  return (
    <div className="listing-card" onClick={onView} style={{ cursor: 'pointer' }}>
      {/* ── Item image / emoji ── */}
      <div className={`listing-img-wrap ${item.imgClass}`}>
        <span style={{ position: 'relative', zIndex: 1 }}>{item.emoji}</span>

        {/* Rarity ribbon */}
        <div className={`rarity-ribbon ${RARITY_RIBBON_CLASS[item.rarity] || 'common'}`}>
          {item.rarity}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="listing-body">
        <div className="listing-top-row">
          <span className={`condition-tag ${item.condClass}`}>{item.condition}</span>
          <span className="nft-tag">{item.nft}</span>
        </div>

        <div className="listing-title">{item.title}</div>

        <div className="listing-price">
          {item.price}
          <span> · {item.trvx}</span>
        </div>

        <div className="listing-original">{item.retail}</div>

        {/* Seller + rating row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.65rem',
        }}>
          <span className="listing-seller">👤 {item.seller}</span>
          <Stars rating={item.rating} />
        </div>

        {/* Category badge */}
        <div className="listing-meta">
          <span className="meta-badge meta-green">✓ Verified</span>
          <span className="meta-badge meta-orange">{item.category}</span>
        </div>

        {/* View Details button */}
        <button className="buy-now-btn" onClick={(e) => { e.stopPropagation(); onView() }}>
          View Details →
        </button>
      </div>
    </div>
  )
}

export default ListingCard

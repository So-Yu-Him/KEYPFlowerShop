// filepath: src/components/BrandLogo.jsx
/**
 * BrandLogo — SVG logo for FloreX
 *
 * Design elements:
 *   - 6 flower petals radiating from center (flower motif)
 *   - Hexagonal outer frame (blockchain / Web3 motif)
 *   - Small dots at each hexagon vertex (blockchain nodes)
 *   - Glowing center circle (DeFi hub)
 *   - Gradient: rose-red → orange → indigo (three sub-brand colors)
 *
 * Props:
 *   size {number} — width & height in px (default 40)
 */
function BrandLogo({ size = 40 }) {
  // Petal: a symmetric teardrop from center (20,20) pointing toward y=5 (12 o'clock)
  // Rotated by 60° increments to form 6 petals
  const PETAL_D = 'M 20 20 C 15 15 15 8 20 5 C 25 8 25 15 20 20 Z'
  const ROTATIONS = [0, 60, 120, 180, 240, 300]

  // Hexagon vertices at radius ≈15 from center (20,20)
  const NODES = [
    [20, 5],
    [33, 12.5],
    [33, 27.5],
    [20, 35],
    [7, 27.5],
    [7, 12.5],
  ]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FloreX logo"
    >
      <defs>
        {/* Gradient spans the full viewBox from top-left (rose) to bottom-right (indigo) */}
        <linearGradient id="flx-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#f43f5e" />
          <stop offset="50%"  stopColor="#f97316" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>

        {/* Soft glow filter applied to center circle */}
        <filter id="flx-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Hexagonal outer ring ── */}
      <polygon
        points="20,5 33,12.5 33,27.5 20,35 7,27.5 7,12.5"
        stroke="url(#flx-grad)"
        strokeWidth="0.75"
        fill="none"
        opacity="0.35"
      />

      {/* ── 6 Flower petals ── */}
      {ROTATIONS.map((r) => (
        <path
          key={r}
          d={PETAL_D}
          fill="url(#flx-grad)"
          opacity="0.78"
          transform={`rotate(${r} 20 20)`}
        />
      ))}

      {/* ── Glowing center node ── */}
      <circle
        cx="20"
        cy="20"
        r="3.5"
        fill="url(#flx-grad)"
        filter="url(#flx-glow)"
      />

      {/* ── Blockchain vertex dots ── */}
      {NODES.map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="1.2"
          fill="url(#flx-grad)"
          opacity="0.6"
        />
      ))}
    </svg>
  )
}

export default BrandLogo

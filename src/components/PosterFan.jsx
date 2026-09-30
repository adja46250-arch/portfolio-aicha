import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const FAN_PRESETS = [
  { rotate: -8, x: -36, y: -24, scale: 1.1 },
  { rotate: 5, x: -12, y: -30, scale: 0.9 },
  { rotate: -4, x: 14, y: -22, scale: 1.2 },
  { rotate: 9, x: 38, y: -28, scale: 0.95 },
  { rotate: 7, x: -34, y: 26, scale: 1.0 },
  { rotate: -10, x: -8, y: 30, scale: 1.15 },
  { rotate: 4, x: 18, y: 28, scale: 0.9 },
  { rotate: -7, x: 40, y: 24, scale: 1.1 },
  // Petits cadres au milieu, de chaque côté du bouton
  { rotate: -6, x: -38, y: -2, scale: 0.55 },
  { rotate: 5, x: -21, y: 5, scale: 0.6 },
  { rotate: -4, x: 21, y: -5, scale: 0.6 },
  { rotate: 7, x: 38, y: 2, scale: 0.55 },
  // Deux très petits cadres entre les précédents
  { rotate: 8, x: -30, y: -11, scale: 0.38 },
  { rotate: -9, x: 30, y: 11, scale: 0.38 },
  // Encore quelques très petits cadres, tout près du bouton
  { rotate: 6, x: -6, y: -3, scale: 0.35 },
  { rotate: -8, x: 5, y: 4, scale: 0.4 },
  { rotate: 10, x: -3, y: 5, scale: 0.36 },
]

// linkTo peut être une route interne ("/projets") ou une ancre ("#galerie-mosaique").
// Une ancre est rendue en <a>, une route en <Link> (React Router).
export default function PosterFan({ items, linkTo = '/projets', linkLabel = 'Ouvrir la galerie' }) {
  const ref = useRef(null)
  const [ratios, setRatios] = useState({})

  function handleImageLoad(id, e) {
    const { naturalWidth, naturalHeight } = e.target
    if (naturalWidth && naturalHeight) {
      setRatios((r) => ({ ...r, [id]: naturalWidth / naturalHeight }))
    }
  }

  function handleMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const py = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    el.style.setProperty('--px', px.toFixed(2))
    el.style.setProperty('--py', py.toFixed(2))
  }

  function handleLeave() {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--px', 0)
    el.style.setProperty('--py', 0)
  }

  if (!items.length) return null

  const isAnchor = linkTo.startsWith('#')

  return (
    <div className="poster-fan" ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {items.slice(0, 17).map((item, i) => {
        const preset = FAN_PRESETS[i % FAN_PRESETS.length]
        return (
          <div
            key={item.id}
            className="poster-fan-item"
            style={{
              '--rot': `${preset.rotate}deg`,
              '--scale': preset.scale,
              '--depth': 1 + i * 0.35,
              left: `${50 + preset.x}%`,
              top: `${50 + preset.y}%`,
              zIndex: i,
              aspectRatio: ratios[item.id] ? String(ratios[item.id]) : undefined,
            }}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                onLoad={(e) => handleImageLoad(item.id, e)}
              />
            ) : (
              <span className="hero-photo-placeholder">Affiche à venir</span>
            )}
          </div>
        )
      })}
      {isAnchor ? (
        <a href={linkTo} className="poster-fan-btn">
          {linkLabel}
        </a>
      ) : (
        <Link to={linkTo} className="poster-fan-btn">
          {linkLabel}
        </Link>
      )}
    </div>
  )
}

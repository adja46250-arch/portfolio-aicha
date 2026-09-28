import { useRef } from 'react'
import { Link } from 'react-router-dom'

const FAN_PRESETS = [
  { rotate: -11, x: -110, y: 8 },
  { rotate: -4, x: -45, y: -22 },
  { rotate: 5, x: 35, y: 18 },
  { rotate: 12, x: 105, y: -10 },
  { rotate: -16, x: -10, y: 34 },
]

// linkTo peut être une route interne ("/projets") ou une ancre ("#galerie-mosaique").
// Une ancre est rendue en <a>, une route en <Link> (React Router).
export default function PosterFan({ items, linkTo = '/projets', linkLabel = 'Ouvrir la galerie' }) {
  const ref = useRef(null)

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
      {items.slice(0, 5).map((item, i) => {
        const preset = FAN_PRESETS[i % FAN_PRESETS.length]
        return (
          <div
            key={item.id}
            className="poster-fan-item"
            style={{
              '--rot': `${preset.rotate}deg`,
              '--depth': 1 + i * 0.35,
              left: `calc(50% + ${preset.x}px)`,
              top: `calc(50% + ${preset.y}px)`,
              zIndex: i,
            }}
          >
            {item.image ? (
              <img src={item.image} alt={item.title} />
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

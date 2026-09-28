import { useRef, useState } from 'react'

// Affiche les captures d'écran d'un projet. Si plusieurs images sont
// renseignées, elles défilent en fondu enchaîné tant que le curseur reste
// sur la carte. Le cadre adopte le format réel de la première image (mesuré
// au chargement), donc plus de bande vide en haut/bas : la hauteur colle à
// l'image au lieu d'un ratio fixe.
export default function ProjectShots({ images, fallback, alt, emptyLabel = 'Capture à venir' }) {
  const list = images && images.length > 0 ? images : fallback ? [fallback] : []
  const [active, setActive] = useState(0)
  const [ratio, setRatio] = useState(null)
  const intervalRef = useRef(null)

  function handleMouseEnter() {
    if (list.length > 1) {
      intervalRef.current = setInterval(() => {
        setActive((i) => (i + 1) % list.length)
      }, 1700)
    }
  }

  function handleMouseLeave() {
    clearInterval(intervalRef.current)
    setActive(0)
  }

  function handleFirstImageLoad(e) {
    const { naturalWidth, naturalHeight } = e.target
    if (naturalWidth && naturalHeight) {
      setRatio(naturalWidth / naturalHeight)
    }
  }

  if (list.length === 0) {
    return (
      <div className="project-mock-screen">
        <span className="hero-photo-placeholder">{emptyLabel}</span>
      </div>
    )
  }

  return (
    <div
      className="project-mock-screen"
      style={ratio ? { aspectRatio: String(ratio) } : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {list.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={alt}
          className={i === active ? 'is-active' : ''}
          onLoad={i === 0 ? handleFirstImageLoad : undefined}
        />
      ))}
      {list.length > 1 && (
        <div className="project-mock-dots">
          {list.map((_, i) => (
            <span key={i} className={i === active ? 'is-active' : ''} />
          ))}
        </div>
      )}
    </div>
  )
}

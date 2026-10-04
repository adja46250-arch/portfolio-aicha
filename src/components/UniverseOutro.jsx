import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'

// Conclusion de « Mon univers » : une constellation dont chaque étoile est un hobby.
// Cliquer une étoile fait remonter jusqu'à la section correspondante.
// (x, y) : position sur grand écran, (mx, my) : position sur téléphone, en % de la zone.
const STARS = [
  { name: 'Mangas', target: '.manga-section', x: 7, y: 66, mx: 22, my: 6 },
  { name: 'Dessin', target: '.sketch-section', x: 23, y: 26, mx: 72, my: 22 },
  { name: 'Lecture', target: '.reading-section', x: 40, y: 64, mx: 28, my: 40 },
  { name: 'Henné', target: '.ink-section', x: 57, y: 24, mx: 74, my: 58 },
  { name: 'Crochet', target: '.cr-section', x: 75, y: 64, mx: 30, my: 76 },
  { name: 'Voyage', target: '.travel-section', x: 92, y: 28, mx: 72, my: 94 },
]

const line = (key) => STARS.map((s) => `${s[key[0]]},${s[key[1]]}`).join(' ')

export default function UniverseOutro() {
  const ref = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setOn(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const go = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Reveal as="section" className="outro-section">
      <div className="wrap outro">
        <p className="eyebrow">Pour finir</p>
        <h2 className="anton">
          Six passions, <span className="gold">une seule curiosité.</span>
        </h2>

        <div className={`outro-sky${on ? ' is-on' : ''}`} ref={ref}>
          <svg className="outro-lines outro-lines-d" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={line(['x', 'y'])} />
          </svg>
          <svg className="outro-lines outro-lines-m" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={line(['mx', 'my'])} />
          </svg>

          {STARS.map((s, i) => (
            <button
              key={s.name}
              type="button"
              className={`outro-star${s.y < 40 ? ' is-top' : ''}`}
              style={{ '--x': `${s.x}%`, '--y': `${s.y}%`, '--mx': `${s.mx}%`, '--my': `${s.my}%`, '--i': i }}
              onClick={() => go(s.target)}
              aria-label={`Revoir la section ${s.name}`}
            >
              <span className="outro-dot" aria-hidden="true" />
              <span className="outro-name">{s.name}</span>
            </button>
          ))}
        </div>

        <p className="outro-text">
          Ce que je fais loin de l'écran nourrit ce que je construis dessus : le regard, la patience, le goût du détail.
        </p>

        <p className="outro-more">
          <span className="outro-more-spark" aria-hidden="true">✦</span>
          Je maquille aussi, je fais de la décoration, et bien d'autres choses encore…
          <span className="outro-more-sub">Mais je vous laisse le plaisir de me découvrir plus tard.</span>
        </p>

        <div className="outro-actions">
          <Link to="/projets" className="outro-btn outro-btn-main">
            Voir mes projets
          </Link>
          <Link to="/contact" className="outro-btn">
            Me contacter
          </Link>
        </div>

        <Link to="/parcours" className="outro-back eyebrow">
          ← Retour au parcours
        </Link>
      </div>
    </Reveal>
  )
}

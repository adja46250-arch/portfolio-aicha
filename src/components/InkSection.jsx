import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import { DESIGNS, REALISATIONS } from '../data/ink'

// Petits motifs dessinés en traits fins (remplacés par tes images dès que DESIGNS n'est plus vide)
const MOTIFS = [
  {
    name: 'Lune',
    svg: (
      <>
        <path pathLength="1" d="M70 20 C38 26 22 58 34 88 C46 118 88 126 112 104 C84 108 58 86 62 56 C64 40 70 28 70 20 Z" />
        <path pathLength="1" d="M104 36 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" />
        <path pathLength="1" d="M118 78 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" />
        <circle pathLength="1" cx="40" cy="28" r="2" />
        <circle pathLength="1" cx="122" cy="116" r="2" />
      </>
    ),
  },
  {
    name: 'Soleil',
    svg: (
      <>
        <circle pathLength="1" cx="75" cy="75" r="22" />
        <circle pathLength="1" cx="75" cy="75" r="30" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6
          const r1 = 38
          const r2 = i % 2 ? 50 : 58
          return (
            <path
              key={i}
              pathLength="1"
              d={`M${75 + Math.cos(a) * r1} ${75 + Math.sin(a) * r1} L${75 + Math.cos(a) * r2} ${75 + Math.sin(a) * r2}`}
            />
          )
        })}
      </>
    ),
  },
  {
    name: 'Branche',
    svg: (
      <>
        <path pathLength="1" d="M75 130 C72 100 78 70 74 30" />
        <path pathLength="1" d="M74 108 C58 104 48 92 46 80 C60 82 70 92 74 108 Z" />
        <path pathLength="1" d="M75 92 C92 88 102 76 104 64 C90 66 80 76 75 92 Z" />
        <path pathLength="1" d="M74 70 C58 66 50 56 48 44 C62 46 70 56 74 70 Z" />
        <path pathLength="1" d="M74 52 C88 48 96 38 98 28 C86 30 78 40 74 52 Z" />
        <circle pathLength="1" cx="74" cy="26" r="3" />
      </>
    ),
  },
  {
    name: 'Étoile',
    svg: (
      <>
        <path pathLength="1" d="M75 18 L86 64 L132 75 L86 86 L75 132 L64 86 L18 75 L64 64 Z" />
        <path pathLength="1" d="M75 46 L80 70 L104 75 L80 80 L75 104 L70 80 L46 75 L70 70 Z" />
        <circle pathLength="1" cx="75" cy="75" r="4" />
        <circle pathLength="1" cx="75" cy="75" r="60" strokeDasharray="1 4" />
      </>
    ),
  },
]

function BeforeAfter({ before, after, title }) {
  const [pos, setPos] = useState(50)
  return (
    <figure className="ink-ba">
      <div className="ink-ba-stage" style={{ '--pos': `${pos}%` }}>
        <img src={after} alt={title ? `${title} — après` : 'Après'} />
        <img className="ink-ba-before" src={before} alt={title ? `${title} — avant` : 'Avant'} />
        <span className="ink-ba-bar" aria-hidden="true" />
        <input
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Comparer avant et après"
        />
        <small className="ink-ba-tag ink-ba-tag-l">Avant</small>
        <small className="ink-ba-tag ink-ba-tag-r">Après</small>
      </div>
      {title && <figcaption>{title}</figcaption>}
    </figure>
  )
}

export default function InkSection() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  // Les traits se dessinent quand la section arrive à l'écran
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Reveal as="section" className="ink-section">
      <div className="wrap ink-head">
        <p className="eyebrow">Hobby n°5</p>
        <h2 className="anton">Ink</h2>
      </div>

      <div className="ink-panel" ref={ref}>
        <div className="wrap ink-center">
          <p className="ink-line">L'encre comme autre terrain d'expression.</p>
          <p className="ink-tags">Designs • motifs • pratique</p>
        </div>

        <div className={`wrap ink-flash${inView ? ' is-in' : ''}`}>
          {DESIGNS.length > 0
            ? DESIGNS.map((d, i) => (
                <figure key={i} className="ink-card">
                  <img src={d.image} alt={d.title || 'Design'} loading="lazy" />
                  {d.title && <figcaption>{d.title}</figcaption>}
                </figure>
              ))
            : MOTIFS.map((m, i) => (
                <figure key={m.name} className="ink-card" style={{ '--d': `${i * 0.25}s` }}>
                  <svg viewBox="0 0 150 150" aria-hidden="true">
                    {m.svg}
                  </svg>
                  <figcaption>
                    <small>Flash {String(i + 1).padStart(2, '0')}</small>
                    {m.name}
                  </figcaption>
                </figure>
              ))}
        </div>

        {REALISATIONS.length > 0 && (
          <div className="wrap ink-real">
            <span className="ink-real-title">Mes réalisations</span>
            <div className="ink-real-grid">
              {REALISATIONS.map((r, i) =>
                r.before ? (
                  <BeforeAfter key={i} before={r.before} after={r.image} title={r.title} />
                ) : (
                  <figure key={i} className="ink-card ink-card-photo">
                    <img src={r.image} alt={r.title || 'Réalisation'} loading="lazy" />
                    {r.title && <figcaption>{r.title}</figcaption>}
                  </figure>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </Reveal>
  )
}

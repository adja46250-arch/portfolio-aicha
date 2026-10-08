import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import { CARDS } from '../data/henne'

// Motifs de henné dessinés en traits fins (remplacés par tes photos dès que DESIGNS n'est plus vide)
const petals = (n, r1, r2, cx = 75, cy = 75) =>
  Array.from({ length: n }).map((_, i) => {
    const a = (i * 2 * Math.PI) / n
    const b = a + Math.PI / n
    const c = a - Math.PI / n
    const p = (ang, r) => `${(cx + Math.cos(ang) * r).toFixed(1)} ${(cy + Math.sin(ang) * r).toFixed(1)}`
    return <path key={i} pathLength="1" d={`M${p(a, r1)} Q${p(b, (r1 + r2) / 1.5)} ${p(a, r2)} Q${p(c, (r1 + r2) / 1.5)} ${p(a, r1)} Z`} />
  })

const MOTIFS = [
  {
    key: 'fleur',
    name: 'Fleur de la paume',
    svg: (
      <>
        <circle pathLength="1" cx="75" cy="75" r="9" />
        {petals(8, 12, 34)}
        <circle pathLength="1" cx="75" cy="75" r="42" strokeDasharray="1 4" />
        {petals(16, 46, 60)}
      </>
    ),
  },
  {
    key: 'losanges',
    name: 'Losanges',
    svg: (
      <>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path pathLength="1" d={`M75 ${14 + i * 44} L100 ${36 + i * 44} L75 ${58 + i * 44} L50 ${36 + i * 44} Z`} />
            <path pathLength="1" d={`M75 ${24 + i * 44} L90 ${36 + i * 44} L75 ${48 + i * 44} L60 ${36 + i * 44} Z`} />
            <circle pathLength="1" cx="75" cy={36 + i * 44} r="2" />
          </g>
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} pathLength="1" cx={i % 2 ? 24 : 126} cy={30 + i * 20} r="2" />
        ))}
      </>
    ),
  },
  {
    key: 'feuillage',
    name: 'Feuillage',
    svg: (
      <>
        <path pathLength="1" d="M40 136 C60 110 40 84 66 60 C84 44 70 28 82 12" />
        <path pathLength="1" d="M52 112 C38 108 30 98 30 88 C44 88 52 98 52 112 Z" />
        <path pathLength="1" d="M52 100 C68 98 78 90 80 78 C66 78 56 86 52 100 Z" />
        <path pathLength="1" d="M62 70 C48 66 42 56 44 46 C56 48 62 58 62 70 Z" />
        <path pathLength="1" d="M72 54 C88 52 98 44 100 32 C86 32 76 40 72 54 Z" />
        <circle pathLength="1" cx="84" cy="10" r="3" />
        <circle pathLength="1" cx="110" cy="100" r="2" />
        <circle pathLength="1" cx="118" cy="116" r="2" />
        <circle pathLength="1" cx="102" cy="120" r="2" />
      </>
    ),
  },
  {
    key: 'bracelet',
    name: 'Bracelet',
    svg: (
      <>
        {[34, 52, 70, 88, 106].map((y) => (
          <path key={y} pathLength="1" d={`M18 ${y} Q75 ${y + 12} 132 ${y}`} />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <circle key={i} pathLength="1" cx={24 + i * 12.5} cy={61 + Math.sin((i / 8) * Math.PI) * 6} r="2" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <circle key={`b${i}`} pathLength="1" cx={24 + i * 12.5} cy={97 + Math.sin((i / 8) * Math.PI) * 6} r="2" />
        ))}
      </>
    ),
  },
]

// Les motifs se dessinent, restent affichés un moment, s'effacent doucement puis se redessinent.
const DRAW_MS = 3500 // le temps que tous les traits se dessinent
const HOLD_MS = 2000 // la pause, motifs entièrement dessinés (1 à 3 s)
const FADE_MS = 700 // l'effacement avant de recommencer

export default function HenneSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | draw | fade | reset

  // CARDS (data/henne.js) : mélange de motifs dessinés et de tes photos, dans l'ordre choisi.
  // Une carte photo sans image est ignorée (rien ne s'affiche tant que tu n'as pas la photo).
  let motifCount = 0
  const cards = CARDS.map((c) => {
    if (c.motif) {
      const motif = MOTIFS.find((m) => m.key === c.motif)
      if (!motif) return null
      motifCount += 1
      return { motif, n: motifCount }
    }
    return c.image ? { image: c.image, title: c.title } : null
  }).filter(Boolean)

  // La section ne joue que lorsqu'elle est à l'écran
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Boucle : dessin → pause → effacement → nouveau dessin
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setPhase('draw')
      return
    }
    if (!visible) {
      setPhase('idle')
      return
    }
    let timer
    const go = (next) => {
      setPhase(next)
      if (next === 'draw') timer = setTimeout(() => go('fade'), DRAW_MS + HOLD_MS)
      else if (next === 'fade') timer = setTimeout(() => go('reset'), FADE_MS)
      else timer = setTimeout(() => go('draw'), 120)
    }
    go('draw')
    return () => clearTimeout(timer)
  }, [visible])

  const inView = phase === 'draw' || phase === 'fade'

  return (
    <Reveal as="section" className="ink-section">
      <div className="wrap ink-head">
        <p className="eyebrow">Hobby n°4</p>
        <h2 className="anton">Henné</h2>
      </div>

      <div className="ink-panel henne" ref={ref}>
        <div className="wrap ink-center">
          <p className="ink-line">Un art de femmes, d'une main à l'autre.</p>
          <p className="ink-tags">Motifs • fêtes • tradition</p>
        </div>

        <div className={`wrap ink-flash${inView ? ' is-in' : ''}${phase === 'fade' ? ' is-fade' : ''}`}>
          {cards.map((c, i) =>
            c.motif ? (
              <figure key={`m-${c.motif.key}`} className="ink-card" style={{ '--d': `${i * 0.25}s` }}>
                <svg viewBox="0 0 150 150" aria-hidden="true">
                  {c.motif.svg}
                </svg>
                <figcaption>
                  <small>Motif {String(c.n).padStart(2, '0')}</small>
                  {c.motif.name}
                </figcaption>
              </figure>
            ) : (
              <figure key={`p-${i}`} className="ink-card ink-card-photo">
                <img src={c.image} alt={c.title || 'Ma réalisation au henné'} loading="lazy" />
                <figcaption>
                  <small>Ma réalisation</small>
                  {c.title || 'Henné'}
                </figcaption>
              </figure>
            )
          )}
        </div>
      </div>
    </Reveal>
  )
}

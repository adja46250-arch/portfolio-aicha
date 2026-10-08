import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Reveal from './Reveal'
import { OUVRAGES } from '../data/crochet'

// Positions des mailles de la chaînette (elles apparaissent une à une)
const STITCHES = Array.from({ length: 8 }, (_, i) => ({ x: 292 + i * 26, y: 236 + Math.sin(i * 0.9) * 5 }))


// Ouvrages : défilent d'un à l'autre avec les flèches (comme les affiches de l'accueil)
function OuvrageFlow({ items }) {
  const [index, setIndex] = useState(0)
  const [w, setW] = useState(520)
  const box = useRef(null)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const update = () => setW(el.clientWidth || 520)
    update()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null
    ro?.observe(el)
    return () => ro?.disconnect()
  }, [])

  if (!items.length) return null
  const itemW = Math.min(300, w * 0.5)
  const step = itemW * 0.62

  function go(n) {
    setIndex((i) => (i + n + items.length) % items.length)
  }

  return (
    <div className="cr-flow" ref={box}>
      <div className="cr-flow-track" style={{ height: itemW * 1.38 }}>
        {items.map((o, i) => {
          let offset = i - index
          if (offset > items.length / 2) offset -= items.length
          if (offset < -items.length / 2) offset += items.length
          if (Math.abs(offset) > 2) return null
          const active = offset === 0
          return (
            <motion.figure
              key={i}
              className={`cr-flow-item${active ? ' is-active' : ''}`}
              style={{ width: itemW }}
              animate={{
                x: offset * step,
                scale: active ? 1 : 0.84 - (Math.abs(offset) - 1) * 0.06,
                opacity: 1 - Math.abs(offset) * 0.28,
                zIndex: 10 - Math.abs(offset),
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => !active && setIndex(i)}
            >
              {o.image ? (
                <img src={o.image} alt={o.title || 'Ouvrage au crochet'} />
              ) : (
                <span className="cr-flow-empty" aria-hidden="true">
                  <small>{o.title || `Ouvrage ${String(i + 1).padStart(2, '0')}`}</small>
                </span>
              )}
              {o.image && o.title && active && <figcaption>{o.title}</figcaption>}
            </motion.figure>
          )
        })}
      </div>

      <div className="cr-flow-nav">
        <button type="button" className="book-nav" onClick={() => go(-1)} aria-label="Ouvrage précédent" disabled={items.length < 2}>
          ‹
        </button>
        <span className="cr-flow-count">
          {index + 1} / {items.length}
        </span>
        <button type="button" className="book-nav" onClick={() => go(1)} aria-label="Ouvrage suivant" disabled={items.length < 2}>
          ›
        </button>
      </div>
    </div>
  )
}

export default function CrochetCorner() {
  const [hover, setHover] = useState(false)
  const [tap, setTap] = useState(false)
  const [auto, setAuto] = useState(false)
  const [inView, setInView] = useState(false)
  const scene = useRef(null)
  const active = hover || tap || auto

  // L'animation se joue seule : 5 s de crochet, 2 s de pause, en boucle (tant que la scène est visible)
  useEffect(() => {
    const el = scene.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!inView || reduce) {
      setAuto(false)
      return
    }
    let timer
    const run = (on) => {
      setAuto(on)
      timer = setTimeout(() => run(!on), on ? 5000 : 2000)
    }
    run(true)
    return () => clearTimeout(timer)
  }, [inView])

  return (
    <Reveal as="section" className="cr-section">
      <div className="wrap cr-head">
        <p className="eyebrow">Hobby n°5</p>
        <h2 className="anton">Crochet</h2>
        <p className="cr-tags">Fil • patience • création</p>
      </div>

      <div className="wrap cr-layout">
        <OuvrageFlow items={OUVRAGES} />

        <button
          type="button"
          ref={scene}
          className={`cr-scene${active ? ' is-active' : ''}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          onClick={() => setTap((t) => !t)}
          aria-pressed={tap}
        >
          <svg viewBox="0 0 520 300" aria-hidden="true">
            <defs>
              <radialGradient id="cr-ball" cx="35%" cy="30%" r="80%">
                <stop offset="0" stopColor="#f6b8a4" />
                <stop offset=".55" stopColor="#d97a6c" />
                <stop offset="1" stopColor="#8a3a3f" />
              </radialGradient>
              <linearGradient id="cr-hook" x1="0" x2="1">
                <stop offset="0" stopColor="#a8823a" />
                <stop offset=".5" stopColor="#f6dd9b" />
                <stop offset="1" stopColor="#e9c46a" />
              </linearGradient>
              <clipPath id="cr-clip">
                <circle cx="130" cy="170" r="72" />
              </clipPath>
            </defs>

            {/* Pelote */}
            <g className="cr-ball">
              <circle cx="130" cy="170" r="72" fill="url(#cr-ball)" />
              <g clipPath="url(#cr-clip)" fill="none" stroke="#7a2f3c" strokeOpacity=".55" strokeWidth="2.2" strokeLinecap="round">
                <path d="M62 150 C100 118 160 120 200 152" />
                <path d="M58 172 C100 140 165 142 204 176" />
                <path d="M64 196 C104 164 160 168 198 198" />
                <path d="M80 120 C118 150 150 196 140 240" />
                <path d="M110 108 C146 140 176 190 164 236" />
                <path d="M150 104 C176 130 196 170 188 214" />
              </g>
              <ellipse cx="108" cy="136" rx="22" ry="12" fill="#fff" opacity=".18" transform="rotate(-28 108 136)" />
            </g>

            {/* Fil qui part de la pelote jusqu'au crochet */}
            <g className="cr-thread">
              <path d="M196 182 C236 232 262 118 322 148" fill="none" stroke="#f2a58e" strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* Crochet */}
            <g className="cr-hook">
              <path d="M326 148 L462 70" stroke="url(#cr-hook)" strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d="M326 148 q-12 6 -10 -8 q3 -8 12 -5" stroke="url(#cr-hook)" strokeWidth="6" strokeLinecap="round" fill="none" />
              <rect x="410" y="62" width="64" height="16" rx="8" fill="#7a2f3c" transform="rotate(-30 442 70)" />
            </g>

            {/* Mailles qui se forment */}
            <g className="cr-stitches" fill="none" stroke="#f2a58e" strokeWidth="3.2" strokeLinecap="round">
              {STITCHES.map((s, i) => (
                <ellipse key={i} cx={s.x} cy={s.y} rx="17" ry="9" style={{ '--i': i }} />
              ))}
            </g>

            {/* Petit ouvrage qui se dévoile */}
            <g className="cr-swatch">
              <rect x="338" y="256" width="150" height="34" rx="6" fill="#d97a6c" />
              <g stroke="#7a2f3c" strokeOpacity=".5" strokeWidth="2" fill="none" strokeLinecap="round">
                {Array.from({ length: 10 }).map((_, i) => (
                  <path key={i} d={`M${346 + i * 14.5} 262 l6 11 l-6 11`} />
                ))}
              </g>
            </g>
          </svg>

          <span className="cr-hint">
            <span className="cr-hint-rest">Un fil, un crochet…</span>
            <span className="cr-hint-active">Créer, maille après maille.</span>
          </span>
        </button>

      </div>

      <div className="wrap">
        <p className="cr-quote">
          J'aime le crochet pour son côté minutieux et créatif. Une activité qui demande patience et
          précision, mais qui permet de transformer simplement un fil en quelque chose de concret.
        </p>
      </div>
    </Reveal>
  )
}

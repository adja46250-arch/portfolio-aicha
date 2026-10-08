import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'

// Conclusion de « Mon univers » : un fil (comme celui du crochet) qui passe par chaque passion
// et dit ce qu'elle m'apporte. Le fil se tisse au fil du défilement ; cliquer une étape
// remonte à la section correspondante. Au bout du fil : ce que je construis ici.
const STEPS = [
  { name: 'Mangas', gift: "L'imagination et le sens du récit", target: '.manga-section' },
  { name: 'Dessin', gift: 'Le regard et le goût du détail', target: '.sketch-section' },
  { name: 'Lecture', gift: 'La concentration et la curiosité', target: '.reading-section' },
  { name: 'Henné', gift: 'La précision et la main sûre', target: '.ink-section' },
  { name: 'Crochet', gift: 'La patience, maille après maille', target: '.cr-section' },
  { name: 'Voyage', gift: "L'ouverture aux autres", target: '.travel-section' },
]

const AND_MORE = ['Maquillage pour événements', 'Décoration']

export default function UniverseOutro() {
  const box = useRef(null)
  const dots = useRef([])
  const [geo, setGeo] = useState({ w: 0, h: 0, d: '', pos: [] })
  const [progress, setProgress] = useState(0)

  // Mesure la position de chaque nœud et construit le fil qui les relie (courbes en S)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const build = () => {
      const b = el.getBoundingClientRect()
      const pts = dots.current
        .filter(Boolean)
        .map((d) => {
          const r = d.getBoundingClientRect()
          return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 }
        })
      if (pts.length < 2) return
      const first = { x: pts[0].x, y: 0 }
      let d = `M ${first.x} ${first.y} L ${pts[0].x} ${pts[0].y}`
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i - 1]
        const q = pts[i]
        const ym = (p.y + q.y) / 2
        const s = (i % 2 ? 1 : -1) * 26
        d += ` C ${p.x + s} ${ym}, ${q.x - s} ${ym}, ${q.x} ${q.y}`
      }
      setGeo({ w: b.width, h: b.height, d, pos: pts.map((p) => p.y / b.height) })
    }
    build()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(build) : null
    ro?.observe(el)
    window.addEventListener('resize', build)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', build)
    }
  }, [])

  // Le fil se dessine en suivant le défilement
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setProgress(1)
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const el = box.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const line = window.innerHeight * 0.62
      const p = (line - r.top) / r.height
      setProgress(Math.max(0, Math.min(1, p)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const go = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const lit = (i) => geo.pos[i] !== undefined && progress >= geo.pos[i] - 0.01

  return (
    <Reveal as="section" className="outro-section">
      <div className="wrap outro">
        <p className="eyebrow">Pour finir</p>
        <h2 className="anton">
          Un seul fil <span className="gold">qui relie tout.</span>
        </h2>
        <p className="outro-lead">
          Chaque passion m'apprend quelque chose que je retrouve ensuite dans mon travail.
        </p>

        <div className="thread" ref={box}>
          {geo.d && (
            <svg className="thread-svg" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
              <path d={geo.d} className="thread-base" />
              <path d={geo.d} className="thread-line" pathLength="1" style={{ strokeDashoffset: 1 - progress }} />
            </svg>
          )}

          {STEPS.map((s, i) => (
            <div key={s.name} className={`thread-step ${i % 2 ? 'is-right' : 'is-left'}${lit(i) ? ' is-lit' : ''}`}>
              <span className="thread-dot" ref={(n) => (dots.current[i] = n)} aria-hidden="true" />
              <button type="button" className="thread-card" onClick={() => go(s.target)} aria-label={`Revoir la section ${s.name}`}>
                <span className="thread-num">{String(i + 1).padStart(2, '0')}</span>
                <strong>{s.name}</strong>
                <span>{s.gift}</span>
              </button>
            </div>
          ))}

          <div className={`thread-step thread-end${lit(STEPS.length) ? ' is-lit' : ''}`}>
            <span className="thread-dot thread-dot-end" ref={(n) => (dots.current[STEPS.length] = n)} aria-hidden="true" />
            <p className="thread-end-card">
              Au bout du fil : <em>ce que je construis ici.</em>
            </p>
          </div>
        </div>

        <div className="outro-more">
          <span className="outro-more-lead">Et ce n'est pas tout…</span>
          <p>
            Je maquille aussi pour des événements, je fais de la décoration, et bien d'autres choses encore.
          </p>
          <div className="outro-more-tags">
            {AND_MORE.map((t) => (
              <span key={t}>{t}</span>
            ))}
            <span className="is-more">…et la suite</span>
          </div>
          <span className="outro-more-sub">Je vous laisse le plaisir de me découvrir plus tard.</span>
        </div>

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

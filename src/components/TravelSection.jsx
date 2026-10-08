import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import { TRAVEL } from '../data/travel'

// Une carte postale : photo(s) + tampon du pays.
//  - Plusieurs photos : elles défilent toutes seules (3 s chacune) tant que la carte est visible.
//  - Une note : un clic retourne la carte pour la lire ; elle se retourne seule après 5 s
//    et les photos reprennent. Un petit repère ✎ en bas à droite signale qu'il y a une note.
const PHOTO_MS = 3000
const NOTE_MS = 5000

function Postcard({ place, code, index }) {
  const [flipped, setFlipped] = useState(false)
  const [broken, setBroken] = useState(() => new Set())
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(false)
  const card = useRef(null)

  const all = place.images?.length ? place.images : place.image ? [place.image] : []
  const imgs = all.filter((src) => !broken.has(src))
  const multi = imgs.length > 1
  const hasNote = Boolean(place.note)
  const current = idx % Math.max(imgs.length, 1)

  // La carte ne joue que lorsqu'elle est à l'écran
  useEffect(() => {
    const el = card.current
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Défilement automatique des photos (pause pendant la lecture de la note)
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!multi || !visible || flipped || reduce) return
    const t = setInterval(() => setIdx((i) => i + 1), PHOTO_MS)
    return () => clearInterval(t)
  }, [multi, visible, flipped])

  // La note se referme toute seule
  useEffect(() => {
    if (!flipped) return
    const t = setTimeout(() => setFlipped(false), NOTE_MS)
    return () => clearTimeout(t)
  }, [flipped])

  const front = (
    <div className={`tv-face tv-front${imgs.length ? ' has-img' : ''}`}>
      {imgs.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === current ? place.city : ''}
          className={i === current ? 'is-active' : ''}
          loading="lazy"
          onError={() => setBroken((b) => new Set(b).add(src))}
        />
      ))}
      <span className="tv-stamp" aria-hidden="true">
        <b>{code}</b>
      </span>
      {hasNote && (
        <span className="tv-note-tag" aria-hidden="true" title="Touche pour lire le souvenir">
          <i>✎</i>
        </span>
      )}
      <span className="tv-city">{place.city}</span>
      {multi && (
        <span className="tv-dots" aria-hidden="true">
          {imgs.map((_, i) => (
            <i key={i} className={i === current ? 'on' : ''} />
          ))}
        </span>
      )}
    </div>
  )

  const style = { '--r': index % 2 ? '1.6deg' : '-1.6deg' }

  // Pas de note : carte simple (les photos défilent seules s'il y en a plusieurs)
  if (!hasNote) {
    return (
      <figure className="tv-card" style={style} ref={card}>
        <div className="tv-inner">{front}</div>
      </figure>
    )
  }

  // Une note : un clic retourne la carte
  return (
    <figure className="tv-card" style={style} ref={card}>
      <button
        type="button"
        className={`tv-inner tv-flip${flipped ? ' is-flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`${place.city} : lire le souvenir`}
      >
        {front}
        <div className="tv-face tv-back">
          <span className="tv-back-city">{place.city}</span>
          <p>{place.note}</p>
        </div>
      </button>
    </figure>
  )
}

export default function TravelSection() {
  return (
    <Reveal as="section" className="travel-section">
      <div className="wrap tv-head">
        <p className="eyebrow">Hobby n°6</p>
        <h2 className="anton">Voyage</h2>
        <p>Née en Arabie saoudite, grandie en Côte d'Ivoire : deux pays, et des villes qui m'ont toutes appris quelque chose.</p>
      </div>

      <div className="wrap tv-groups">
        {TRAVEL.map((g) => (
          <div key={g.country} className="tv-group">
            <div className="tv-group-head">
              <h3>{g.country}</h3>
              {g.line && <p>{g.line}</p>}
            </div>
            <div className="tv-grid">
              {g.places.map((p, i) => (
                <Postcard key={p.city} place={p} code={g.code} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  )
}

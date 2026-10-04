import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import { TRAVEL } from '../data/travel'

// Une carte postale : photo(s) + tampon du pays.
//  - Plusieurs photos : elles défilent au survol (ordinateur) ou à chaque clic/toucher (téléphone).
//  - Une phrase "note" : un petit bouton ⓘ retourne la carte pour la lire
//    (s'il n'y a qu'une photo, un clic sur la carte suffit).
function Postcard({ place, code, index }) {
  const [flipped, setFlipped] = useState(false)
  const [broken, setBroken] = useState(() => new Set())
  const [idx, setIdx] = useState(0)
  const timer = useRef(null)

  const all = place.images?.length ? place.images : place.image ? [place.image] : []
  const imgs = all.filter((src) => !broken.has(src))
  const multi = imgs.length > 1
  const hasNote = Boolean(place.note)
  const current = idx % Math.max(imgs.length, 1)

  const stop = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
  }
  useEffect(() => stop, [])

  const onEnter = (e) => {
    if (!multi || e.pointerType !== 'mouse' || timer.current) return
    setIdx((i) => i + 1)
    timer.current = setInterval(() => setIdx((i) => i + 1), 1300)
  }
  const onLeave = (e) => {
    if (e.pointerType !== 'mouse') return
    stop()
    setIdx(0)
  }
  const next = () => setIdx((i) => i + 1)

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
  const pointer = { onPointerEnter: onEnter, onPointerLeave: onLeave }

  // Ni note ni plusieurs photos : carte simple
  if (!hasNote && !multi) {
    return (
      <figure className="tv-card" style={style}>
        <div className="tv-inner">{front}</div>
      </figure>
    )
  }

  // Plusieurs photos : le clic fait défiler ; le bouton ⓘ retourne la carte (s'il y a une note)
  if (multi) {
    return (
      <figure className="tv-card" style={style} {...pointer}>
        <div className={`tv-inner${flipped ? ' is-flipped' : ''}`}>
          <button type="button" className="tv-hit" onClick={next} aria-label={`${place.city} : photo suivante`}>
            {front}
          </button>
          {hasNote && (
            <>
              <div className="tv-face tv-back">
                <span className="tv-back-city">{place.city}</span>
                <p>{place.note}</p>
              </div>
              <button
                type="button"
                className="tv-note-btn"
                onClick={() => setFlipped((f) => !f)}
                aria-pressed={flipped}
                aria-label={flipped ? 'Revenir aux photos' : 'Lire le souvenir'}
              >
                {flipped ? '×' : 'i'}
              </button>
            </>
          )}
        </div>
      </figure>
    )
  }

  // Une photo + une note : toute la carte se retourne
  return (
    <figure className="tv-card" style={style}>
      <button
        type="button"
        className={`tv-inner tv-flip${flipped ? ' is-flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`${place.city} : retourner la carte`}
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

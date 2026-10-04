import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import StarSky from '../components/StarSky'
import { useWorkingDrawings } from '../lib/useWorkingDrawings'

export default function DrawingGallery() {
  const { list: DRAWINGS, onError } = useWorkingDrawings()
  const [open, setOpen] = useState(null) // index du dessin agrandi

  // Même ambiance sombre que « Mon univers »
  useEffect(() => {
    document.body.classList.add('is-universe')
    return () => document.body.classList.remove('is-universe')
  }, [])

  // Échap ferme l'agrandissement, flèches pour passer au suivant
  useEffect(() => {
    if (open === null) return
    const real = DRAWINGS.filter((d) => d.image)
    function onKey(e) {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % real.length)
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + real.length) % real.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const real = DRAWINGS.filter((d) => d.image)

  return (
    <main className="universe-page">
      <StarSky />

      <section className="page-hero wrap universe-hero">
        <span className="spark spark-1" aria-hidden="true" />
        <span className="spark spark-2" aria-hidden="true" />
        <span className="spark spark-3" aria-hidden="true" />
        <p className="eyebrow">Hobby n°2</p>
        <h1 className="anton">
          Mes <span className="rose">dessins</span>
        </h1>
        <p>Croquis, essais et idées : tout mon carnet, feuille par feuille.</p>
      </section>

      <section className="wrap drawing-gallery-wrap">
        <Reveal as="div" className="drawing-grid">
          {DRAWINGS.map((d, i) =>
            d.image ? (
              <button
                type="button"
                key={i}
                className="drawing-item"
                onClick={() => setOpen(real.indexOf(d))}
                aria-label={`Agrandir ${d.title || 'le dessin'}`}
              >
                <img
                  src={d.image}
                  alt={d.title || 'Dessin'}
                  loading="lazy"
                  onError={() => onError(d.image)}
                />
                {d.title && <span className="drawing-caption">{d.title}</span>}
              </button>
            ) : (
              <div key={i} className="drawing-item drawing-item-empty" aria-hidden="true">
                <span className="sketch-empty">
                  <small>Croquis {String(i + 1).padStart(2, '0')}</small>
                </span>
              </div>
            )
          )}
        </Reveal>

        <div className="drawing-back">
          <Link to="/univers" className="eyebrow">
            ← Retour à mon univers
          </Link>
        </div>
      </section>

      {open !== null && real[open] && (
        <div className="drawing-lightbox" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <img src={real[open].image} alt={real[open].title || 'Dessin'} onClick={(e) => e.stopPropagation()} />
          {real[open].title && <p>{real[open].title}</p>}
          <button type="button" className="drawing-close" onClick={() => setOpen(null)} aria-label="Fermer">
            ✕
          </button>
        </div>
      )}
    </main>
  )
}

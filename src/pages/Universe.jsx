import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import StarSky from '../components/StarSky'
import TypeIntro from '../components/TypeIntro'
import { useWorkingDrawings } from '../lib/useWorkingDrawings'
import { SHELVES } from '../data/books'
import BookShelf from '../components/BookShelf'
import HenneSection from '../components/HenneSection'
import CrochetCorner from '../components/CrochetCorner'
import TravelSection from '../components/TravelSection'
import UniverseOutro from '../components/UniverseOutro'
import SpaceProgress from '../components/SpaceProgress'
import StarTrail from '../components/StarTrail'

// Cartes qui défilent dans la section Mangas.
// Pour mettre une vraie image : place-la dans "public/univers/" puis écris son chemin
// dans "image" (ex. '/univers/manga-1.jpg'). "title" est facultatif.
const MANGAS = [
  { title: 'Naruto', image: '/univers/Naruto.jpg' },
  { title: 'Hunter x Hunter', image: '/univers/gon.jpg' },
  { title: 'Jujutsu Kaisen', image: '/univers/Gojo.jpg' },
  { title: 'Attack of Titan', image: '/univers/rm.jpg' },
  { title: 'Demon Slayer', image: '/univers/muzan.jpg' },
  { title: 'Black Clover', image: '/univers/clover.jpg' },
  { title: 'Viland Saga', image: '/univers/saga.jpg' },
  { title: 'Solo Leveling', image: '/univers/solo.jpg' },
  { title: 'Classroom of the Elite', image: '/univers/elite.jpg' },
]

// On répète la liste si elle est courte, pour que le défilement ne laisse jamais de vide.
export default function Universe() {
  // Dessins : les 10 premiers défilent (liste répétée si elle est courte, pour ne jamais laisser de vide)
  const { list: drawings, onError: onDrawingError } = useWorkingDrawings()
  const preview = drawings.slice(0, 10)
  const SKETCHES =
    preview.length >= 6 ? preview : Array.from({ length: 6 }, (_, i) => preview[i % preview.length])

  // Fond sombre + en-tête/pied de page assortis tant qu'on est sur cette page
  useEffect(() => {
    document.body.classList.add('is-universe')
    return () => document.body.classList.remove('is-universe')
  }, [])

  return (
    <main className="universe-page">
      <StarSky />
      <StarTrail />
      <SpaceProgress />

      <section className="page-hero wrap universe-hero">
        <span className="spark spark-1" aria-hidden="true" />
        <span className="spark spark-2" aria-hidden="true" />
        <span className="spark spark-3" aria-hidden="true" />
        <span className="spark spark-4" aria-hidden="true" />
        <p className="eyebrow">En dehors du code</p>
        <h1 className="anton">
          Mon <span className="rose">univers</span>
        </h1>
        <p>Tout ce qui m'inspire, m'amuse et me pousse à créer.</p>
      </section>

      <TypeIntro />

      <section className="playground wrap">
        <Reveal>
          <span className="playground-rule" aria-hidden="true">
            <span className="spark" />
          </span>
          <h2 className="anton playground-title">
            Mon <span className="gold">terrain de jeu</span>
          </h2>
          <p className="playground-sub">
            Là où je m'amuse, je m'inspire et je laisse ma créativité courir.
          </p>
          <span className="playground-arrow" aria-hidden="true">↓</span>
        </Reveal>
      </section>

      <section className="manga-section">
        <div className="wrap manga-head">
          <p className="eyebrow">Hobby n°1</p>
          <h2 className="anton">Mangas</h2>
          <p>
            Ma passion pour les mangas ne m'a jamais quittée. Leurs images, leurs émotions et leurs
            mondes imaginaires nourrissent ma créativité, mon sens du détail et ma façon de raconter
            une histoire.
          </p>
        </div>

        <div className="manga-marquee" style={{ '--dur': `${MANGAS.length * 4}s` }}>
          <div className="manga-track">
            {[...MANGAS, ...MANGAS].map((m, i) => (
              <article
                key={i}
                className={`manga-card manga-card-${(i % MANGAS.length) + 1}`}
                aria-hidden={i >= MANGAS.length}
              >
                {m.image ? (
                  <img src={m.image} alt={m.title || 'Manga'} loading="eager" />
                ) : (
                  <span className="manga-card-empty">
                    <span className="spark spark-card" aria-hidden="true" />
                    <small>Bientôt</small>
                  </span>
                )}
                {m.title && <span className="manga-card-title">{m.title}</span>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <Reveal as="section" className="sketch-section">
        <div className="wrap sketch-head">
          <p className="eyebrow">Hobby n°2</p>
          <h2 className="anton">Dessin</h2>
          <span className="sketch-tag">✦ Sketchbook</span>
          <p>Je dessine par plaisir, pour explorer des idées, des formes et des personnages.</p>
        </div>

        <div className="sketch-marquee" style={{ '--dur': `${SKETCHES.length * 6}s` }}>
          <div className="sketch-track">
            {[...SKETCHES, ...SKETCHES].map((d, i) => (
              <figure
                key={i}
                className={`sketch-sheet sketch-sheet-${(i % 4) + 1}`}
                aria-hidden={i >= SKETCHES.length}
              >
                {d.image ? (
                  <img
                    src={d.image}
                    alt={d.title || 'Dessin'}
                    loading="eager"
                    onError={() => onDrawingError(d.image)}
                  />
                ) : (
                  <span className="sketch-empty" aria-hidden="true">
                    <span className="sketch-lines" />
                    <small>Croquis {String((i % SKETCHES.length) + 1).padStart(2, '0')}</small>
                  </span>
                )}
                {d.title && <figcaption>{d.title}</figcaption>}
              </figure>
            ))}
          </div>
        </div>

        <p className="sketch-caption">Croquis • essais • idées</p>

        <div className="sketch-more">
          <p>Ce n'est qu'un aperçu : le reste de mon carnet est juste là, si tu as envie de feuilleter.</p>
          <Link to="/univers/dessins" className="sketch-more-btn">
            Voir tous mes dessins →
          </Link>
        </div>
      </Reveal>

      <Reveal as="section" className="reading-section">
        <div className="wrap reading-head">
          <p className="eyebrow">Hobby n°3</p>
          <h2 className="anton">Lecture</h2>
          <p>Lire est pour moi une autre façon de voyager, d'apprendre et de m'évader.</p>
        </div>

        <div className="wrap reading-shelves">
          {SHELVES.map((shelf, i) => (
            <BookShelf
              key={shelf.name}
              name={shelf.name}
              books={shelf.books}
              startAt={shelf.startAt || (i % 2 === 0 ? 'left' : 'right')}
            />
          ))}
        </div>
      </Reveal>


      <HenneSection />

      <CrochetCorner />

      <TravelSection />

      <UniverseOutro />
    </main>
  )
}

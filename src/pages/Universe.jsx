import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import StarSky from '../components/StarSky'
import TypeIntro from '../components/TypeIntro'
import { DRAWINGS } from '../data/drawings'
import { SHELVES } from '../data/books'
import BookShelf from '../components/BookShelf'

const ICONS = {
  dessin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  maquillage: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 21v-6h8v6" />
      <path d="M9 15V9h6v6" />
      <path d="M10 9l1-6 3 1-1 5" />
    </svg>
  ),
  lecture: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Z" />
      <path d="M4 5.5v16" />
    </svg>
  ),
  films: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
    </svg>
  ),
  manga: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
      <path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7Z" />
    </svg>
  ),
}

// Pour ajouter une photo à une carte : mets l'image dans le dossier "public/univers/"
// puis renseigne son chemin dans "image", par exemple : image: '/univers/dessin.jpg'
const PASSIONS = [
  {
    icon: 'maquillage',
    title: 'Maquillage',
    text: 'Couleurs, harmonies, détails : un autre terrain de création.',
    image: '',
  },
  {
    icon: 'films',
    title: 'Films',
    text: "Cadrage, lumière, ambiance : j'y puise beaucoup d'inspiration.",
    image: '',
  },
]

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
// (Tes dessins se gèrent dans src/data/drawings.js : les 8 premiers défilent ici.)
const PREVIEW = DRAWINGS.slice(0, 8)
const SKETCHES =
  PREVIEW.length >= 6
    ? PREVIEW
    : Array.from({ length: 6 }, (_, i) => PREVIEW[i % PREVIEW.length])

export default function Universe() {
  // Fond sombre + en-tête/pied de page assortis tant qu'on est sur cette page
  useEffect(() => {
    document.body.classList.add('is-universe')
    return () => document.body.classList.remove('is-universe')
  }, [])

  return (
    <main className="universe-page">
      <StarSky />

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

        <div className="manga-marquee" style={{ '--dur': `${MANGAS.length * 7}s` }}>
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
                  <img src={d.image} alt={d.title || 'Dessin'} loading="eager" />
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

      <Reveal as="section" className="wrap univers-section">
        <div className="univers-intro">
          <p className="eyebrow">Et aussi</p>
          <h2 className="anton">Mes autres passions</h2>
        </div>

        <div className="univers-grid">
          {PASSIONS.map((p) => (
            <article key={p.title} className="univers-card">
              {p.image && (
                <img src={p.image} alt={p.title} className="univers-photo" loading="lazy" />
              )}
              <div className="univers-card-body">
                <span className="univers-icon">{ICONS[p.icon]}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="univers-back">
          <Link to="/parcours" className="eyebrow">
            ← Retour au parcours
          </Link>
        </div>
      </Reveal>
    </main>
  )
}

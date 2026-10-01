import { useProjects } from '../lib/useProjects'
import Reveal from '../components/Reveal'

export default function Gallery() {
  const { projects } = useProjects()
  const designItems = projects.filter((p) => p.category === 'design')

  function handleSpotlight(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <main>
      <section className="page-hero wrap">
        <p className="eyebrow">Infographie</p>
        <h1 className="anton">
          Galerie <span className="rose">infographie</span>
        </h1>
        <p>Affiches, identités visuelles et compositions réunies ici.</p>
      </section>

      <section className="projects-list wrap">
        <Reveal as="div" className="masonry-gallery">
          {designItems.map((p) => (
            <div className="masonry-item spotlight" key={p.id} onMouseMove={handleSpotlight}>
              {p.image ? (
                <img src={p.image} alt={p.title} />
              ) : (
                <span className="hero-photo-placeholder">Affiche à venir</span>
              )}
              <div className="masonry-caption">{p.title}</div>
            </div>
          ))}
        </Reveal>
      </section>
    </main>
  )
}

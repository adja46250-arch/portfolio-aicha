import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProjects } from '../lib/useProjects'
import Reveal from '../components/Reveal'
import PosterFan from '../components/PosterFan'
import ProjectShots from '../components/ProjectShots'

const FILTERS = [
  { key: 'all', label: 'Tous' },
  { key: 'dev', label: 'Développement' },
  { key: 'design', label: 'Infographie' },
]

export default function Projects() {
  const { projects } = useProjects()
  const [filter, setFilter] = useState('all')

  function handleSpotlight(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const visible =
    filter === 'all' ? projects : projects.filter((p) => p.category === filter)
  const devItems = visible.filter((p) => p.category === 'dev')
  const designItems = visible.filter((p) => p.category === 'design')

  return (
    <main>
      <section className="page-hero wrap">
        <p className="eyebrow">Développement &amp; infographie</p>
        <h1 className="anton">
          Mes <span className="rose">projets</span>
        </h1>
        <p>
          Des applications construites du frontend à la base de données, et des identités
          visuelles pensées pour être comprises d'un coup d'œil. Certains sont en ligne, d'autres
          encore en chantier. Je préfère montrer où j'en suis vraiment.
        </p>

        <div className="filters" role="tablist" aria-label="Filtrer les projets">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-btn ${filter === f.key ? 'is-active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="projects-list wrap">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {devItems.length > 0 && (
              <div className="project-mock-list">
                {devItems.map((p, i) => {
                  const CardLink = p.link ? 'a' : 'div'
                  const linkProps = p.link
                    ? { href: p.link, target: '_blank', rel: 'noreferrer' }
                    : {}
                  return (
                    <Reveal
                      delay={i * 0.06}
                      key={p.id}
                      as="article"
                      className="project-mock project-mock-detail spotlight"
                      onMouseMove={handleSpotlight}
                    >
                      <CardLink className="project-mock-link" {...linkProps}>
                        <div className="project-mock-frame">
                          <div className="project-mock-bar">
                            <span className="dot dot-red" />
                            <span className="dot dot-yellow" />
                            <span className="dot dot-green" />
                            <span className="mock-badge">{String(i + 1).padStart(2, '0')}</span>
                          </div>
                          <ProjectShots
                            images={p.images}
                            fallback={p.image}
                            alt={p.title}
                            emptyLabel="Capture d'écran à venir"
                          />
                        </div>
                      </CardLink>
                      <div className="project-mock-body">
                        <div className="project-top">
                          <span className={`status ${p.status}`}>
                            {p.status === 'live' ? 'En ligne' : 'En cours'}
                          </span>
                        </div>
                        <h2>{p.title}</h2>
                        <p className="desc">{p.description}</p>
                        <div className="stack-row">
                          {(p.stack || []).map((s) => (
                            <span className="pill" key={s}>
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="project-links">
                          <Link to={`/projets/${p.id}`} className="project-link">
                            Voir le détail →
                          </Link>
                          {p.link && (
                            <a
                              href={p.link}
                              className="project-link"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Voir le site en ligne →
                            </a>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  )
                })}
              </div>
            )}

            {designItems.length > 0 && (
              <Reveal as="div" className="gallery-block">
                <h2 className="gallery-heading">Infographie</h2>
                <PosterFan items={designItems} linkTo="/projets/galerie" linkLabel="Ouvrir la galerie" />
              </Reveal>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  )
}

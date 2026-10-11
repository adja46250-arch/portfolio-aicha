import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProjects } from '../lib/useProjects'
import Reveal from '../components/Reveal'
import PosterFan from '../components/PosterFan'
import ProjectShots from '../components/ProjectShots'
import SkyClouds from '../components/SkyClouds'

const FILTERS = [
  { key: 'all', label: 'Tous' },
  { key: 'dev', label: 'Développement' },
  { key: 'design', label: 'Infographie' },
]

export default function Projects() {
  const { projects } = useProjects()
  const [filter, setFilter] = useState('all')
  const topRef = useRef(null)

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
    <main className="pj-page">
      <div className="pj-hero">
        <div className="design-motifs" aria-hidden="true">
          <i className="dm-r" />
          <i className="dm-l" />
        </div>
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
      </div>

      <div className={`pj-top${devItems.length === 0 ? ' pj-top-empty' : ''}`} ref={topRef}>
        <div className="dev-motifs" aria-hidden="true">
          <i className="dm-r" />
          <i className="dm-l" />
        </div>
        <SkyClouds targetRef={topRef} variant="dev-clouds" offset={['start end', 'start 15%']} />

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <section className="projects-list wrap">
            {devItems.length > 0 && (
              <>
              <div className="pj-head">
                <span className="dev-eyebrow">Projets</span>
                <h2 className="pj-title">Développement</h2>
              </div>
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
              </>
            )}
          </section>
        </motion.div>
      </AnimatePresence>
      <SkyClouds targetRef={topRef} variant="dev-clouds-b" offset={['end end', 'end 35%']} />
      </div>

      <AnimatePresence mode="wait">
        {designItems.length > 0 && (
          <motion.div
            key={`d-${filter}`}
            className="pj-design design-band"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="design-motifs" aria-hidden="true">
              <i className="dm-r" />
              <i className="dm-l" />
            </div>
            <section className="wrap pj-design-inner">
              <Reveal as="div">
                <div className="pj-head pj-head-design">
                  <span className="dev-eyebrow">Projets</span>
                  <h2 className="pj-title">Infographie</h2>
                </div>
                <PosterFan items={designItems} linkTo="/projets/galerie" linkLabel="Ouvrir la galerie" />
              </Reveal>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

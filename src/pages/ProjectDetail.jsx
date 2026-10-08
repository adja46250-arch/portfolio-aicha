import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProjects } from '../lib/useProjects'
import Reveal from '../components/Reveal'

const STORY = [
  { key: 'problem', label: 'Le problème' },
  { key: 'solution', label: 'La solution' },
  { key: 'result', label: 'Le résultat' },
]

// « Titre | texte » par ligne
const pairs = (t) =>
  (t || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf('|')
      return i === -1 ? { title: l, text: '' } : { title: l.slice(0, i).trim(), text: l.slice(i + 1).trim() }
    })
const lines = (t) =>
  (t || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
const paras = (t) => (t || '').split(/\n{2,}/).map((x) => x.trim()).filter(Boolean)

export default function ProjectDetail() {
  const { id } = useParams()
  const { projects, loading } = useProjects()
  const [active, setActive] = useState(0)

  const project = projects.find((p) => String(p.id) === id)

  if (!project) {
    return (
      <main>
        <section className="page-hero wrap">
          <p className="eyebrow">Projet</p>
          <h1 className="anton">{loading ? 'Chargement…' : 'Projet introuvable'}</h1>
          {!loading && <p>Ce projet n'existe pas ou n'est plus en ligne.</p>}
          <Link to="/projets" className="project-link detail-back-link">
            ← Tous les projets
          </Link>
        </section>
      </main>
    )
  }

  const shots =
    project.images && project.images.length > 0
      ? project.images
      : project.image
        ? [project.image]
        : []
  const features = pairs(project.features)
  const techs = pairs(project.tech_choices)
  const archi = pairs(project.architecture)
  const roadmap = lines(project.roadmap)
  const hasCase = project.why || project.utility || features.length || techs.length || archi.length || project.security || roadmap.length
  const story = STORY.filter((s) => project[s.key] && project[s.key].trim())

  return (
    <main>
      <section className="page-hero wrap detail-hero">
        <Link to="/projets" className="eyebrow detail-back">
          ← Tous les projets
        </Link>

        <span className={`status ${project.status}`}>
          {project.status === 'live' ? 'En ligne' : 'En cours'}
        </span>
        <h1 className="anton">{project.title}</h1>
        <p>{project.description}</p>

        {(project.stack || []).length > 0 && (
          <div className="stack-row">
            {project.stack.map((s) => (
              <span className="pill" key={s}>
                {s}
              </span>
            ))}
          </div>
        )}

        {(project.link || project.github) && (
          <div className="detail-actions">
            {project.link && (
              <a href={project.link} className="btn btn-solid" target="_blank" rel="noreferrer">
                Voir le site en ligne →
              </a>
            )}
            {project.github && (
              <a href={project.github} className="btn btn-line" target="_blank" rel="noreferrer">
                Code sur GitHub →
              </a>
            )}
          </div>
        )}
      </section>

      {shots.length > 0 && (
        <Reveal as="section" className="wrap detail-shots">
          <div className="project-mock-frame">
            <div className="project-mock-bar">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <img
              src={shots[Math.min(active, shots.length - 1)]}
              alt={`${project.title}, capture ${active + 1}`}
              className="detail-shot"
            />
          </div>
          {shots.length > 1 && (
            <div className="detail-thumbs">
              {shots.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  className={`detail-thumb ${i === active ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`Voir la capture ${i + 1}`}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </Reveal>
      )}

      {story.length > 0 && (
        <section className="wrap detail-story">
          {story.map((s, i) => (
            <Reveal as="div" key={s.key} className="detail-step">
              <div className="detail-step-head">
                <span className="detail-step-num">{String(i + 1).padStart(2, '0')}</span>
                <h2>{s.label}</h2>
              </div>
              <p>{project[s.key]}</p>
            </Reveal>
          ))}
        </section>
      )}

      {hasCase && (
        <section className="wrap case">
          {[
            ['why', 'Pourquoi ce projet ?'],
            ['utility', 'À quoi ça sert, concrètement ?'],
          ].map(
            ([k, label]) =>
              project[k] && (
                <Reveal as="div" key={k} className="case-block">
                  <h2>{label}</h2>
                  {paras(project[k]).map((t, i) => (
                    <p key={i}>{t}</p>
                  ))}
                </Reveal>
              ),
          )}

          {features.length > 0 && (
            <Reveal as="div" className="case-block">
              <h2>Fonctionnalités clés et comment elles marchent</h2>
              <div className="case-grid">
                {features.map((f) => (
                  <article className="case-card" key={f.title}>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </article>
                ))}
              </div>
            </Reveal>
          )}

          {archi.length > 0 && (
            <Reveal as="div" className="case-block">
              <h2>Comment c'est construit</h2>
              <div className="case-flow">
                {archi.map((a, i) => (
                  <div className="case-flow-item" key={a.title + i}>
                    <div className="case-node">
                      <strong>{a.title}</strong>
                      {a.text && <span>{a.text}</span>}
                    </div>
                    {i < archi.length - 1 && <span className="case-arrow" aria-hidden="true">→</span>}
                  </div>
                ))}
              </div>
              {paras(project.architecture_note).map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </Reveal>
          )}

          {techs.length > 0 && (
            <Reveal as="div" className="case-block">
              <h2>Choix techniques</h2>
              <ul className="case-list">
                {techs.map((t) => (
                  <li key={t.title}>
                    <strong>{t.title}</strong> {t.text && <>: {t.text}</>}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {project.security && (
            <Reveal as="div" className="case-block">
              <h2>Sécurité</h2>
              {paras(project.security).map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </Reveal>
          )}

          {roadmap.length > 0 && (
            <Reveal as="div" className="case-block">
              <h2>Prochaines étapes</h2>
              <ul className="case-list">
                {roadmap.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </Reveal>
          )}
        </section>
      )}

      <section className="wrap detail-cta">
        <p>Un projet en tête ? Parlons-en.</p>
        <Link to="/contact" className="btn btn-solid">
          Me contacter →
        </Link>
      </section>
    </main>
  )
}

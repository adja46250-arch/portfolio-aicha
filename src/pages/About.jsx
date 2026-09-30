import { useEffect, useState } from 'react'
import Reveal from '../components/Reveal'
import { SkillIcons } from '../components/SkillIcons'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

// Repli affiché tant qu'aucune formation n'est ajoutée depuis l'admin
// (onglet Parcours) ou si Supabase n'est pas encore configuré.
const FALLBACK_FORMATIONS = [
  {
    id: 'fallback',
    period: 'En cours',
    title: 'Licence 3 — Informatique',
    description:
      "Formation en développement : PHP, Java, Laravel et JavaScript, complétée par des projets personnels.",
  },
]

// ---- Compétences : regroupées par domaine, chacune avec son logo.
const SKILLS = [
  {
    group: 'Développement',
    items: [
      { name: 'React', icon: 'react' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'PHP', icon: 'php' },
      { name: 'Laravel', icon: 'laravel' },
      { name: 'Java', icon: 'java' },
    ],
  },
  {
    group: 'Données & services',
    items: [
      { name: 'MySQL', icon: 'mysql' },
      { name: 'Supabase', icon: 'supabase' },
    ],
  },
  {
    group: 'Design & infographie',
    items: [
      { name: 'Photoshop', icon: 'photoshop' },
      { name: 'Illustrator', icon: 'illustrator' },
      { name: 'Canva', icon: 'canva' },
      { name: 'CapCut', icon: 'capcut' },
    ],
  },
]

export default function About() {
  const [photo, setPhoto] = useState('')
  const [formations, setFormations] = useState(FALLBACK_FORMATIONS)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    supabase
      .from('settings')
      .select('about_image')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => {
        if (!error && data?.about_image) setPhoto(data.about_image)
      })

    supabase
      .from('formations')
      .select('*')
      .order('position', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setFormations(data)
      })
  }, [])

  return (
    <main>
      <section className="page-hero wrap">
        <p className="eyebrow">Qui je suis</p>
        <h1 className="anton">
          Mon <span className="rose">parcours</span>
        </h1>
        <p>
          Étudiante en informatique, fondatrice d'agence, et attachée à faire aussi bien tourner
          le code que porter une identité visuelle.
        </p>
      </section>

      <Reveal as="section" className="about-block wrap">
        <h2>Formation</h2>
        <div className="formation-layout">
          <ol className="timeline">
            {formations.map((f) => (
              <li key={f.id} className="timeline-item">
                <span className="timeline-period">{f.period}</span>
                <h3>{f.title}</h3>
                {f.description && <p>{f.description}</p>}
              </li>
            ))}
          </ol>

          {photo && (
            <div className="formation-photo">
              <span className="formation-shape formation-shape-a" aria-hidden="true" />
              <span className="formation-shape formation-shape-b" aria-hidden="true" />
              <span className="formation-dots" aria-hidden="true" />
              <img src={photo} alt="Aïcha" className="formation-photo-img" />
            </div>
          )}
        </div>
      </Reveal>

      <Reveal as="section" className="about-block wrap">
        <h2>Compétences techniques</h2>
        <div className="skills-block">
          {SKILLS.map((s) => (
            <div key={s.group} className="skills-section">
              <span className="skills-group">{s.group}</span>
              <div className="skill-grid">
                {s.items.map((item) => (
                  <div key={item.name} className="skill-card">
                    <span className="skill-icon">{SkillIcons[item.icon]}</span>
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="about-block wrap">
        <h2>En dehors du code</h2>
        <p>
          Section à compléter — dis-moi ce que tu veux vraiment mettre ici (dessin, lecture,
          autre chose) et je remplace ce texte par le tien depuis l'admin.
        </p>
      </Reveal>
    </main>
  )
}

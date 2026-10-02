import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { SkillIcons } from '../components/SkillIcons'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

// Parcours affiché sur la page (modifiable ici, dans le code).
const DEFAULT_FORMATIONS = [
  {
    id: 'licence',
    period: '2023-2026',
    title: 'Licence en Sciences Informatiques',
    place: "Groupe ITA (Institut des Technologies d'Abidjan) annexe Bouaké",
    description:
      "Formation orientée vers la conception et le développement de solutions informatiques : programmation, bases de données, développement web, algorithmique, systèmes d'information et gestion de projets informatiques.",
  },
  {
    id: 'lycee',
    period: '2020-2023',
    title: 'Lycée Technique de Bouaké',
    place: 'Série F2, Électronique',
    description:
      "La série F2 est une formation technique orientée vers l'électronique : étude des circuits électriques et électroniques, des composants, des systèmes automatisés et des principes qui permettent de comprendre et de concevoir des dispositifs électroniques.",
    note:
      "Cette formation m'a permis de développer une première culture technique, ma capacité à analyser des systèmes et mon goût pour les technologies.",
  },
  {
    id: 'college',
    period: 'Avant 2020',
    title: 'Collège Al-Fourqan, Bouaké',
    place: 'Enseignement général',
    description:
      "Parcours scolaire dans un environnement franco-arabe, qui m'a permis de construire mes bases académiques avant de poursuivre une formation technique au Lycée Technique de Bouaké.",
  },
  {
    id: 'college-arabe',
    period: 'Avant 2020',
    title: 'Collège Al-Fourqan, Bouaké',
    place: 'Enseignement Langue arabe',
    description:
      "J’ai effectué mon parcours au Collège Al-Fourqan, un établissement franco-arabe, où j’ai obtenu mon BEPC. Cette formation m’a permis de développer mes bases scolaires tout en suivant un enseignement en sciences arabes et en langue arabe, avant de poursuivre mon parcours dans l’enseignement technique.",
  },
  {
    id: 'infographie',
    period: '2020-2026',
    title: 'Infographie',
    place: 'Apprentissage autodidacte',
    description:
      "L’infographie est un domaine que j’ai développé en autodidacte, principalement à travers des tutoriels, l’expérimentation et la réalisation de projets personnels. Au fil de ma pratique, j’ai appris à utiliser différents outils de création graphique et à travailler sur des supports tels que logos, affiches, flyers, visuels pour les réseaux sociaux et éléments d’identité visuelle.",
    note:
      "Apprendre en faisant, a toujours été ma manière de progresser : tester, créer, corriger et recommencer.",
  },
]

// Formations complémentaires (hors cursus principal)
const EXTRA_TRAININGS = [
  {
    tag: 'Certification',
    title: 'YouthJob',
    place: 'Entrepreneuriat • Soft skills • Recherche d\'emploi',
    description:
      "Certification axée sur des compétences professionnelles complémentaires : entrepreneuriat, communication, savoir-être professionnel, préparation à l'emploi et techniques de recherche d'opportunités.",
  },
  {
    tag: 'Apprentissage continu',
    title: 'Bootcamps & formations pratiques',
    place: 'Renforcement technique et professionnel',
    description:
      "En complément de mon parcours académique, je participe à différents bootcamps et formations pratiques pour renforcer mes compétences techniques et rester en apprentissage continu.",
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
  }, [])

  return (
    <main>
      <section className="page-hero wrap">
        <p className="eyebrow">Qui je suis</p>
        <h1 className="anton">
          Mon <span className="rose">parcours</span>
        </h1>
        <p>
          Je mêle logique du code et sens créatif pour concevoir des expériences numériques qui ont leur propre identité.
        </p>
      </section>

      <Reveal as="section" className="about-block wrap">
        <h2>Formation</h2>

        <div className="parcours-intro">
          <p className="parcours-lead">
            Entre technique et créativité, un parcours guidé par l’envie de comprendre, d’apprendre et de créer.
          </p>
          <p>
            Mon parcours s’est construit entre apprentissage académique, curiosité technique et pratique personnelle.
            Au fil des années, j’ai développé un profil qui combine développement informatique et création visuelle. Ma formation m’a donné les bases techniques, tandis que mes apprentissages personnels et mes projets m’ont permis d’explorer d’autres domaines et de développer ma créativité.
          </p>
        </div>

        <div className="formation-layout">
          <ol className="timeline">
            {DEFAULT_FORMATIONS.map((f) => (
              <li key={f.id} className="timeline-item">
                <span className="timeline-period">{f.period}</span>
                <h3>{f.title}</h3>
                {f.place && <span className="timeline-place">{f.place}</span>}
                {f.description && <p>{f.description}</p>}
                {f.note && <blockquote className="timeline-note">{f.note}</blockquote>}
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

        <p className="parcours-quote">
          Mon parcours a commencé dans l'électronique avant d'évoluer naturellement vers les
          sciences informatiques et le développement de solutions numériques.
        </p>
      </Reveal>

      <Reveal as="section" className="about-block wrap">
        <h2>Formations complémentaires</h2>
        <div className="extra-grid">
          {EXTRA_TRAININGS.map((t) => (
            <article key={t.title} className="extra-card">
              <span className="extra-tag">{t.tag}</span>
              <h3>{t.title}</h3>
              <span className="extra-place">{t.place}</span>
              <p>{t.description}</p>
            </article>
          ))}
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

      <Reveal as="section" className="about-block wrap univers-teaser">
        <h2>En dehors du code</h2>
        <p className="univers-lead">Derrière le code, il y a Aïcha.</p>
        <Link to="/univers" className="univers-btn">
          Découvrir mon univers
        </Link>
      </Reveal>
    </main>
  )
}

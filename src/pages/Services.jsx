import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '../lib/useProjects'
import Reveal from '../components/Reveal'
import SkyClouds from '../components/SkyClouds'
import ContactBand from '../components/ContactBand'

// Services proposés (modifiable ici, dans le code).
const SERVICES = [
  {
    key: 'dev',
    title: 'Développement web',
    tag: 'Sites & applications',
    short: 'Des solutions pensées pour vos besoins.',
    description:
      "Je conçois des sites et des applications web sur mesure, de l'interface à la base de données, pensés pour être clairs, rapides et faciles à utiliser.",
    points: ['Site vitrine ou portfolio', 'Application web (gestion, suivi, réservation…)', "Interface adaptée au mobile et à l'ordinateur", 'Mise en ligne et mises à jour'],
    tools: ['React', 'Laravel', 'PHP', 'Supabase'],
    to: '/projets',
    cta: 'Voir mes projets web',
  },
  {
    key: 'design',
    title: 'Infographie',
    tag: 'Visuels & supports',
    short: "Des visuels qui se comprennent d'un coup d'œil.",
    description:
      'Affiches, flyers, visuels pour les réseaux sociaux, supports imprimés : de quoi annoncer, vendre ou simplement faire bonne impression.',
    points: ['Affiches et flyers', 'Visuels pour les réseaux sociaux', 'Cartes de visite et supports imprimés', 'Montage vidéo court'],
    tools: ['Photoshop', 'Illustrator', 'Canva', 'CapCut'],
    to: '/projets',
    cta: 'Voir mes créations',
  },
  {
    key: 'brand',
    title: 'Identité visuelle',
    tag: 'Logo & univers',
    short: 'Un logo, des couleurs et un style qui te ressemblent.',
    description:
      'Logo, palette de couleurs, typographies et déclinaisons : une image cohérente sur le web comme sur papier, de la carte de visite aux affiches.',
    points: ['Création de logo', 'Palette de couleurs et typographies', 'Charte graphique simple', "Déclinaisons web et impression"],
    tools: ['Illustrator', 'Photoshop', 'Canva'],
    to: '/projets',
    cta: "Voir l'identité Aid Muslima",
  },
  {
    key: 'support',
    title: 'Accompagnement numérique',
    tag: 'Conseil & mise en ligne',
    short: 'Un coup de main pour bien démarrer en ligne.',
    description:
      "Conseils, mise en ligne, prise en main : je t'aide à choisir les bons outils et à les utiliser sereinement, sans jargon.",
    points: ['Choix des bons outils', 'Mise en ligne de ton site ou de ta page', 'Prise en main et formation courte', 'Réponses à tes questions après la livraison'],
    tools: ['Conseil', 'Mise en ligne', 'Formation'],
    cta: 'Me contacter',
  },
]

const STEPS = [
  { title: 'On discute', text: "Tu m'expliques ton projet, tes envies et ton budget. J'écoute et je pose les bonnes questions." },
  { title: 'Je propose', text: 'Je te présente une idée claire : maquette, style ou plan du site, avant de me lancer.' },
  { title: 'Je crée', text: "Je réalise le projet en te tenant au courant. Tu peux demander des ajustements en cours de route." },
  { title: 'Je livre', text: 'Tu reçois tes fichiers ou ton site en ligne, avec un petit accompagnement pour bien démarrer.' },
]

const norm = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
// =====================================================================
// ⬇️ TES IMAGES : modifie-les ici
// Mets le chemin d'une image placée dans le dossier « public » (ex. '/affiches/gala.jpg')
// ou le lien complet d'une image en ligne. Laisse '' pour que le site choisisse tout seul
// parmi tes projets.
// =====================================================================
// Carte « Infographie » : 3 affiches (gauche, milieu, droite)
const IMAGES_INFOGRAPHIE = [
  '', // gauche
  '', // milieu
  '', // droite
]
// Carte « Identité visuelle » : le logo (médaillon rond) + jusqu'à 3 affiches derrière
const IMAGES_IDENTITE = {
  logo: '',
  affiches: ['', '', ''],
}

const imagesOf = (p) => (p.images && p.images.length ? p.images : p.image ? [p.image] : [])

// Illustration animée propre à chaque service (s'anime à l'ouverture de la carte)
function Illustration({ k, devImage, designImages, brandImages, brandName }) {
  if (k === 'dev') {
    return (
      <div className="svi svi-dev">
        <div className="sv-browser">
          <div className="sv-browser-bar"><i /><i /><i /><span /></div>
          <div className="sv-browser-body">
            {devImage ? (
              <img src={devImage} alt="" />
            ) : (
              <div className="sv-ui">
                <b className="sv-ui-hero" />
                <div className="sv-ui-row"><b /><b /><b /></div>
                <em /><em className="short" /><em />
              </div>
            )}
          </div>
        </div>
        <pre className="sv-code"><span className="l1">{'const idee = await creer()'}</span>{'\n'}<span className="l2">{'return <Site {...idee} />'}</span></pre>
        <span className="svi-chip c1">{'</>'}</span>
        <span className="svi-chip c2">React</span>
      </div>
    )
  }
  if (k === 'design') {
    const imgs = designImages.slice(0, 3)
    return (
      <div className="svi svi-design">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`svi-poster p${i + 1}`}>
            {imgs[i] ? (
              <img src={imgs[i]} alt="" />
            ) : (
              <span className={`svi-poster-css v${i + 1}`}><b>{['AFFICHE', 'FLYER', 'VISUEL'][i]}</b><i /><em /></span>
            )}
          </div>
        ))}
        <span className="svi-file f1">affiche-finale.psd</span>
        <span className="svi-file f2">flyer.ai</span>
        <span className="svi-file f3">post-reseaux.png</span>
      </div>
    )
  }
  if (k === 'brand') {
    const [logo, ...posters] = brandImages
    return (
      <div className="svi svi-brand">
        <div className="svi-logo">
          {logo ? <img src={logo} alt="" /> : <b>A</b>}
        </div>
        <div className="svi-brand-posters">
          {posters.slice(0, 3).map((src, i) => (
            <div key={src + i} className={`svi-bp bp${i + 1}`}><img src={src} alt="" /></div>
          ))}
        </div>
        <div className="svi-swatches"><i style={{ background: '#7a1f2b' }} /><i style={{ background: '#d4a24c' }} /><i style={{ background: '#f2a58e' }} /><i style={{ background: '#f7ece2' }} /></div>
        <span className="svi-specimen">Aa <em>{brandName || 'Logo · Couleurs · Typo'}</em></span>
      </div>
    )
  }
  return (
    <div className="svi svi-support">
      <div className="svi-check">
        <b>Ton plan de départ</b>
        <ul>
          <li style={{ '--d': '0.5s' }}><i /><span>Choisir les bons outils</span></li>
          <li style={{ '--d': '1.2s' }}><i /><span>Mettre en ligne</span></li>
          <li style={{ '--d': '1.9s' }}><i /><span>Prendre en main</span></li>
        </ul>
      </div>
      <span className="svi-bubble b1">Par où commencer ?</span>
      <span className="svi-bubble b2">On y va ensemble 🤝</span>
    </div>
  )
}

export default function Services() {
  const stepsRef = useRef(null)
  const { projects } = useProjects()
  const [open, setOpen] = useState(0)

  const withImg = (p) => imagesOf(p).length > 0
  const devProject = projects.find((x) => x.category === 'dev' && withImg(x))
  const devImage = devProject ? imagesOf(devProject)[0] : ''

  // Infographie : tes images (IMAGES_INFOGRAPHIE) sinon les affiches de tes projets
  const autoDesign = projects.filter((x) => x.category === 'design').flatMap(imagesOf)
  const designImages = [0, 1, 2].map((i) => IMAGES_INFOGRAPHIE[i] || autoDesign[i] || '')

  // Identité visuelle : tes images (IMAGES_IDENTITE) sinon les projets « Muslima » / « logo » / « identité »
  const brandProjects = projects.filter((x) => /muslima/.test(norm(x.title)) && withImg(x))
  const brandSource = brandProjects.length ? brandProjects : projects.filter((x) => /logo|identit/.test(norm(x.title)) && withImg(x))
  const autoBrand = brandSource.flatMap(imagesOf)
  const brandLogo = IMAGES_IDENTITE.logo || autoBrand[0] || ''
  const autoPosters = autoBrand.slice(1)
  const brandPosters = [0, 1, 2].map((i) => IMAGES_IDENTITE.affiches[i] || autoPosters[i] || '').filter(Boolean)
  const brandImages = [brandLogo, ...brandPosters]
  const brandName = brandProjects.length ? 'Aid Muslima' : ''
  const goContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main className="pc-page sv-page">
      {/* ---------- Titre de la page ---------- */}
      <div className="pj-hero pc-hero">
        <div className="design-motifs" aria-hidden="true">
          <i className="dm-r" />
          <i className="dm-l" />
        </div>
        <section className="page-hero wrap">
          <p className="eyebrow">Ce que je fais</p>
          <h1 className="anton">
            Mes <span className="rose">services</span>
          </h1>
          <p>
            Du site web à l'identité visuelle, je t'aide à présenter ton activité de façon claire,
            soignée et fidèle à ton image. Chaque projet est pensé sur mesure, avec une relation
            simple et honnête.
          </p>
        </section>
      </div>

      {/* ---------- Domaines : un grand bloc éditorial + une liste élégante ---------- */}
      <section className="pc-dark sv-domains">
        <div className="design-motifs" aria-hidden="true">
          <i className="dm-r" />
          <i className="dm-l" />
        </div>
        <div className="wrap pc-inner">
          <Reveal>
            <div className="pj-head">
              <span className="dev-eyebrow">Services</span>
              <h2 className="pj-title">Quatre façons de donner vie à tes idées</h2>
            </div>
          </Reveal>

          <ul className="sv-list">
            {SERVICES.map((sv, i) => {
              const isOpen = open === i
              return (
                <Reveal key={sv.key} as="li" delay={i * 0.06} className={`sv-item ${isOpen ? 'is-open' : ''}`}>
                  <div className="sv-item-in" onMouseEnter={() => setOpen(i)}>
                    <button
                      type="button"
                      className="sv-item-head"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      onFocus={() => setOpen(i)}
                    >
                      <span className="sv-row-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="sv-row-title">{sv.title}</span>
                      <span className="sv-row-tag">{sv.tag}</span>
                      <span className="sv-row-arrow" aria-hidden="true">↗</span>
                    </button>
                    <div className="sv-panel">
                      <div className="sv-panel-clip">
                        <div className="sv-feature">
                          <div className="sv-feature-text">
                            <p className="sv-lead">{sv.short}</p>
                            <p className="sv-desc">{sv.description}</p>
                            <ul className="sv-points">
                              {sv.points.map((pt) => (
                                <li key={pt}>{pt}</li>
                              ))}
                            </ul>
                            <div className="sv-tools">
                              {sv.tools.map((t) => (
                                <span key={t}>{t}</span>
                              ))}
                            </div>
                            {sv.to ? (
                              <Link to={sv.to} className="sv-link" tabIndex={isOpen ? 0 : -1}>
                                {sv.cta} <i aria-hidden="true">↗</i>
                              </Link>
                            ) : (
                              <button type="button" className="sv-link" onClick={goContact} tabIndex={isOpen ? 0 : -1}>
                                {sv.cta} <i aria-hidden="true">↗</i>
                              </button>
                            )}
                          </div>
                          <div className="sv-feature-visual" aria-hidden="true">
                            <Illustration
                              k={sv.key}
                              devImage={devImage}
                              designImages={designImages}
                              brandImages={brandImages}
                              brandName={brandName}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ---------- Méthode : fond clair, dégradé avant et après ---------- */}
      <div className="pj-top pc-skills sv-steps-band" ref={stepsRef}>
        <div className="dev-motifs" aria-hidden="true">
          <i className="dm-r" />
          <i className="dm-l" />
        </div>
        <SkyClouds targetRef={stepsRef} variant="dev-clouds" offset={['start end', 'start 15%']} />
        <section className="wrap pc-inner">
          <Reveal>
            <div className="pj-head">
              <span className="dev-eyebrow">Méthode</span>
              <h2 className="pj-title">Comment je travaille</h2>
            </div>
          </Reveal>
          <ol className="sv-steps">
            {STEPS.map((st, i) => (
              <Reveal key={st.title} delay={i * 0.08} as="li" className="sv-step">
                <span className="sv-step-n">{i + 1}</span>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </Reveal>
            ))}
          </ol>
        </section>
        <SkyClouds targetRef={stepsRef} variant="dev-clouds-b" offset={['end end', 'end 35%']} />
      </div>

      <div className="cb-wrap" id="contact">
        <ContactBand />
      </div>
    </main>
  )
}

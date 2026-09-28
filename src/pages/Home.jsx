import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useProjects } from '../lib/useProjects'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'
import ProjectShots from '../components/ProjectShots'

function PosterCoverflow({ items }) {
  const [index, setIndex] = useState(0)

  if (!items.length) return null

  function go(step) {
    setIndex((i) => (i + step + items.length) % items.length)
  }

  return (
    <div className="coverflow">
      <div className="coverflow-track">
        {items.map((item, i) => {
          let offset = i - index
          if (offset > items.length / 2) offset -= items.length
          if (offset < -items.length / 2) offset += items.length
          if (Math.abs(offset) > 2) return null
          const isActive = offset === 0

          return (
            <motion.div
              key={item.id}
              className={`coverflow-item ${isActive ? 'is-active' : ''}`}
              animate={{
                x: offset * 280,
                scale: isActive ? 1 : 0.82 - Math.abs(offset) * 0.06,
                opacity: 1 - Math.abs(offset) * 0.3,
                zIndex: 10 - Math.abs(offset),
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => !isActive && setIndex(i)}
            >
              {item.image ? (
                <img src={item.image} alt={item.title} />
              ) : (
                <span className="hero-photo-placeholder">Affiche à venir</span>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="coverflow-nav">
        <button
          className="book-nav"
          onClick={() => go(-1)}
          aria-label="Affiche précédente"
          disabled={items.length < 2}
        >
          ‹
        </button>
        <button
          className="book-nav"
          onClick={() => go(1)}
          aria-label="Affiche suivante"
          disabled={items.length < 2}
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const { projects } = useProjects()
  const featured = projects.slice(0, 5)
  const devFeatured = projects.filter((p) => p.category === 'dev').slice(0, 4)
  const designFeatured = projects.filter((p) => p.category === 'design')

  function handleSpotlight(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const [heroPhoto, setHeroPhoto] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase
      .from('settings')
      .select('hero_image')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => {
        if (!error && data?.hero_image) setHeroPhoto(data.hero_image)
      })
  }, [])

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const nameOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const photoOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const photoRotate = useTransform(scrollYProgress, [0, 1], [0, -14])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 0.82])
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const leftOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const leftX = useTransform(scrollYProgress, [0, 0.8], [0, -80])
  const rightOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const rightX = useTransform(scrollYProgress, [0, 0.8], [0, 80])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 70])
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  const NAME_PART_1 = 'Adja Aïcha'
  const NAME_PART_2 = ' Diarra'
  const fullName = NAME_PART_1 + NAME_PART_2

  const nameContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.035, delayChildren: 0.15 } },
  }
  const nameLetter = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <main>
      <div className="hero-v2-wrap" ref={heroRef}>
        <section className="hero-v2 hero-v2-sticky">
          <motion.div className="hero-bg-glow" style={{ y: glowY, scale: glowScale }} />

          <motion.div
            className="hero-name"
            style={{ opacity: nameOpacity }}
            variants={nameContainer}
            initial="hidden"
            animate="visible"
          >
            {fullName.split('').map((char, i) => {
              const inPart2 = i >= NAME_PART_1.length
              return (
                <motion.span
                  key={i}
                  variants={nameLetter}
                  className={inPart2 ? 'hero-name-b' : 'hero-name-a'}
                  style={{ display: 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              )
            })}
          </motion.div>

          <div className="hero-photo-wrap">
            <motion.div
              style={{ opacity: photoOpacity, rotate: photoRotate, scale: photoScale, y: photoY }}
            >
              {heroPhoto ? (
                <img src={heroPhoto} alt="Aïcha" className="hero-photo" />
              ) : (
                <span className="hero-photo-placeholder">
                  Ta photo ici (à ajouter depuis /admin)
                </span>
              )}
            </motion.div>
          </div>

          <div className="hero-columns wrap">
            <motion.div className="hero-col left" style={{ opacity: leftOpacity, x: leftX }}>
              <span className="hero-label">Développeuse full-stack</span>
              <p className="script">Des idées qui codent.</p>
            </motion.div>

            <motion.div className="hero-col right" style={{ opacity: rightOpacity, x: rightX }}>
              <span className="hero-label">Infographe</span>
              <p className="hero-copy-text">
                Je construis des produits web et je conçois des identités pour des marques qui
                veulent être comprises d'un coup d'œil.
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      <Marquee items={['Développement web', 'Infographie', 'Identité de marque', 'Direction artistique']} />

      <section className="about-teaser wrap">
        <Reveal>
          <div className="section-head">
            <h2>À propos de moi</h2>
          </div>
        </Reveal>

        <div className="about-teaser-grid">
          <Reveal className="code-card spotlight" onMouseMove={handleSpotlight}>
            <div className="code-card-bar">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <pre className="code-card-body">
              <code>
                <span className="ln">01</span> <span className="code-kw">const</span>{' '}
                <span className="code-var">developer</span> = {'{'}
                {'\n'}
                <span className="ln">02</span> {'  '}
                <span className="code-key">name</span>:{' '}
                <span className="code-str">'Adja Aïcha Diarra'</span>,{'\n'}
                <span className="ln">03</span> {'  '}
                <span className="code-key">role</span>:{' '}
                <span className="code-str">'Développeuse Full-Stack'</span>,{'\n'}
                <span className="ln">04</span> {'  '}
                <span className="code-key">focus</span>:{' '}
                <span className="code-str">'Web & Infographie'</span>,{'\n'}
                <span className="ln">05</span> {'  '}
                <span className="code-key">location</span>:{' '}
                <span className="code-str">"Bouaké, Côte d'Ivoire"</span>,{'\n'}
                <span className="ln">06</span> {'}'}
                <span className="code-card-cursor">&nbsp;</span>
              </code>
            </pre>
          </Reveal>

          <Reveal delay={0.1} className="about-teaser-text">
            <p>
              Je suis Adja Aïcha Diarra, développeuse web Full Stack et passionnée par la
              technologie, le design et la création digitale. Formée en sciences informatiques,
              j'aime transformer des idées et des besoins concrets en solutions numériques
              modernes, utiles et intuitives.
            </p>
            <p>
              Curieuse, créative et en constante évolution, je développe mes compétences en
              développement web, conception d'interfaces et gestion de bases de données. Mon
              objectif est de concevoir des projets qui allient technologie, créativité et
              impact, tout en continuant à apprendre et à relever de nouveaux défis.
            </p>
            <p className="about-teaser-tagline">Créer. Apprendre. Innover. Donner vie aux idées.</p>

            <Link to="/parcours" className="btn btn-line">
              CV bientôt disponible ↓
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="teaser wrap">
        <Reveal>
          <div className="section-head">
            <h2>Projets — Développement</h2>
            <Link to="/projets" className="eyebrow">
              Voir tous les projets →
            </Link>
          </div>
        </Reveal>
        <div className="mock-grid">
          {devFeatured.map((p, i) => {
            const CardLink = p.link ? 'a' : 'div'
            const linkProps = p.link
              ? { href: p.link, target: '_blank', rel: 'noreferrer' }
              : {}
            return (
              <Reveal
                delay={i * 0.08}
                key={p.id}
                as="article"
                className="project-mock spotlight"
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
                    <ProjectShots images={p.images} fallback={p.image} alt={p.title} />
                  </div>
                  <div className="project-mock-body">
                    <div className="stack-row">
                      {(p.stack || []).map((s) => (
                        <span className="pill" key={s}>
                          {s}
                        </span>
                      ))}
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                  </div>
                </CardLink>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="teaser wrap">
        <Reveal>
          <div className="section-head">
            <h2>Projets — Infographie</h2>
            <Link to="/projets" className="eyebrow">
              Voir toute la galerie →
            </Link>
          </div>
        </Reveal>
        <PosterCoverflow items={designFeatured} />
      </section>

      <section className="stats wrap">
        <Reveal>
          <div className="stat">
            <h3>05+</h3>
            <p>projets construits de bout en bout, du code à l'interface</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="stat">
            <h3>02</h3>
            <p>domaines maîtrisés : développement et infographie</p>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="stat">
            <h3>L3</h3>
            <p>en informatique, tout en dirigeant Athar</p>
          </div>
        </Reveal>
      </section>

      <section className="pull-quote wrap">
        <Reveal>
          <p>
            Le code donne vie aux idées. <em>Le design leur donne un sens.</em>
          </p>
        </Reveal>
      </section>

      <Reveal as="section" className="split">
        <div>
          <h3>Compétences &amp; outils</h3>
          <div className="palette">
            <div className="swatch" style={{ background: '#1c0a0d' }}></div>
            <div className="swatch" style={{ background: '#f2a58e' }}></div>
            <div className="swatch" style={{ background: '#d97a6c' }}></div>
            <div className="swatch" style={{ background: '#f7ece2' }}></div>
            <div className="swatch" style={{ background: '#0f0607' }}></div>
          </div>
          <div className="pill-row">
            <span className="pill">React</span>
            <span className="pill">Supabase</span>
            <span className="pill">PHP / Laravel</span>
            <span className="pill">JavaScript</span>
            <span className="pill">Identité de marque</span>
            <span className="pill">Affiches</span>
          </div>
        </div>
        <div>
          <h3>Ma méthode</h3>
          <ol className="steps">
            <li>
              <span className="n">01</span>
              <div>
                <h4>Comprendre</h4>
                <p>Le besoin réel avant la première ligne de code ou le premier croquis.</p>
              </div>
            </li>
            <li>
              <span className="n">02</span>
              <div>
                <h4>Concevoir</h4>
                <p>Structure, contenu, direction visuelle — posés avant l'exécution.</p>
              </div>
            </li>
            <li>
              <span className="n">03</span>
              <div>
                <h4>Construire</h4>
                <p>Code propre côté dev, fichiers soignés côté design.</p>
              </div>
            </li>
            <li>
              <span className="n">04</span>
              <div>
                <h4>Livrer</h4>
                <p>Un résultat testé, présenté et prêt à être utilisé.</p>
              </div>
            </li>
          </ol>
        </div>
      </Reveal>

      <section className="wrap" style={{ padding: '20px 0 80px' }}>
        <Reveal className="cta-band">
          <h2>Discutons de votre projet</h2>
          <div className="cta-contact">
            <Link to="/contact">Envoyer un message →</Link>
          </div>
        </Reveal>
      </section>
    </main>
  )
}

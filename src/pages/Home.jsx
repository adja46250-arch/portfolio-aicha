import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useProjects } from '../lib/useProjects'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import Reveal from '../components/Reveal'
import { SocialIcons } from '../components/SocialIcons'
import Marquee from '../components/Marquee'
import ProjectShots from '../components/ProjectShots'
import Testimonials from '../components/Testimonials'
import ContactBand from '../components/ContactBand'

// Quelques étoiles dorées qui scintillent doucement le long de la page (positions fixes, générées une fois)
const SPARKLES = (() => {
  let seed = 7
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
  return Array.from({ length: 28 }, (_, i) => ({
    left: 4 + rnd() * 92,
    top: 3 + (i / 28) * 94 + rnd() * 3,
    size: 0.8 + rnd() * 1.0,
    delay: -rnd() * 6,
    dur: 3.5 + rnd() * 4,
    kind: i % 5 === 0 ? 'red' : 'gold',
  }))
})()

function Sparkles() {
  return (
    <div className="sparkles" aria-hidden="true">
      {SPARKLES.map((st, i) => (
        <i
          key={i}
          className={`sparkle sparkle-${st.kind}`}
          style={{ left: `${st.left}%`, top: `${st.top}%`, fontSize: `${st.size}rem`, animationDelay: `${st.delay}s`, animationDuration: `${st.dur}s` }}
        >
          ✦
        </i>
      ))}
    </div>
  )
}

// Nom géant en filigrane derrière la photo : s'écrit lettre par lettre, curseur qui clignote
// ⚠️ Tes liens (section « À propos ») — un lien vide = le bouton n'apparaît pas
const LINKEDIN_URL = 'https://www.linkedin.com/in/adja-a%C3%AFcha-diarra-b68701386/'
const GITHUB_URL = 'https://github.com/adja46250-arch'
const EMAIL = 'adja46250@gmail.com'

// Nuages qui se forment quand on arrive sur « À propos » (liés au défilement)
const CLOUDS = [
  { cls: 'c1', x: -120 }, { cls: 'c2', x: 140 }, { cls: 'c3', x: -80 },
  { cls: 'c4', x: 100 }, { cls: 'c5', x: 0 },
]
function ApClouds({ targetRef, variant = '', offset = ['start end', 'start 25%'] }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset })
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [0, 1, 1])
  const scale = useTransform(scrollYProgress, [0, 1], [0.55, 1.05])
  const y = useTransform(scrollYProgress, [0, 1], [70, 0])
  return (
    <div className={`ap-clouds ${variant}`} aria-hidden="true">
      {CLOUDS.map((c) => (
        <motion.i key={c.cls} className={`ap-cloud ${c.cls}`} style={{ opacity, scale, y }} />
      ))}
    </div>
  )
}

const WM_LINES = ['ADJA AÏCHA', 'DIARRA']

function HeroWatermark() {
  const total = WM_LINES.join('').length
  const [n, setN] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setN(total)
      return
    }
    let timer
    let i = 0
    let typing = true
    // ---- Réglages de vitesse (en millisecondes) ----
    const TYPE_MS = 240        // délai entre deux lettres (plus grand = plus lent)
    const HOLD_MS = 7000       // le nom complet reste affiché
    const ERASE_MS = 80        // vitesse d'effacement
    const RESTART_MS = 1800    // pause avant de recommencer
    const tick = () => {
      if (typing) {
        i += 1
        setN(i)
        if (i >= total) {
          typing = false
          timer = setTimeout(tick, HOLD_MS)
          return
        }
        timer = setTimeout(tick, TYPE_MS)
      } else {
        i -= 1
        setN(Math.max(i, 0))
        if (i <= 0) {
          typing = true
          timer = setTimeout(tick, RESTART_MS)
          return
        }
        timer = setTimeout(tick, ERASE_MS)
      }
    }
    timer = setTimeout(tick, 1200)
    return () => clearTimeout(timer)
  }, [total])

  let idx = 0
  return (
    <div className="hero-watermark" aria-hidden="true">
      {n === 0 && <i className="wm-cursor" />}
      {WM_LINES.map((line, li) => (
        <div className="wm-line" key={li}>
          {line.split('').map((ch, ci) => {
            const my = idx++
            return (
              <span key={ci}>
                <span className={`wm-ch${my < n ? ' on' : ''}`}>{ch === ' ' ? '\u00A0' : ch}</span>
                {my === n - 1 && <i className="wm-cursor" />}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}

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

  const [aboutPhoto, setAboutPhoto] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase
      .from('settings')
      .select('home_about_image')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => {
        if (!error && data?.home_about_image) setAboutPhoto(data.home_about_image)
      })
  }, [])

  const apRef = useRef(null)
  const devRef = useRef(null)
  const statsRef = useRef(null)
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

  const NAME_PART_1 = 'Adja  Aïcha'
  const NAME_PART_2 = '  Diarra'
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
    <main className="home-main">
      <Sparkles />
      <div className="hero-v2-wrap" ref={heroRef}>
        <section className="hero-v2 hero-v2-sticky">
          <motion.div className="hero-bg-glow" style={{ y: glowY, scale: glowScale }} />
          <div className="hero-motifs" aria-hidden="true">
            <i className="motif-l" />
            <i className="motif-r" />
          </div>
          <motion.div className="hero-watermark-wrap" style={{ opacity: nameOpacity }}>
            <HeroWatermark />
          </motion.div>

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

      <section className="ap" ref={apRef}>
        <ApClouds targetRef={apRef} />
        <div className="ap-motifs" aria-hidden="true" />
        <div className="ap-inner wrap">
          <Reveal className="ap-photo">
            <div className="ap-insta">
              <div className="ap-insta-head">
                <span className="ap-insta-avatar">A</span>
                <span>Adja Aïcha</span>
                <span className="ap-insta-dots">•••</span>
              </div>
              <div className="ap-insta-window">
                {aboutPhoto && <img src={aboutPhoto} alt="Adja Aïcha Diarra" />}
              </div>
              <div className="ap-insta-foot">
                <div className="ap-insta-icons">
                  <svg className="heart" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.5 3 5 6.4 5c2 0 3.7 1.1 5.6 3.3C13.9 6.1 15.6 5 17.6 5 21 5 22.8 8.5 21.5 11.7 19.5 16.4 12 21 12 21Z" /></svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20.5 12a8.5 8.5 0 1 1-3.6-6.950L21 4l-1 4.300A8.4 8.4 0 0 1 20.5 12Z" strokeLinejoin="round" /></svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 3 10 14M21 3l-6.5 18-4-7-7-4L21 3Z" strokeLinejoin="round" /></svg>
                  <svg className="save" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 3.500h12v17l-6-4.5-6 4.500v-17Z" strokeLinejoin="round" /></svg>
                </div>
                <p><strong>Adja Aïcha Diarra</strong> Créer. Apprendre. Innover. <span style={{ color: '#2f6fb5' }}>#portfolio</span></p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="ap-text">
            <span className="ap-eyebrow">À propos</span>
            <h2 className="ap-title">
              Je donne vie à vos idées, <em>en code et en images.</em>
            </h2>

            <p>
              Je suis Adja Aïcha Diarra, développeuse web Full Stack et passionnée par la
              technologie, le design et la création digitale. Formée en sciences informatiques,
              j'aime transformer des idées et des besoins concrets en solutions numériques
              modernes, utiles et intuitives.
            </p>
            <p>
              Curieuse, créative et en constante évolution, je développe mes compétences en
              développement web, conception d'interfaces et gestion de bases de données.
            </p>

            <div className="ap-facts">
              <div className="ap-fact">
                <span className="ap-fact-icon">{SocialIcons.pin}</span>
                <div>
                  <small>Basée en</small>
                  <strong>Côte d'Ivoire</strong>
                </div>
              </div>
              <div className="ap-fact">
                <span className="ap-fact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z" strokeLinejoin="round" />
                    <path d="M6.5 11.8V16c0 1.2 2.5 2.5 5.5 2.5s5.5-1.3 5.5-2.5v-4.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <small>Formation</small>
                  <strong>Licence en sciences informatiques</strong>
                </div>
              </div>
            </div>

            <div className="ap-links">
              {LINKEDIN_URL && (
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                  {SocialIcons.linkedin}
                  <span>LinkedIn</span>
                </a>
              )}
              {GITHUB_URL && (
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  {SocialIcons.github}
                  <span>GitHub</span>
                </a>
              )}
              {EMAIL && (
                <a href={`mailto:${EMAIL}`}>
                  {SocialIcons.email}
                  <span>{EMAIL}</span>
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="dev-band" ref={devRef}>
        <div className="dev-motifs" aria-hidden="true">
          <i className="dm-r" />
          <i className="dm-l" />
        </div>
        <ApClouds targetRef={devRef} variant="dev-clouds" offset={['start end', 'start 15%']} />
      <section className="teaser wrap dev-sec">
        <Reveal>
          <div className="dev-head">
            <div>
              <span className="dev-eyebrow">Projets développement</span>
              <h2 className="dev-title">
                Des idées qui deviennent <em>de vraies applications.</em>
              </h2>
              <p className="dev-lead">
                Je conçois des applications web complètes, du premier croquis à la mise en ligne :
                l’interface, la base de données et la logique, pensées pour être simples et utiles
                au quotidien.
              </p>
            </div>
            <Link to="/projets" className="dev-all">
              Voir tous les projets <span aria-hidden="true">→</span>
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
                delay={(i % 2) * 0.12}
                y={90}
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
        <ApClouds targetRef={devRef} variant="dev-clouds-b" offset={['end end', 'end 35%']} />
      </div>

      <div className="design-band">
        <div className="design-motifs" aria-hidden="true">
          <i className="dm-r" />
          <i className="dm-l" />
        </div>
      <section className="teaser wrap design-sec">
        <Reveal>
          <div className="dev-head">
            <div>
              <span className="dev-eyebrow">Projets infographie</span>
              <h2 className="dev-title">
                Quand l’art rencontre <em>le design.</em>
              </h2>
              <p className="dev-lead">
                Affiches, identités visuelles et illustrations : je donne une forme à vos idées,
                avec des couleurs, des lettres et des images qui se remarquent.
              </p>
            </div>
            <Link to="/projets" className="dev-all">
              Voir toute la galerie <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
        <PosterCoverflow items={designFeatured} />
      </section>
      </div>

      <div className="dev-band stats-band" ref={statsRef}>
        <div className="dev-motifs" aria-hidden="true">
          <i className="dm-r" />
          <i className="dm-l" />
        </div>
        <ApClouds targetRef={statsRef} variant="dev-clouds" offset={['start end', 'start 15%']} />
      <Testimonials />
        <ApClouds targetRef={statsRef} variant="dev-clouds-b" offset={['end end', 'end 35%']} />
      </div>

      <div className="cb-wrap">
        <ContactBand />
      </div>
    </main>
  )
}

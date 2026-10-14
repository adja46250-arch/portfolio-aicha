import { Link } from 'react-router-dom'
import { CONTACT } from '../data/contact'

function prettyPhone(n) {
  const d = String(n || '').replace(/\D/g, '')
  if (!d) return ''
  if (d.startsWith('225') && d.length === 13) return `+225 ${d.slice(3).match(/.{2}/g).join(' ')}`
  return `+${d}`
}

export default function Footer() {
  const { whatsapp, email, linkedin, github } = CONTACT
  const year = new Date().getFullYear()

  return (
    <footer className="site ft">
      <div className="ft-grid wrap">
        <div className="ft-brand">
          {/* Quand ton logo sera prêt, remplace ce bloc par <img src="/logo.png" alt="Adja Aïcha Diarra" /> */}
          <Link to="/" className="ft-logo" aria-label="Accueil">
            <small>Diarra</small>
            <span>Adja Aïcha</span>
          </Link>
          <p>
            Développeuse full-stack et infographe. Je crée des sites, des applications et des
            visuels qui allient technologie, créativité et impact.
          </p>
          <p className="ft-script">Des idées qui codent.</p>
        </div>

        <nav className="ft-col" aria-label="Le site">
          <h3>Le site</h3>
          <Link to="/">Accueil</Link>
          <Link to="/projets">Projets</Link>
          <Link to="/services">Services</Link>
          <Link to="/parcours">Parcours</Link>
        </nav>

        <div className="ft-col">
          <h3>Domaines</h3>
          <Link to="/projets">Développement web</Link>
          <Link to="/projets">Infographie</Link>
          <Link to="/projets">Identité de marque</Link>
          <Link to="/projets">Direction artistique</Link>
        </div>

        <div className="ft-col">
          <h3>Contact</h3>
          {whatsapp && (
            <a className="ft-phone" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
              {prettyPhone(whatsapp)}
            </a>
          )}
          {email && <a href={`mailto:${email}`}>{email}</a>}
          <span>Côte d'Ivoire</span>
          <span className="ft-social">
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
          </span>
        </div>
      </div>

      <div className="ft-bottom wrap">
        <span>© {year} Adja Aïcha Diarra. Tous droits réservés.</span>
        <button
          type="button"
          className="ft-top"
          aria-label="Retour en haut de la page"
          title="Haut de page"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  )
}

import Reveal from './Reveal'
import { CONTACT, WHATSAPP_TEXT } from '../data/contact'

// Affiche +225 07 07 07 07 07 à partir de 2250707070707
function prettyPhone(n) {
  const d = String(n || '').replace(/\D/g, '')
  if (!d) return ''
  if (d.startsWith('225') && d.length === 13) {
    return `+225 ${d.slice(3).match(/.{2}/g).join(' ')}`
  }
  return `+${d}`
}

export default function ContactBand() {
  const { whatsapp, email, linkedin, github } = CONTACT
  const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(WHATSAPP_TEXT)}`

  return (
    <section className="cb">
      <div className="cb-motifs" aria-hidden="true">
        <i className="dm-r" />
        <i className="dm-l" />
      </div>

      <Reveal className="cb-inner">
        <span className="cb-eyebrow">Disponible pour de nouveaux projets</span>
        <h2 className="cb-title">
          Un site, une application, une affiche ? <em>Parlons-en.</em>
        </h2>

        <a className="cb-btn" href={waUrl} target="_blank" rel="noopener noreferrer">
            <span>Écrire sur WhatsApp</span>
          </a>

        <div className="cb-info">
          {whatsapp && (
            <div>
              <small>Appel &amp; WhatsApp</small>
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                {prettyPhone(whatsapp)}
              </a>
            </div>
          )}
          {email && (
            <div>
              <small>E-mail</small>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          )}
          {(linkedin || github) && (
            <div>
              <small>Réseaux</small>
              <span className="cb-links">
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
          )}
        </div>
      </Reveal>
    </section>
  )
}

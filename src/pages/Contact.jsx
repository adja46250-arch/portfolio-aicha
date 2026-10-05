import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import Reveal from '../components/Reveal'
import { SocialIcons } from '../components/SocialIcons'

// ---- Tes coordonnées : modifie ici ------------------------------------
// Numéro WhatsApp avec l'indicatif du pays, sans le "+" (ex. "225 07 00 00 00 00").
// Tant que ce champ est vide, la carte WhatsApp ne s'affiche pas.
const WHATSAPP_NUMBER = '225 0142396729'
const WHATSAPP_MESSAGE = "Bonjour Aïcha, j'ai vu ton portfolio et j'aimerais discuter d'un projet."

const EMAIL = 'adja46250@gmail.com'

// Clé publique Web3Forms : chaque message arrive dans ta boîte mail.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || ''

// Message pré-rempli quand on arrive depuis « Demander mon CV »
const CV_MESSAGE =
  "Bonjour Aïcha,\n\nJe souhaiterais recevoir votre CV. Merci d'avance.\n\nCordialement,"

// Un bouton ne s'affiche que si son lien n'est pas vide : laisse '' pour le masquer.
const SOCIAL_LINKS = [
  { key: 'linkedin', label: 'LinkedIn', href: 'www.linkedin.com/in/adja-aïcha-diarra-b68701386' },
  { key: 'github', label: 'GitHub', href: 'https://github.com/adja46250-arch' },
  { key: 'tiktok', label: 'TikTok', href: '' },
  { key: 'facebook', label: 'Facebook', href: '' },
]

export default function Contact() {
const [params] = useSearchParams()
const [form, setForm] = useState({
  name: '',
  email: '',
  message: params.get('objet') === 'cv' ? CV_MESSAGE : '',
})
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
  e.preventDefault()

  if (!isSupabaseConfigured && !WEB3FORMS_KEY) {
    setStatus('error')
    return
  }

  setStatus('sending')

  // 1) Archive dans Supabase (visible dans l'admin)
  const saved = isSupabaseConfigured
    ? await supabase
        .from('messages')
        .insert({ name: form.name, email: form.email, message: form.message })
        .then(({ error }) => {
          if (error) console.error(error.message)
          return !error
        })
    : false

  // 2) Notification par e-mail dans ta boîte (Web3Forms)
  let mailed = false
  if (WEB3FORMS_KEY) {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio : message de ${form.name}`,
          from_name: 'Portfolio Aïcha',
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      })
      const data = await res.json()
      mailed = Boolean(data.success)
    } catch (err) {
      console.error(err)
    }
  }

  if (saved || mailed) {
    setStatus('success')
    setForm({ name: '', email: '', message: '' })
  } else {
    setStatus('error')
  }
}

  const links = SOCIAL_LINKS.filter((s) => s.href)
  const waDigits = WHATSAPP_NUMBER.replace(/\D/g, '')
  const waHref = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    : ''

  return (
    <main>
      <section className="page-hero wrap">
        <p className="eyebrow">Travaillons ensemble</p>
        <h1 className="anton">
          Me <span className="rose">contacter</span>
        </h1>
        <p>
          Un projet en tête, une question sur une prestation de développement ou d'infographie ?
          Écris-moi.
        </p>
      </section>

      <section className="contact-grid wrap">
        {waHref && (
          <Reveal as="div" className="ct-area-wa">
            <a href={waHref} target="_blank" rel="noreferrer" className="wa-card">
              <span className="wa-icon">{SocialIcons.whatsapp}</span>
              <span className="wa-text">
                <strong>Écris-moi sur WhatsApp</strong>
                <small>Le moyen le plus rapide de me joindre</small>
              </span>
              <span className="wa-arrow">{SocialIcons.arrow}</span>
            </a>
          </Reveal>
        )}

        <form className="contact-form contact-form-card ct-area-form" onSubmit={handleSubmit}>
          <h3 className="ct-title">Envoyer un message</h3>
          <div className="field">
            <label htmlFor="name">Nom</label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              required
              rows={6}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
            {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
          </button>

          {status === 'success' && (
            <p className="form-status success">Message envoyé, merci — je réponds vite.</p>
          )}
          {status === 'error' && (
            <p className="form-status error">
              {isSupabaseConfigured
                ? "Une erreur s'est produite, réessaie dans un instant."
                : "Le formulaire n'est pas encore branché à Supabase (voir .env.example)."}
            </p>
          )}
        </form>

        <Reveal as="div" className="ct-area-info" delay={0.1}>
          <div className="ct-info">
            <a href={`mailto:${EMAIL}`} className="ct-row">
              <span className="ct-row-icon">{SocialIcons.email}</span>
              <span className="ct-row-text">
                <small>Email</small>
                <strong>{EMAIL}</strong>
              </span>
              <span className="ct-row-arrow">{SocialIcons.arrow}</span>
            </a>

            <div className="ct-row ct-row-static">
              <span className="ct-row-icon">{SocialIcons.pin}</span>
              <span className="ct-row-text">
                <small>Basée à</small>
                <strong>Bouaké, Côte d'Ivoire</strong>
              </span>
            </div>

            {links.length > 0 && (
              <div className="ct-socials">
                <span className="ct-socials-title">Me retrouver aussi</span>
                <div className="ct-social-row">
                  {links.map((l) => (
                    <a
                      key={l.key}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="ct-social"
                      aria-label={l.label}
                      title={l.label}
                    >
                      {SocialIcons[l.key]}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </section>
    </main>
  )
}

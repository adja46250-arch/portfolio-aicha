import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import Reveal from '../components/Reveal'
import { SocialIcons } from '../components/SocialIcons'

// Mets tes vrais liens ici dès que tu les as. Un badge ne s'affiche que si
// son lien n'est pas vide — pas besoin de retirer une ligne, laisse-la à ''.
const SOCIAL_LINKS = [
  { key: 'email', label: 'Email', href: 'mailto:hello@aicha.com' },
  { key: 'linkedin', label: 'LinkedIn', href: '' },
  { key: 'github', label: 'GitHub', href: '' },
  { key: 'tiktok', label: 'TikTok', href: '' },
  { key: 'facebook', label: 'Facebook', href: '' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!isSupabaseConfigured) {
      setStatus('error')
      return
    }

    setStatus('sending')
    const { error } = await supabase.from('messages').insert({
      name: form.name,
      email: form.email,
      message: form.message,
    })

    if (error) {
      console.error(error.message)
      setStatus('error')
    } else {
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    }
  }

  const links = SOCIAL_LINKS.filter((s) => s.href)

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
        <form className="contact-form contact-form-card" onSubmit={handleSubmit}>
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

        <Reveal as="div" className="contact-side" delay={0.1}>
          <div className="contact-card">
            <h3>Autres façons de me joindre</h3>
            <p className="contact-location">
              <span aria-hidden="true"></span> Bouaké, Côte d'Ivoire
            </p>

            {links.length > 0 ? (
              <div className="social-grid">
                {links.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target={s.key === 'email' ? undefined : '_blank'}
                    rel={s.key === 'email' ? undefined : 'noreferrer'}
                    className="social-link"
                  >
                    <span className="social-icon">{SocialIcons[s.key]}</span>
                    {s.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="contact-hint">Mes liens arrivent bientôt.</p>
            )}
          </div>
        </Reveal>
      </section>
    </main>
  )
}

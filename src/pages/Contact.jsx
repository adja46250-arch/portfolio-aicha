import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

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
        <form className="contact-form" onSubmit={handleSubmit}>
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

        <div>
          <h3 className="eyebrow" style={{ marginBottom: 14 }}>
            Autres façons de me joindre
          </h3>
          <p style={{ color: 'var(--muted)', marginBottom: 10 }}>Bouaké, Côte d'Ivoire</p>
          <div className="interests-row">
            <a href="mailto:hello@aicha.com" className="pill">
              Email
            </a>
            <a href="#" className="pill">
              LinkedIn
            </a>
            <a href="#" className="pill">
              GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

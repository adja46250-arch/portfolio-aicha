import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import Reveal from './Reveal'

const EMPTY = { name: '', role: '', title: '', rating: 5, message: '', website: '' }
const AUTO_MS = 6500

function Stars({ value }) {
  return (
    <span className="testi-stars" aria-label={`${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? 'on' : ''}>
          ★
        </span>
      ))}
    </span>
  )
}

// Témoignages validés (carrousel) + fenêtre "Témoigner" pour en proposer un.
// Un avis envoyé reste "en attente" tant qu'il n'est pas publié depuis l'admin.
export default function Testimonials() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [hoverRating, setHoverRating] = useState(0)
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'
  const [perPage, setPerPage] = useState(2)
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase
      .from('testimonials')
      .select('id, name, role, title, rating, message')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setItems(data)
      })
  }, [])

  useEffect(() => {
    function onResize() {
      setPerPage(window.innerWidth < 820 ? 1 : 2)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const pages = Math.max(1, Math.ceil(items.length / perPage))
  const current = Math.min(page, pages - 1)
  const visible = items.slice(current * perPage, current * perPage + perPage)

  useEffect(() => {
    if (pages < 2 || paused) return
    const id = setInterval(() => setPage((p) => (Math.min(p, pages - 1) + 1) % pages), AUTO_MS)
    return () => clearInterval(id)
  }, [pages, paused])

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function openForm() {
    setStatus(null)
    setForm(EMPTY)
    setOpen(true)
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // Champ piège invisible : un robot le remplit, une personne non.
    if (form.website) {
      setStatus('success')
      return
    }
    if (!isSupabaseConfigured) {
      setStatus('error')
      return
    }
    setStatus('sending')
    const { error } = await supabase.from('testimonials').insert({
      name: form.name.trim(),
      role: form.role.trim() || null,
      title: form.title.trim() || null,
      rating: form.rating,
      message: form.message.trim(),
    })
    if (error) {
      console.error(error.message)
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  return (
    <section className="testimonials wrap">
      <Reveal as="div" className="testi-head">
        <span className="testi-badge">
          <i /> Témoignages
        </span>
        <h2>
          Ils en parlent : <span>la confiance</span>
          <br />
          de ceux qui m'ont vue travailler
        </h2>
      </Reveal>

      {items.length > 0 ? (
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current + '-' + perPage}
              className="testi-grid"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {visible.map((t) => (
                <figure className="testi-card" key={t.id}>
                  <div className="testi-top">
                    <Stars value={t.rating || 5} />
                    <span className="testi-score">{Number(t.rating || 5).toFixed(1)}</span>
                  </div>
                  {t.title && <h3>{t.title}</h3>}
                  <blockquote>{t.message}</blockquote>
                  <figcaption className="testi-author">
                    <span className="testi-avatar">{t.name.charAt(0).toUpperCase()}</span>
                    <span className="testi-who">
                      <strong>{t.name}</strong>
                      {t.role && <span>{t.role}</span>}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </motion.div>
          </AnimatePresence>

          {pages > 1 && (
            <div className="testi-dots">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Page ${i + 1}`}
                  className={i === current ? 'active' : ''}
                  onClick={() => setPage(i)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="testi-empty">Les premiers témoignages arrivent bientôt.</p>
      )}

      <div className="testi-cta">
        <button type="button" className="testi-btn" onClick={openForm}>
          <span aria-hidden="true">✎</span> Témoigner
        </button>
        <p>Ton avis sera publié après validation.</p>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="testi-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="testi-modal"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="testi-close"
                aria-label="Fermer"
                onClick={() => setOpen(false)}
              >
                ×
              </button>

              {status === 'success' ? (
                <div className="testi-success">
                  <span className="testi-check">✓</span>
                  <h3>Merci pour ton témoignage !</h3>
                  <p>Il apparaîtra sur le site dès que je l'aurai validé.</p>
                  <button type="button" className="testi-submit" onClick={() => setOpen(false)}>
                    Fermer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="testi-modal-title">Partage ton expérience</h3>
                  <p className="testi-modal-sub">
                    Quelques mots sur notre collaboration suffisent.
                  </p>

                  <div className="testi-rating">
                    <span>Ta note</span>
                    <div onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                          className={n <= (hoverRating || form.rating) ? 'on' : ''}
                          onMouseEnter={() => setHoverRating(n)}
                          onClick={() => update('rating', n)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="testi-row">
                    <label className="testi-field">
                      <span>Ton nom</span>
                      <input
                        required
                        minLength={2}
                        maxLength={100}
                        placeholder="Ex. Fatma Koné"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                      />
                    </label>
                    <label className="testi-field">
                      <span>Ton rôle (optionnel)</span>
                      <input
                        maxLength={100}
                        placeholder="Ex. Directrice d'école"
                        value={form.role}
                        onChange={(e) => update('role', e.target.value)}
                      />
                    </label>
                  </div>

                  <label className="testi-field">
                    <span>Un titre court (optionnel)</span>
                    <input
                      maxLength={80}
                      placeholder="Ex. Un travail soigné et rapide"
                      value={form.title}
                      onChange={(e) => update('title', e.target.value)}
                    />
                  </label>

                  <label className="testi-field">
                    <span>
                      Ton témoignage <em>{form.message.length}/600</em>
                    </span>
                    <textarea
                      required
                      minLength={10}
                      maxLength={600}
                      rows={5}
                      placeholder="Raconte ce que tu as apprécié…"
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                    />
                  </label>

                  <input
                    className="testi-trap"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={form.website}
                    onChange={(e) => update('website', e.target.value)}
                  />

                  <button
                    type="submit"
                    className="testi-submit"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Envoi…' : 'Envoyer mon témoignage'}
                  </button>

                  {status === 'error' && (
                    <p className="testi-error">
                      {isSupabaseConfigured
                        ? "Une erreur s'est produite, réessaie dans un instant."
                        : "Le formulaire n'est pas encore branché à Supabase."}
                    </p>
                  )}
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

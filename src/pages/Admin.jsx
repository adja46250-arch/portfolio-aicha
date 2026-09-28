import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const EMPTY_FORM = {
  id: null,
  title: '',
  category: 'dev',
  status: 'live',
  description: '',
  stack: '',
  link: '',
  image: '',
  images: [],
}

// Nom du bucket Supabase Storage à créer une fois dans le dashboard
// (Storage > New bucket > "project-images", coché "Public bucket").
const IMAGE_BUCKET = 'project-images'

export default function Admin() {
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')

  const [projects, setProjects] = useState([])
  const [messages, setMessages] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [galleryUrlInput, setGalleryUrlInput] = useState('')
  const [savingError, setSavingError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const [heroImage, setHeroImage] = useState('')
  const [heroUploading, setHeroUploading] = useState(false)
  const [heroError, setHeroError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCheckingSession(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCheckingSession(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      loadProjects()
      loadMessages()
      loadHeroImage()
    }
  }, [session])

  async function loadHeroImage() {
    const { data, error } = await supabase
      .from('settings')
      .select('hero_image')
      .eq('id', 1)
      .single()
    if (!error) setHeroImage(data?.hero_image || '')
  }

  async function loadProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error) setProjects(data || [])
  }

  async function loadMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    if (!error) setMessages(data || [])
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    })
    if (error) setLoginError(error.message)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  function editProject(p) {
    setForm({
      id: p.id,
      title: p.title || '',
      category: p.category || 'dev',
      status: p.status || 'live',
      description: p.description || '',
      stack: (p.stack || []).join(', '),
      link: p.link || '',
      image: p.image || '',
      images: p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [],
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError('')

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-')
    const path = `${Date.now()}-${safeName}`

    const { error: uploadErr } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (uploadErr) {
      setUploadError(
        uploadErr.message.includes('Bucket not found')
          ? `Le bucket "${IMAGE_BUCKET}" n'existe pas encore — crée-le dans Supabase (Storage > New bucket, coché "Public").`
          : uploadErr.message
      )
      setUploading(false)
      e.target.value = ''
      return
    }

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
    setForm((f) => ({ ...f, image: data.publicUrl }))
    setUploading(false)
    e.target.value = ''
  }

  async function handleGalleryUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError('')

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-')
    const path = `${Date.now()}-${safeName}`

    const { error: uploadErr } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (uploadErr) {
      setUploadError(
        uploadErr.message.includes('Bucket not found')
          ? `Le bucket "${IMAGE_BUCKET}" n'existe pas encore — crée-le dans Supabase (Storage > New bucket, coché "Public").`
          : uploadErr.message
      )
      setUploading(false)
      e.target.value = ''
      return
    }

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
    setForm((f) => ({ ...f, images: [...f.images, data.publicUrl] }))
    setUploading(false)
    e.target.value = ''
  }

  function addGalleryUrl() {
    const url = galleryUrlInput.trim()
    if (!url) return
    setForm((f) => ({ ...f, images: [...f.images, url] }))
    setGalleryUrlInput('')
  }

  function removeGalleryImage(index) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }))
  }

  async function handleHeroUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setHeroUploading(true)
    setHeroError('')

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-')
    const path = `hero-${Date.now()}-${safeName}`

    const { error: uploadErr } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (uploadErr) {
      setHeroError(
        uploadErr.message.includes('Bucket not found')
          ? `Le bucket "${IMAGE_BUCKET}" n'existe pas encore — crée-le dans Supabase (Storage > New bucket, coché "Public").`
          : uploadErr.message
      )
      setHeroUploading(false)
      e.target.value = ''
      return
    }

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)

    const { error: saveErr } = await supabase
      .from('settings')
      .upsert({ id: 1, hero_image: data.publicUrl })

    if (saveErr) {
      setHeroError(saveErr.message)
      setHeroUploading(false)
      e.target.value = ''
      return
    }

    setHeroImage(data.publicUrl)
    setHeroUploading(false)
    e.target.value = ''
  }

  async function handleSave(e) {
    e.preventDefault()
    setSavingError('')

    const payload = {
      title: form.title,
      category: form.category,
      status: form.status,
      description: form.description,
      stack: form.stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      link: form.link,
      image: form.category === 'dev' ? form.images[0] || '' : form.image,
      images: form.category === 'dev' ? form.images : [],
    }

    const query = form.id
      ? supabase.from('projects').update(payload).eq('id', form.id)
      : supabase.from('projects').insert(payload)

    const { error } = await query
    if (error) {
      setSavingError(error.message)
      return
    }
    setForm(EMPTY_FORM)
    setGalleryUrlInput('')
    loadProjects()
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce projet ?')) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (!error) loadProjects()
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="admin-shell wrap">
        <p>
          Supabase n'est pas encore configuré — remplis <code>.env</code> à partir de{' '}
          <code>.env.example</code> pour activer l'admin.
        </p>
      </main>
    )
  }

  if (checkingSession) {
    return (
      <main className="admin-shell wrap">
        <p>Chargement…</p>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="admin-shell wrap">
        <form className="admin-login" onSubmit={handleLogin}>
          <h1 className="anton" style={{ fontSize: '1.6rem', marginBottom: 10 }}>
            Connexion admin
          </h1>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={loginForm.email}
              onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn btn-solid">
            Se connecter
          </button>
          {loginError && <p className="form-status error">{loginError}</p>}
        </form>
      </main>
    )
  }

  return (
    <main className="admin-shell wrap">
      <div className="section-head">
        <h2>Admin — Projets</h2>
        <button className="btn btn-line" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>

      <div className="admin-form" style={{ gridTemplateColumns: '1fr', marginBottom: 40 }}>
        <div className="field full">
          <label>Ta photo (page d'accueil)</label>
          <input type="file" accept="image/*" onChange={handleHeroUpload} disabled={heroUploading} />
          {heroUploading && <p className="form-status">Envoi en cours…</p>}
          {heroError && <p className="form-status error">{heroError}</p>}
          {heroImage && (
            <div style={{ marginTop: 10 }}>
              <img
                src={heroImage}
                alt="Aperçu"
                style={{ maxWidth: 220, borderRadius: 4, border: '1px solid var(--line)' }}
              />
            </div>
          )}
        </div>
      </div>

      <form className="admin-form" onSubmit={handleSave}>
        <div className="field">
          <label>Titre</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Catégorie</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            <option value="dev">Développement</option>
            <option value="design">Infographie</option>
          </select>
        </div>
        <div className="field">
          <label>Statut</label>
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="live">En ligne</option>
            <option value="wip">En cours</option>
          </select>
        </div>
        <div className="field">
          <label>Lien (optionnel)</label>
          <input
            value={form.link}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
          />
        </div>
        <div className="field full">
          <label>Description</label>
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="field full">
          <label>Stack (séparée par des virgules)</label>
          <input
            value={form.stack}
            onChange={(e) => setForm((f) => ({ ...f, stack: e.target.value }))}
            placeholder="React, Supabase, Tailwind"
          />
        </div>
        {form.category === 'dev' ? (
          <>
            <div className="field full">
              <label>Captures d'écran du site (plusieurs possibles)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleGalleryUpload}
                disabled={uploading}
              />
              {uploading && <p className="form-status">Envoi en cours…</p>}
              {uploadError && <p className="form-status error">{uploadError}</p>}
              {form.images.length > 0 && (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                  {form.images.map((src, i) => (
                    <div key={src + i} style={{ position: 'relative' }}>
                      <img
                        src={src}
                        alt=""
                        style={{
                          maxWidth: 120,
                          maxHeight: 90,
                          objectFit: 'cover',
                          borderRadius: 4,
                          border: '1px solid var(--line)',
                          display: 'block',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        aria-label="Retirer cette image"
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: '#1a1a1a',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 13,
                          lineHeight: '22px',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="field full">
              <label>Ou ajouter une URL d'image directement</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  placeholder="https://..."
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn btn-line" onClick={addGalleryUrl}>
                  Ajouter
                </button>
              </div>
              {form.images.length > 0 && (
                <p className="form-status">
                  {form.images.length} image{form.images.length > 1 ? 's' : ''} — la première
                  s'affiche par défaut, les suivantes défilent au survol de la carte.
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="field full">
              <label>Photo / affiche</label>
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
              {uploading && <p className="form-status">Envoi en cours…</p>}
              {uploadError && <p className="form-status error">{uploadError}</p>}
              {form.image && (
                <div style={{ marginTop: 10 }}>
                  <img
                    src={form.image}
                    alt="Aperçu"
                    style={{ maxWidth: 220, borderRadius: 4, border: '1px solid var(--line)' }}
                  />
                </div>
              )}
            </div>
            <div className="field full">
              <label>Ou coller une URL d'image directement (optionnel)</label>
              <input
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </>
        )}
        <div className="field full">
          <button type="submit" className="btn btn-solid">
            {form.id ? 'Mettre à jour le projet' : 'Ajouter le projet'}
          </button>
          {form.id && (
            <button
              type="button"
              className="btn btn-line"
              style={{ marginLeft: 10 }}
              onClick={() => {
                setForm(EMPTY_FORM)
                setGalleryUrlInput('')
              }}
            >
              Annuler
            </button>
          )}
          {savingError && <p className="form-status error">{savingError}</p>}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.category === 'dev' ? 'Développement' : 'Infographie'}</td>
              <td>{p.status === 'live' ? 'En ligne' : 'En cours'}</td>
              <td>
                <button className="btn btn-line" onClick={() => editProject(p)}>
                  Modifier
                </button>{' '}
                <button className="btn btn-line" onClick={() => handleDelete(p.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="section-head" style={{ marginTop: 60 }}>
        <h2>Messages reçus</h2>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

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
  github: '',
  problem: '',
  solution: '',
  result: '',
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
  const [testimonials, setTestimonials] = useState([])
  const [testiForm, setTestiForm] = useState({
    name: '',
    role: '',
    title: '',
    rating: 5,
    message: '',
  })
  const [testiError, setTestiError] = useState('')
  const [tab, setTab] = useState('projects')
  const [filter, setFilter] = useState('all')
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [galleryUrlInput, setGalleryUrlInput] = useState('')
  const [savingError, setSavingError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const [heroImage, setHeroImage] = useState('')
  const [heroUploading, setHeroUploading] = useState(false)
  const [heroError, setHeroError] = useState('')

  const [aboutImage, setAboutImage] = useState('')
  const [aboutUploading, setAboutUploading] = useState(false)
  const [aboutError, setAboutError] = useState('')

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
      loadTestimonials()
      loadHeroImage()
      loadAboutImage()
    }
  }, [session])

  async function loadAboutImage() {
    const { data, error } = await supabase
      .from('settings')
      .select('about_image')
      .eq('id', 1)
      .single()
    if (!error) setAboutImage(data?.about_image || '')
  }

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
      .limit(100)
    if (!error) setMessages(data || [])
  }

  async function loadTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setTestimonials(data || [])
  }

  async function setTestimonialApproved(id, approved) {
    const { error } = await supabase.from('testimonials').update({ approved }).eq('id', id)
    if (!error) loadTestimonials()
  }

  async function deleteTestimonial(id) {
    if (!confirm('Supprimer ce témoignage ?')) return
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (!error) loadTestimonials()
  }

  async function addTestimonial(e) {
    e.preventDefault()
    setTestiError('')
    const { error } = await supabase.from('testimonials').insert({
      name: testiForm.name.trim(),
      role: testiForm.role.trim() || null,
      title: testiForm.title.trim() || null,
      rating: testiForm.rating,
      message: testiForm.message.trim(),
      approved: true,
    })
    if (error) {
      setTestiError(error.message)
      return
    }
    setTestiForm({ name: '', role: '', title: '', rating: 5, message: '' })
    loadTestimonials()
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
      github: p.github || '',
      problem: p.problem || '',
      solution: p.solution || '',
      result: p.result || '',
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

  async function handleAboutUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setAboutUploading(true)
    setAboutError('')

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-')
    const path = `about-${Date.now()}-${safeName}`

    const { error: uploadErr } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (uploadErr) {
      setAboutError(
        uploadErr.message.includes('Bucket not found')
          ? `Le bucket "${IMAGE_BUCKET}" n'existe pas encore — crée-le dans Supabase (Storage > New bucket, coché "Public").`
          : uploadErr.message
      )
      setAboutUploading(false)
      e.target.value = ''
      return
    }

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)

    const { error: saveErr } = await supabase
      .from('settings')
      .upsert({ id: 1, about_image: data.publicUrl })

    if (saveErr) {
      setAboutError(saveErr.message)
      setAboutUploading(false)
      e.target.value = ''
      return
    }

    setAboutImage(data.publicUrl)
    setAboutUploading(false)
    e.target.value = ''
  }

  async function handleSave(e) {
    e.preventDefault()
    setSavingError('')

    const isDev = form.category === 'dev'
    const payload = {
      title: form.title,
      category: form.category,
      status: isDev ? form.status : 'live',
      description: isDev ? form.description : '',
      stack: isDev
        ? form.stack
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      link: isDev ? form.link : '',
      github: isDev ? form.github : '',
      problem: isDev ? form.problem : '',
      solution: isDev ? form.solution : '',
      result: isDev ? form.result : '',
      image: isDev ? form.images[0] || '' : form.image,
      images: isDev ? form.images : [],
    }

    const query = form.id
      ? supabase.from('projects').update(payload).eq('id', form.id)
      : supabase.from('projects').insert(payload)

    const { error } = await query
    if (error) {
      setSavingError(
        /column|schema cache/i.test(error.message)
          ? "Il manque les nouvelles colonnes dans Supabase : exécute d'abord le fichier projects-detail.sql (Supabase > SQL Editor). Détail : " +
              error.message
          : error.message,
      )
      return
    }
    setForm(EMPTY_FORM)
    setGalleryUrlInput('')
    loadProjects()
    flash(form.id ? 'Projet mis à jour ✓' : 'Projet ajouté ✓')
  }

  function flash(text) {
    setNotice(text)
    setTimeout(() => setNotice(''), 3000)
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

  const devCount = projects.filter((p) => p.category === 'dev').length
  const designCount = projects.filter((p) => p.category === 'design').length
  const liveCount = projects.filter((p) => p.category === 'dev' && p.status === 'live').length
  const wipCount = projects.filter((p) => p.category === 'dev' && p.status === 'wip').length
  const pendingCount = testimonials.filter((t) => !t.approved).length
  const shownProjects = projects.filter((p) => filter === 'all' || p.category === filter)
  const isDev = form.category === 'dev'

  function formatDate(d) {
    return d
      ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : ''
  }

  return (
    <main className="admin-shell wrap">
      <header className="admin-head">
        <div>
          <p className="eyebrow">Espace privé</p>
          <h1 className="anton">Tableau de bord</h1>
        </div>
        <button className="btn btn-line" onClick={handleLogout}>
          Se déconnecter
        </button>
      </header>

      <div className="admin-stats">
        <div className="admin-stat">
          <strong>{projects.length}</strong>
          <span>Projets</span>
          <small>
            {devCount} web · {designCount} infographie
          </small>
        </div>
        <div className="admin-stat">
          <strong>{liveCount}</strong>
          <span>Sites en ligne</span>
          <small>{wipCount} en cours</small>
        </div>
        <div className="admin-stat">
          <strong>{messages.length}</strong>
          <span>Messages reçus</span>
          <small>via le formulaire de contact</small>
        </div>
        <div className={`admin-stat${pendingCount > 0 ? ' alert' : ''}`}>
          <strong>{pendingCount}</strong>
          <span>Avis à valider</span>
          <small>{testimonials.length - pendingCount} publiés</small>
        </div>
      </div>

      <nav className="admin-tabs">
        {[
          ['projects', 'Projets'],
          ['testimonials', 'Témoignages'],
          ['messages', 'Messages'],
          ['parcours', 'Parcours'],
          ['settings', 'Réglages'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={tab === key ? 'active' : ''}
            onClick={() => setTab(key)}
          >
            {label}
            {key === 'testimonials' && pendingCount > 0 && (
              <span className="admin-badge">{pendingCount}</span>
            )}
            {key === 'messages' && messages.length > 0 && (
              <span className="admin-badge muted">{messages.length}</span>
            )}
          </button>
        ))}
      </nav>

      {notice && <div className="admin-toast">{notice}</div>}

      {tab === 'projects' && (
        <>
          <form className="admin-card" onSubmit={handleSave}>
            <div className="admin-card-head">
              <h2>{form.id ? 'Modifier le projet' : 'Nouveau projet'}</h2>
              <div className="admin-segment" role="tablist">
                <button
                  type="button"
                  className={isDev ? 'active' : ''}
                  onClick={() => setForm((f) => ({ ...f, category: 'dev' }))}
                >
                  Développement
                </button>
                <button
                  type="button"
                  className={!isDev ? 'active' : ''}
                  onClick={() => setForm((f) => ({ ...f, category: 'design' }))}
                >
                  Infographie
                </button>
              </div>
            </div>

            <div className="admin-fields">
              <div className="field full">
                <label>Titre</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>

              {isDev ? (
                <>
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
                    <label>Lien du site (optionnel)</label>
                    <input
                      value={form.link}
                      placeholder="https://..."
                      onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                    />
                  </div>
                  <div className="field">
                    <label>Lien GitHub (optionnel)</label>
                    <input
                      value={form.github}
                      placeholder="https://github.com/..."
                      onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
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
                    <label>Technologies (séparées par des virgules)</label>
                    <input
                      value={form.stack}
                      onChange={(e) => setForm((f) => ({ ...f, stack: e.target.value }))}
                      placeholder="React, Supabase, Tailwind"
                    />
                  </div>

                  <div className="field full">
                    <label>Le problème (page détail, optionnel)</label>
                    <textarea
                      value={form.problem}
                      placeholder="Quel besoin ou quelle difficulté ce projet devait résoudre ?"
                      onChange={(e) => setForm((f) => ({ ...f, problem: e.target.value }))}
                    />
                  </div>
                  <div className="field full">
                    <label>La solution (page détail, optionnel)</label>
                    <textarea
                      value={form.solution}
                      placeholder="Comment tu l'as résolu : choix techniques, fonctionnalités clés…"
                      onChange={(e) => setForm((f) => ({ ...f, solution: e.target.value }))}
                    />
                  </div>
                  <div className="field full">
                    <label>Le résultat (page détail, optionnel)</label>
                    <textarea
                      value={form.result}
                      placeholder="Ce que le projet a apporté, ce que tu as appris, ce qui reste à faire…"
                      onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))}
                    />
                  </div>

                  <div className="field full">
                    <label>Captures d'écran du site</label>
                    <div className="admin-thumbs">
                      {form.images.map((src, i) => (
                        <div key={src + i} className="admin-thumb">
                          <img src={src} alt="" />
                          {i === 0 && <span className="admin-thumb-tag">Principale</span>}
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(i)}
                            aria-label="Retirer cette image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <label className={`admin-upload${uploading ? ' busy' : ''}`}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleGalleryUpload}
                          disabled={uploading}
                          hidden
                        />
                        <span>{uploading ? 'Envoi…' : '+ Ajouter'}</span>
                      </label>
                    </div>
                    {uploadError && <p className="form-status error">{uploadError}</p>}
                    <div className="admin-inline">
                      <input
                        value={galleryUrlInput}
                        onChange={(e) => setGalleryUrlInput(e.target.value)}
                        placeholder="Ou colle l'URL d'une image"
                      />
                      <button type="button" className="btn btn-line" onClick={addGalleryUrl}>
                        Ajouter
                      </button>
                    </div>
                    {form.images.length > 1 && (
                      <p className="form-status">
                        La première s'affiche par défaut, les suivantes défilent au survol.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="field full">
                  <label>Image de l'affiche</label>
                  <div className="admin-thumbs">
                    {form.image && (
                      <div className="admin-thumb big">
                        <img src={form.image} alt="Aperçu" />
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, image: '' }))}
                          aria-label="Retirer l'image"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <label className={`admin-upload${uploading ? ' busy' : ''}`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        hidden
                      />
                      <span>{uploading ? 'Envoi…' : form.image ? 'Remplacer' : '+ Ajouter'}</span>
                    </label>
                  </div>
                  {uploadError && <p className="form-status error">{uploadError}</p>}
                  <div className="admin-inline">
                    <input
                      value={form.image}
                      onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                      placeholder="Ou colle l'URL d'une image"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="admin-actions">
              <button type="submit" className="btn btn-solid" disabled={uploading}>
                {form.id ? 'Mettre à jour' : 'Ajouter le projet'}
              </button>
              {form.id && (
                <button
                  type="button"
                  className="btn btn-line"
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

          <div className="admin-list-head">
            <h2>Mes projets</h2>
            <div className="admin-chips">
              {[
                ['all', `Tous (${projects.length})`],
                ['dev', `Développement (${devCount})`],
                ['design', `Infographie (${designCount})`],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={filter === key ? 'active' : ''}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {shownProjects.length === 0 ? (
            <p className="admin-empty">Aucun projet dans cette catégorie pour l'instant.</p>
          ) : (
            <div className="admin-grid">
              {shownProjects.map((p) => {
                const thumb = (p.images && p.images[0]) || p.image
                return (
                  <article key={p.id} className="admin-project">
                    <div className="admin-project-thumb">
                      {thumb ? <img src={thumb} alt="" /> : <span>Pas d'image</span>}
                      {p.images && p.images.length > 1 && (
                        <span className="admin-count">{p.images.length} images</span>
                      )}
                    </div>
                    <div className="admin-project-body">
                      <div className="admin-project-tags">
                        <span className="admin-tag">
                          {p.category === 'dev' ? 'Développement' : 'Infographie'}
                        </span>
                        {p.category === 'dev' && (
                          <span className={`admin-tag ${p.status}`}>
                            {p.status === 'live' ? 'En ligne' : 'En cours'}
                          </span>
                        )}
                      </div>
                      <h3>{p.title}</h3>
                      {p.description && <p>{p.description}</p>}
                      {p.stack && p.stack.length > 0 && (
                        <div className="admin-stack">
                          {p.stack.map((s) => (
                            <span key={s}>{s}</span>
                          ))}
                        </div>
                      )}
                      <div className="admin-project-actions">
                        <button className="btn btn-line" onClick={() => editProject(p)}>
                          Modifier
                        </button>
                        <button className="btn btn-line danger" onClick={() => handleDelete(p.id)}>
                          Supprimer
                        </button>
                        {p.link && (
                          <a className="admin-link" href={p.link} target="_blank" rel="noreferrer">
                            Voir le site ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </>
      )}

      {tab === 'testimonials' && (
        <>
          <form className="admin-card" onSubmit={addTestimonial}>
            <div className="admin-card-head">
              <h2>Ajouter un témoignage</h2>
              <span className="admin-hint">Publié tout de suite</span>
            </div>
            <div className="admin-fields">
              <div className="field">
                <label>Nom</label>
                <input
                  required
                  value={testiForm.name}
                  onChange={(e) => setTestiForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Rôle (optionnel)</label>
                <input
                  value={testiForm.role}
                  onChange={(e) => setTestiForm((f) => ({ ...f, role: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Titre (optionnel)</label>
                <input
                  value={testiForm.title}
                  onChange={(e) => setTestiForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Note</label>
                <select
                  value={testiForm.rating}
                  onChange={(e) =>
                    setTestiForm((f) => ({ ...f, rating: Number(e.target.value) }))
                  }
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} étoile{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field full">
                <label>Témoignage</label>
                <textarea
                  required
                  value={testiForm.message}
                  onChange={(e) => setTestiForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>
            </div>
            <div className="admin-actions">
              <button type="submit" className="btn btn-solid">
                Ajouter le témoignage
              </button>
              {testiError && <p className="form-status error">{testiError}</p>}
            </div>
          </form>

          <div className="admin-list-head">
            <h2>Témoignages</h2>
          </div>
          {testimonials.length === 0 ? (
            <p className="admin-empty">Aucun témoignage pour l'instant.</p>
          ) : (
            <div className="admin-stack-list">
              {[...testimonials]
                .sort((x, y) => Number(x.approved) - Number(y.approved))
                .map((t) => (
                  <article key={t.id} className={`admin-item${t.approved ? '' : ' pending'}`}>
                    <div className="admin-item-top">
                      <div className="admin-avatar">{(t.name || '?').charAt(0).toUpperCase()}</div>
                      <div className="admin-item-who">
                        <strong>{t.name}</strong>
                        <span>
                          {t.role ? `${t.role} · ` : ''}
                          {formatDate(t.created_at)}
                        </span>
                      </div>
                      <span className={`admin-tag ${t.approved ? 'live' : 'wip'}`}>
                        {t.approved ? 'Publié' : 'En attente'}
                      </span>
                    </div>
                    <p className="admin-item-text">{t.message}</p>
                    <div className="admin-project-actions">
                      <button
                        className="btn btn-line"
                        onClick={() => setTestimonialApproved(t.id, !t.approved)}
                      >
                        {t.approved ? 'Masquer' : 'Publier'}
                      </button>
                      <button className="btn btn-line danger" onClick={() => deleteTestimonial(t.id)}>
                        Supprimer
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </>
      )}

      {tab === 'messages' && (
        <>
          <div className="admin-list-head">
            <h2>Messages reçus</h2>
          </div>
          {messages.length === 0 ? (
            <p className="admin-empty">Aucun message pour l'instant.</p>
          ) : (
            <div className="admin-stack-list">
              {messages.map((m) => (
                <article key={m.id} className="admin-item">
                  <div className="admin-item-top">
                    <div className="admin-avatar">{(m.name || '?').charAt(0).toUpperCase()}</div>
                    <div className="admin-item-who">
                      <strong>{m.name}</strong>
                      <span>
                        {m.email} · {formatDate(m.created_at)}
                      </span>
                    </div>
                  </div>
                  <p className="admin-item-text">{m.message}</p>
                  <div className="admin-project-actions">
                    <a
                      className="btn btn-line"
                      href={`mailto:${m.email}?subject=${encodeURIComponent('Re : ton message sur mon portfolio')}`}
                    >
                      Répondre par email
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'parcours' && (
        <>
          <div className="admin-card">
            <div className="admin-card-head">
              <h2>Photo de la page Parcours</h2>
              <span className="admin-hint">Différente de celle de l'accueil</span>
            </div>
            <div className="admin-fields">
              <div className="field full">
                <div className="admin-thumbs">
                  {aboutImage && (
                    <div className="admin-thumb big">
                      <img src={aboutImage} alt="Aperçu" />
                    </div>
                  )}
                  <label className={`admin-upload${aboutUploading ? ' busy' : ''}`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAboutUpload}
                      disabled={aboutUploading}
                      hidden
                    />
                    <span>
                      {aboutUploading ? 'Envoi…' : aboutImage ? 'Remplacer' : '+ Ajouter'}
                    </span>
                  </label>
                </div>
                {aboutError && <p className="form-status error">{aboutError}</p>}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'settings' && (
        <div className="admin-card">
          <div className="admin-card-head">
            <h2>Photo de la page d'accueil</h2>
          </div>
          <div className="admin-fields">
            <div className="field full">
              <div className="admin-thumbs">
                {heroImage && (
                  <div className="admin-thumb big">
                    <img src={heroImage} alt="Aperçu" />
                  </div>
                )}
                <label className={`admin-upload${heroUploading ? ' busy' : ''}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroUpload}
                    disabled={heroUploading}
                    hidden
                  />
                  <span>{heroUploading ? 'Envoi…' : heroImage ? 'Remplacer' : '+ Ajouter'}</span>
                </label>
              </div>
              {heroError && <p className="form-status error">{heroError}</p>}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

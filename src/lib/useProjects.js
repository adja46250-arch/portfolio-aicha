import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabaseClient'
import { seedProjects } from '../data/seedProjects'

// Charge les projets depuis Supabase si configuré, sinon utilise les
// données statiques. Ça permet au site de fonctionner dès le premier
// déploiement, avant même d'avoir créé le projet Supabase.
export function useProjects() {
  const [projects, setProjects] = useState(seedProjects)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false

    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Erreur chargement projets Supabase :', error.message)
          setProjects(seedProjects)
        } else if (data && data.length > 0) {
          setProjects(data)
        } else {
          setProjects(seedProjects)
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { projects, loading }
}

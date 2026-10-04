import { useState } from 'react'
import { DRAWINGS } from '../data/drawings'

// Liste des dessins, sans ceux dont l'image est introuvable (pas de case cassée)
export function useWorkingDrawings() {
  const [failed, setFailed] = useState(() => new Set())

  const list = DRAWINGS.filter((d) => !d.image || !failed.has(d.image))

  function onError(src) {
    if (import.meta.env.DEV) console.warn('Dessin introuvable (vérifie le nom du fichier) :', src)
    setFailed((s) => new Set(s).add(src))
  }

  return { list: list.length ? list : [{ title: '', image: '' }, { title: '', image: '' }, { title: '', image: '' }, { title: '', image: '' }], onError }
}

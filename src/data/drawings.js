// Tous tes dessins, au même endroit.
//
// ✦ MÉTHODE AUTOMATIQUE (recommandée) : mets tes images dans le dossier  src/assets/dessins/
//   → elles apparaissent toutes toutes seules, triées par nom (1, 2, 3 … 10, 11).
//   Plus besoin d'écrire les noms de fichiers, plus de souci de majuscules (.JPG / .jpg),
//   ni d'extension (.jpeg / .jpg / .png / .webp).
//
// ✦ Pour donner un titre à un dessin, ajoute son nom de fichier ci-dessous :
//   const TITLES = { '3.jpeg': 'Portrait', '7.jpg': 'Mandala' }
//
// ✦ (Facultatif) Méthode manuelle : images dans public/univers/ + une ligne dans MANUAL :
//   { title: 'Portrait', image: '/univers/dessin-1.jpg' }
//   (le nom doit être écrit EXACTEMENT comme le fichier, majuscules comprises)
//
// Les 8 premiers défilent sur la page « Mon univers » ; tous apparaissent dans la galerie « Mes dessins ».
// Une image introuvable est simplement ignorée (plus de case cassée).

const TITLES = {
  // '3.jpeg': 'Portrait',
}

const MANUAL = [
  // { title: '', image: '/univers/dessin-1.jpg' },
]

const found = import.meta.glob('../assets/dessins/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

const AUTO = Object.entries(found)
  .filter(([path]) => /\.(jpe?g|png|webp|gif|avif)$/i.test(path)) // peu importe les majuscules (.JPG, .Jpeg…)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  .map(([path, url]) => {
    const file = path.split('/').pop()
    return { title: TITLES[file] || '', image: url }
  })

const REAL = [...AUTO, ...MANUAL.filter((d) => d.image)]

// Tant que tu n'as pas mis d'images, on montre des feuilles vides
export const DRAWINGS = REAL.length
  ? REAL
  : Array.from({ length: 4 }, () => ({ title: '', image: '' }))

// Section « Henné » (art traditionnel des mains et des pieds, très présent en Afrique de l'Ouest).
//
// CARDS : les cartes affichées, dans l'ordre. Deux sortes de cartes :
//   { motif: 'fleur' }  → un motif dessiné. Au choix : 'fleur', 'losanges', 'feuillage', 'bracelet'
//   { title: 'Eid', image: '/univers/henne1.jpg' }  → TA photo (une de tes réalisations)
//
// Une carte photo dont "image" est vide n'est pas affichée : remplis-la quand tu as la photo.
// Mets les images dans "public/univers/" (sans espaces ni accents), en JPEG ou PNG (pas HEIC).
export const CARDS = [
  { motif: 'fleur' },
  { title: '', image: '/univers/henne1.png' },
  { motif: 'bracelet' },
  { title: '', image: '/univers/henne2.png' }, // 4e case : mets ici une autre de tes réalisations
]

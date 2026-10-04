// Ton étagère de lecture.
// 1) Mets les couvertures dans "public/univers/" (ex. livre-1.jpg, sans espaces ni accents)
// 2) Ajoute un livre par ligne :
//    { title: 'Titre du livre', author: 'Nom de l'auteur', note: 'Une petite phrase', image: '/univers/livre-1.jpg' }
//    "author" et "note" sont facultatifs.
// Tu peux ajouter, retirer ou renommer les étagères comme tu veux, et mettre autant de livres que tu veux :
// des flèches ‹ › apparaissent d'elles-mêmes quand il y en a trop pour tenir.
//
// Sens de départ : par défaut, l'étagère 1 commence à gauche, la 2 à droite, la 3 à gauche…
// (donc les flèches révèlent les livres dans des sens différents). Pour forcer un sens sur une étagère,
// ajoute  startAt: 'left'  ou  startAt: 'right'  à côté de son "name".
export const SHELVES = [
  {
    name: 'Mes lectures en ce moment',
    books: [
      { title: 'Linpératrice', author: 'Aya ESTRELA', note: '', image: '/univers/imperatrice.jpg' },
      { title: 'Lights Out', author: 'Navessa ALLEN', note: '', image: '/univers/light.jpg' },
    ],
  },
  {
    name: 'Mes découvertes',
    books: [
      { title: 'Intelligence Artificielle', author: 'François Cazals et Chantal Cazals', note: '', image: '/univers/int.png' },
      { title: 'Red Falcon', author: 'Aurore PAYELLE', note: '', image: '/univers/falcon.jpg' },
      { title: 'RIVERSEND', author: 'Aimée BIANCA', note: '', image: '/univers/riversend.jpg' },
      { title: 'Le ventre de l\'atlantique ', author: 'Fatou DIOME', note: '', image: '/univers/fatou.png' },
      { title: 'L\'étranger', author: 'Albert Camus', note: '', image: '/univers/etranger.png' },
      { title: 'Les soleils de l\'indépendances', author: 'Ahmadou Kourouma', note: '', image: '/univers/amadou.png' },
      { title: 'Petites habitudes Grandes réussites', author: 'Onur KARAPINAR', note: '', image: '/univers/petite.png' },
      { title: 'SWAN 1', author: 'Sarah RIVENS', note: '', image: '/univers/swan.jpg' },
      { title: 'Allah n\'est pas obligé', author: 'Ahmadou Kourouma', note: '', image: '/univers/oblige.png' },
      { title: '', author: 'Le livre du C premier langage pour les vrais débutants en progammation', note: '', image: '/univers/livre.png' },
    ],
  },
  {
    name: 'Mes incontournables',
    books: [
      { title: 'LAKESTONE', author: 'Sarah RIVENS', note: '', image: '/univers/lakestone.jpg' },
      { title: 'POWER', author: 'ROBERT GREENE', note: '', image: '/univers/power.png' },
      { title: 'CAPTIVE', author: 'Sarah RIVENS', note: '', image: '/univers/captive.jpg' },
      { title: 'CAPTIVE 2', author: 'Sarah RIVENS', note: '', image: '/univers/captive2.jpg' },
      { title: 'PERFECTLY WRONG', author: 'Sarah RIVENS', note: '', image: '/univers/perfect.jpg' },
      { title: 'La force des Discrets', author: 'Susan Cain', note: '', image: '/univers/force.jpg' },
      { title: 'Les lois de la nature humaines', author: 'ROBERT GREENE', note: '', image: '/univers/nature.png' },
      { title: 'Les Frasques d\'ebinto', author: 'Amadou KONE', note: '', image: '/univers/frasque.jpg' },
      { title: 'L\'ombre d\'Adreline', author: 'H.D. CARLTON', note: '', image: '/univers/ombre.jpg' },
      { title: '', author: '', note: '', image: '' },


    ],
  },
]

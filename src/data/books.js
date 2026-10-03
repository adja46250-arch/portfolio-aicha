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
    name: 'À lire actuellement',
    books: [
      { title: '', author: '', note: '', image: '' },
      { title: '', author: '', note: '', image: '' },
    ],
  },
  {
    name: 'Mes découvertes',
    books: [
      { title: '', author: '', note: '', image: '' },
      { title: '', author: '', note: '', image: '' },
      { title: '', author: '', note: '', image: '' },
      { title: '', author: '', note: '', image: '' },
    ],
  },
  {
    name: 'Mes incontournables',
    books: [
      { title: '', author: '', note: '', image: '' },
      { title: '', author: '', note: '', image: '' },
      { title: '', author: '', note: '', image: '' },
      { title: '', author: '', note: '', image: '' },
      { title: '', author: '', note: '', image: '' },
    ],
  },
]

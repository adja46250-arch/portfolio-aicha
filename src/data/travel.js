// Section « Voyage » (Hobby n°6) : les endroits où tu as vécu ou que tu as visités.
//
// Pour chaque ville :
//   city  : le nom affiché
//   image : ta photo, ex. '/univers/riyad.jpg' (fichier dans "public/univers/", JPEG ou PNG, pas HEIC).
//           Laisse '' tant que tu n'as pas la photo : la carte reste jolie (nom + tampon).
//   images: (facultatif) PLUSIEURS photos pour la même ville, 2 à 4 :
//             images: ['/univers/abidjan-1.jpg', '/univers/abidjan-2.jpg', '/univers/abidjan-3.jpg']
//           Sur ordinateur, elles défilent quand le curseur est sur la carte ;
//           sur téléphone, elles changent à chaque touche. (Si "images" est rempli, "image" est ignoré.)
//   note  : une phrase sur ce lieu (un souvenir, ce que tu y as aimé). Facultatif.
//           S'il y en a une, la carte se retourne au clic (ou via le petit bouton « i » quand il y a
//           plusieurs photos) pour la montrer.
//
// Tu peux ajouter, retirer ou réordonner les villes librement.
export const TRAVEL = [
  {
    country: 'Arabie saoudite',
    code: 'SA',
    line: "Là où je suis née et où j'ai grandi pendant 15 ans.",
    places: [
      { city: 'Riyad', image: '', note: '' },
      { city: 'La Mecque', image: '', note: '' },
    ],
  },
  {
    country: "Côte d'Ivoire",
    code: 'CI',
    line: 'Mon pays, que je continue de découvrir ville après ville.',
    places: [
      { city: 'Abidjan', image: '', note: '' },
      { city: 'San Pedro', image: '', note: '' },
      { city: 'Yamoussoukro', image: '', note: '' },
      { city: 'Man', image: '', note: '' },
      { city: 'Kong', image: '', note: '' },
    ],
  },
]

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
    line: "Là où j'ai grandi pendant 15 ans.",
    places: [
      { city: 'Riyad', image: '', note: 'C\'est là que j\'ai grandi, entourée de mes parents et de mes frères. J\'y ai vécu une enfance heureuse, remplie de beaux souvenirs en famille. Riyad reste une partie importante de mon histoire.'},
      { city: 'La Mecque', image: '/univers/mecque.jpg', note: 'En 2015, à 14 ans, j\'ai passé plus de six mois chez ma grand-mère à La Mecque. J\'y ai découvert beaucoup de choses et accompli le Hajj, une expérience marquante que je garde parmi mes plus beaux souvenirs.' },
    ],
  },
  {
    country: "Côte d'Ivoire",
    code: 'CI',
    line: 'Mon pays, que je continue de découvrir ville après ville.',
    places: [
      { city: 'Abidjan', images: ['/univers/abi1.jpg'], note: 'Abidjan a été ma première découverte de la Côte d\'Ivoire. Tout y était différent de ce que je connaissais, des paysages à l\'ambiance, et j\'ai peu à peu découvert une nouvelle façon de vivre. Depuis, mes nombreux allers-retours entre Abidjan et Bouaké ont créé d\'autres souvenirs.' },
      { city: 'San Pedro', images: ['/univers/sanpedro.jpg', '/univers/sanpedro2.jpg', '/univers/sanpedro3.jpg'], note: '' },
      { city: 'Yamoussoukro', images: ['/univers/yam1.jpg',  '/univers/yam2.jpg'], note: '' },
      { city: 'Grand-Bassam', images: ['/univers/'], note: '' },
      { city: 'Man', images: ['/univers/man1.jpg', '/univers/man2.jpg'], note: '' },
      { city: 'Kong', images: ['/univers/kong2.jpg','/univers/kong.jpg'], note: '' },
      { city: 'Et Bouaké là où je vie', images: ['/univers/'], note: '' },
    ],
  },
]

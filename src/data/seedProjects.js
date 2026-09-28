// Données de secours, affichées tant que la table Supabase "projects" est vide
// ou que Supabase n'est pas encore configuré (voir .env.example).
// Une fois l'admin branché, ces projets peuvent être recréés directement
// depuis /admin — ce fichier ne sert alors plus qu'à ne jamais avoir une
// page vide.

export const seedProjects = [
  {
    id: 'taskflow',
    title: 'TaskFlow',
    category: 'dev',
    status: 'live',
    description:
      "Application SaaS de gestion de projet : tableaux Kanban en temps réel, pages de détail des tâches, notifications, statistiques et un assistant IA flottant pour aider à s'organiser.",
    stack: ['HTML / CSS / JS', 'Supabase', 'Chart.js', 'Groq API'],
    link: '',
    image: '',
  },
  {
    id: 'stockflow',
    title: 'StockFlow',
    category: 'dev',
    status: 'live',
    description:
      "Système de gestion de boutique : suivi des stocks et des ventes, pensé pour de petits commerces qui ont besoin d'une solution simple et rapide à utiliser.",
    stack: ['PHP', 'MySQL'],
    link: '',
    image: '',
  },
  {
    id: 'athar',
    title: 'Athar',
    category: 'dev',
    status: 'live',
    description:
      "Site vitrine de mon agence digitale, Athar. La version actuelle tourne en PHP/MySQL ; une migration vers React et Supabase est en cours.",
    stack: ['PHP / MySQL', 'React (en migration)', 'Vite', 'Supabase'],
    link: '',
    image: '',
  },
  {
    id: 'finsmart-ci',
    title: 'FinSmart CI',
    category: 'dev',
    status: 'wip',
    description:
      "Application de gestion de finances personnelles pensée pour le contexte ivoirien, structurée en onze modules. Encore en développement.",
    stack: ['React / Vite', 'Tailwind', 'Node.js / Express', 'Supabase'],
    link: '',
    image: '',
  },
  {
    id: 'tontinepro',
    title: 'TontinePro',
    category: 'dev',
    status: 'wip',
    description:
      'Système de gestion de tontine en CRUD complet, construit pour consolider mes bases en PHP.',
    stack: ['PHP', 'PDO', 'MySQL'],
    link: '',
    image: '',
  },
  {
    id: 'affiches',
    title: 'Affiches & supports visuels',
    category: 'design',
    status: 'live',
    description:
      'Emplacement réservé pour les créations graphiques — à remplacer depuis /admin.',
    stack: ['Identité visuelle', 'Composition'],
    link: '',
    image: '',
  },
]

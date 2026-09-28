# Portfolio — Aïcha

Site React (Vite) + Supabase. Fonctionne dès le premier lancement avec des
données de démonstration ; devient dynamique dès que tu branches ton propre
projet Supabase.

## 1. Installer et lancer en local

```bash
npm install
npm run dev
```

Le site s'ouvre sur `http://localhost:5173`. À ce stade, les pages Accueil et
Projets affichent les projets définis dans `src/data/seedProjects.js` — tu
peux déjà tout voir et ajuster le design sans rien configurer.

## 2. Créer le projet Supabase (séparé de TaskFlow)

1. Va sur [supabase.com](https://supabase.com) et crée un **nouveau projet**
   (pas celui de TaskFlow — celui-ci est dédié au portfolio).
2. Une fois créé, ouvre **SQL Editor** et colle le contenu de
   `supabase/schema.sql`, puis exécute-le. Ça crée les deux tables :
   `projects` et `messages`, avec les bonnes règles de sécurité.
3. Va dans **Authentication > Users** et crée ton propre utilisateur
   (ton email + un mot de passe) — c'est ce compte qui te servira à te
   connecter sur `/admin`.
4. Va dans **Project Settings > API** et récupère :
   - `Project URL`
   - `anon public key`

## 3. Connecter le site à Supabase

Copie `.env.example` en `.env` :

```bash
cp .env.example .env
```

Remplis les deux variables avec les valeurs récupérées à l'étape 2 :

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=ta-cle-anon-publique
```

Relance `npm run dev`. Le site utilise maintenant Supabase — tant que la
table `projects` est vide, les projets de démo restent affichés (pour ne
jamais avoir une page vide).

## 4. Utiliser l'admin

Va sur `/admin`, connecte-toi avec l'email/mot de passe créés à l'étape 2.
Tu peux ajouter, modifier, supprimer des projets, et voir les messages
envoyés depuis le formulaire de contact — sans toucher au code.

## 5. Déployer sur Vercel (gratuit)

1. Pousse ce dossier sur un dépôt GitHub.
2. Sur [vercel.com](https://vercel.com), importe le dépôt.
3. Dans les réglages du projet Vercel, ajoute les mêmes variables
   d'environnement que dans `.env` (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`).
4. Déploie. Le site est en ligne sur une URL `*.vercel.app` (tu pourras
   brancher un vrai nom de domaine plus tard).

## Ce qui reste à faire

- Remplacer les emplacements réservés (`photo-slot`, `project-visual`) par
  tes vraies images une fois que tu les as choisies.
- Ajouter le contenu réel de la section "En dehors du code" sur la page
  Parcours (`src/pages/About.jsx`).
- Remplacer les liens Email / LinkedIn / GitHub par les tiens
  (`src/pages/Home.jsx`, `Contact.jsx`, `Footer.jsx`).
- Ajouter tes vraies affiches côté Infographie, une fois envoyées.

## Structure du projet

```
src/
  components/   → Header, Footer (communs à toutes les pages)
  pages/        → Home, Projects, About, Contact, Admin
  lib/          → client Supabase + hook de chargement des projets
  data/         → données de secours utilisées avant Supabase
supabase/
  schema.sql    → à exécuter une fois dans ton projet Supabase
```

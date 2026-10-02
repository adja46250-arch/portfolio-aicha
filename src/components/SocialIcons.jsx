// Petites icônes monochromes (héritent de la couleur via currentColor),
// dans un style cohérent avec le reste du site plutôt qu'un logo officiel
// copié — suffisant pour être reconnaissable sur des badges ronds.
export const SocialIcons = {
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="6.5" cy="7" r="1.3" fill="currentColor" stroke="none" />
      <path d="M6.5 10.5v7" strokeLinecap="round" />
      <path
        d="M11 17.5v-4.3c0-1.9 1.2-2.9 2.7-2.9 1.5 0 2.8.9 2.8 2.9v4.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 10.5v7" strokeLinecap="round" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.6-.2.6-.43v-1.68c-2.5.55-3.03-1.08-3.03-1.08-.41-1.05-1-1.33-1-1.33-.82-.56.06-.55.06-.55.9.07 1.38.93 1.38.93.8 1.38 2.11.98 2.62.75.08-.58.31-.98.57-1.2-2-.23-4.1-1-4.1-4.44 0-.98.35-1.79.92-2.42-.09-.23-.4-1.15.09-2.4 0 0 .76-.24 2.48.92a8.6 8.6 0 0 1 4.52 0c1.72-1.16 2.47-.92 2.47-.92.5 1.25.19 2.17.1 2.4.58.63.92 1.44.92 2.42 0 3.45-2.1 4.2-4.11 4.43.32.28.61.83.61 1.68v2.48c0 .24.15.52.61.43A9 9 0 0 0 12 3Z"
        strokeLinejoin="round"
      />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M13.5 4v10.2a2.8 2.8 0 1 1-2.3-2.76" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 4c.3 2 1.7 3.4 3.6 3.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M14.5 21v-7h2.3l.35-2.7h-2.65V9.6c0-.78.22-1.32 1.34-1.32h1.43V5.86c-.25-.03-1.1-.11-2.1-.11-2.08 0-3.5 1.27-3.5 3.6v2h-2.35v2.7h2.35V21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M4 20l1.2-4.1A8 8 0 1 1 8.2 19L4 20Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.6c.2-.4.5-.4.8-.4.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c.8 1.4 1.8 2.3 3.3 3l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.3.1.3.3.3.6-.1.9-.9 1.5-1.8 1.4-3-.4-5.6-2.9-6.2-5.7-.1-.7.1-1.5.3-2.1Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

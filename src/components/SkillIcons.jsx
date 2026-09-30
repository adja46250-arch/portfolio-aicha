// Petits logos simplifiés (pas les SVG officiels pixel pour pixel, mais
// aux couleurs et formes reconnaissables) pour la section Compétences.
export const SkillIcons = {
  react: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <circle cx="12" cy="12" r="2.2" fill="#61dafb" />
      <g fill="none" stroke="#61dafb" strokeWidth="1.4">
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
      </g>
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <rect x="1.5" y="1.5" width="21" height="21" rx="3" fill="#f0db4f" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#141414">
        JS
      </text>
    </svg>
  ),
  php: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <ellipse cx="12" cy="12" rx="10.5" ry="6.5" fill="#8993be" />
      <text
        x="12"
        y="14.5"
        textAnchor="middle"
        fontSize="6.5"
        fontStyle="italic"
        fontWeight="700"
        fill="#1c0a0d"
      >
        php
      </text>
    </svg>
  ),
  laravel: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="#ff2d20" />
      <path
        d="M6.5 17V8.6l3.2-1.8 3.2 1.8v3.5l3.1-1.8 3 1.8v3.5l-3 1.7-3.1-1.7v-3.5l-3.2 1.8-3.2-1.8"
        fill="none"
        stroke="#fff"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  ),
  java: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path
        d="M8.5 15.5c-2 1 .5 2.3 3.6 2.3 3.6 0 6-1.2 6-2.2 0-.6-.8-1-1.6-1.3"
        fill="none"
        stroke="#e76f00"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M10.5 12.7c-1.6.8.4 1.7 2.7 1.7 2.6 0 4.3-.9 4.3-1.6 0-.4-.5-.7-1.1-.9"
        fill="none"
        stroke="#e76f00"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M12.7 3.5c1.2 1.3-2 2.6-2 4.9 0 1.6 1.4 2.5 1.4 2.5s2.6-1.2 1.7-3.1c-.7-1.6-1.9-2.6-1.1-4.3Z"
        fill="#e76f00"
      />
      <path
        d="M9.5 12.2c-.9.5-1.4 1-1.4 1.6 0 1.1 2 1.9 4.6 1.9s4.6-.8 4.6-1.9c0-.5-.4-1-1.1-1.4"
        fill="none"
        stroke="#e76f00"
        strokeWidth="0"
      />
    </svg>
  ),
  mysql: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path
        d="M4 18c0-6.5 2.8-11 5.8-11S15 8 15 13.5c0 1-.1 2-.3 2.9"
        fill="none"
        stroke="#00758f"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M15 14c1.6-.9 3.5-.6 4.7.6" fill="none" stroke="#f29111" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="19" cy="15.4" r="1.1" fill="#f29111" />
    </svg>
  ),
  supabase: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path d="M13.2 2 4.8 13.6h6.4L10.8 22l8.4-11.6h-6.4Z" fill="#3ecf8e" />
    </svg>
  ),
  design: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f2a58e" strokeWidth="1.6">
      <path d="M19 3 9 13" strokeLinecap="round" />
      <path
        d="M9 13c.6 1.9-.3 3.6-2 4.4C5.6 18 4 18 3 18c0-1 0-2.6.6-4C4.4 12.3 6.1 11.4 8 12l1 1Z"
        strokeLinejoin="round"
      />
      <path d="M14 5.5 16.5 8" strokeLinecap="round" />
    </svg>
  ),
  compose: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f2a58e" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="8" height="8" rx="1.5" />
      <rect x="13" y="3.5" width="7.5" height="5" rx="1.5" />
      <rect x="13" y="10.5" width="7.5" height="10" rx="1.5" />
      <rect x="3.5" y="13.5" width="8" height="7" rx="1.5" />
    </svg>
  ),
  photoshop: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <rect x="1.5" y="1.5" width="21" height="21" rx="4" fill="#001e36" />
      <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill="#31a8ff">
        Ps
      </text>
    </svg>
  ),
  illustrator: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <rect x="1.5" y="1.5" width="21" height="21" rx="4" fill="#330000" />
      <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill="#ff9a00">
        Ai
      </text>
    </svg>
  ),
  canva: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <circle cx="12" cy="12" r="10.5" fill="#00c4cc" />
      <path
        d="M12.3 8.2c-2.4 0-4.2 1.8-4.2 4s1.7 3.8 3.9 3.8c1.2 0 2.1-.4 2.8-1.1.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0-.5.5-1.2.8-2.1.8-1.6 0-2.8-1.2-2.8-2.8s1.3-2.9 2.9-2.9c.7 0 1.3.2 1.7.6.2.2.3.5.3.9v1.6c0 .3-.2.5-.5.5s-.5-.2-.5-.5v-.3c-.3.3-.8.6-1.4.6-1 0-1.7-.8-1.7-1.8s.8-1.9 1.8-1.9c.4 0 .8.1 1 .4V9c0-.2.2-.4.4-.4.3 0 .4.2.4.4v3c0 .9-.5 1.4-1.3 1.4-.6 0-1.1-.3-1.3-.9"
        fill="#fff"
      />
    </svg>
  ),
  capcut: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#000" />
      <path
        d="M8 7.5a4.5 4.5 0 1 0 0 9 4.4 4.4 0 0 0 3.1-1.3"
        fill="none"
        stroke="url(#cc1)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16 7.5a4.5 4.5 0 1 0 0 9 4.4 4.4 0 0 0 3.1-1.3"
        fill="none"
        stroke="url(#cc2)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="cc1" x1="4" y1="7" x2="12" y2="17">
          <stop offset="0" stopColor="#00f0e0" />
          <stop offset="1" stopColor="#ff2d55" />
        </linearGradient>
        <linearGradient id="cc2" x1="12" y1="7" x2="20" y2="17">
          <stop offset="0" stopColor="#00f0e0" />
          <stop offset="1" stopColor="#ff2d55" />
        </linearGradient>
      </defs>
    </svg>
  ),
}

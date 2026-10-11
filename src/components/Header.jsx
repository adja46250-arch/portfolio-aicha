import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { CONTACT, WHATSAPP_TEXT } from '../data/contact'

const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(WHATSAPP_TEXT)}`

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const isHome = useLocation().pathname === '/'

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site ${scrolled ? 'scrolled' : ''}${isHome ? ' is-home' : ''}`}>
      <nav className="site-nav wrap">
        <div className="nav-left" aria-hidden="true" />
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Accueil
          </NavLink>
          <NavLink to="/projets" className={({ isActive }) => (isActive ? 'active' : '')}>
            Projets
          </NavLink>
          <NavLink to="/parcours" className={({ isActive }) => (isActive ? 'active' : '')}>
            Parcours
          </NavLink>
        </div>
        <a
          className="nav-contact"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.17-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.07.9.92-3-.2-.31a8.2 8.2 0 1 1 6.85 3.74Zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.17.24-.64.8-.78.96-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.02-.38.1-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05 0 1.2.88 2.37 1 2.54.12.16 1.72 2.63 4.17 3.69.58.25 1.04.4 1.4.51.58.19 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.18.2-.58.2-1.07.14-1.18-.06-.1-.23-.16-.47-.29Z"/>
          </svg>
          <span>Contact</span>
        </a>
      </nav>
    </header>
  )
}

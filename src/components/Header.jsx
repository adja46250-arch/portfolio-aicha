import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site ${scrolled ? 'scrolled' : ''}`}>
      <nav className="site-nav wrap">
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
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
            Contact
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

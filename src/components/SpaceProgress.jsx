import { useEffect, useRef } from 'react'

// Fusée qui descend le long d'un fil doré pendant qu'on fait défiler la page,
// (le retour en haut se fait avec le bouton du footer).
export default function SpaceProgress() {
  const fillRef = useRef(null)
  const rocketRef = useRef(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`
      if (rocketRef.current) rocketRef.current.style.top = `${p * 100}%`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="space-progress" aria-hidden="true">
        <span className="space-progress-track" />
        <span className="space-progress-fill" ref={fillRef} />
        <span className="space-progress-rocket" ref={rocketRef}>
          <svg viewBox="0 0 24 40" width="18" height="30">
            <path className="flame" d="M12 38 C9 33 10 30 12 28 C14 30 15 33 12 38 Z" />
            <path className="body" d="M12 2 C17 8 18 18 16 28 L8 28 C6 18 7 8 12 2 Z" />
            <circle className="win" cx="12" cy="14" r="2.4" />
            <path className="fin" d="M8 20 L3 29 L8 28 Z M16 20 L21 29 L16 28 Z" />
          </svg>
        </span>
      </div>
    </>
  )
}

import { useEffect, useRef } from 'react'

// Traînée de petites étoiles dorées derrière la souris (ordinateur seulement).
export default function StarTrail() {
  const ref = useRef(null)

  useEffect(() => {
    const canTrack = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canTrack || reduce) return

    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const stars = []
    let raf = 0
    let lastX = -1
    let lastY = -1
    const COLORS = ['#e9c46a', '#f6dd9b', '#f2a58e', '#fff3d1']

    const spawn = (x, y) => {
      stars.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: Math.random() * 0.7 + 0.15,
        size: Math.random() * 3.2 + 1.6,
        life: 1,
        decay: 0.016 + Math.random() * 0.014,
        color: COLORS[(Math.random() * COLORS.length) | 0],
      })
      if (stars.length > 70) stars.shift()
    }

    const drawStar = (s) => {
      const r = s.size * (0.4 + s.life * 0.6)
      ctx.globalAlpha = Math.max(0, s.life)
      ctx.fillStyle = s.color
      ctx.shadowColor = s.color
      ctx.shadowBlur = 8
      ctx.beginPath()
      // étoile à quatre branches
      ctx.moveTo(s.x, s.y - r * 2)
      ctx.quadraticCurveTo(s.x, s.y, s.x + r * 2, s.y)
      ctx.quadraticCurveTo(s.x, s.y, s.x, s.y + r * 2)
      ctx.quadraticCurveTo(s.x, s.y, s.x - r * 2, s.y)
      ctx.quadraticCurveTo(s.x, s.y, s.x, s.y - r * 2)
      ctx.fill()
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i]
        s.x += s.vx
        s.y += s.vy
        s.life -= s.decay
        if (s.life <= 0) stars.splice(i, 1)
        else drawStar(s)
      }
      ctx.globalAlpha = 1
      raf = stars.length ? requestAnimationFrame(tick) : 0
    }

    const onMove = (e) => {
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      if (dx * dx + dy * dy < 100) return // une étoile tous les ~10 px
      lastX = e.clientX
      lastY = e.clientY
      spawn(e.clientX, e.clientY)
      if (!raf) raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={ref} className="star-trail" aria-hidden="true" />
}

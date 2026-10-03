import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// Ciel étoilé : étoiles dorées qui scintillent, quelques paillettes roses,
// légère parallaxe au scroll et une étoile filante de temps en temps.
// Rendu dans <body> (portail) pour rester fixe malgré les transitions de page.
const GOLD = ['255,214,120', '246,221,155', '233,196,106']
const ROSE = '242,165,142'

export default function StarSky() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let stars = []
    let shooting = null
    let nextShoot = performance.now() + 3500
    let raf = 0

    function build() {
      const count = Math.min(170, Math.round((w * h) / 9500))
      stars = Array.from({ length: count }, () => {
        const depth = Math.random()
        const sparkle = Math.random() < 0.09
        const rose = !sparkle && Math.random() < 0.12
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          depth,
          r: 0.35 + depth * 1.25,
          color: rose ? ROSE : GOLD[Math.floor(Math.random() * GOLD.length)],
          sparkle,
          base: 0.35 + Math.random() * 0.4,
          amp: 0.2 + Math.random() * 0.35,
          speed: 0.0006 + Math.random() * 0.0016,
          phase: Math.random() * Math.PI * 2,
        }
      })
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h)
      const scroll = window.scrollY

      for (const s of stars) {
        const a = Math.max(
          0.05,
          Math.min(1, s.base + (reduce ? 0 : Math.sin(t * s.speed + s.phase) * s.amp)),
        )
        const y = (((s.y - scroll * s.depth * 0.14) % h) + h) % h

        if (s.sparkle) {
          const L = 4 + s.depth * 5
          const g = ctx.createRadialGradient(s.x, y, 0, s.x, y, L * 2.4)
          g.addColorStop(0, `rgba(${s.color},${a * 0.5})`)
          g.addColorStop(1, `rgba(${s.color},0)`)
          ctx.fillStyle = g
          ctx.fillRect(s.x - L * 2.4, y - L * 2.4, L * 4.8, L * 4.8)
          ctx.strokeStyle = `rgba(${s.color},${a})`
          ctx.lineWidth = 0.9
          ctx.beginPath()
          ctx.moveTo(s.x - L, y)
          ctx.lineTo(s.x + L, y)
          ctx.moveTo(s.x, y - L)
          ctx.lineTo(s.x, y + L)
          ctx.stroke()
        }

        ctx.fillStyle = `rgba(${s.color},${a})`
        ctx.beginPath()
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduce) {
        if (!shooting && t > nextShoot) {
          shooting = {
            x: w * (0.45 + Math.random() * 0.5),
            y: Math.random() * h * 0.4,
            vx: -(5 + Math.random() * 3),
            vy: 2.6 + Math.random() * 1.6,
            life: 0,
          }
        }
        if (shooting) {
          shooting.x += shooting.vx
          shooting.y += shooting.vy
          shooting.life += 1
          const fade = Math.max(0, 1 - shooting.life / 70)
          const tail = 90
          const len = Math.hypot(shooting.vx, shooting.vy)
          const tx = shooting.x - (shooting.vx / len) * tail
          const ty = shooting.y - (shooting.vy / len) * tail
          const g = ctx.createLinearGradient(shooting.x, shooting.y, tx, ty)
          g.addColorStop(0, `rgba(255,230,160,${0.95 * fade})`)
          g.addColorStop(1, 'rgba(255,214,120,0)')
          ctx.strokeStyle = g
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(shooting.x, shooting.y)
          ctx.lineTo(tx, ty)
          ctx.stroke()
          if (shooting.life > 70) {
            shooting = null
            nextShoot = t + 5000 + Math.random() * 5000
          }
        }
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
      draw(performance.now())
    }

    function onScroll() {
      draw(performance.now())
    }

    function loop(t) {
      if (!document.hidden) draw(t)
      raf = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduce) raf = requestAnimationFrame(loop)
    else window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return createPortal(
    <div className="star-sky" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>,
    document.body,
  )
}

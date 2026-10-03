import { useEffect, useRef, useState } from 'react'

// Une étagère : autant de livres que tu veux, avec des flèches pour faire défiler.
// startAt : 'left' (on commence par le premier livre) ou 'right' (on commence par le dernier).
export default function BookShelf({ name, books, startAt = 'left' }) {
  const scroller = useRef(null)
  const [openId, setOpenId] = useState(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  function update() {
    const el = scroller.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < max - 4)
  }

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    if (startAt === 'right') el.scrollLeft = el.scrollWidth
    update()
    window.addEventListener('resize', update)
    // les images changent la largeur quand elles se chargent
    const t = setTimeout(update, 600)
    return () => {
      window.removeEventListener('resize', update)
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books.length, startAt])

  function go(dir) {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className="shelf">
      <h3 className="shelf-name">{name}</h3>

      <div className="shelf-row">
        {canPrev && (
          <button type="button" className="shelf-arrow shelf-arrow-prev" onClick={() => go(-1)} aria-label="Livres précédents">
            ‹
          </button>
        )}

        <div className="shelf-books" ref={scroller} onScroll={update}>
          {books.map((b, i) => {
            const id = `${name}-${i}`
            return (
              <button
                type="button"
                key={id}
                className={`book book-${(i % 5) + 1}${openId === id ? ' is-open' : ''}`}
                onClick={() => setOpenId(openId === id ? null : id)}
                aria-label={b.title || 'Livre à venir'}
              >
                {b.image ? (
                  <img src={b.image} alt={b.title || 'Livre'} loading="lazy" onLoad={update} />
                ) : (
                  <span className="book-empty" aria-hidden="true">
                    <small>Bientôt</small>
                  </span>
                )}
                {(b.title || b.author || b.note) && (
                  <span className="book-info">
                    {b.title && <strong>{b.title}</strong>}
                    {b.author && <em>{b.author}</em>}
                    {b.note && <span>{b.note}</span>}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {canNext && (
          <button type="button" className="shelf-arrow shelf-arrow-next" onClick={() => go(1)} aria-label="Livres suivants">
            ›
          </button>
        )}
      </div>
    </div>
  )
}

// Bande de texte défilante en continu (CSS pur, pas de JS lourd).
// items est répété deux fois pour boucler sans coupure visible.
export default function Marquee({ items }) {
  const doubled = [...items, ...items]

  return (
    <div className="marquee">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item} <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

// Introduction « machine à écrire » : un curseur clignote, puis le texte s'écrit
// très vite, ligne après ligne, en grands caractères. Il reste affiché un moment,
// s'efface, et la scène recommence.
//
// Pour changer le texte : modifie la liste LINES ci-dessous (une ligne = un élément).
// Tu peux en ajouter ou en retirer : la taille des lettres s'adapte toute seule
// pour que la plus longue phrase tienne sur une seule ligne (sur ordinateur).
const LINES = [
  'Ici, pas une ligne de code.',
  'Curieuse, j’aime explorer différents univers.',
  'Je dessine, je maquille, je lis, je rêve.',
  'Bienvenue dans mon univers.',
]

const START_DELAY = 2000 // curseur seul, avant que le texte commence (ms)
const TYPE_SPEED = 38 // temps entre deux lettres (ms) : plus petit = plus rapide
const LINE_PAUSE = 450 // petite pause entre deux lignes (ms)
const HOLD = 3800 // le texte reste affiché complet (ms)
const ERASE_SPEED = 12 // vitesse d'effacement (ms par lettre)
const RESTART_DELAY = 700 // pause curseur seul avant de recommencer (ms)

// Ce qui est visible quand la ligne `l` est écrite jusqu'à la lettre `c` :
// les lignes d'avant sont complètes, celles d'après sont vides.
// (Calculé depuis LINES à chaque fois : ça marche même si tu ajoutes une ligne
// pendant que le site tourne.)
function frame(l, c) {
  return LINES.map((text, i) => (i < l ? text : i === l ? text.slice(0, c) : ''))
}

export default function TypeIntro() {
  const [shown, setShown] = useState(() => frame(0, 0))
  const [active, setActive] = useState(0) // ligne qui porte le curseur
  const timers = useRef([])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setShown(LINES)
      setActive(LINES.length - 1)
      return
    }

    let cancelled = false
    const wait = (ms) =>
      new Promise((resolve) => {
        const id = setTimeout(resolve, ms)
        timers.current.push(id)
      })

    async function run() {
      setShown(frame(0, 0))
      setActive(0)
      await wait(START_DELAY)
      while (!cancelled) {
        // Écriture
        for (let l = 0; l < LINES.length && !cancelled; l++) {
          setActive(l)
          for (let c = 1; c <= LINES[l].length && !cancelled; c++) {
            setShown(frame(l, c))
            await wait(TYPE_SPEED)
          }
          await wait(LINE_PAUSE)
        }
        await wait(HOLD)

        // Effacement, de la dernière ligne à la première
        for (let l = LINES.length - 1; l >= 0 && !cancelled; l--) {
          setActive(l)
          for (let c = LINES[l].length - 1; c >= 0 && !cancelled; c--) {
            setShown(frame(l, c))
            await wait(ERASE_SPEED)
          }
        }
        setActive(0)
        await wait(RESTART_DELAY)
      }
    }

    run()
    return () => {
      cancelled = true
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [])

  // Longueur de la plus longue phrase : sert à calculer la taille des lettres en CSS
  const longest = Math.max(...LINES.map((t) => t.length))

  return (
    <section
      className="type-intro wrap"
      aria-label={LINES.join(' ')}
      style={{ '--chars': longest }}
    >
      <div className="type-stack">
        {/* Copie invisible : réserve la hauteur pour que la page ne saute pas */}
        <div className="type-ghost" aria-hidden="true">
          {LINES.map((t, i) => (
            <p key={i} className="type-line">
              {t}
            </p>
          ))}
        </div>

        <div className="type-live" aria-hidden="true">
          {LINES.map((_, i) => (
            <p key={i} className="type-line">
              {shown[i] ?? ''}
              {i === active && <span className="type-cursor" />}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

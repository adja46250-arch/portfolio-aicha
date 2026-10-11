import { motion, useScroll, useTransform } from 'framer-motion'

// Mêmes nuages que sur l'accueil (classes .ap-clouds / .ap-cloud dans accueil.css),
// qui se forment au défilement.
const CLOUDS = ['c1', 'c2', 'c3', 'c4', 'c5']

export default function SkyClouds({ targetRef, variant = '', offset = ['start end', 'start 15%'] }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset })
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [0, 1, 1])
  const scale = useTransform(scrollYProgress, [0, 1], [0.55, 1.05])
  const y = useTransform(scrollYProgress, [0, 1], [70, 0])
  return (
    <div className={`ap-clouds ${variant}`} aria-hidden="true">
      {CLOUDS.map((c) => (
        <motion.i key={c} className={`ap-cloud ${c}`} style={{ opacity, scale, y }} />
      ))}
    </div>
  )
}

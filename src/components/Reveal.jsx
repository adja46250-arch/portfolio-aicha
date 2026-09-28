import { motion } from 'framer-motion'

// Fait apparaître son contenu en fondu + léger décalage vertical quand il
// entre dans l'écran. `delay` permet d'enchaîner plusieurs Reveal pour un
// effet de cascade (voir Projects.jsx, Home.jsx).
export default function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const Tag = motion[as] || motion.div

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}

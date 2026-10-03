import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Gallery from './pages/Gallery'
import ProjectDetail from './pages/ProjectDetail'
import About from './pages/About'
import Universe from './pages/Universe'
import DrawingGallery from './pages/DrawingGallery'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
}

function Page({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <Header />
      <AnimatePresence
        mode="wait"
        onExitComplete={() =>
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        }
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/projets" element={<Page><Projects /></Page>} />
          <Route path="/projets/galerie" element={<Page><Gallery /></Page>} />
          <Route path="/projets/:id" element={<Page><ProjectDetail /></Page>} />
          <Route path="/parcours" element={<Page><About /></Page>} />
          <Route path="/univers" element={<Page><Universe /></Page>} />
          <Route path="/univers/dessins" element={<Page><DrawingGallery /></Page>} />
          <Route path="/contact" element={<Page><Contact /></Page>} />
          <Route path="/admin" element={<Page><Admin /></Page>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}

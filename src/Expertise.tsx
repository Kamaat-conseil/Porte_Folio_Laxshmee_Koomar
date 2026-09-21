import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import DecorativeStar from './DecorativeStar'
import './Expertise.css'

const expertises = [
  { title: 'Direction artistique', description: 'Donner une direction à vos idées. Imaginer un univers sensible et cohérent, où les couleurs, les images et les mots racontent la même histoire.', details: 'Concept créatif · Univers de marque · Moodboard' },
  { title: 'Identité visuelle', description: 'Faire émerger ce qui vous rend unique. Construire une signature visuelle reconnaissable, pensée pour accompagner votre marque sur tous ses supports.', details: 'Logo · Charte graphique · Déclinaisons' },
  { title: 'Contenus & social media', description: 'Faire vivre votre univers au quotidien. Concevoir des contenus visuels qui prolongent votre identité et créent un lien avec votre communauté.', details: 'Visuels éditoriaux · Réseaux sociaux · Montage vidéo' },
  { title: 'Coordination créative', description: 'Relier les idées, les personnes et les étapes. Accompagner la création pour préserver le sens et la cohérence du projet, de son intention à sa réalisation.', details: 'Suivi de projet · Cohérence visuelle · Production créative' },
]

export default function Expertise() {
  const [active, setActive] = useState<number | null>(null)
  const id = useId()
  const reduced = useReducedMotion()
  return <div className="expertise expertise-accordion">
    {expertises.map((item, index) => {
      const open = active === index
      const triggerId = `${id}-trigger-${index}`
      const panelId = `${id}-panel-${index}`
      return <div key={item.title} className={`expertise-item${open ? ' is-open' : ''}`}>
        <h3 className="expertise-heading"><button id={triggerId} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setActive(open ? null : index)}>
          <span className="expertise-title">{item.title}</span>
          <motion.span className="expertise-star" aria-hidden="true" animate={{ rotate: open ? 135 : 0, scale: open ? 1.08 : 1 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 145, damping: 15 }}><DecorativeStar /></motion.span>
        </button></h3>
        <AnimatePresence initial={false}>
          {open && <motion.div id={panelId} role="region" aria-labelledby={triggerId} className="expertise-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : .48, ease: [.22, 1, .36, 1] }}>
            <motion.div className="expertise-content" initial={{ y: reduced ? 0 : 12 }} animate={{ y: 0 }} transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : .07 }}>
              <div><p>{item.description}</p><span className="expertise-details">{item.details}</span></div>
            </motion.div>
          </motion.div>}
        </AnimatePresence>
      </div>
    })}
  </div>
}

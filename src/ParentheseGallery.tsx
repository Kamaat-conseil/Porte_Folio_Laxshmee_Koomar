import { motion, useReducedMotion } from 'framer-motion';

const pairs = [
  { title: 'Une identité, deux signatures.', kind: 'identity', images: [['parenthese-logo', 'Le logo principal'], ['parenthese-submark', 'La signature secondaire']] },
  { title: 'L’univers prend la parole.', kind: 'editorial', images: [['parenthese-cover', 'Le magazine · La couverture'], ['parenthese-founder', 'Le magazine · Le mot de la fondatrice']] },
  { title: 'Prolonger la rencontre.', kind: 'communication', images: [['parenthese-contact', 'Le magazine · Invitation au contact'], ['parenthese-social', 'Instagram · Portrait de la fondatrice']] },
] as const;

export default function ParentheseGallery() {
  const reduced = useReducedMotion();
  return <div className="parenthese-gallery">{pairs.map(pair => <section key={pair.kind} className={`parenthese-pair ${pair.kind}`}>
    <h3>{pair.title}</h3>
    <div className="parenthese-pair-grid">{pair.images.map(([image, label]) => <motion.figure key={image} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .6 }}>
      <div className="parenthese-art-mat"><img src={`/images/${image}.webp`} alt={`Parenthèse — ${label}`} loading="lazy" /></div>
      <figcaption>{label}</figcaption>
    </motion.figure>)}</div>
  </section>)}</div>;
}

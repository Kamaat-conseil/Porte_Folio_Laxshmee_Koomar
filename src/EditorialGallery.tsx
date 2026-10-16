import { motion, useReducedMotion } from 'framer-motion';
import './editorial-gallery.css';

const galleries = {
  maeva: {
    name: 'Maëva Hubert',
    chapters: [
      { title: 'Une signature, toute en douceur.', kind: 'identity', images: [['maeva-1', 'Le logo & le monogramme MH'], ['maeva-3', 'L’atmosphère de la marque']] },
      { title: 'Du réel à l’imaginaire.', kind: 'collection', images: [['maeva-4', 'Le portrait au cabinet'], ['maeva-5', 'La déclinaison illustrée']] },
      { title: 'La personne derrière la signature.', kind: 'focus', description: 'Un portrait de présentation aux couleurs de la marque. Une façon de raconter son parcours et de créer un premier lien, avant même la rencontre.', images: [['maeva-2', 'Réseaux sociaux · Qui suis-je ?']] },
    ],
  },
  unik: {
    name: 'Unik Locks',
    chapters: [
      { title: 'Une signature. Une personnalité.', kind: 'signatures', images: [['unik-1', 'La signature visuelle'], ['unik-3', 'Le personnage illustré']] },
      { title: 'Du premier regard au prochain rendez-vous.', kind: 'print', images: [['unik-2', 'Le flyer de la marque'], ['unik-4', 'Les cartes de fidélité']] },
      { title: 'Le soin continue.', kind: 'focus', description: 'Un univers qui accompagne aussi les gestes du quotidien. Conseils et suivi prolongent l’expérience au-delà du rendez-vous.', images: [['unik-5', 'Les supports de conseils et de suivi']] },
    ],
  },
  bertine: {
    name: 'Pâtisserie Bertine',
    chapters: [
      { title: 'Une marque, un visage gourmand.', kind: 'signatures', images: [['bertine-1', 'Le logo existant · Point de départ'], ['bertine-3', 'Le personnage illustré']] },
      { title: 'La gourmandise prend des couleurs.', kind: 'collection', images: [['bertine-6', 'La collection Heartcake'], ['bertine-7', 'La collection Kids Cake']] },
      { title: 'De l’univers à la création.', kind: 'print', images: [['bertine-4', 'La mise en scène des créations'], ['bertine-5', 'La photographie pâtissière']] },
      { title: 'L’art de partager.', kind: 'focus', description: 'Une communication qui donne envie et qui accompagne. Le langage visuel de la marque se décline jusque dans ses conseils pratiques.', images: [['bertine-2', 'Le contenu pédagogique · Découper un layer cake']] },
    ],
  },
} as const;

export default function EditorialGallery({ project }: { project: keyof typeof galleries }) {
  const reduced = useReducedMotion();
  const gallery = galleries[project];
  return <div className={`editorial-gallery editorial-gallery--${project}`}>
    {gallery.chapters.map(chapter => <section className={`editorial-chapter editorial-chapter--${chapter.kind}`} key={chapter.kind} aria-labelledby={`${project}-${chapter.kind}`}>
      <header className="editorial-chapter-heading">
        <h3 id={`${project}-${chapter.kind}`}>{chapter.title}</h3>
        {'description' in chapter && <p>{chapter.description}</p>}
      </header>
      <div className="editorial-duo">{chapter.images.map(([image, label], index) => <motion.figure key={image}
        initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .08 }} transition={{ duration: .65, delay: reduced ? 0 : index * .1 }}>
        <div className="editorial-mat"><img src={`/images/${image}.webp`} alt={`${gallery.name} — ${label}`} loading="lazy" /></div>
        <figcaption>{label}</figcaption>
      </motion.figure>)}</div>
    </section>)}
  </div>;
}

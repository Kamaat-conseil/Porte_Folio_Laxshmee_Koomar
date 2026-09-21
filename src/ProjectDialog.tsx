import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import SignatureLink from './SignatureLink';
import { type Project } from './data';

type Props = { project: Project; onClose: () => void; onContact: () => void };
export default function ProjectDialog({ project, onClose, onContact }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const element = dialog.current;
    element?.showModal();
    return () => { element?.close(); document.body.style.overflow = previousOverflow; previous?.focus(); };
  }, []);
  return <dialog ref={dialog} className={`project-dialog ${project.id}`} aria-labelledby="project-title" onCancel={onClose}>
    <button className="close-button" aria-label="Fermer le projet" onClick={onClose}><X size={22} /></button>
    <motion.div initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
      <header className="detail-header"><span className="eyebrow">Étude de cas / {project.year}</span><h2 id="project-title">{project.name}</h2><p>{project.headline}</p></header>
      <div className="detail-story"><p>{project.intro}</p><div><span className="eyebrow">L’accompagnement</span><ul>{project.services.map(service => <li key={service}>{service}</li>)}</ul></div></div>
      <div className="detail-gallery">{project.images.map((image, index) => <img key={image} src={`/images/${image}.webp`} alt={`${project.name} — ${['identité visuelle', 'contenu de marque', 'déclinaison créative', 'supports de communication', 'univers visuel'][index] ?? `création ${index + 1}`}`} loading={index ? 'lazy' : 'eager'} />)}</div>
      <div className="detail-end"><p>{project.description}</p><SignatureLink onClick={onContact}>Imaginons votre univers</SignatureLink><button className="text-button" onClick={onClose}>Revenir aux projets</button></div>
    </motion.div>
  </dialog>;
}

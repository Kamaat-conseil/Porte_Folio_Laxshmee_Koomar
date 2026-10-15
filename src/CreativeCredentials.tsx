import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X, Download } from 'lucide-react';
import DecorativeStar from './DecorativeStar';
import './credentials.css';

const documents = [
  { title: 'Mon parcours', label: 'Consulter mon CV', note: 'Direction artistique & coordination créative', file: 'laxshmee-koomar-cv.pdf', pages: ['cv-preview.webp'], tag: 'LE SENS DU PARCOURS' },
  { title: 'Le geste, certifié.', label: 'Voir ma certification', note: 'ICDL · Édition d’image · Photoshop · 2024', file: 'laxshmee-koomar-icdl.pdf', pages: ['icdl-preview-1.webp', 'icdl-preview-2.webp'], tag: 'LA PRÉCISION DU SAVOIR-FAIRE' },
] as const;
type Document = typeof documents[number];

function DocumentViewer({ document: item, onClose }: { document: Document; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const element = dialog.current;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={dialog} className="credential-dialog" aria-labelledby="credential-title" onCancel={onClose}>
    <header className="credential-toolbar"><div><span>{item.tag}</span><h2 id="credential-title">{item.title}</h2></div><button onClick={onClose} aria-label="Fermer le document"><X size={22} /></button></header>
    <motion.div className="credential-pages" initial={reduced ? false : { opacity: 0, y: 35, rotateX: 5 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: .7 }}>
      {item.pages.map((page, index) => <img key={page} src={`/documents/${page}`} alt={`${item.label} — page ${index + 1}`} />)}
    </motion.div>
    <div className="credential-download"><a href={`/documents/${item.file}`} download><Download size={18} /> Télécharger le PDF</a></div>
  </dialog>;
}

export default function CreativeCredentials() {
  const [selected, setSelected] = useState<Document | null>(null);
  const reduced = useReducedMotion();
  return <>
    <div className="credentials" aria-label="Parcours et certification">
      {documents.map((item, index) => <motion.button key={item.file} className={`credential-card credential-card-${index}`} onClick={() => setSelected(item)} whileHover={reduced ? undefined : { y: -5 }} whileTap={reduced ? undefined : { scale: .98 }}>
        <span className="credential-paper" aria-hidden="true"><img src={`/documents/${item.pages[0]}`} alt="" loading="lazy" /></span>
        <span className="credential-card-copy"><span className="credential-tag">{item.tag}</span><span className="credential-heading">{item.title}</span><span className="credential-note">{item.note}</span><span className="credential-action">{item.label}<DecorativeStar /></span></span>
      </motion.button>)}
    </div>
    {selected && <DocumentViewer document={selected} onClose={() => setSelected(null)} />}
  </>;
}

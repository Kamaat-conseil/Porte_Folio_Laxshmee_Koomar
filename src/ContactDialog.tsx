import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import DecorativeStar from './DecorativeStar';
import { submitContact } from './contactSubmission';
import './contact-dialog.css';
import ContactReveal from './ContactReveal';

type Props = { onClose: () => void };
export default function ContactDialog({ onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const request = useRef<AbortController | null>(null);
  const inFlight = useRef(false);
  const successTitle = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [localPreview, setLocalPreview] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);
  const [closeFocused, setCloseFocused] = useState(false);
  const closeExpanded = closeHovered || closeFocused;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const element = dialog.current;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    return () => {
      request.current?.abort();
      element?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  useEffect(() => { if (status === 'success') successTitle.current?.focus(); }, [status]);
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !event.currentTarget.reportValidity()) return;
    inFlight.current = true;
    setStatus('pending');
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      await submitContact(event.currentTarget, controller.signal);
      setStatus('success');
    } catch (error) {
      setLocalPreview(error instanceof Error && error.message === 'LOCAL_PREVIEW');
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
      inFlight.current = false;
    }
  }
  const reveal = {
    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : .65 } },
  };
  return <dialog ref={dialog} className="contact-dialog" aria-labelledby="contact-dialog-title"
    onCancel={event => { event.preventDefault(); onClose(); }}>
    <motion.div className="contact-material" aria-hidden="true" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: reduced ? .34 : .58 }} transition={{ duration: reduced ? 0 : 1.6, delay: reduced ? 0 : 1.25 }} />
    <ContactReveal />
    <motion.button className="contact-close" data-expanded={closeExpanded} onClick={onClose} aria-label="Fermer le formulaire"
      onHoverStart={() => setCloseHovered(true)} onHoverEnd={() => setCloseHovered(false)} onFocus={event => setCloseFocused(event.currentTarget.matches(':focus-visible'))} onBlur={() => setCloseFocused(false)}
      initial={false} animate={{ width: closeExpanded ? 128 : 48 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 25 }}>
      <span className="contact-close-label">Fermer</span><span className="contact-close-icon"><X size={19} /></span>
    </motion.button>
    <div className="contact-atmosphere" aria-hidden="true" />
    <motion.div className="contact-composition" initial="hidden" animate="visible"
      variants={{ visible: { transition: { staggerChildren: reduced ? 0 : .12, delayChildren: reduced ? 0 : 1.25 } } }}>
      <motion.aside className="contact-invitation" variants={reveal}>
        <span className="contact-kicker">KOOMAR · UNE RENCONTRE CRÉATIVE</span>
        <div className="contact-star" aria-hidden="true"><motion.span initial={reduced ? false : { rotate: -135, scale: .5 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 1.4, ease: [.16, 1, .3, 1] }}><DecorativeStar /></motion.span></div>
        <h2 id="contact-dialog-title">Et si tout<br />commençait<br /><em>par vous ?</em></h2>
        <p>Une envie, une intuition, un projet.<br />Donnons-lui une première étincelle.</p>
        <span className="contact-signature">Laxshmee Koomar</span>
      </motion.aside>
      <motion.div className="contact-paper" variants={reveal}>
        {status === 'success' ? <motion.div className="contact-success" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span className="contact-success-star"><DecorativeStar /></span>
          <span className="contact-kicker">MESSAGE ENVOYÉ</span>
          <h3 ref={successTitle} tabIndex={-1}>Votre idée a trouvé<br /><em>son chemin.</em></h3>
          <p>Merci pour votre confiance. Votre message a bien été transmis à Koomar.</p>
          <button className="contact-submit" onClick={onClose}>Revenir à l’univers Koomar<DecorativeStar /></button>
        </motion.div> : <form name="contact" onSubmit={send} aria-busy={status === 'pending'}>
          <input type="hidden" name="form-name" value="contact" />
          <div className="contact-honeypot" aria-hidden="true"><label>Ne pas remplir<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></div>
          <span className="contact-kicker">VOTRE PROJET, EN QUELQUES MOTS</span>
          <div className="contact-fields-row">
            <label>Votre nom<input name="name" autoComplete="name" required maxLength={100} placeholder="Comment vous appelez-vous ?" /></label>
            <label>Votre adresse e-mail<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="vous@exemple.fr" /></label>
          </div>
          <label>Ce que vous imaginez <span className="contact-optional">(facultatif)</span><select name="service" defaultValue=""><option value="">Choisir un accompagnement</option><option>Direction artistique</option><option>Identité visuelle</option><option>Contenus & social media</option><option>Coordination créative</option><option>Une idée à explorer ensemble</option></select></label>
          <label>Racontez-moi votre idée<textarea name="message" required minLength={10} maxLength={5000} rows={4} placeholder="Votre univers, vos envies, ce que vous aimeriez créer…" /></label>
          <p className="contact-privacy">Vos coordonnées servent uniquement à vous répondre au sujet de votre projet. Les champs nom, e-mail et message sont nécessaires.</p>
          {status === 'error' && <p className="contact-error" role="alert">{localPreview ? 'Cette version est un aperçu local. L’envoi est disponible sur le site en ligne ; votre message est conservé ici.' : 'L’envoi n’a pas abouti. Votre message est conservé : vérifiez votre connexion, puis réessayez.'}</p>}
          <button className="contact-submit" type="submit" disabled={status === 'pending'}><span>{status === 'pending' ? 'Envoi en cours…' : 'Envoyer mon message'}</span><motion.span aria-hidden="true" animate={{ rotate: status === 'pending' && !reduced ? 360 : 0 }} transition={{ duration: 2, repeat: status === 'pending' && !reduced ? Infinity : 0 }}><DecorativeStar /></motion.span></button>
        </form>}
      </motion.div>
    </motion.div>
  </dialog>;
}

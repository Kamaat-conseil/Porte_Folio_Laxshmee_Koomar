import { useEffect, useRef, useState } from 'react';
import BrandLogo from './BrandLogo';
import './welcome.css';

export const INTRO_STORAGE_KEY = 'koomar-intro-seen-v1';
const INTRO_DURATION = 3600;

function shouldShowIntro(force = false) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (force) return true;
  try { return localStorage.getItem(INTRO_STORAGE_KEY) !== 'seen'; }
  catch { return true; }
}

export default function WelcomeIntro({ onComplete, force = false }: { onComplete: () => void; force?: boolean }) {
  const [visible, setVisible] = useState(() => shouldShowIntro(force));
  const dialog = useRef<HTMLDialogElement>(null);
  const completed = useRef(false);
  const callback = useRef(onComplete);
  callback.current = onComplete;

  const finish = () => {
    if (completed.current) return;
    completed.current = true;
    try { localStorage.setItem(INTRO_STORAGE_KEY, 'seen'); } catch { /* Private browsing can disable storage. */ }
    dialog.current?.close();
    setVisible(false);
    callback.current();
  };

  useEffect(() => {
    if (!visible) { if (!completed.current) { completed.current = true; callback.current(); } return; }
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    const timer = window.setTimeout(finish, INTRO_DURATION);
    return () => { window.clearTimeout(timer); element?.close(); document.body.style.overflow = overflow; };
    // The timer belongs to this opening; callback ref always uses the latest parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;
  return <dialog ref={dialog} className="welcome-intro" aria-label="Bienvenue dans l’univers Koomar" onCancel={finish}>
    <div className="dream-light" aria-hidden="true" />
    <div className="dream-orbit orbit-one" aria-hidden="true" />
    <div className="dream-orbit orbit-two" aria-hidden="true" />
    <span className="welcome-edition">Laxshmee Koomar · Direction artistique</span>
    <div className="welcome-center"><div className="welcome-seal"><BrandLogo /></div><p>Tout commence<br/>par <em>une étincelle.</em></p><span className="welcome-rule" aria-hidden="true" /></div>
    <span className="welcome-caption">Entrer dans un univers singulier</span>
    <button className="welcome-skip" onClick={finish}>Passer l’introduction <span aria-hidden="true">↗</span></button>
  </dialog>;
}

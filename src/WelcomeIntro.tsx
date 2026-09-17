import { useEffect, useRef, useState } from 'react';
import BrandLogo from './BrandLogo';
import { startLogoDissolve } from './logoDissolve';
import './welcome.css';

export const INTRO_STORAGE_KEY = 'koomar-intro-seen-v2';
const INTRO_DURATION = 8200;

function shouldShowIntro(force = false) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (force) return true;
  try { return localStorage.getItem(INTRO_STORAGE_KEY) !== 'seen'; }
  catch { return true; }
}

export default function WelcomeIntro({ onComplete, force = false }: { onComplete: () => void; force?: boolean }) {
  const [visible, setVisible] = useState(() => shouldShowIntro(force));
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
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
    const stopAnimation = canvas.current ? startLogoDissolve(canvas.current) : () => {};
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (event: MediaQueryListEvent) => { if (event.matches) finish(); };
    motion.addEventListener('change', onMotionChange);
    const timer = window.setTimeout(finish, INTRO_DURATION);
    return () => { window.clearTimeout(timer); stopAnimation(); motion.removeEventListener('change', onMotionChange); element?.close(); document.body.style.overflow = overflow; };
    // The timer belongs to this opening; callback ref always uses the latest parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;
  return <dialog ref={dialog} className="welcome-intro" aria-label="Bienvenue dans l’univers Koomar" onCancel={finish}>
    <div className="dream-fallback" aria-hidden="true" />
    <canvas ref={canvas} className="dream-canvas" aria-hidden="true" />
    <div className="dream-vignette" aria-hidden="true" />
    <div className="dream-orbit" aria-hidden="true" />
    <span className="welcome-edition">Laxshmee Koomar · Direction artistique</span>
    <p className="dream-whisper">Tout commence par <em>une étincelle.</em></p>
    <div className="welcome-center"><div className="welcome-signature"><BrandLogo /></div><span>Une idée. Un univers. Votre signature.</span></div>
    <span className="welcome-caption">Un univers singulier prend forme.</span>
    <button className="welcome-skip" onClick={finish}>Passer l’introduction <span aria-hidden="true">↗</span></button>
    <div className="dream-progress" aria-hidden="true" />
  </dialog>;
}

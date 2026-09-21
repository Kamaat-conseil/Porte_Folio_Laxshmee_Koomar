import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import BrandLogo from './BrandLogo';
import { startLogoDissolve } from './logoDissolve';

export default function ContactReveal() {
  const reduced = useReducedMotion();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (reduced || !canvas.current) return;
    const stop = startLogoDissolve(canvas.current, 2.5);
    const timer = window.setTimeout(() => { stop(); setFinished(true); }, 3100);
    return () => { window.clearTimeout(timer); stop(); };
  }, [reduced]);
  if (reduced || finished) return null;
  return <div className="contact-reveal" aria-hidden="true">
    <div className="contact-reveal-fallback" />
    <canvas ref={canvas} className="contact-reveal-canvas" />
    <motion.div className="contact-reveal-signature"
      initial={{ opacity: 0, scale: .94, filter: 'blur(9px)' }}
      animate={{ opacity: [0, 1, 1, 0], scale: [.94, 1, 1.025, 1.09], filter: ['blur(9px)', 'blur(0px)', 'blur(0px)', 'blur(12px)'] }}
      transition={{ duration: 2.2, times: [0, .2, .48, 1] }}>
      <BrandLogo />
      <span>Une rencontre. Mille possibles.</span>
    </motion.div>
  </div>;
}

import { useRef, type PointerEvent } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';
import DecorativeStar from './DecorativeStar';

export default function SignatureLink({ href, children, className = '' }: { href: string; children: string; className?: string }) {
  const reduced = useReducedMotion();
  const anchor = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 20 });
  const y = useSpring(0, { stiffness: 220, damping: 20 });
  const reset = () => { x.set(0); y.set(0); };
  const follow = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduced || event.pointerType !== 'mouse') return;
    const bounds = anchor.current?.getBoundingClientRect();
    if (!bounds) return;
    x.set(Math.max(-6, Math.min(6, (event.clientX - bounds.left - bounds.width / 2) * .07)));
    y.set(Math.max(-4, Math.min(4, (event.clientY - bounds.top - bounds.height / 2) * .12)));
  };
  return <motion.a ref={anchor} href={href} className={`signature-link ${className}`} style={{ x: reduced ? 0 : x, y: reduced ? 0 : y }} onPointerMove={follow} onPointerLeave={reset} onBlur={reset} whileTap={reduced ? undefined : { scale: .97 }}>
    <span className="signature-fill" aria-hidden="true" />
    <span className="signature-mark" aria-hidden="true"><DecorativeStar /></span>
    <span className="signature-label"><span>{children}</span><span aria-hidden="true">{children}</span></span>
  </motion.a>;
}

import { useRef, type PointerEvent } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';
import DecorativeStar from './DecorativeStar';

type Props = { children: string; className?: string } & ({ href: string; onClick?: never } | { href?: never; onClick: () => void });
export default function SignatureLink({ href, onClick, children, className = '' }: Props) {
  const reduced = useReducedMotion();
  const anchor = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 20 });
  const y = useSpring(0, { stiffness: 220, damping: 20 });
  const reset = () => { x.set(0); y.set(0); };
  const follow = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== 'mouse') return;
    const bounds = anchor.current?.getBoundingClientRect();
    if (!bounds) return;
    x.set(Math.max(-6, Math.min(6, (event.clientX - bounds.left - bounds.width / 2) * .07)));
    y.set(Math.max(-4, Math.min(4, (event.clientY - bounds.top - bounds.height / 2) * .12)));
  };
  const content = <>
    <span className="signature-fill" aria-hidden="true" />
    <span className="signature-mark" aria-hidden="true"><DecorativeStar /></span>
    <span className="signature-label"><span>{children}</span><span aria-hidden="true">{children}</span></span>
  </>;
  const shared = { ref: anchor, className: `signature-link ${className}`, style: { x: reduced ? 0 : x, y: reduced ? 0 : y }, onPointerMove: follow, onPointerLeave: reset, onBlur: reset, whileTap: reduced ? undefined : { scale: .97 } };
  return href !== undefined ? <motion.a {...shared} href={href}>{content}</motion.a> : <motion.button {...shared} type="button" onClick={onClick}>{content}</motion.button>;
}

import { useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Plus } from 'lucide-react';
import { contactEmail, contactHref, projects, type Project } from './data';
import ProjectDialog from './ProjectDialog';
import BrandLogo from './BrandLogo';
import WelcomeIntro from './WelcomeIntro';

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 130]);
  return <section className="hero" ref={ref} aria-labelledby="hero-title">
    <div className="hero-meta"><span>Direction artistique & design</span><span>Portfolio — 2026</span></div>
    <motion.h1 id="hero-title" initial={{ opacity: 0, y: reduced ? 0 : -35 }} animate={{ opacity: ready ? 1 : 0, y: ready || reduced ? 0 : -35 }} transition={{ duration: 1.15, ease: [.22, 1, .36, 1] }}><span>Laxshmee</span> <span className="surname">Koomar<span className="name-dot">.</span></span></motion.h1>
    <motion.div className="portrait-frame" style={{ y: reduced ? 0 : y }} initial={{ clipPath: reduced ? 'inset(0%)' : 'inset(100% 0% 0% 0%)' }} animate={{ clipPath: ready || reduced ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }} transition={{ duration: 1.3, delay: .15, ease: [.22, 1, .36, 1] }}>
      <img src="/images/portrait.webp" alt="Laxshmee Koomar, directrice artistique" width="1333" height="2000" fetchPriority="high" />
      <span className="portrait-caption">Le sens du détail. L’envie de créer.</span>
    </motion.div>
    <div className="hero-left"><span className="little-star" aria-hidden="true">✳</span><p>Une idée.<br/>Un univers.<br/><em>Votre signature.</em></p></div>
    <div className="hero-right"><p>Directrice artistique &<br/>coordinatrice de projets créatifs.</p><a href={contactHref} className="hero-contact">Créons quelque chose ensemble <ArrowUpRight size={20}/></a></div>
    <div className="hero-bottom"><a href="#projets" className="scroll-link"><span className="circle"><ArrowDown size={18}/></span>Explorer mon univers</a><span className="hero-note">Des identités qui ont du sens.<br/>Et qui font la différence.</span><span className="edition">01 — 04</span></div>
  </section>;
}
function ProjectCard({ project, index, onSelect }: { project: Project; index: number; onSelect: (project: Project) => void }) {
  return <Reveal className={`project-card ${project.id}`}>
    <button className="project-art" aria-label={`Découvrir ${project.name}`} onClick={() => onSelect(project)}>
      <span className="art-label">KMR / {project.year}</span>
      {project.id === 'unik' ? <><img className="unik-main" src="/images/unik-2.webp" alt="Affiche Unik Locks dans les tons violets et lilas" loading="lazy"/><img className="unik-secondary" src="/images/unik-4.webp" alt="Carte de fidélité et palette Unik Locks" loading="lazy"/></> : <><img className="maeva-photo" src="/images/maeva-3.webp" alt="Univers doux et chaleureux de Maëva Hubert" loading="lazy"/><div className="maeva-brand"><img src="/images/maeva-cover.webp" alt="Monogramme MH de Maëva Hubert" loading="lazy"/><span>Un retour à soi.</span></div></>}
      <span className="project-open"><ArrowUpRight size={24}/><span>Découvrir le projet</span></span>
    </button>
    <div className="project-caption"><div><span className="project-number">0{index + 1}</span><h3>{project.name}</h3></div><span>{project.category}</span></div>
  </Reveal>;
}
function Contact() {
  return <section id="contact" className="contact"><Reveal><div className="section-top"><span className="eyebrow">04 / La prochaine histoire</span><span className="contact-star" aria-hidden="true">✳</span></div><h2>Et si on créait<br/><em>la suite ?</em></h2><div className="contact-bottom"><p>Une idée à faire grandir, une marque à révéler ?<br/>Tout commence par une conversation.</p><a className="pill cream" href={contactHref}>Parlons de votre projet <ArrowUpRight size={20}/></a></div><a className="email" href={contactHref}>{contactEmail}<ArrowUpRight size={18}/></a></Reveal></section>;
}
export default function App() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [ready, setReady] = useState(false);
  const [introVersion, setIntroVersion] = useState(0);
  return <>
    <WelcomeIntro key={introVersion} force={introVersion > 0} onComplete={() => setReady(true)} />
    <a className="skip-link" href="#projets">Aller aux projets</a>
    <header className="site-header"><a href="#" className="wordmark" aria-label="Laxshmee Koomar, accueil"><BrandLogo /></a><nav aria-label="Navigation principale"><a href="#projets">Projets <span>(02)</span></a><a href="#apropos">À propos</a><a href="#contact" className="nav-contact">Contact <ArrowUpRight size={16}/></a></nav></header>
    <main><Hero ready={ready}/>
      <section className="intro"><Reveal><span className="eyebrow">01 / L’intention</span><h2>L’art de rendre simple<br/><em>l’inoubliable.</em><span className="intro-star" aria-hidden="true">✳</span></h2><div className="intro-bottom"><span className="small-rule"/><p>Je transforme une idée en un univers de marque<br className="desktop-break"/> cohérent, identifiable et vivant.</p><a className="inline-link" href="#projets">Une sélection de projets <ArrowDown size={17}/></a></div></Reveal></section>
      <section id="projets" className="projects"><div className="section-top"><span className="eyebrow">02 / Univers choisis</span><span className="eyebrow">2025 — 2026</span></div><Reveal className="projects-heading"><h2>Chaque marque,<br/><em>une histoire.</em></h2><p>De la première intuition<br/>au dernier détail.</p></Reveal>{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onSelect={setSelected}/>)}</section>
      <section id="apropos" className="about"><Reveal className="about-image"><img src="/images/portrait.webp" alt="Portrait de Laxshmee Koomar" width="1333" height="2000" loading="lazy"/><span>Laxshmee Koomar / KMR Design</span></Reveal><Reveal className="about-copy"><span className="eyebrow">03 / Derrière les idées</span><h2>De la sensibilité.<br/>Du sens.<br/><em>Du caractère.</em></h2><p>Créer une identité, c’est raconter une histoire. De la stratégie à l’image, chaque détail a du sens.</p><p>J’accompagne les marques et les entrepreneures dans la construction et le déploiement de leur univers visuel. De la réflexion stratégique à la production des contenus, je veille à créer des identités cohérentes, singulières et pensées pour durer.</p><div className="expertise">{['Direction artistique', 'Identité visuelle', 'Contenus & social media', 'Coordination créative'].map(item => <div key={item}><span>{item}</span><Plus size={16}/></div>)}</div><a className="inline-link" href={contactHref}>Faisons connaissance <ArrowUpRight size={18}/></a></Reveal></section>
      <div className="marquee" aria-hidden="true"><div>{Array.from({length:4},(_,i)=><span key={i}>De l’idée à l’émotion <i>✳</i> Du sens à l’image <i>✳</i> </span>)}</div></div><Contact/>
    </main>
    <footer><a href="#" className="footer-logo" aria-label="Koomar, accueil"><BrandLogo /></a><span>© {new Date().getFullYear()} KMR Design</span><button className="replay-intro" onClick={() => setIntroVersion(version => version + 1)}>Revoir l’introduction ↗</button><a href="#">Retour en haut ↑</a></footer>
    {selected && <ProjectDialog project={selected} onClose={() => setSelected(null)}/>}
  </>;
}

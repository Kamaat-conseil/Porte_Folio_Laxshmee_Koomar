export default function BrandLogo({ className = '' }: { className?: string }) {
  return <span className={`brand-logo ${className}`}><img src="/images/about.webp" alt="Koomar — logo original" width="1254" height="1254" /></span>;
}

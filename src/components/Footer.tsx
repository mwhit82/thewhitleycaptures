import Link from 'next/link';
import { Photo } from './Photo';
import type { SiteSettings } from '@/content/types';
export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <Link href="/" aria-label="The Whitley Captures home">
          <Photo image={settings.logo} sizes="160px" className="footer-logo" />
        </Link>
        <div>
          <p className="eyebrow">A LITTLE STUDIO. A LOT OF HEART.</p>
          <p>
            {settings.location}
            <br />
            {settings.areaServed}
          </p>
          <a href={`mailto:${settings.email}`} className="footer-email">
            {settings.email}
          </a>
        </div>
        <div className="footer-socials">
          {settings.socials.map((s) => (
            <a href={s.href} key={s.href}>
              {s.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {settings.name}
        </span>
        <span>Photography by Rachel Whitley</span>
        <a href={settings.privacyUrl}>Privacy policy</a>
      </div>
    </footer>
  );
}

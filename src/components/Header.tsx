'use client';
import Link from 'next/link';
import { reviewLinks } from '@/content/navigation';
import { Photo } from './Photo';
import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Link as ContentLink, ContentImage } from '@/content/types';
export function Header({
  logo,
  navigation,
  services,
}: {
  logo: ContentImage;
  navigation: ContentLink[];
  services: ContentLink[];
}) {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const path = usePathname();
  const open = openPath === path;
  const toggle = useRef<HTMLButtonElement>(null);
  function close() {
    setOpenPath(null);
  }
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          close();
          toggle.current?.focus();
        }
      }}
    >
      <div className="header-inner">
        <Link
          href="/"
          aria-label="The Whitley Captures home"
          onClick={close}
          className="brand"
        >
          <Photo image={logo} sizes="124px" className="brand-logo" />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="header-cta" href="/#enquire" onClick={close}>
            Check availability <span aria-hidden="true">↗</span>
          </Link>
          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpenPath(open ? null : path)}
          >
            <span className={open ? 'menu-icon is-open' : 'menu-icon'}>
              <i />
              <i />
            </span>
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>
      <nav
        id="mobile-menu"
        className="mobile-nav"
        aria-label="Website menu"
        hidden={!open}
      >
        <p className="eyebrow">FIND YOUR PHOTO SHOOT</p>
        <div className="mobile-services">
          {services.map((n) => (
            <Link key={n.href} href={n.href} onClick={close}>
              {n.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
        <div className="mobile-extra">
          {[...navigation.slice(1), ...reviewLinks].map((n) => (
            <Link key={n.href} href={n.href} onClick={close}>
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

import type { Metadata } from 'next';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import './globals.css';
import { getSiteSettings, getServices } from '@/content';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { siteUrl, isProduction } from '@/lib/seo';
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'The Whitley Captures',
    template: '%s | The Whitley Captures',
  },
  robots: { index: isProduction, follow: isProduction },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getServices(),
  ]);
  return (
    <html lang="en-GB" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header
          logo={settings.logo}
          navigation={settings.navigation}
          services={services.map((s) => ({
            label: s.title,
            href: `/prices/${s.slug}`,
          }))}
        />
        {children}
        <Footer settings={settings} />
      </body>
    </html>
  );
}

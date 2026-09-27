import Link from 'next/link';
import { getHomepage, getSiteSettings } from '@/content';
import { Photo } from '@/components/Photo';
import {
  Enquiry,
  ServiceGrid,
  Testimonials,
  FinalCta,
} from '@/components/Sections';
import { Gallery } from '@/components/Gallery';
import { pageMetadata, jsonLd, siteUrl } from '@/lib/seo';
export async function generateMetadata() {
  return pageMetadata((await getHomepage()).seo, '/');
}
export default async function Home() {
  const [home, settings] = await Promise.all([
    getHomepage(),
    getSiteSettings(),
  ]);
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            '@id': new URL('/#business', siteUrl).href,
            name: settings.name,
            url: siteUrl.href,
            email: settings.email,
            areaServed: settings.areaServed,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Sherburn Hill',
              addressRegion: 'County Durham',
              addressCountry: 'GB',
            },
            sameAs: settings.socials.map((s) => s.href),
            image: new URL(home.hero.image.src, siteUrl).href,
          }),
        }}
      />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{home.hero.eyebrow}</p>
          <h1>
            {home.hero.heading}
            <br />
            <em>{home.hero.accent}</em>
          </h1>
          <p className="hero-description">{home.hero.copy}</p>
          <div className="hero-links">
            <Link className="button" href={home.hero.cta.href}>
              {home.hero.cta.label}
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href={home.hero.secondaryCta.href}>
              {home.hero.secondaryCta.label}
              <span aria-hidden="true">↓</span>
            </Link>
          </div>
          <p className="hero-footnote">
            STUDIO & LOCATION PHOTOGRAPHY
            <br />
            <span>Made personal. Kept forever.</span>
          </p>
        </div>
        <div className="hero-photo">
          <Photo
            image={home.hero.image}
            priority
            sizes="(max-width: 700px) 100vw, 60vw"
          />
          <div className="photo-caption">
            <span>THE WHITLEY CAPTURES</span>
            <span>A little of life, held still.</span>
          </div>
        </div>
      </section>
      <section id="about" className="intro section container">
        <div className="intro-image">
          <Photo
            image={home.introduction.image}
            sizes="(max-width: 700px) 70vw, 30vw"
          />
          <span className="intro-caption">THE FACE BEHIND THE CAMERA</span>
        </div>
        <div className="intro-copy">
          <p className="eyebrow">{home.introduction.eyebrow}</p>
          <h2>{home.introduction.heading}</h2>
          {home.introduction.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <span className="signature">{home.introduction.signature}</span>
        </div>
      </section>
      <Enquiry content={home.enquiry} email={settings.email} />
      <ServiceGrid content={home.services} services={home.services.items} />
      <section className="featured-section section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{home.featured.eyebrow}</p>
              <h2>{home.featured.heading}</h2>
            </div>
            <Link className="text-link" href={home.featured.cta.href}>
              {home.featured.cta.label}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <Gallery gallery={home.featured.gallery} />
        </div>
      </section>
      <Testimonials
        items={home.testimonials.items}
        heading={home.testimonials.heading}
        eyebrow={home.testimonials.eyebrow}
      />
      <FinalCta content={home.cta} />
    </main>
  );
}

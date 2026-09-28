import { ArrowIcon } from '@/components/ArrowIcon';
import Link from 'next/link';
import { getHomepage, getSiteSettings } from '@/content';
import { HeroSlideshow } from '@/components/HeroSlideshow';
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
  const [home, settings] = await Promise.all([
    getHomepage(),
    getSiteSettings(),
  ]);
  return pageMetadata(home.seo, '/', settings.seo);
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
            image: home.hero.image?.src
              ? new URL(home.hero.image.src, siteUrl).href
              : undefined,
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
              <span aria-hidden="true">
                <ArrowIcon direction="up-right" />
              </span>
            </Link>
            <Link className="text-link" href={home.hero.secondaryCta.href}>
              {home.hero.secondaryCta.label}
              <span aria-hidden="true">
                <ArrowIcon direction="down" />
              </span>
            </Link>
          </div>
          <p className="hero-footnote">
            {home.hero.footnote}
            <br />
            <span>{home.hero.motto}</span>
          </p>
        </div>
        <div className="hero-photo">
          <HeroSlideshow images={home.hero.images} fallback={home.hero.image} />
          <div className="photo-caption">
            <span>{settings.name.toUpperCase()}</span>
            <span>{home.hero.photoCaption}</span>
          </div>
        </div>
      </section>
      <section id="about" className="intro section container">
        <div className="intro-image">
          <Photo
            image={home.introduction.image}
            sizes="(max-width: 700px) 70vw, 30vw"
          />
          <span className="intro-caption">
            {home.introduction.imageCaption}
          </span>
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
      {home.featured?.gallery?.images.length > 0 && (
        <section className="featured-section section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{home.featured.eyebrow}</p>
                <h2>{home.featured.heading}</h2>
              </div>
              {home.featured.cta?.href && (
                <Link className="text-link" href={home.featured.cta.href}>
                  {home.featured.cta.label}
                  <span aria-hidden="true">
                    <ArrowIcon direction="up-right" />
                  </span>
                </Link>
              )}
            </div>
            <Gallery gallery={home.featured.gallery} />
          </div>
        </section>
      )}
      {home.awards?.articleSlug && (
        <section
          className={`awards-section section container ${home.awards.image?.src ? 'has-image' : ''}`}
        >
          {home.awards.image?.src && (
            <Link
              className="awards-image"
              href={`/post/${home.awards.articleSlug}`}
            >
              <Photo
                image={home.awards.image}
                sizes="(max-width: 700px) 90vw, 35vw"
              />
            </Link>
          )}
          <div className="awards-copy">
            <p className="eyebrow">A LITTLE RECOGNITION</p>
            <h2>{home.awards.heading}</h2>
            <p>{home.awards.copy}</p>
            <Link
              className="text-link"
              href={`/post/${home.awards.articleSlug}`}
            >
              My awards and the stories behind them{' '}
              <ArrowIcon direction="up-right" />
            </Link>
          </div>
        </section>
      )}
      <Testimonials
        items={home.testimonials.items}
        heading={home.testimonials.heading}
        eyebrow={home.testimonials.eyebrow}
      />
      <FinalCta content={home.cta} />
    </main>
  );
}

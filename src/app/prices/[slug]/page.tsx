import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServiceBySlug, getServices, getHomepage } from '@/content';
import { Photo } from '@/components/Photo';
import { Gallery } from '@/components/Gallery';
import { Testimonials, FinalCta } from '@/components/Sections';
import { pageMetadata, jsonLd, siteUrl } from '@/lib/seo';
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  return service
    ? pageMetadata(service.seo, `/prices/${service.slug}`)
    : { title: 'Page not found' };
}
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();
  const home = await getHomepage();
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            description: service.introduction,
            url: new URL(`/prices/${service.slug}`, siteUrl).href,
            provider: {
              '@type': 'ProfessionalService',
              '@id': new URL('/#business', siteUrl).href,
              name: 'The Whitley Captures',
            },
            areaServed: 'North East England',
          }),
        }}
      />
      <section className="service-hero">
        <div className="service-hero-copy">
          <Link href="/#photography" className="breadcrumb">
            ← All photography
          </Link>
          <p className="eyebrow">YOUR STORY, THROUGH MY LENS</p>
          <h1>{service.title}</h1>
          <p className="service-tagline">{service.description}</p>
          <p>{service.introduction}</p>
          <Link className="button" href={service.cta.href}>
            {service.cta.label}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="service-hero-photo">
          <Photo
            image={service.hero}
            priority
            sizes="(max-width: 700px) 100vw, 55vw"
          />
        </div>
      </section>
      {service.reviewNote && (
        <aside className="review-note container">{service.reviewNote}</aside>
      )}
      {service.sections.length > 0 && (
        <section className="service-story section container">
          {service.sections.map((s) => (
            <div className="story-row" key={s.id}>
              <h2>{s.heading}</h2>
              <div>
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
      <section className="section container service-gallery">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A FEW FAVOURITE CAPTURES</p>
            <h2>{service.gallery.title}</h2>
          </div>
          <span className="gallery-count">
            {String(service.gallery.images.length).padStart(2, '0')} PHOTOGRAPHS
          </span>
        </div>
        <Gallery gallery={service.gallery} />
      </section>
      {service.packages.length > 0 && (
        <section className="packages-section section">
          <div className="container">
            <div className="center-heading">
              <p className="eyebrow">YOUR PHOTO SHOOT</p>
              <h2>A little something to treasure.</h2>
              <p>
                I offer three levels of package, depending on your time and
                budget.
              </p>
            </div>
            <p className="review-note">{service.pricingNote}</p>
            <div className="packages">
              {service.packages.map((p, index) => (
                <article key={p.id}>
                  <p className="eyebrow">
                    0{index + 1} / {p.duration}
                  </p>
                  <h3>{p.title}</h3>
                  <p className="package-price">£{p.price}</p>
                  <ul>
                    {p.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {p.note && <p className="package-note">{p.note}</p>}
                  <Link className="text-link" href="/#enquire">
                    Enquire about {p.title}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </article>
              ))}
            </div>
            <div className="package-extras">
              {service.included.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}
      {service.faqs.length > 0 && (
        <section className="faq-section section container">
          <div>
            <p className="eyebrow">BEFORE YOUR VISIT</p>
            <h2>A few little questions.</h2>
          </div>
          <div>
            {service.faqs.map((f) => (
              <details key={f.id}>
                <summary>
                  {f.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
      <Testimonials
        items={service.testimonials}
        heading="Little ones. Lovely words."
      />
      <FinalCta content={home.cta} />
    </main>
  );
}

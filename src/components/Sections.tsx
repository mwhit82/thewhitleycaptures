import Link from 'next/link';
import type { Homepage, Testimonial, Service } from '@/content/types';
import { Photo } from './Photo';
import { SessionInquiryForm } from './SessionInquiryForm';
export function Enquiry({
  content,
  email,
}: {
  content: Homepage['enquiry'];
  email: string;
}) {
  return (
    <section id="enquire" className="enquiry-section">
      <div className="container enquiry-layout">
        <div className="enquiry-copy">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.heading}</h2>
          <p>{content.copy}</p>
          <div className="enquiry-detail">
            <span aria-hidden="true">✳</span>
            <p>
              A new arrival.
              <br />A growing family.
              <br />A moment worth keeping.
            </p>
          </div>
        </div>
        <SessionInquiryForm email={email} />
      </div>
    </section>
  );
}
export function ServiceGrid({
  content,
  services,
}: {
  content: Homepage['services'];
  services: Service[];
}) {
  return (
    <section id="photography" className="section container">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.heading}</h2>
        </div>
        <p>{content.copy}</p>
      </div>
      <div className="service-grid">
        {services.map((s, index) => (
          <Link
            href={`/prices/${s.slug}`}
            className={`service-card service-card-${index}`}
            key={s.id}
          >
            <div className="service-image">
              <Photo
                image={s.cardImage || s.hero}
                sizes={
                  index === 0
                    ? '(max-width: 700px) 100vw, 60vw'
                    : '(max-width: 700px) 50vw, 33vw'
                }
              />
            </div>
            <div className="service-label">
              <div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
              <span aria-hidden="true">↗</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
export function Testimonials({
  items,
  heading = 'A little love, from my families.',
  eyebrow = 'KIND WORDS',
}: {
  items: Testimonial[];
  heading?: string;
  eyebrow?: string;
}) {
  if (!items.length) return null;
  return (
    <section id="kind-words" className="testimonials section">
      <div className="container">
        <div className="center-heading">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{heading}</h2>
        </div>
        <div className="quotes">
          {items.map((t) => (
            <figure key={t.id}>
              <span className="quote-mark" aria-hidden="true">
                “
              </span>
              <blockquote>{t.quote}</blockquote>
              <figcaption>— {t.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
export function FinalCta({ content }: { content: Homepage['cta'] }) {
  return (
    <section className="final-cta container">
      <p className="eyebrow">{content.eyebrow}</p>
      <h2>{content.heading}</h2>
      <p>{content.copy}</p>
      <Link className="button" href={content.link.href}>
        {content.link.label}
        <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAboutPage, getSiteSettings } from '@/content';
import { Photo } from '@/components/Photo';
import { ArrowIcon } from '@/components/ArrowIcon';
import { pageMetadata } from '@/lib/seo';
export async function generateMetadata() {
  const [about, settings] = await Promise.all([
    getAboutPage(),
    getSiteSettings(),
  ]);
  if (!about) return {};
  return pageMetadata(about.seo, '/about-me', settings.seo);
}
export default async function AboutRachel() {
  const about = await getAboutPage();
  if (!about) notFound();
  return (
    <main id="main" className="about-page">
      <section className="intro section container">
        <div className="intro-image">
          <Photo
            image={about.portrait}
            priority
            sizes="(max-width: 700px) 80vw, 40vw"
          />
        </div>
        <div className="intro-copy">
          <p className="eyebrow">THE FACE BEHIND THE CAMERA</p>
          <h1>{about.heading}</h1>
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>
      <section className="section container article-end">
        <h2>{about.closingHeading}</h2>
        <Link className="button" href={about.cta.href}>
          {about.cta.label} <ArrowIcon />
        </Link>
      </section>
    </main>
  );
}

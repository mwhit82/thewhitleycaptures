import { ArrowIcon } from '@/components/ArrowIcon';
import Link from 'next/link';
import { getPortfolio, getSiteSettings } from '@/content';
import { portfolioTabs, portfolioHref } from '@/content/navigation';
import { Gallery } from '@/components/Gallery';
import { pageMetadata } from '@/lib/seo';
export async function generateMetadata() {
  const settings = await getSiteSettings();
  return pageMetadata(
    {
      ...settings.seo,
      title: 'Photography portfolio | The Whitley Captures',
      description:
        'Explore Rachel’s newborn, maternity and family photography in Durham.',
    },
    '/portfolio',
    settings.seo,
  );
}
export default async function Portfolio({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const services = await getPortfolio();
  const selected = tab
    ? services.find((s) => portfolioTabs[s.slug] === tab || s.slug === tab)
    : services[0];
  return (
    <main id="main" className="section container portfolio-page">
      <p className="eyebrow">THROUGH MY LENS</p>
      <h1>My portfolio</h1>
      <p className="page-lead">
        A few favourite captures, and a little inspiration for your own photo
        shoot.
      </p>
      <nav className="portfolio-nav" aria-label="Photography categories">
        {services.map((s) => (
          <Link
            key={s.id}
            href={portfolioHref(s.slug)}
            aria-current={selected?.id === s.id ? 'page' : undefined}
          >
            {s.title}
          </Link>
        ))}
      </nav>
      {selected ? (
        <section key={selected.id} aria-label={selected.title}>
          <div className="section-heading">
            <h2>{selected.title}</h2>
            <Link className="text-link" href={`/prices/${selected.slug}`}>
              Photo shoots & prices <ArrowIcon direction="up-right" />
            </Link>
          </div>
          {selected.gallery?.images.length ? (
            <Gallery gallery={selected.gallery} />
          ) : (
            <p>
              More photographs will be added soon. Please get in touch to
              discuss your photo shoot.
            </p>
          )}
        </section>
      ) : (
        <section>
          <h2>This collection isn’t available in the preview yet.</h2>
          <p>
            Please choose one of the photography categories above, or{' '}
            <Link href="/#enquire">ask Rachel about this collection</Link>.
          </p>
        </section>
      )}
    </main>
  );
}

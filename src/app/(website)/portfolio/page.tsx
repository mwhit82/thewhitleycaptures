import Link from 'next/link';
import { redirect } from 'next/navigation';
import { portfolioTabs } from '@/content/navigation';
export const metadata = {
  title: 'Photography collection',
  robots: { index: false, follow: false },
};
export default async function LegacyPortfolio({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  if (!tab) redirect('/#photography');
  const slug = Object.keys(portfolioTabs).find(
    (slug) => portfolioTabs[slug] === tab || slug === tab,
  );
  if (slug) redirect(`/prices/${slug}#gallery`);
  return (
    <main id="main" className="section container portfolio-page">
      <h1>This collection isn’t available in the preview yet.</h1>
      <p>
        <Link href="/#photography">Explore photography sessions</Link> or{' '}
        <Link href="/#enquire">ask Rachel about this collection</Link>.
      </p>
    </main>
  );
}

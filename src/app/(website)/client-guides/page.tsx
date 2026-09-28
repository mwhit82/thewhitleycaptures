import { getArticles, getSiteSettings } from '@/content';
import { ArticleCards } from '@/components/ArticleCards';
import { pageMetadata } from '@/lib/seo';
export async function generateMetadata() {
  const s = await getSiteSettings();
  return pageMetadata(
    {
      ...s.seo,
      title: 'Client guides | The Whitley Captures',
      description:
        'Backdrop inspiration and advice on printing your photographs.',
    },
    '/client-guides',
    s.seo,
  );
}
export default async function ClientGuides() {
  const articles = await getArticles();
  return (
    <main id="main" className="section container guide-index">
      <p className="eyebrow">A LITTLE HELP ALONG THE WAY</p>
      <h1>Client guides</h1>
      <p className="page-lead">
        Choose a backdrop you love, and make the most of your finished
        photographs.
      </p>
      <ArticleCards articles={articles.filter((a) => a.kind === 'guide')} />
    </main>
  );
}

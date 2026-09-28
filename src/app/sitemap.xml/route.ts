import { getServices, getArticles } from '@/content';
import { isProduction, siteUrl } from '@/lib/seo';
export async function GET() {
  if (!isProduction)
    return new Response('Sitemap is disabled for this preview.', {
      status: 404,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    });
  const paths = [
    '/',
    '/portfolio',
    '/client-guides',
    ...(await getArticles()).map((a) => `/post/${a.slug}`),
    ...(await getServices()).map((s) => `/prices/${s.slug}`),
  ];
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escape(new URL(path, siteUrl).href)}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
}

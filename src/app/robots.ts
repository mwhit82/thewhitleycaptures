import type { MetadataRoute } from 'next';
import { isProduction, siteUrl } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  return isProduction
    ? {
        rules: { userAgent: '*', allow: '/' },
        sitemap: new URL('/sitemap.xml', siteUrl).href,
      }
    : { rules: { userAgent: '*', disallow: '/' } };
}

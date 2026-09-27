import type { Metadata } from 'next';
import type { Seo } from '@/content/types';
export const isProduction = process.env.SITE_MODE === 'production';
export const siteUrl = new URL(process.env.SITE_URL || 'http://localhost:3000');
export function pageMetadata(seo: Seo, path: string): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: new URL(path, siteUrl).href },
    robots: { index: isProduction, follow: isProduction },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      siteName: 'The Whitley Captures',
      url: new URL(path, siteUrl).href,
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: new URL(seo.image.src, siteUrl).href,
          width: seo.image.width,
          height: seo.image.height,
          alt: seo.image.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [new URL(seo.image.src, siteUrl).href],
    },
  };
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

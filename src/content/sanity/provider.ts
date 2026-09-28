import 'server-only';
import { cache } from 'react';
import { draftMode } from 'next/headers';
import { getSanityClient } from './client';
import type { ContentProvider } from '../types';
import { resolveImages } from './images';
import {
  settingsQuery,
  articlesQuery,
  articleQuery,
  homepageQuery,
  servicesQuery,
  serviceQuery,
} from './queries';
async function query<T>(groq: string, params = {}): Promise<T> {
  const { isEnabled } = await draftMode();
  if (isEnabled && !process.env.SANITY_API_READ_TOKEN)
    throw new Error('Draft preview needs SANITY_API_READ_TOKEN.');
  const client = getSanityClient().withConfig({
    perspective: isEnabled ? 'drafts' : 'published',
    token: isEnabled ? process.env.SANITY_API_READ_TOKEN : undefined,
  });
  const result = await client.fetch(
    groq,
    params,
    isEnabled ? { cache: 'no-store' } : { next: { revalidate: 60 } },
  );
  return resolveImages(result) as T;
}
function required<T>(value: T | null, area: string): T {
  if (!value)
    throw new Error(
      `Sanity ${area} is not published yet. Run cms:seed or publish it in /studio. CONTENT_SOURCE=local is available for offline review.`,
    );
  return value;
}
export const sanityProvider: ContentProvider = {
  getArticles: cache(async () => query(articlesQuery)),
  getArticleBySlug: cache(async (slug: string) =>
    query(articleQuery, { slug }),
  ),
  getPortfolio: cache(async () => query(servicesQuery)),
  getSiteSettings: cache(async () =>
    required(
      await query<Awaited<
        ReturnType<ContentProvider['getSiteSettings']>
      > | null>(settingsQuery),
      'site settings',
    ),
  ),
  getHomepage: cache(async () =>
    required(
      await query<Awaited<ReturnType<ContentProvider['getHomepage']>> | null>(
        homepageQuery,
      ),
      'homepage',
    ),
  ),
  getServices: cache(async () => query(servicesQuery)),
  getServiceBySlug: cache(async (slug: string) =>
    query(serviceQuery, { slug }),
  ),
};

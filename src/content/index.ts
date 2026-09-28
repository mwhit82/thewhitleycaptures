import 'server-only';
import { localProvider } from './local/provider';
import { sanityProvider } from './sanity/provider';
// Local fixtures are an explicit offline fallback, never merged with published CMS data.
export const contentSource =
  process.env.CONTENT_SOURCE ||
  (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? 'sanity' : 'local');
if (!['sanity', 'local'].includes(contentSource))
  throw new Error('CONTENT_SOURCE must be sanity or local');
const provider = contentSource === 'sanity' ? sanityProvider : localProvider;
export const {
  getSiteSettings,
  getHomepage,
  getServices,
  getServiceBySlug,
  getPortfolio,
  getArticles,
  getArticleBySlug,
} = provider;

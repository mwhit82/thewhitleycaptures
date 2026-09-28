import 'server-only';
import articles from './articles.json' with { type: 'json' };
import type { Article } from '../types';
import type { ContentProvider } from '../types';
import { settings } from './settings';
import { homepage } from './homepage';
import { services } from './services';
import { galleries } from './galleries';
import { testimonials } from './testimonials';
function resolve<T extends { id: string }>(items: T[], id: string): T {
  const item = items.find((item) => item.id === id);
  if (!item) throw new Error(`Missing content reference: ${id}`);
  return item;
}
export const localProvider: ContentProvider = {
  async getArticles() {
    return articles as Article[];
  },
  async getArticleBySlug(slug) {
    return (articles as Article[]).find((a) => a.slug === slug) || null;
  },
  async getPortfolio() {
    return Promise.all(
      services.map(async (s) => ({
        ...s,
        gallery: resolve(galleries, s.galleryId),
        testimonials: s.testimonialIds.map((id) => resolve(testimonials, id)),
      })),
    );
  },
  async getSiteSettings() {
    return settings;
  },
  async getHomepage() {
    return {
      ...homepage,
      services: {
        ...homepage.services,
        items: homepage.services.ids.map((id) => resolve(services, id)),
      },
      featured: {
        ...homepage.featured,
        gallery: resolve(galleries, homepage.featured.galleryId),
      },
      testimonials: {
        ...homepage.testimonials,
        items: homepage.testimonials.ids.map((id) => resolve(testimonials, id)),
      },
    };
  },
  async getServices() {
    return [...services].sort((a, b) => a.order - b.order);
  },
  async getServiceBySlug(slug) {
    const service = services.find((s) => s.slug === slug);
    return service
      ? {
          ...service,
          gallery: resolve(galleries, service.galleryId),
          testimonials: service.testimonialIds.map((id) =>
            resolve(testimonials, id),
          ),
        }
      : null;
  },
};

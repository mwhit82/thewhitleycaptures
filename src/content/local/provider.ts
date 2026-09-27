import 'server-only';
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

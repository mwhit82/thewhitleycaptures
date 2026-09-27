import 'server-only';
import type { ContentProvider } from './types';
import { settings } from './local/settings';
import { homepage } from './local/homepage';
import { services } from './local/services';
import { galleries } from './local/galleries';
import { testimonials } from './local/testimonials';
function resolve<T extends { id: string }>(items: T[], id: string): T {
  const item = items.find((item) => item.id === id);
  if (!item) throw new Error(`Missing content reference: ${id}`);
  return item;
}
const localProvider: ContentProvider = {
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
// Future Sanity adapter implements ContentProvider here; pages never know the source.
export const { getSiteSettings, getHomepage, getServices, getServiceBySlug } =
  localProvider;

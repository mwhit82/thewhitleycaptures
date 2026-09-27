export type ContentImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  position?: { x: number; y: number };
};
export type Link = { label: string; href: string };
export type Seo = { title: string; description: string; image: ContentImage };
export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  serviceId?: string;
  serviceIds?: string[];
  featured?: boolean;
  order?: number;
};
export type Gallery = {
  id: string;
  title: string;
  images: ContentImage[];
  featuredImageIds: string[];
};
export type ContentSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};
export type Package = {
  id: string;
  title: string;
  price: number;
  duration: string;
  includes: string[];
  note?: string;
};
export type Service = {
  id: string;
  title: string;
  slug: string;
  order: number;
  description: string;
  cardImage?: ContentImage;
  hero: ContentImage;
  introduction: string;
  sections: ContentSection[];
  packages: Package[];
  pricingNote?: string;
  included: string[];
  galleryId: string;
  testimonialIds: string[];
  faqs: { id: string; question: string; answer: string }[];
  cta: Link;
  seo: Seo;
  reviewNote?: string;
};
export type SiteSettings = {
  id: string;
  name: string;
  logo: ContentImage;
  email: string;
  location: string;
  areaServed: string;
  navigation: Link[];
  socials: Link[];
  privacyUrl: string;
  seo: Seo;
};
export type Homepage = {
  id: string;
  hero: {
    eyebrow: string;
    heading: string;
    accent: string;
    copy: string;
    image: ContentImage;
    cta: Link;
    secondaryCta: Link;
    footnote?: string;
    motto?: string;
    photoCaption?: string;
  };
  introduction: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    image: ContentImage;
    signature: string;
    imageCaption?: string;
  };
  enquiry: { eyebrow: string; heading: string; copy: string };
  services: { eyebrow: string; heading: string; copy: string; ids: string[] };
  featured: { eyebrow: string; heading: string; galleryId: string; cta: Link };
  testimonials: { eyebrow: string; heading: string; ids: string[] };
  cta: { eyebrow: string; heading: string; copy: string; link: Link };
  seo: Seo;
};
export type ServicePageContent = Service & {
  gallery: Gallery;
  testimonials: Testimonial[];
};
export interface ContentProvider {
  getSiteSettings(): Promise<SiteSettings>;
  getHomepage(): Promise<
    Homepage & {
      services: Homepage['services'] & { items: Service[] };
      featured: Homepage['featured'] & { gallery: Gallery };
      testimonials: Homepage['testimonials'] & { items: Testimonial[] };
    }
  >;
  getServices(): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<ServicePageContent | null>;
}

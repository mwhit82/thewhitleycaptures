import type { SchemaTypeDefinition } from '@sanity/types';
// These are ready-to-register schema definitions, not a running Studio.
// A future adapter resolves references and image metadata into ContentProvider types.
const string = (name: string, title: string) => ({
  name,
  title,
  type: 'string' as const,
});
const text = (name: string, title: string) => ({
  name,
  title,
  type: 'text' as const,
  rows: 3,
});
const ref = (name: string, title: string, target: string) => ({
  name,
  title,
  type: 'reference' as const,
  to: [{ type: target }],
});
const refs = (name: string, title: string, target: string) => ({
  name,
  title,
  type: 'array' as const,
  of: [{ type: 'reference', to: [{ type: target }] }],
});
const strings = (name: string, title: string) => ({
  name,
  title,
  type: 'array' as const,
  of: [{ type: 'string' }],
});
const image = (name: string, title: string) => ({
  name,
  title,
  type: 'photograph',
});
const link = (name: string, title: string) => ({
  name,
  title,
  type: 'contentLink',
});
export const schemaTypes: SchemaTypeDefinition[] = [
  {
    name: 'photograph',
    title: 'Photograph',
    type: 'image',
    options: { hotspot: true },
    fields: [
      string('alt', 'Image description'),
      string('caption', 'Optional caption'),
    ],
    description:
      'Describe what is in the photograph. Use the hotspot to choose the focus when the photograph is cropped.',
  },
  {
    name: 'contentLink',
    title: 'Link',
    type: 'object',
    fields: [string('label', 'Link text'), string('href', 'Destination')],
  },
  {
    name: 'seo',
    title: 'Search & sharing',
    type: 'object',
    fields: [
      string('title', 'Page title'),
      text('description', 'Page description'),
      image('image', 'Social sharing image'),
    ],
  },
  {
    name: 'contentSection',
    title: 'Text section',
    type: 'object',
    fields: [
      string('heading', 'Heading'),
      {
        name: 'paragraphs',
        title: 'Paragraphs',
        type: 'array',
        of: [{ type: 'text' }],
      },
    ],
  },
  {
    name: 'package',
    title: 'Photo shoot package',
    type: 'object',
    fields: [
      string('title', 'Package name'),
      { name: 'price', title: 'Price (£)', type: 'number' },
      string('duration', 'Time to allow'),
      strings('includes', 'What’s included'),
      text('note', 'Additional information'),
    ],
  },
  {
    name: 'faq',
    title: 'Question & answer',
    type: 'object',
    fields: [string('question', 'Question'), text('answer', 'Answer')],
  },
  {
    name: 'siteSettings',
    title: 'Site settings',
    type: 'document',
    fields: [
      string('name', 'Business name'),
      image('logo', 'Logo'),
      string('email', 'Email address'),
      string('location', 'Studio location'),
      string('areaServed', 'Area covered'),
      {
        name: 'navigation',
        title: 'Navigation',
        type: 'array',
        of: [{ type: 'contentLink' }],
      },
      {
        name: 'socials',
        title: 'Social links',
        type: 'array',
        of: [{ type: 'contentLink' }],
      },
      string('privacyUrl', 'Privacy policy link'),
      { name: 'seo', title: 'Default search & sharing', type: 'seo' },
    ],
  },
  {
    name: 'homepage',
    title: 'Homepage',
    type: 'document',
    fields: [
      {
        name: 'hero',
        title: 'Opening section',
        type: 'object',
        fields: [
          string('eyebrow', 'Small heading'),
          string('heading', 'Main heading'),
          string('accent', 'Second heading line'),
          text('copy', 'Introduction'),
          image('image', 'Main photograph'),
          link('cta', 'Main link'),
          link('secondaryCta', 'Second link'),
        ],
      },
      {
        name: 'introduction',
        title: 'About Rachel',
        type: 'object',
        fields: [
          string('eyebrow', 'Small heading'),
          string('heading', 'Heading'),
          {
            name: 'paragraphs',
            title: 'Text',
            type: 'array',
            of: [{ type: 'text' }],
          },
          image('image', 'Portrait'),
          string('signature', 'Sign-off'),
        ],
      },
      {
        name: 'enquiry',
        title: 'Enquiry section',
        type: 'object',
        fields: [
          string('eyebrow', 'Small heading'),
          string('heading', 'Heading'),
          text('copy', 'Introduction'),
        ],
      },
      {
        name: 'services',
        title: 'Photography categories',
        type: 'object',
        fields: [
          string('eyebrow', 'Small heading'),
          string('heading', 'Heading'),
          text('copy', 'Introduction'),
          refs('items', 'Categories (drag to reorder)', 'photographyService'),
        ],
      },
      {
        name: 'featured',
        title: 'Featured photography',
        type: 'object',
        fields: [
          string('eyebrow', 'Small heading'),
          string('heading', 'Heading'),
          ref('gallery', 'Gallery', 'gallery'),
          link('cta', 'Link'),
        ],
      },
      {
        name: 'testimonials',
        title: 'Kind words',
        type: 'object',
        fields: [
          string('eyebrow', 'Small heading'),
          string('heading', 'Heading'),
          refs('items', 'Testimonials', 'testimonial'),
        ],
      },
      {
        name: 'cta',
        title: 'Closing invitation',
        type: 'object',
        fields: [
          string('eyebrow', 'Small heading'),
          string('heading', 'Heading'),
          text('copy', 'Text'),
          link('link', 'Link'),
        ],
      },
      { name: 'seo', title: 'Search & sharing', type: 'seo' },
    ],
  },
  {
    name: 'photographyService',
    title: 'Photography service',
    type: 'document',
    fields: [
      string('title', 'Service name'),
      {
        name: 'slug',
        title: 'Page address',
        type: 'slug',
        options: { source: 'title' },
      },
      { name: 'order', title: 'Navigation order', type: 'number' },
      text('description', 'Short introduction'),
      image('hero', 'Main photograph'),
      text('introduction', 'Introduction'),
      {
        name: 'sections',
        title: 'Text sections',
        type: 'array',
        of: [{ type: 'contentSection' }],
      },
      {
        name: 'packages',
        title: 'Packages',
        type: 'array',
        of: [{ type: 'package' }],
      },
      text('pricingNote', 'Pricing note'),
      strings('included', 'Additional inclusions'),
      ref('gallery', 'Gallery', 'gallery'),
      refs('testimonials', 'Testimonials', 'testimonial'),
      {
        name: 'faqs',
        title: 'Questions & answers',
        type: 'array',
        of: [{ type: 'faq' }],
      },
      link('cta', 'Enquiry link'),
      { name: 'seo', title: 'Search & sharing', type: 'seo' },
      text('reviewNote', 'Temporary review note'),
    ],
    preview: { select: { title: 'title', media: 'hero' } },
  },
  {
    name: 'gallery',
    title: 'Gallery',
    type: 'document',
    fields: [
      string('title', 'Gallery name'),
      {
        name: 'images',
        title: 'Photographs',
        type: 'array',
        of: [{ type: 'photograph' }],
        options: { layout: 'grid' },
        description:
          'Upload multiple images, then drag to reorder. Remove images from this gallery without deleting the original asset.',
      },
      {
        name: 'featuredImages',
        title: 'Featured photographs',
        type: 'array',
        of: [{ type: 'photograph' }],
        options: { layout: 'grid' },
        description:
          'Choose existing gallery assets for featured use; no need to upload them again.',
      },
    ],
  },
  {
    name: 'testimonial',
    title: 'Testimonial',
    type: 'document',
    fields: [
      text('quote', 'Customer’s words'),
      string('name', 'Customer name'),
      ref('service', 'Related service (optional)', 'photographyService'),
    ],
    preview: { select: { title: 'name', subtitle: 'quote' } },
  },
];

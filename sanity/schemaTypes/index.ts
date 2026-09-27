import type { SchemaTypeDefinition, DocumentDefinition, Rule } from 'sanity';
// Shared by embedded Studio and the one-time content migration.
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
  validation: (rule: Rule) => rule.required(),
});
const link = (name: string, title: string) => ({
  name,
  title,
  type: 'contentLink',
  validation: (rule: Rule) => rule.required(),
});
export const schemaTypes: SchemaTypeDefinition[] = [
  {
    name: 'photograph',
    title: 'Photograph',
    type: 'image',
    preview: {
      select: { title: 'alt', subtitle: 'caption', media: 'asset' },
      prepare({ title, subtitle, media }) {
        return {
          title: title || 'Photograph — add a description',
          subtitle,
          media,
        };
      },
    },
    options: { hotspot: true },
    fields: [
      {
        ...string('alt', 'Image description'),
        description:
          'A short description for people who cannot see the photo. Describe the moment, without identifying children.',
        validation: (rule: Rule) =>
          rule
            .required()
            .warning('Add a description to make this photograph accessible.'),
      },
      string('caption', 'Optional caption'),
    ],
    description:
      'Describe what is in the photograph. Use the hotspot to choose the focus when the photograph is cropped.',
  },
  {
    name: 'contentLink',
    title: 'Link',
    type: 'object',
    preview: { select: { title: 'label', subtitle: 'href' } },
    fields: [
      string('label', 'Link text'),
      {
        ...string('href', 'Destination'),
        description: 'Use /#enquire, a page path, or a full https:// link.',
        validation: (rule: Rule) =>
          rule
            .required()
            .custom((value) =>
              typeof value === 'string' &&
              /^(#|\/(?!\/)|https:\/\/|mailto:)/.test(value)
                ? true
                : 'Use an anchor (#enquire), site path, https:// URL or mailto: link.',
            ),
      },
    ],
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
    preview: {
      select: { title: 'title', price: 'price' },
      prepare({ title, price }) {
        return {
          title: title || 'New package',
          subtitle: typeof price === 'number' ? `£${price}` : 'Add a price',
        };
      },
    },
    fields: [
      string('title', 'Package name'),
      {
        name: 'price',
        title: 'Price (£)',
        type: 'number',
        validation: (rule: Rule) => rule.required().min(0).precision(2),
      },
      string('duration', 'Time to allow'),
      strings('includes', 'What’s included'),
      text('note', 'Additional information'),
    ],
  },
  {
    name: 'faq',
    title: 'Question & answer',
    type: 'object',
    preview: { select: { title: 'question', subtitle: 'answer' } },
    fields: [string('question', 'Question'), text('answer', 'Answer')],
  },
  {
    name: 'siteSettings',
    title: 'Site settings',
    type: 'document',
    preview: {
      select: { name: 'name', media: 'logo' },
      prepare({ name, media }) {
        return {
          title: 'Site settings',
          subtitle: name || 'Contact details, navigation and branding',
          media,
        };
      },
    },
    fields: [
      string('name', 'Business name'),
      image('logo', 'Logo'),
      {
        ...string('email', 'Email address'),
        validation: (rule: Rule) => rule.required().email(),
      },
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
      {
        ...string('privacyUrl', 'Privacy policy link'),
        validation: (rule: Rule) =>
          rule
            .required()
            .custom((value) =>
              typeof value === 'string' && /^(\/(?!\/)|https:\/\/)/.test(value)
                ? true
                : 'Use a page path or full https:// address.',
            ),
      },
      { name: 'seo', title: 'Default search & sharing', type: 'seo' },
    ],
  },
  {
    name: 'homepage',
    title: 'Homepage',
    type: 'document',
    preview: {
      select: { media: 'hero.image' },
      prepare({ media }) {
        return {
          title: 'Homepage',
          subtitle: 'Your opening photograph, introduction and page sections',
          media,
        };
      },
    },
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
          string('footnote', 'Small footer line'),
          string('motto', 'Short motto'),
          string('photoCaption', 'Photograph caption'),
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
          string('imageCaption', 'Portrait caption'),
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
        readOnly: ({ document }) => Boolean(document?._createdAt),
        description:
          'Keep existing page addresses unchanged to preserve links. Ask Mark before changing this.',
        validation: (rule: Rule) => rule.required(),
      },
      { name: 'order', title: 'Navigation order', type: 'number' },
      text('description', 'Short introduction'),
      image('cardImage', 'Homepage card photograph'),
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
      {
        ...text('reviewNote', 'Review reminder'),
        description:
          'Shown on staging only. Remove once you have checked the content.',
      },
    ],
    preview: { select: { title: 'title', media: 'cardImage' } },
    orderings: [
      {
        title: 'Navigation order',
        name: 'navigation',
        by: [{ field: 'order', direction: 'asc' }],
      },
    ],
  },
  {
    name: 'gallery',
    title: 'Gallery',
    type: 'document',
    preview: { select: { title: 'title', media: 'images.0' } },
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
        title: 'Legacy featured selection',
        hidden: true,
        readOnly: true,
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
      refs('services', 'Related photography services', 'photographyService'),
      {
        name: 'featured',
        title: 'Favourite for future use',
        type: 'boolean',
        description:
          'A library marker only. Choose testimonials on Homepage or a service to display them.',
      },
      {
        name: 'order',
        title: 'Library order',
        type: 'number',
        description:
          'For sorting this library. Website order follows the selections on each page.',
      },
    ],
    preview: { select: { title: 'name', subtitle: 'quote' } },
    orderings: [
      {
        title: 'Library order',
        name: 'libraryOrder',
        by: [{ field: 'order', direction: 'asc' }],
      },
    ],
  },
];

// Keep essential page structure intact when publishing, while allowing optional sections.
const requiredFields: Record<string, string[]> = {
  siteSettings: [
    'name',
    'logo',
    'email',
    'location',
    'areaServed',
    'navigation',
    'privacyUrl',
    'seo',
  ],
  homepage: [
    'hero',
    'introduction',
    'enquiry',
    'services',
    'testimonials',
    'cta',
  ],
  photographyService: [
    'title',
    'slug',
    'hero',
    'cardImage',
    'introduction',
    'cta',
    'gallery',
  ],
  testimonial: ['name', 'quote'],
  gallery: ['title'],
  contentLink: ['label', 'href'],
  seo: ['title', 'description'],
  package: ['title', 'price', 'includes'],
  faq: ['question', 'answer'],
};
for (const schema of schemaTypes) {
  if ('fields' in schema && Array.isArray(schema.fields)) {
    for (const field of schema.fields) {
      if (
        requiredFields[schema.name]?.includes(field.name) &&
        !field.validation
      )
        field.validation = (rule: Rule) => rule.required();
    }
  }
}

const homepageRequired: Record<string, string[]> = {
  hero: ['heading', 'copy', 'image', 'cta', 'secondaryCta'],
  introduction: ['heading', 'paragraphs', 'image'],
  enquiry: ['heading', 'copy'],
  services: ['heading', 'items'],
  testimonials: ['heading'],
  cta: ['heading', 'link'],
};
for (const schema of schemaTypes) {
  if (
    schema.name === 'homepage' &&
    'fields' in schema &&
    Array.isArray(schema.fields)
  ) {
    for (const section of schema.fields) {
      if ('fields' in section && Array.isArray(section.fields)) {
        for (const field of section.fields) {
          if (
            homepageRequired[section.name]?.includes(field.name) &&
            !field.validation
          )
            field.validation = (rule: Rule) => rule.required();
        }
      }
    }
  }
}

const serviceGroups: Record<string, string[]> = {
  overview: ['title', 'description', 'introduction', 'sections', 'cta'],
  photographs: ['cardImage', 'hero', 'gallery'],
  pricing: ['packages', 'pricingNote', 'included', 'faqs'],
  kindWords: ['testimonials'],
  sharing: ['seo'],
  settings: ['slug', 'order', 'reviewNote'],
};
const serviceSchema = schemaTypes.find(
  (schema): schema is DocumentDefinition =>
    schema.name === 'photographyService' && schema.type === 'document',
);
if (serviceSchema?.type === 'document') {
  serviceSchema.groups = [
    { name: 'overview', title: 'Page copy', default: true },
    { name: 'photographs', title: 'Photographs' },
    { name: 'pricing', title: 'Prices & questions' },
    { name: 'kindWords', title: 'Kind words' },
    { name: 'sharing', title: 'Search & sharing' },
    { name: 'settings', title: 'Page settings' },
  ];
  for (const field of serviceSchema.fields)
    field.group = Object.keys(serviceGroups).find((group) =>
      serviceGroups[group].includes(field.name),
    );
}

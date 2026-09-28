import type { SchemaTypeDefinition, Rule } from 'sanity';
export const reviewSchemas: SchemaTypeDefinition[] = [
  {
    name: 'articleSpan',
    title: 'Text or link',
    type: 'object',
    fields: [
      {
        name: 'text',
        title: 'Text',
        type: 'text',
        rows: 2,
        validation: (r: Rule) => r.required(),
      },
      {
        name: 'href',
        title: 'Link (optional)',
        type: 'string',
        validation: (r: Rule) =>
          r.custom((v) =>
            !v || /^(\/|https?:\/\/|mailto:)/.test(String(v))
              ? true
              : 'Use a page path, https:// link or mailto: address.',
          ),
      },
    ],
    preview: { select: { title: 'text', subtitle: 'href' } },
  },
  {
    name: 'articleBlock',
    title: 'Article section',
    type: 'object',
    fields: [
      {
        name: 'kind',
        title: 'Section type',
        type: 'string',
        options: {
          list: [
            { title: 'Paragraph', value: 'paragraph' },
            { title: 'Heading', value: 'heading' },
            { title: 'Photographs', value: 'gallery' },
          ],
        },
        validation: (r: Rule) => r.required(),
      },
      {
        name: 'spans',
        title: 'Text and links',
        description:
          'Add text segments in reading order. A segment can optionally link to a page.',
        type: 'array',
        of: [{ type: 'articleSpan' }],
        hidden: ({ parent }) => parent?.kind === 'gallery',
      },
      {
        name: 'images',
        title: 'Photographs',
        type: 'array',
        of: [{ type: 'photograph' }],
        hidden: ({ parent }) => parent?.kind !== 'gallery',
      },
    ],
    preview: {
      select: { kind: 'kind', title: 'spans.0.text', media: 'images.0' },
      prepare({ kind, title, media }) {
        return { title: title || 'Photographs', subtitle: kind, media };
      },
    },
  },
  {
    name: 'article',
    title: 'Client guide or awards article',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Page title',
        type: 'string',
        validation: (r: Rule) => r.required(),
      },
      {
        name: 'slug',
        title: 'Page address',
        description:
          'Preserve imported addresses so existing client links keep working.',
        type: 'slug',
        options: { source: 'title' },
        readOnly: ({ document }) => Boolean(document?._createdAt),
        validation: (r: Rule) => r.required(),
      },
      {
        name: 'summary',
        title: 'Short introduction',
        type: 'text',
        rows: 3,
        validation: (r: Rule) => r.required(),
      },
      {
        name: 'kind',
        title: 'Article type',
        type: 'string',
        options: {
          list: [
            { title: 'Client guide', value: 'guide' },
            { title: 'Awards', value: 'awards' },
          ],
        },
        validation: (r: Rule) => r.required(),
      },
      {
        name: 'blocks',
        title: 'Article content',
        description:
          'Reorder headings, text and photographs here. Open a photograph to edit its description or crop.',
        type: 'array',
        of: [{ type: 'articleBlock' }],
      },
      { name: 'seo', title: 'Search & sharing', type: 'seo' },
      {
        name: 'reviewNote',
        title: 'Rachel’s review note',
        description: 'Only displayed on the preview site.',
        type: 'text',
      },
      {
        name: 'sourceUrl',
        title: 'Original article address',
        type: 'url',
        readOnly: true,
      },
    ],
    preview: {
      select: { title: 'title', subtitle: 'kind', media: 'seo.image' },
    },
  },
];

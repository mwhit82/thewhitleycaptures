'use client';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool, defineLocations } from 'sanity/presentation';
import { PreviewSetup } from './src/components/PreviewSetup';
import { schemaTypes } from './sanity/schemaTypes';
const singletons = new Set(['homepage', 'siteSettings']);
export function createStudioConfig(previewEnabled: boolean) {
  return defineConfig({
    name: 'whitley',
    title: 'The Whitley Captures',
    basePath: '/studio',
    releases: { enabled: false },
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing-project',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    plugins: [
      structureTool({
        title: 'Edit website',
        structure: (S) =>
          S.list()
            .title('Your website')
            .items([
              S.listItem()
                .title('Homepage')
                .child(
                  S.document().schemaType('homepage').documentId('homepage'),
                ),
              S.documentTypeListItem('photographyService').title(
                'Photography services',
              ),
              S.documentTypeListItem('gallery').title('Photo galleries'),
              S.documentTypeListItem('testimonial').title('Testimonials'),
              S.listItem()
                .title('Site settings')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('site-settings'),
                ),
            ]),
      }),
      ...(previewEnabled
        ? [
            presentationTool({
              title: 'Preview website',
              previewUrl: {
                origin: process.env.NEXT_PUBLIC_SANITY_PREVIEW_URL || undefined,
                previewMode: { enable: '/api/draft-mode/enable' },
              },
              resolve: {
                locations: {
                  homepage: defineLocations({
                    locations: [{ title: 'Homepage', href: '/' }],
                  }),
                  photographyService: defineLocations({
                    select: { title: 'title', slug: 'slug.current' },
                    resolve: (doc) => ({
                      locations: doc?.slug
                        ? [
                            {
                              title: doc.title || 'Photography',
                              href: `/prices/${doc.slug}`,
                            },
                          ]
                        : [],
                    }),
                  }),
                },
              },
            }),
          ]
        : [
            {
              name: 'preview-setup',
              tools: [
                {
                  name: 'presentation',
                  title: 'Preview setup',
                  component: PreviewSetup,
                },
              ],
            },
          ]),
    ],
    schema: {
      types: schemaTypes,
      templates: (templates) =>
        templates.filter(
          (t) =>
            !singletons.has(t.schemaType) &&
            t.schemaType !== 'photographyService',
        ),
    },
    document: {
      actions: (actions, context) =>
        singletons.has(context.schemaType) ||
        context.schemaType === 'photographyService'
          ? actions.filter(
              ({ action }) =>
                !['delete', 'duplicate', 'unpublish'].includes(action || ''),
            )
          : actions,
    },
  });
}
export default createStudioConfig(false);

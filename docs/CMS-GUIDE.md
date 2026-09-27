# A simple guide for Rachel

## What you can do now

This is a first look at the new website. Open the local link while the development computer is running. On your phone, use the same Wi-Fi and the computer’s local address (the developer can give you the link).

Try the menu, explore the seven photography categories and look at Baby & Newborn for the most complete example. The enquiry form is your real Session form: submitting it creates a real enquiry. You do not need to open any new accounts to review the website.

Your feedback on photographs, crops, colours, wording and the mobile layout is the priority. Prices on the sample newborn page come from the old website and need your confirmation. The other service pages are shorter previews, not finished replacements.

There is no CMS login yet. For this first version, tell the developer what to change; content is kept in clearly named local files. There is no save, upload or publish button being simulated.

## After you approve the direction

The developer will help set up business-owned Sanity and hosting accounts. The planned editor has five areas: Site settings, Homepage, Photography services, Galleries and Testimonials.

The intended workflow is:

1. Open your private editor and choose the page you want to change.
2. Edit the text or choose another photograph.
3. In a gallery, add multiple photographs, remove unwanted entries or drag them into a new order. You will not need to make different image sizes.
4. Add a short description of each photograph, for example “Baby asleep in a pink wrap”. Captions are optional.
5. Preview the draft on a phone or computer.
6. Publish when you are happy with the change.

These editor and draft-preview steps will become available after setup; they are not active in this prototype. Upload only website photographs, keeping your master archive elsewhere. Session remains the place for enquiries and bookings.

## Developer transition notes

Register the exported `sanity/schemaTypes` in a future Studio and create one site settings document and one homepage document. Restrict duplicate singleton creation in the Studio structure. Register photography services, galleries and testimonials as regular document lists. Provide multi-file gallery upload/reordering and preview controls, then test these with Rachel.

Implement a Sanity `ContentProvider` adapter; keep page/component interfaces unchanged. Map:

| Local model                             | Sanity equivalent                                     |
| --------------------------------------- | ----------------------------------------------------- |
| Document `id`                           | `_id`                                                 |
| Section/package/FAQ `id`                | Stable array `_key`                                   |
| Service `slug`                          | `slug.current` (retain existing slugs)                |
| Ordered `service`/testimonial ID arrays | Ordered document references                           |
| `galleryId`                             | Gallery document reference                            |
| Image `src`, width, height              | Resolved Sanity asset URL and metadata dimensions     |
| Image position                          | Image hotspot, with crop respected by the URL builder |
| Image caption and alt                   | Image-level caption/alt fields                        |
| Gallery featured image IDs              | Featured selections resolved from gallery assets/keys |

The UI uses plain text paragraphs rather than raw CMS documents or Portable Text. Resolve nullable fields and validate required IDs/images in the adapter before returning data. Unknown service slugs must still return null. Add a Sanity image URL builder/Next image loader for width, format and quality; allowlist the Sanity CDN host. The current local file resolver stays useful for fixtures/tests.

Future configuration needed (none required now):

- Business-owned Sanity project ID and dataset name; set `SANITY_PROJECT_ID` and `SANITY_DATASET` server-side and appropriate Studio configuration separately.
- Server-only least-privilege draft read token (`SANITY_API_READ_TOKEN`). Never put it in `NEXT_PUBLIC_*` or send it to the browser.
- Preview authentication and secret (`SANITY_PREVIEW_SECRET`), with safe redirect validation and secure Next draft-mode cookies. Authorise the preview origin/CORS in Sanity. Draft responses must not enter the published content cache.
- Business-owned hosting project, actual staging origin (`SITE_URL`), deployment protection and GitHub connection.
- Published-content revalidation/webhook configuration and secret, if using cached queries. Validate webhook signatures.

Keep a deliberately selected local adapter for credential-free development; do not silently show fixtures when an explicitly configured production CMS fails. Add real draft-preview and publication tests only after Sanity exists. No temporary CMS, database or client-side editor is needed.

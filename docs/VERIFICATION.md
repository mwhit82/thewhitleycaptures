# Prototype verification

Verified on 27 September 2026. No business accounts, CMS credentials or `.env` file were used. No production website, DNS, Webflow project or hosting service was changed.

## Automated checks

- TypeScript (`npm run typecheck`): passed.
- ESLint (`npm run lint`): passed without warnings.
- Production build (`npm run build`): passed; homepage and seven service routes prerendered.
- Seven local Playwright tests: passed. They cover all eight page routes, unknown-service 404, one H1 per page, route-specific metadata, canonical/social tags, noindex headers, robots rules, disabled sitemap, content/asset references, widths 320/390/768/1440, keyboard Escape/focus behaviour, mobile navigation, FAQ expansion, enquiry anchors, script failure and repeated form mounts.
- Opt-in live Session check: passed. The real form loaded, a single iframe remained after service-page navigation, height was bounded at 960px, and the submit button could be scrolled into the iframe viewport. No fields were filled and no enquiry was submitted.

Run the local suite with `npm test`. The live test is skipped by default; enable it with `LIVE_SESSION=1 npm test -- tests/session-live.spec.ts`. It requires internet access but no credentials.

## Visual review

Inspected homepage at 390px and 320px, mobile navigation at 320px, the live enquiry form, and the Baby & Newborn page. Desktop homepage uses an editorial split hero; mobile puts a short introduction and enquiry action above the photograph. Narrow service galleries use full-width photographs. The form uses Session’s original internal appearance.

Review screenshots are in `docs/previews`. Website imagery is a curated local copy of Rachel’s existing published photography; existing watermarks are retained. Rachel should choose final photographs and approve crops/copy/prices before the next milestone.

## Mobile performance

A production-build Lighthouse run on localhost, using its simulated mobile settings, reported:

| Measure                  | Result    |
| ------------------------ | --------- |
| Performance              | 94 / 100  |
| Accessibility            | 100 / 100 |
| Best practices           | 100 / 100 |
| First Contentful Paint   | 1.5 s     |
| Largest Contentful Paint | 3.0 s     |
| Cumulative Layout Shift  | 0.001     |
| Total Blocking Time      | 10 ms     |

See `performance-summary.json` for measured values and configuration. These are lab results, not guarantees on Rachel’s customers’ networks. Accessibility scoring does not replace manual testing, especially inside the external Session form.

Session now starts loading when the form is within 300px of the viewport. Before this change, loading its full application immediately affected initial mobile performance. Images use responsive sizes and modern-format optimisation; the hero is eager/high priority and other images are lazy. Fonts and website content are served locally. No runtime Sanity request exists.

## Known limits and follow-up

- Session’s current resize code can over-report its iframe height after navigation. The outer frame has a 60rem maximum height with native scrolling available; no internal form CSS or submission code is patched. Recheck this behaviour when Session changes its embed.
- Actual enquiry receipt remains untested: it would send a real lead and needs an authorised submission with Rachel checking Session.
- Sanity schemas are prepared and type checked, but Studio, image upload, authenticated draft preview and publishing are not operational until business-owned accounts are set up.
- Facebook’s external scraper cannot access a localhost URL. Metadata is present; test actual sharing after a separate staging deployment is approved.
- Local preview is not remotely hosted. `noindex` is not authentication. Any future remote private preview needs access protection.
- Prices are carried over for review. Six service pages are deliberately lightweight, and the remaining old URLs are inventoried rather than migrated or redirected.
- No privacy/legal approval, ranking assurance, analytics audit or final migration decision is implied by this prototype.

## Sanity integration milestone — 27 September 2026

Implemented and verified locally; **external activation is pending**, so this is not a claim that Rachel can already publish to the replacement.

- Type checking, ESLint, formatting, production build and Git whitespace checks passed.
- Sanity schema validation: zero errors and zero warnings.
- Migration dry run: 28 documents / 17 unique curated image files; stable references and the actual frontend GROQ projections pass preflight. No Sanity writes were made.
- Public dataset read returned 0 documents. No CLI login, Editor token or Viewer token was available. Studio renders its expected “Connect this Studio to your project” CORS screen at `/studio`.
- 15 browser checks passed, covering all page routes, preview metadata/headers, invalid preview entry, image crop resolution, keyboard lightbox focus/Escape/arrow keys, mobile menu, no horizontal overflow at 320/360/390/430/768/1440 widths, and Session failure/repeat navigation.
- Real Session loaded after navigation with one iframe and a bounded 960px height; no enquiry was submitted.
- Mobile Lighthouse on the production build in local fallback mode: Performance 92, Accessibility 100, Best Practices 100; LCP 3.3s, CLS 0.001. See cms-performance-summary.json. This is a lab result; image delivery needs another measurement after real Sanity seeding, and field Core Web Vitals cannot yet be claimed. SEO is intentionally reduced by preview indexing restrictions.
- Dependency audit reports zero vulnerabilities after targeted transitive tooling overrides.
- Launch guard correctly fails under current preview/local settings. No Webflow, DNS, hosting or production redirects were changed.

### Required external verification

1. Add `http://localhost:3000` as a credential-enabled Sanity CORS origin; add any other actual review origin separately.
2. Authenticate locally with `npx sanity login` or provide an Editor token in `.env.local`; run the prepared import and switch CONTENT_SOURCE to sanity.
3. Confirm homepage and all seven service pages render from the real documents and Sanity images. Test replacing/reordering images through Studio.
4. Add a Viewer token locally; verify authenticated draft save/refresh/publish/exit and anonymous preview rejection against the real project.
5. Retest delivery performance and image crops from the Sanity CDN, then resolve CONTENT-REVIEW.md before launch.

### Sanity activation follow-up

Google CLI login succeeded and `http://localhost:3000` was added as a credential-enabled CORS origin. The initial import published 28 content documents and uploaded 17 images into `4d7wgp7e/production`, preserving existing IDs. The local `.env.local` now selects `CONTENT_SOURCE=sanity`; homepage HTML was verified to contain real Sanity CDN images and the approved heading. The prior empty-dataset/authentication blockers above are resolved. A separate Viewer token is still needed for authenticated draft preview.

## CMS checkpoint — 27 September 2026

- Embedded Studio, Sanity published-content adapter, isolated local fallback, schema validation and repeatable initial migration are included.
- Latest checks: lint, formatting, standalone type checking and production build passed; 18 automated tests passed, with the optional live Session test skipped. Sanity schema validation reported zero errors/warnings; dependency audit reported zero vulnerabilities.
- Signed-in Studio gallery list, newborn gallery editor and homepage navigation were checked after patching the react-i18next namespace bug. Patch installation is reproducible and covered by a browser regression test.
- A transient standalone type-check failure involved duplicate generated declarations under `.next/types`; after the production build regenerated them, the standalone check passed. Generated output is not committed.
- Draft preview still requires the server-only Viewer token and an authenticated end-to-end walkthrough. Hosting, production domain migration and live form submission remain separate tasks. Webflow and DNS are unchanged.

# The Whitley Captures

A local review prototype for Rachel’s family photography website. Next.js App Router, TypeScript and Tailwind CSS. The live Webflow website and production domain are untouched.

## Run locally

Use Node.js 22.13+ (Node 24 recommended) and npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). **No `.env`, Sanity credentials, database, CMS account or hosting account is required.** The site’s content, fonts and photographs are local. The real Session form needs internet access; if blocked, it shows an email fallback. Initial dependency installation needs internet access.

For a phone on the same trusted Wi-Fi, open `http://YOUR-COMPUTER-LAN-IP:3000`. Leave the development server running and allow the OS network prompt if needed. Next.js automatically allows the computer’s own IPv4 addresses for development resources; restart the server if your Wi-Fi address changes. The development server binds to `0.0.0.0`; do not forward the port onto the public internet. A remotely shareable review URL is not deployed. For a more representative local performance check, stop the dev server, run `npm run build`, then `npm start`.

## What to review

- Homepage visual direction, seven service cards and mobile navigation.
- Enquiry form immediately after Rachel’s introduction; header and hero jump directly to it.
- `/prices/baby-newborn`: full sample service page, packages, gallery, questions and testimonials.
- Six lightweight local service previews, including existing maternity content.
- Existing prices are labelled for Rachel to confirm. Preview notes are deliberate and must be resolved before launch.

## Content architecture

All business content lives in `src/content/local`: `settings.ts`, `homepage.ts`, `services.ts`, `galleries.ts`, `testimonials.ts`, `images.json`. Stable IDs and ordered references connect the documents. Local photos are in `public/images`; source provenance is in `docs/asset-sources.json`. Do not delete an image without updating its content references.

Pages use only the server-only `src/content/index.ts` interface:

- `getSiteSettings()`
- `getHomepage()` (resolves ordered service, gallery and testimonial references)
- `getServices()`
- `getServiceBySlug(slug)` (returns `null` for unknown services)

A future Sanity adapter implements `ContentProvider` from `src/content/types.ts`; the UI does not need to change. `sanity/schemaTypes/index.ts` contains typed, dependency-light schema definitions ready to register in a future Studio. There is no running Studio or fake preview/publish workflow. See [CMS guide](docs/CMS-GUIDE.md) for the transition.

## Session

`SessionInquiryForm` uses the supplied `0Ll72MoGY` link unchanged. It loads the vendor script once when the form approaches the viewport and observes the inserted iframe for load/error feedback. A single vendor-owned mount is reused across navigation because Session has no public unmount API. The outer iframe is bounded to 60rem to contain a verified vendor resize issue; native iframe scrolling remains available, and no internal form styles are changed. It is a Client Component; other content is server rendered. Styles are applied around the cross-origin iframe. Session owns validation, submission, confirmation and lead management. No requests are sent to a custom backend.

The real form is live: submitting it contacts Rachel. Automated tests mock or inspect the form and never submit an enquiry. A successful submission/receipt test still requires explicit authorisation.

## Checks

```sh
npm run typecheck
npm run lint
npm run format:check
npm run build
npx playwright install chromium
npm test
# Optional read-only real Session loading/navigation check (requires internet):
LIVE_SESSION=1 npm test -- tests/session-live.spec.ts
```

Tests reuse the local dev server on port 3000, or start one if it is not running. They check service routing, mobile navigation, preview SEO controls, fixture references, Session script failure and remount behaviour without sending leads. Browser installation is needed once on a new developer machine.

## Preview safety

The default `SITE_MODE=preview` adds `noindex, nofollow` to metadata and response headers. `robots.txt` disallows crawling; `/sitemap.xml` returns 404. The optional `SITE_URL` controls canonical and social URL origins, defaulting to localhost. Local links cannot be previewed by Facebook’s external scraper.

Only a separate approved migration should enable `SITE_MODE=production`. Search directives are not authentication; protect a future remote staging deployment. No DNS, Webflow or hosting configuration is changed by this project.

## Documentation

- [Migration/content/SEO audit](docs/MIGRATION.md)
- [Source audit evidence](docs/source-audit.json)
- [CMS guide and transition](docs/CMS-GUIDE.md)
- [Verification results](docs/VERIFICATION.md)

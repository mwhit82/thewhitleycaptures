# The Whitley Captures

Rachel’s approved replacement website: Next.js App Router, TypeScript, Tailwind and an embedded Sanity Studio. Webflow, DNS and the production domain remain untouched. Initial content is imported into Sanity and published-content rendering is verified. Authenticated draft-preview checks still require a local Viewer token.

## Local review

Node.js 22.13+ (24 recommended):

```sh
npm ci
npm run dev
```

Open http://localhost:3000. With no environment file, the site runs from isolated local fixtures. The real Session form needs internet access and provides an email fallback. No hosting account is required.

For a phone on the same trusted Wi-Fi, use `http://YOUR-COMPUTER-LAN-IP:3000` and keep the server running. Restart it if the computer’s address changes. A remote review URL is not deployed. Search directives are not access control; a future remote staging site needs hosting authentication.

## Real Sanity content

Copy `.env.example` to `.env.local`. Project: `4d7wgp7e`; dataset: `production`. Add the exact local origin to Sanity CORS with credentials allowed, then follow [CMS-GUIDE.md](docs/CMS-GUIDE.md) for login, import and preview setup.

```sh
npm run cms:seed                 # Validate references and queries; no writes
npm run cms:seed -- --apply      # Requires local Editor token
# Or, after npx sanity login:
npm run cms:seed:login
```

The import creates missing documents and uploads curated images. Existing document IDs are never overwritten. Remove the temporary write token afterwards. Set `CONTENT_SOURCE=sanity` and restart to use the real dataset. Published reads are public and cached for up to 60 seconds; draft reads require `SANITY_API_READ_TOKEN` and authenticated Studio preview entry.

`CONTENT_SOURCE=local` explicitly selects the offline fallback. Sanity mode never silently substitutes stale fixtures for missing CMS content. `/studio` is isolated from public page styles and content requests. Its JavaScript is not included in ordinary page bundles.

The homepage, seven services, galleries, testimonials and settings share the server-only `ContentProvider` interface. `src/content/sanity` contains queries and image resolution; `src/content/local` is offline fallback and initial migration input only. Components never import fixtures directly. Source photography provenance is in `docs/asset-sources.json`.

## Review and editing

All seven existing service paths are retained. Prices are carried over from verified source content and await Rachel’s confirmation. Galleries support arrow keys, Escape, modal focus containment and returning focus to the selected photograph. Sanity images use responsive CDN widths, modern formats, stored crops and focal points.

Rachel’s editing instructions are in [CMS-GUIDE.md](docs/CMS-GUIDE.md), with outstanding copy, prices and photo selections in [CONTENT-REVIEW.md](docs/CONTENT-REVIEW.md). Preview is a simple save-draft → refresh-preview → publish workflow. The original Webflow website is unaffected by publishing into this replacement’s dataset.

## Session

`SessionInquiryForm` retains identifier `0Ll72MoGY`. One shared script loads as the form approaches the viewport; its vendor-owned mount survives client navigation and React remounts. The outer iframe is bounded to 60rem to contain a verified vendor resize issue while retaining native scrolling. No iframe internals or submission behaviour are modified, and no custom enquiry backend exists.

Automated tests never submit a lead. An end-to-end submission and receipt check requires Rachel or explicit authorisation.

## Verification

```sh
npm run typecheck
npm run lint
npm run format:check
npm run build
npx sanity schema validate
npx playwright install chromium
npm test
LIVE_SESSION=1 npm test -- tests/session-live.spec.ts
```

Tests use the local server on port 3000 or start it when absent. They cover routes, metadata, preview indexing controls, mobile navigation, galleries, image crops, Session failure and repeat navigation. A successful local test does not prove authenticated Sanity publish/preview until credentials are configured. See [VERIFICATION.md](docs/VERIFICATION.md).

## Staging and eventual launch

Default `SITE_MODE=preview`: HTML and response headers specify `noindex, nofollow`; robots disallows crawling and sitemap returns 404. `SITE_URL` controls canonical/social origins. Studio and API remain noindex even in production; draft metadata also remains noindex.

Only a separately approved migration enables `SITE_MODE=production`. Run `npm run check:launch` to catch preview mode, an unsuitable origin or the wrong content source before that migration. Complete the [URL mapping, launch and rollback checklist](docs/MIGRATION.md) first. No production redirects have been enabled.

Optional analytics uses `NEXT_PUBLIC_GA_MEASUREMENT_ID` and loads only after visitor consent. Leave it empty on staging. Do not commit real tokens or `.env.local`.

Security overrides in package.json update vulnerable Sanity CLI transitive dependencies without downgrading Studio. The current lockfile audits clean; retest these overrides when upgrading Sanity.

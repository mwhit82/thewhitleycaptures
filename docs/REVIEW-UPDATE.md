# Rachel review update — implementation record

## Content and provenance

Four complete articles were imported from the existing Webflow site, preserving their `/post/` addresses: awards, general backdrops, baby posing backdrops and printing. The source snapshot is `review-source-articles.json`; `review-asset-sources.json` records original photograph URLs, source pages and local dimensions. All 50 article images were retained, including the printing comparison. Consecutive image sections were combined into browsable collections without dropping images or text sections.

The six existing Webflow portfolio categories contribute eight curated images each, selected across their source collection and visually reviewed for category fit. Existing photographs remain. Maternity retains its two existing representative photographs; no unrelated category was substituted. Corporate, Landscape and Mini-Shoots remain unresolved for the production migration and show an explicit unavailable message when requested on the preview portfolio.

`review-copy-changes.json` records article wording edits. These are first-person contact wording, two typo corrections and a clearer explanation of screenshots and print kiosks. Existing printer recommendations are retained as Rachel's advice, with an explicit preview-only review note. The award article's baby-led link now leads to Baby & Newborn; contact links lead to the enquiry section; the inconsistent `/Portfolio` link is corrected. No customer quotations or legal text were changed.

`src/content/local/review-introductions.json` contains the condensed service introductions. They consolidate the previous introductory and story copy, preserve safety, capacity, travel and package details, and remove repeated statements. Package prices themselves were not changed.

## Migration and rollback

`scripts/migrate-review.ts` is a targeted migration, not a replacement seed. Dry run:

```sh
node --import tsx scripts/migrate-review.ts
```

Authenticated application:

```sh
npx sanity exec scripts/migrate-review.ts --with-user-token -- --apply
```

The migration creates missing articles only, reuses existing assets by source ID, appends missing portfolio photographs, adds unset homepage fields and replaces the specific woodland feature photograph only if its original key is still present. Service copy is changed only if it still matches the original fixture copy. Revision guards reject concurrent document edits, and documents with drafts are skipped. A private backup of affected document types is written under ignored `.wrangler/` before each application. Uploads run sequentially to respect Sanity's in-flight request limit. A interrupted migration can be rerun safely; existing articles and asset IDs are reused.

If rolling back, revert the code commit first; additive CMS fields are compatible with the previous frontend. Restore only intended document fields from the private backup after checking for newer edits. Never bulk-replace the dataset or delete shared assets.

`scripts/import-review-content.mjs` rebuilds the raw local import from Webflow. It is an explicit engineering tool, not part of build/deploy: rerunning it resets imported fixtures to source copy, so review and reapply editorial changes before committing. It never writes to Webflow.

## Deployment and review

Keep SITE_MODE=preview, noindex/nofollow, disabled sitemap and server-only Viewer token. GitHub main deploys the Cloudflare review Worker automatically. No domain attachment, DNS, nameserver or Webflow change is included. See RACHEL-REVIEW.md for the handover and HOSTING.md for deployment settings.

## Verification

Next.js production build (webpack) and Cloudflare production build passed. Lint, type checking, formatting and Sanity schema validation passed; schema validation reported zero errors and warnings. The built Worker passed 24 checks against live Sanity and Session, then the corrected simulated-touch test passed separately, completing all 25 non-Studio checks. The original touch failure was missing the required identifier in the test event. No enquiry was submitted. Desktop and phone layouts were visually inspected, and mobile footer overflow was corrected. The migration dry run after application reported zero changes. Hosted Studio and the full hosted suite are the final deployment checks.

# CMS usability and reliability review — 27 September 2026

## Findings addressed

- **Optional content could break rendering.** Cleared arrays now resolve to empty lists, unpublished references are filtered after dereferencing, empty service galleries are omitted, and gallery upload slots without assets are skipped. Photo rendering tolerates an unselected image. Regression coverage exercises these CMS shapes without changing live documents.
- **Service addresses and lifecycle actions could break existing journeys.** Existing service slugs are read-only in Studio. The seven service templates are excluded from the create menu, and destructive/duplicate service actions are hidden. Structural changes remain a developer task; these editor controls are not a substitute for Sanity permissions.
- **The gallery featured shortlist did not affect the website.** That legacy field is hidden, preserving stored data. Rachel chooses actual hero and card photographs on the service’s Photographs tab. Testimonial favourites are explicitly labelled as library markers, with a usable library sort order.
- **Validation was too shallow.** Essential nested homepage fields now validate before publishing. Email, privacy destinations and non-negative, two-decimal prices are checked. Empty social-link lists remain permitted.
- **Editor labels and organisation needed polish.** Homepage and Site settings have friendly titles. Photos, links, FAQs and packages have useful previews. Services have Page copy, Photographs, Prices & questions, Kind words, Search & sharing and Page settings tabs. Releases is disabled because this project implements ordinary draft/publish preview, not release perspectives.
- **The seed script only worked in one execution context.** Environment loading now works with both the normal Node dry run and the Sanity CLI module runner. The dry run remains read-only and checks actual GROQ projections and references.
- **A gallery could retain an invalid selected index after an image was removed.** The displayed lightbox image is now bounded to the remaining collection.

## Verification

- TypeScript, lint, whitespace checks and production build passed.
- Sanity schema validation: zero errors/warnings.
- Read-only validation of existing Sanity documents: no reported issues.
- Automated suite: 15 passed, 1 optional live Session test skipped. Prior live Session verification remains documented separately.
- Migration dry run: reference/query preflight passed; no content import or overwrite performed during this review.

## Remaining acceptance work

Authenticated **save draft → preview → publish → exit preview** has not been certified. `SANITY_API_READ_TOKEN` still needs a Viewer token in the local environment. Until configured, Studio can save drafts and publish content, but its Preview website action returns setup guidance. Published website content refreshes within about a minute.

After configuring the token, perform a supervised editor walkthrough with Rachel: change a draft heading, replace a photograph, reorder gallery images, check phone/desktop preview and publish an agreed change. Do not claim this workflow is verified from schema checks alone.

Rachel must also confirm legacy prices, final photographs and the outstanding content items in CONTENT-REVIEW.md. The site remains staging/noindex; production migration is a separate decision.

## Next.js console review — 27 September 2026

- Confirmed the visual-editing timeout was caused by exposing Presentation while `SANITY_API_READ_TOKEN` was absent. Studio now receives only a server-computed readiness boolean. Until configured, the same presentation URL displays a Preview setup tool with an explanation and a published-website link; no iframe connection is attempted. Authenticated draft entry still fails closed without valid setup and a valid Studio secret.
- Kept Sanity intent/params props on React link components while filtering them from native HTML elements in Studio, addressing styled-components forwarding warnings.
- Fixed misleading LCP warnings caused by hero and gallery copies sharing a URL in Next's image registry. Hero/enlarged photos use quality 85; smaller gallery photos use 80. Only the active enlarged photo mounts when its dialog is open. Below-fold images remain lazy.
- Added a browser console regression across the homepage and seven service routes, plus a configuration test for both preview readiness states. Mobile gallery focus/keyboard checks still pass.
- Historical useMemo dependency warnings were present in the old dev log; the website regression run did not reproduce them. Signed-in Studio navigation and real draft preview still require a follow-up walkthrough after configuring the Viewer token. No content was published or changed during these checks.

### Follow-up: confirmed Studio useMemo error

Expanded the signed-in gallery error stack and traced it to `react-i18next` 17.0.15 `useTranslation`, called by Sanity's `useI18nText` / `PaneContextMenuItem`. The namespace dependency list changes from empty to `studio` while labels load. This was not caused by WebsiteStudio's fixed-length config memo.

Added a reproducible version-pinned dependency patch (see `patches/README.md`) and a browser regression covering namespace growth/shrinkage and correct label updates. Restarted the local development server with a fresh cache. No Sanity content was modified.

Follow-up verification: opened the signed-in gallery list, newborn gallery editor, homepage editor, and returned to galleries without new hook errors or an issues badge. All 18 active automated tests passed (one optional live Session test skipped); production build, lint, type checking and formatting passed. A separate historical hydration message showed Grammarly-injected body attributes in Chrome; this is not the gallery hook defect, and application diagnostics were not suppressed.

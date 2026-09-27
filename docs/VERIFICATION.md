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

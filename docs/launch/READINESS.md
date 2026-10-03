# Production launch checklist — 3 October 2026

Rachel has approved the current copy/photos. User confirmed a Session enquiry was received successfully on 3 October. The newly appended photos still require Rachel's review before any domain change.

## Protection and rollback

- Squarespace remains the registrar. DNS management can move to Cloudflare after the full Squarespace record inventory is verified.
- Keep Webflow active for exactly 24 hours after actual cutover; cancellation is requested for 4 October, with the time still to be agreed. Do not promise a 24-hour overlap if the actual deadline is earlier.
- Before cancellation, rollback can remove Worker custom-domain bindings and restore captured Webflow website DNS records in Cloudflare. Preserve mail and verification records.
- After cancellation, use Cloudflare deployment rollback and Sanity backups. The Webflow archive is content/source recovery, not a runnable CMS replacement.
- No domain or nameserver changes are included in preparation deployments.

## Backups

Private local archives live in `.wrangler/launch-backups/` (ignored by Git). `sanity-prelaunch.tar.gz` contains all 38 documents and 114 assets before import, including drafts. `webflow/` contains 34 published HTML pages, the sitemap, original referenced assets and a SHA-256 manifest. This is a published-site archive, not an export of private Webflow account settings, form submissions or unpublished CMS items.

Verify archives before cancellation, copy them to business-controlled backup storage, and keep the original files. GitHub contains the optimized local website assets, not these private backups.

## Search and old addresses

The authoritative executable map is `src/content/legacy-urls.json` plus the portfolio query mapping. All ten retired articles receive 410: their topics are not fully replaced by the four retained articles. Retired service pages and known category queries receive 410; unknown addresses remain 404. Server-side 301 redirects preserve useful query parameters, remove the obsolete tab selector and are tested without following redirects. Retain redirects indefinitely.

Search Console access has not been verified. Before cutover, review any available indexed URL/export reports and retain verification records. After launch submit `/sitemap.xml`; the domain does not change, so do not use Change of Address.

## Privacy

`/privacy-policy` preserves the existing published policy text, with a factual section listing Cloudflare, Sanity and Session. No legal promises, retention periods or consent claims were invented. Rachel should confirm the retained business/address details and review the older legal wording before launch. This migration is not a legal compliance certification.

## Final gates

- [ ] Rachel approves newly expanded masonry galleries.
- [ ] Full Squarespace DNS inventory and DNSSEC checked, including any hidden/custom subdomains.
- [ ] Production secret and exact Sanity CORS origin configured; signed-in production draft preview verified.
- [ ] Production build, redirects, TLS, canonical www host, sitemap/indexing and mobile checks pass.
- [ ] Exact cutover/cancellation times preserve the 24-hour overlap.
- [ ] User approves concrete nameserver and domain changes.
- [ ] Search Console sitemap submitted after cutover.

Monitor server errors and missing paths immediately, later on launch day and before cancellation, then daily for one week and weekly for a month. No automatic monitoring is installed by this checklist.

## Completed preparation

- Published-site archive verified: 34 HTML pages and 815 assets. Original Sanity archive verified before import.
- Append-only import verified against all 37 original non-system documents: existing content, drafts and the complete original gallery prefixes are unchanged. Added 478 photographs; skipped 58 source photographs already represented. See `docs/launch-photo-report.json`.
- Maternity has only three suitable photographs on the old service page and no separate old portfolio collection; all three are now represented.
- Local gallery snapshots preserve the expanded published galleries and use local optimized images. Never run the old seed against Rachel's dataset.
- The full Squarespace DNS records screen has four records: apex Webflow A, www Webflow CNAME, Google verification CNAME, Squarespace Domain Connect CNAME. Exact records/TTLs are in the private backup `dns/squarespace-before.json`. No MX records are configured.
- User clarified cancellation can happen at any time after the actual 24-hour overlap; no fixed hour tomorrow is required.
- Automated live Session loading and repeated navigation passed without submitting a form. User separately confirmed receipt of Rachel's test enquiry.

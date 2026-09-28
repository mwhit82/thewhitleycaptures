# Editing your website

## Getting in

Open `/studio` on the review website (locally, http://localhost:3000/studio). Sign in with the Sanity account that belongs to The Whitley Captures. Mark must first import the starting content and allow this website address in Sanity; setup instructions are below.

Choose **Edit website**. The left menu contains Homepage, Photography services, Photo galleries, Testimonials and Site settings. Ordinary edits do not need GitHub or hosting access.

## Homepage and services

1. Open Homepage or choose a Photography service.
2. Open the section you want to change. Text fields use the same headings as the page.
3. Change the words. Sanity automatically saves a draft; that does not change the published website.
4. Check the preview, then choose **Publish** when happy.

On the homepage, drag the photography categories or testimonials to change their order. A service has separate **Homepage card photograph** and **Main photograph** fields. Changing one does not change the other. Existing Page addresses are locked to protect old links. Mark handles any deliberate address changes or additions to the seven photography categories.

Prices are in pounds. Existing prices and service details need the checks in CONTENT-REVIEW.md before launch. Review reminders appear on staging only.

## Photographs and galleries

- In a photograph field choose Upload, or Select to reuse an existing photograph. To replace a photo, use that field’s replacement menu.
- Open Photo galleries, then the named service gallery. Drop several images into Photographs or choose Upload. Use website-size exports rather than master files.
- Drag the thumbnails to reorder. Open a photograph’s menu and remove it to remove it from that gallery. This does not delete the image from the library or other pages.
- Open each photograph to add its image description and optional caption. Describe the moment without identifying children.
- Use crop/focal-point controls to keep the subject visible on phones. Check the actual page afterwards.
- To feature a photo on a service, select it in that service’s Main photograph or Homepage card photograph field. Homepage supporting photography uses the selected gallery in Homepage → Featured photography; remove that gallery reference to hide the section.

## Testimonials and settings

Open Testimonials to edit a customer name or quotation, then select the testimonial on Homepage or the relevant service. Keep the customer’s actual words unchanged. Related services and Favourite for future use help organise the library; selecting references on the page determines what is displayed.

Site settings contains your logo, email, location, navigation, social links and default search/sharing details. Page-specific Search & sharing fields control the title, description and photograph used for Facebook and messaging previews.

## Preview and publish

Choose **Preview website** in Studio. With preview enabled, the site says “Draft preview”. Save your changes, then refresh the preview to see the latest saved draft. Use the preview’s phone/desktop size controls. This intentionally uses a simple refresh-based workflow, not click-to-edit overlays.

After publishing, the normal staging site updates within about a minute; refresh it after that. Exit preview to check the published version. A failed preview setup never publishes a draft automatically.

If preview says it needs a Viewer token, Mark must finish the setup below. Until then, drafts can be saved in Studio, but only published content is shown on the normal website. Publishing here updates the replacement website’s content only; it does not change Webflow or the live domain.

## Setup for Mark

1. `cp .env.example .env.local`. Set `CONTENT_SOURCE=local` temporarily if the dataset is still empty. Project is `4d7wgp7e`, dataset `production`.
2. In [Sanity project management](https://www.sanity.io/manage), add `http://localhost:3000` under API → CORS origins with **Allow credentials**. Add port 3001 separately if used. Add only the exact eventual staging origin, not a wildcard. Phone Studio/preview needs its exact LAN origin too.
3. Invite Rachel with editing access if needed. The Studio uses her Sanity login; published website reads need no token for this public dataset.
4. For initial import, create an **Editor** API token under API → Tokens and save it as `SANITY_API_WRITE_TOKEN` in `.env.local`. Alternatively run `npx sanity login`, then `npm run cms:seed:login`.
5. Run `npm run cms:seed` to inspect the destination/count, then `npm run cms:seed -- --apply`. This uploads the curated images and creates missing documents atomically. It never replaces existing document IDs. Resolve any intentionally existing content manually instead of forcing an overwrite. Remove the write token after import.
6. Set `CONTENT_SOURCE=sanity` and restart. Check the homepage, all seven services, images and Studio. Local files are now isolated offline fallback/migration inputs only; edits to them do not affect the CMS site.
7. Create a **Viewer** API token under API → Tokens; save as `SANITY_API_READ_TOKEN`. Restart. Studio’s Presentation tool generates a short-lived authenticated preview secret; the server validates it before setting its draft cookie. The read token stays server-side. No shared public preview password is used.
8. Test save draft → refresh preview → publish → exit preview. Invalid preview links must be rejected. Never commit tokens or paste them into chat.

Remote staging requires a separately configured hosting project, environment values, exact Sanity CORS origin, correct SITE_URL and hosting access protection. `noindex` is not a password. A phone can review locally on the same Wi-Fi while the development server runs. No remote URL or production migration has been set up by this milestone.

## Editing safeguards

Service editing is split into Page copy, Photographs, Prices & questions, Kind words, Search & sharing and Page settings. The seven established services cannot be accidentally duplicated, unpublished or deleted through the normal editor controls. Ask Mark for structural changes. These controls simplify editing; Sanity project permissions still determine who can access the underlying data.

Required headings, links, email and prices are checked before publishing. Optional empty galleries and testimonial selections are omitted safely. A photograph that is still uploading is not displayed in a gallery yet. The old gallery “Featured photographs” shortlist is hidden because it did not change the website; choose the real service card/hero fields instead.

Use ordinary Draft → Publish. The advanced Releases tool is hidden because it is not part of this site’s preview workflow.

If Studio shows **Preview setup**, editing and saving are available, but draft preview is not ready. The developer must configure `SANITY_API_READ_TOKEN` with Viewer access, use Sanity content mode, and restart the server. Studio then offers **Preview website** automatically. Only the readiness flag reaches the browser; the token stays on the server. The website link on the setup screen displays published content, not drafts.

## Rachel’s review update

The homepage now supports three ordered hero photographs and an awards introduction. Photo galleries supply the complete portfolio and the first three service-page photographs. Client guides and awards have their own Studio collection, preserved page addresses and draft-preview links. See [Rachel’s review guide](RACHEL-REVIEW.md) for editing steps and the pre-launch content checklist. The migration never replaces existing articles or drafts; see [migration details](REVIEW-UPDATE.md).

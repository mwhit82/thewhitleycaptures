# Rachel’s website review

Website: https://thewhitleycaptures-preview.thewhitleycaptures.workers.dev

Editing Studio: https://thewhitleycaptures-preview.thewhitleycaptures.workers.dev/studio

The preview works on your phone or laptop from any network. Sign in to Studio with your existing Sanity account. The Webflow website is still live and unchanged.

## What to review

- Homepage: the opening photograph changes between three images. Check their crops on your phone and laptop, and the enquiry form beneath the seven service cards.
- Photography pages: check the condensed introductions, prices and package details. Prices now come directly after the introduction; “View prices” jumps to them.
- Portfolios: each service page now shows its full collection below the prices. “View portfolio” jumps down to it. Open a photograph, then use Next/Previous, arrow keys or swipe. Maternity currently uses the two existing representative photographs; add more whenever you like.
- Awards: check the award names and years, photographs and homepage introduction.
- Client guides: check both backdrop libraries are current, plus printing advice, provider recommendations and package inclusions. Preview-only review notes identify these checks.
- Enquiry form: review its appearance. We have not submitted an enquiry during testing; please make any authorised test submission yourself.

## Editing in Sanity

**About Rachel**: edit the new About page’s heading, paragraphs, portrait, closing heading, enquiry link and search metadata. It starts with the existing introduction; Rachel can expand it here. The homepage introduction remains separately editable.

**Homepage → Opening section → Hero slideshow photographs**: select up to three photographs, drag to change their order, and open each one to set its crop/hotspot and image description. The first image loads immediately. Keep three for the rotating design; an empty list uses the fallback photograph. Automatic rotation stops for reduced-motion visitors.

**Homepage → Awards introduction**: edit the heading, introduction, linked article and optional award certificate/photograph. The certificate appears uncropped beside the introduction, or above it on mobile. Clear the image for a text-only section.

**Photography services**: choose the service. “Page copy” contains the introduction; separate paragraphs with a blank line. “Prices & questions” contains packages and pricing notes. Existing additional introduction paragraphs are still supported for older content, but the imported introductions have been combined.

**Photo galleries**: add, remove or reorder photographs for each service. The full collection appears on its service page. The old homepage photo strip and its gallery are retained as unused content. Removing a photograph from a gallery does not delete its original asset.

**Client guides & awards**: choose an article. “Article content” contains headings, paragraphs and photograph collections. Drag sections to reorder them. Text segments can optionally contain a link. Keep the existing page address unchanged because clients may already have it saved. Review notes appear only on the preview site.

## Preview and publish

Changes save as drafts. Choose **Preview website**, open the page you edited and use **Refresh preview** after saving. Normal visitors continue to see the published version. Publish only when you are happy. Use **Exit preview** to see the ordinary website again.

Publishing in Sanity updates this new website; it does not edit Webflow. Code changes are deployed automatically from GitHub. Moving the real domain is a separate, explicitly approved step after your review.

## Review notes

Internal article, service and pricing reminders are visible to everyone on the preview site. They disappear when the site is configured for production; publishing a Sanity document does not hide them. Customer-facing package inclusions and conditions remain visible.

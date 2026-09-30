// Explicit projections maintain the same contract as the isolated offline provider.
// Image crop rectangles are applied by the image mapper before responsive resizing.
const photo = `{ "id": coalesce(_key, asset._ref), "src": asset->url,
 "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height,
 "alt": coalesce(alt, ""), caption, crop, sourceUrl, sourcePage,
 "position": {"x": coalesce(hotspot.x, 0.5) * 100, "y": coalesce(hotspot.y, 0.5) * 100} }`;
const seo = `{title, description, "image": image${photo}}`;
const testimonial = `{ "id": _id, name, quote, featured, order, "serviceIds": services[]._ref }`;
const gallery = `{ "id": _id, title, "images": coalesce(images[defined(asset->url)]${photo}, []), "featuredImageIds": coalesce(featuredImages[].asset._ref, []) }`;
const service = `{ "id": _id, title, "slug": slug.current, order, description,
 "cardImage": cardImage${photo}, "hero": hero${photo}, introduction,
 "sections": coalesce(sections[]{"id": _key, heading, "paragraphs": coalesce(paragraphs, [])}, []),
 "packages": coalesce(packages[]{"id": _key, title, price, duration, "includes": coalesce(includes, []), note}, []), pricingNote,
 "included": coalesce(included, []), "galleryId": gallery._ref, "gallery": gallery->${gallery},
 "testimonialIds": coalesce(testimonials[]._ref, []), "testimonials": coalesce((testimonials[]->${testimonial})[defined(id)], []),
 "faqs": coalesce(faqs[]{"id": _key, question, answer}, []), cta, "seo": seo${seo}, reviewNote }`;

export const settingsQuery = `*[_type == "siteSettings" && _id == "site-settings"][0]{"id": _id, name, "logo": logo${photo}, email, location, areaServed, "navigation": coalesce(navigation[defined(href) && defined(label)], []), "socials": coalesce(socials[defined(href) && defined(label)], []), privacyUrl, "seo": seo${seo}}`;
export const homepageQuery = `*[_type == "homepage" && _id == "homepage"][0]{"id": _id,
    hero{..., "image": image${photo}, "images": coalesce(images[defined(asset->url)]${photo}, [])}, introduction{..., "paragraphs": coalesce(paragraphs, []), "image": image${photo}}, enquiry,
    services{..., "ids": items[]._ref, "items": coalesce((items[]->${service})[defined(id)], [])},
    featured{..., "galleryId": gallery._ref, "gallery": gallery->${gallery}},
    testimonials{..., "ids": items[]._ref, "items": coalesce((items[]->${testimonial})[defined(id)], [])}, cta, awards{heading, copy, "image": image${photo}, "articleSlug": coalesce(article->slug.current, articleSlug)}, "seo": seo${seo}}`;
export const servicesQuery = `*[_type == "photographyService" && slug.current in ["baby-newborn","maternity","portraits","family-portraits","on-location","cake-smash-bath","sitter"]] | order(order asc) ${service}`;
export const serviceQuery = `*[_type == "photographyService" && slug.current == $slug][0]${service}`;

const article = `{ "id": _id, "slug": slug.current, title, summary, kind, sourceUrl, reviewNote,
 "blocks": coalesce(blocks[]{"id": _key, kind, spans[]{text,href}, "images": coalesce(images[defined(asset->url)]${photo}, [])}, []), "seo": seo${seo} }`;
export const articlesQuery = `*[_type == "article"] | order(title asc) ${article}`;
export const articleQuery = `*[_type == "article" && slug.current == $slug][0]${article}`;

export const aboutQuery = `*[_type == "aboutPage" && _id == "about-rachel"][0]{"id": _id, heading, "paragraphs": coalesce(paragraphs, []), "portrait": portrait${photo}, closingHeading, cta, "seo": seo${seo}}`;

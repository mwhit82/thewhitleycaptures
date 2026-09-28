import type { Homepage } from '../types';
import images from './images.json' with { type: 'json' };
import articles from './articles.json' with { type: 'json' };
import { settings } from './settings';
export const homepage: Homepage = {
  id: 'homepage',
  hero: {
    images: [images.location, images.newborn0, images.maternity0],
    eyebrow: 'FAMILY PHOTOGRAPHY · DURHAM & THE NORTH EAST',
    heading: 'Little moments.',
    accent: 'Everything to you.',
    copy: 'Natural photographs of your most important people, by someone who cares as much as you do.',
    image: images.location,
    cta: { label: 'Check availability', href: '#enquire' },
    secondaryCta: { label: 'Find your photo shoot', href: '#photography' },
    footnote: 'STUDIO & LOCATION PHOTOGRAPHY',
    motto: 'Made personal. Kept forever.',
    photoCaption: 'A little of life, held still.',
  },
  awards: {
    image: {
      ...articles[0].blocks
        .flatMap((b) => b.images || [])
        .find((i) => i.id === 'review-ef61c81e4fb716')!,
      alt: 'Legacy Photography Awards Excellence distinction, newborn category, February 2026 — sleeping baby in blue, photographed by Rachel Whitley',
    },
    heading: 'Photographs made with care. Recognised with pride.',
    copy: 'I’m grateful to have my work recognised by photography awards. The little people in front of my camera always come first.',
    articleSlug: 'we-won-an-award',
  },
  introduction: {
    eyebrow: 'A LITTLE ABOUT ME',
    heading: 'Your people.\nMy whole heart.',
    paragraphs: [
      'Hello, I’m Rachel. A family photographer, a mam, and the person behind The Whitley Captures.',
      'Your family is your world. From the tiniest new arrival to the wonderfully chaotic family photo, I take the time to help everyone feel at home. My little studio is in Sherburn Hill, Durham — or we can head out into the beautiful North East together.',
    ],
    image: images.rachel,
    signature: 'Rachel x',
    imageCaption: 'THE FACE BEHIND THE CAMERA',
  },
  enquiry: {
    eyebrow: 'LET’S MAKE SOME MEMORIES',
    heading: 'It starts with a hello.',
    copy: 'Tell me a little about your family and the photo shoot you have in mind. I’d love to hear from you.',
  },
  services: {
    eyebrow: 'EVERY CHAPTER, BEAUTIFULLY CAPTURED',
    heading: 'A little moment for everyone.',
    copy: 'From the first flutter to the first birthday, and all the lovely life in between.',
    ids: [
      'baby-newborn',
      'maternity',
      'portraits',
      'family-portraits',
      'on-location',
      'cake-smash-bath',
      'sitter',
    ],
  },
  featured: {
    eyebrow: 'THROUGH MY LENS',
    heading: 'Small moments.\nLasting keepsakes.',
    galleryId: 'featured',
    cta: {
      label: 'Explore baby & newborn photography',
      href: '/prices/baby-newborn',
    },
  },
  testimonials: {
    eyebrow: 'KIND WORDS',
    heading: 'A little love, from my families.',
    ids: ['helen', 'kelly', 'hannah'],
  },
  cta: {
    eyebrow: 'YOUR NEXT CHAPTER',
    heading: 'Let’s capture it together.',
    copy: 'Tiny toes, big cuddles, or just being yourselves. I’d love to photograph your story.',
    link: { label: 'Check availability', href: '/#enquire' },
  },
  seo: settings.seo,
};

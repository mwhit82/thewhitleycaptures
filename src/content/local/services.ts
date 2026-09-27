import type { Service } from '../types';
import i from './images.json';
const summaries = [
  {
    id: 'baby-newborn',
    title: 'Baby & Newborn',
    description: 'The very beginning of your story.',
    image: i.baby,
    introduction:
      'My baby photography packages are suitable for babies from newborn until they’re sitting unaided. Gentle, patient photo shoots, going at your little one’s pace and comfort levels.',
  },
  {
    id: 'maternity',
    title: 'Maternity',
    description: 'A little time, just for you and your bump.',
    image: i.maternity0,
    introduction:
      'A wonderful way of capturing such a special time in your life, my maternity photo shoots are designed with your comfort and preferences in mind.',
  },
  {
    id: 'portraits',
    title: 'Portraits',
    description: 'A little glimpse of who you are.',
    image: i.portraits,
    introduction:
      'Portraits are for small groups, of two or less (or 2 plus a baby), and are available in my studio or on location.',
  },
  {
    id: 'family-portraits',
    title: 'Family',
    description: 'Your favourite people, all together.',
    image: i.family,
    introduction:
      'Available in the studio or on location, my family photo shoots include a mix of posed and natural shots of you and your family of any size.',
  },
  {
    id: 'on-location',
    title: 'On Location',
    description: 'Fresh air and room to be yourselves.',
    image: i.location,
    introduction:
      'Whether you have a location in mind, or need some inspiration, outdoor shoots are lots of fun in the glorious British weather!',
  },
  {
    id: 'cake-smash-bath',
    title: 'Cake Smash & Bath',
    description: 'A birthday, a little mess, a lot of joy.',
    image: i.cake,
    introduction:
      'Cake smashes are suitable for up to age 4, and include a custom design to suit your preferences, and the cake to take home to finish off. Additional bath splashes are available as an add-on.',
  },
  {
    id: 'sitter',
    title: 'Sitter',
    description: 'Little personalities, finding their feet.',
    image: i.sitter,
    introduction:
      'Sitter shoots are ideal for babies who can sit and / or stand aided, but aren’t yet walking. It’s a wonderful milestone to capture, full of smiles.',
  },
];
export const services: Service[] = summaries.map((s, order) => ({
  id: s.id,
  slug: s.id,
  title: s.title,
  order,
  description: s.description,
  hero: s.image,
  introduction: s.introduction,
  sections: [],
  packages: [],
  included: [],
  galleryId: s.id,
  testimonialIds: [],
  faqs: [],
  cta: { label: 'Ask me about a photo shoot', href: '/#enquire' },
  seo: {
    title: `${s.title} photography in Durham`,
    description: s.introduction,
    image: s.image,
  },
  reviewNote:
    s.id === 'baby-newborn'
      ? undefined
      : 'Preview for Rachel: this is a first look at the page. Full service details and final image selections are still to be reviewed.',
}));
Object.assign(services[0], {
  hero: i.newborn0,
  sections: [
    {
      id: 'approach',
      heading: 'Tiny details. A gentle pace.',
      paragraphs: [
        'I use wraps, outfits and props to safely pose and position your baby in a mix of styles. I’m a gentle, patient baby photographer and take great care in handling and making friends with your tiny little one; sometimes I just enjoy a cuddle for a few minutes!',
        'Safety is my top priority, regardless of the package you choose. I’ve completed extensive training in wrapping and posing babies, including hands-on training, so your little one’s comfort always comes first.',
      ],
    },
  ],
  packages: [
    {
      id: 'wrapped',
      title: 'Wrapped Mini',
      price: 79,
      duration: 'Around 1 hour',
      includes: [
        '10 digital images',
        'Wrapped captures in a variety of colours and props',
        'A capture with mam & dad',
      ],
      note: 'No unwrapped posed images, siblings or home outfits.',
    },
    {
      id: 'standard',
      title: 'Standard',
      price: 129,
      duration: '2–3 hours',
      includes: [
        '10 digital images',
        'Unwrapped, posed and wrapped captures',
        'A family capture with your baby wrapped',
        'Siblings included in one prop setup',
      ],
      note: 'No home outfits.',
    },
    {
      id: 'premium',
      title: 'Premium',
      price: 169,
      duration: 'Often more than 3 hours',
      includes: [
        '12 digital images',
        'A wide range of posed and wrapped captures',
        'Captures with each parent and the whole family',
        'Multiple sibling captures',
      ],
      note: 'Not recommended where siblings are under 5 or cannot be taken somewhere more fun after their part.',
    },
  ],
  pricingNote:
    'Prices carried over from the existing website for Rachel to review. Please confirm current pricing when you enquire.',
  included: [
    'Additional digital images are £10 each.',
    'Packages do not include all images.',
  ],
  testimonialIds: ['catherine', 'lisa'],
  faqs: [
    {
      id: 'book',
      question: 'When should I book?',
      answer:
        'The best time to reserve your photo shoot is after your 20 week scan. I don’t book a specific date at that point; I reserve a slot around your due date. I rarely have immediate availability, so please get in touch in advance.',
    },
    {
      id: 'age',
      question: 'How old should my baby be?',
      answer:
        'Newborn shoots are held in the first 2–3 weeks, older newborn sessions at 4–8 weeks, and baby sessions from 8 weeks until sitting unaided. For those squishy, posed captures, it’s best to visit when your baby is brand new, although some posing is possible with older babies.',
    },
    {
      id: 'siblings',
      question: 'Can parents and siblings join in?',
      answer:
        'All three packages include a capture with parents. Standard includes siblings in one prop setup; Premium includes multiple sibling captures. The Wrapped Mini does not include siblings.',
    },
  ],
});
Object.assign(services[1], {
  sections: [
    {
      id: 'comfort',
      heading: 'Made to feel like you.',
      paragraphs: [
        'There are no additional costs for partners or family members to join in, and I have a range of outfits and fabrics for you to wear, as well as a range of backdrops to suit a variety of styles.',
        'I recommend holding your maternity photo shoot in the 7th or 8th month of pregnancy and booking at some point in your second trimester.',
      ],
    },
  ],
});

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
  cardImage: s.image,
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

Object.assign(
  services.find((service) => service.id === 'maternity')!,
  {
    packages: [
      {
        id: 'maternity',
        title: 'Maternity',
        price: 60,
        duration: '',
        includes: [
          '10 digital images',
          'Partners and family welcome at no additional cost',
          'A choice of outfits, fabrics and backdrops',
        ],
      },
    ],
    faqs: [
      {
        id: 'timing',
        question: 'When should I book?',
        answer:
          'I recommend booking during your second trimester, for a photo shoot in your 7th or 8th month of pregnancy.',
      },
    ],
    reviewNote:
      'Rachel: please confirm the £60 price and whether the previous newborn bundle saving still applies.',
    pricingNote:
      'Prices from the existing website, awaiting Rachel’s confirmation. Please confirm current pricing when you enquire.',
  },
);

Object.assign(
  services.find((service) => service.id === 'portraits')!,
  {
    sections: [
      {
        id: 'your-session',
        heading: 'A photo shoot with personality.',
        paragraphs: [
          'My most versatile photo shoot, Portraits are available in a wide range of themes for up to two people, including birthdays.',
          'I include some posed images, but mainly look to capture you and your little one naturally. Choose two backdrop designs, with props to suit your preferences.',
        ],
      },
    ],
    packages: [
      {
        id: 'portrait',
        title: 'Portraits',
        price: 79,
        duration: '',
        includes: ['10 digital images', 'Two backdrop designs'],
        note: 'This price does not apply to cake smashes or posed newborn sessions. Floating balloons carry a surcharge; alternatives are available.',
      },
    ],
    pricingNote:
      'Prices from the existing website, awaiting Rachel’s confirmation. Please confirm current pricing when you enquire.',
  },
);

Object.assign(
  services.find((service) => service.id === 'family-portraits')!,
  {
    sections: [
      {
        id: 'together',
        heading: 'Room for everyone to be themselves.',
        paragraphs: [
          'I include a mix of posed and relaxed, lifestyle captures, with individual portraits if you wish. I help everyone relax, play with the children and even get a little silly to bring out natural expressions.',
          'Two backdrop setups give you a choice of styles. For your comfort, my studio accommodates up to four adults plus little ones. Larger families can be photographed at the local community centre.',
        ],
      },
    ],
    packages: [
      {
        id: 'family',
        title: 'Family photo shoot',
        price: 99,
        duration: '',
        includes: [
          '10 digital images',
          'Two backdrop setups',
          'Individual portraits if you wish',
        ],
      },
    ],
    faqs: [
      {
        id: 'group',
        question: 'Can you photograph a larger family?',
        answer:
          'My studio accommodates up to four adults plus little ones. Larger families can be accommodated at the local community centre; please enquire about the arrangements.',
      },
    ],
    pricingNote:
      'Prices from the existing website, awaiting Rachel’s confirmation. Please confirm current pricing when you enquire.',
  },
);

Object.assign(
  services.find((service) => service.id === 'on-location')!,
  {
    sections: [
      {
        id: 'outdoors',
        heading: 'A favourite place, a different perspective.',
        paragraphs: [
          'I can visit your home, your favourite place or recommend seasonal beauty spots nearby for most of my packages. My editing is included, so the weather does not have to be perfect.',
          'Locations up to 15 minutes away have no additional travel charge. Further afield in the North East, travel starts at £10, depending on the distance, in addition to your chosen package. Contact me with your location for a quote.',
          'Location shoots are not suitable for baby or cake smash packages.',
        ],
      },
    ],
    faqs: [
      {
        id: 'travel',
        question: 'How much does an on-location shoot cost?',
        answer:
          'The price is your chosen photography package plus any travel charge. Locations up to 15 minutes away have no additional charge; further afield in the North East, travel starts at £10. Please ask me for a quote.',
      },
    ],
    reviewNote:
      'Rachel: confirm the travel radius, £10 starting travel fee and package exclusions.',
    pricingNote:
      'Prices from the existing website, awaiting Rachel’s confirmation. Please confirm current pricing when you enquire.',
  },
);

Object.assign(
  services.find((service) => service.id === 'cake-smash-bath')!,
  {
    sections: [
      {
        id: 'celebrate',
        heading: 'A birthday worth getting messy for.',
        paragraphs: [
          'Cake smashes are recommended for children up to four years old. Please get in touch to discuss older birthdays. Choose a backdrop or let me style a solid-colour backdrop around your ideas.',
          'An 8-inch cake in your chosen colour is included, with the remaining cake yours to take home. A 6-inch cake is available for a £10 reduction.',
          'Add a milk bath splash in one of my miniature tubs for the clean-up afterwards. Please discuss any food allergies with me when you enquire. Floating balloons carry a surcharge; alternatives are available.',
        ],
      },
    ],
    packages: [
      {
        id: 'smash',
        title: 'Cake Smash',
        price: 99,
        duration: '',
        includes: ['10 digital images', 'An 8-inch cake', 'Backdrop styling'],
      },
      {
        id: 'smash-bath',
        title: 'Cake Smash & Bath',
        price: 129,
        duration: '',
        includes: ['13 digital images', 'An 8-inch cake', 'A milk bath splash'],
      },
    ],
    reviewNote:
      'Rachel: confirm cake sizes, the £10 smaller-cake reduction, balloon surcharge and allergy arrangements.',
    pricingNote:
      'Prices from the existing website, awaiting Rachel’s confirmation. Please confirm current pricing when you enquire.',
  },
);

Object.assign(
  services.find((service) => service.id === 'sitter')!,
  {
    sections: [
      {
        id: 'milestone',
        heading: 'Another little milestone.',
        paragraphs: [
          'A Sitter photo shoot is for babies who can sit or stand with help but are not yet running around. Two themes are included, with props and outfits to choose from. You are also welcome to bring outfits for your baby.',
          'I can photograph your little one in my Durham studio or nearby on location, depending on the weather.',
        ],
      },
    ],
    packages: [
      {
        id: 'sitter',
        title: 'Sitter',
        price: 49,
        duration: '',
        includes: [
          '10 digital images',
          'Two themes',
          'A choice of props and outfits',
        ],
      },
      {
        id: 'sitter-family',
        title: 'Sitter with family',
        price: 69,
        duration: '',
        includes: ['10 digital images', 'Family involvement', 'Two themes'],
      },
    ],
    pricingNote:
      'Prices from the existing website, awaiting Rachel’s confirmation. Please confirm current pricing when you enquire.',
  },
);

services.find((service) => service.id === 'family-portraits')!.testimonialIds =
  ['family-portraits-review-1', 'family-portraits-review-2'];

services.find((service) => service.id === 'on-location')!.testimonialIds = [
  'on-location-review-1',
  'on-location-review-2',
];

services.find((service) => service.id === 'cake-smash-bath')!.testimonialIds = [
  'cake-smash-bath-review-1',
  'cake-smash-bath-review-2',
];

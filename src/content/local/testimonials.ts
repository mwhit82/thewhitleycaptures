import type { Testimonial } from '../types';
export const testimonials: Testimonial[] = [
  {
    id: 'helen',
    name: 'Helen M',
    quote:
      'What can I say…the images are stunning. Rachel was amazing with the kids, giving them gentle direction to be able to get the best shots. I’m blown away by the quality of the pictures and I can’t wait to come back and document more growing up of the kids.',
  },
  {
    id: 'kelly',
    name: 'Kelly C',
    quote:
      'Visited twice now and over the moon with all photographs we have received. Lovely lady, welcoming atmosphere and amazing quality photographs. We wouldn’t use anyone else now.',
  },
  {
    id: 'hannah',
    name: 'Hannah R',
    quote: 'Amazing photographer with great style and an eye for a great shot.',
  },
  {
    id: 'catherine',
    name: 'Catherine M',
    serviceId: 'baby-newborn',
    quote:
      'Amazing service & photos from Rachel. We are over the moon with our photos of our 8 week old and our family shoot. Rachel was very welcoming and was great with our baby too. The photos are such good quality and captured him at his best. I couldn’t recommend Rachel enough, we will be back x',
  },
  {
    id: 'lisa',
    name: 'Lisa C',
    serviceId: 'baby-newborn',
    quote:
      'Fantastic photos. Rachael is amazing from start to finish. I had packet from new born to 1 year old cake smash and each time was great and amazing photos',
  },
];

testimonials.push(
  ...[
    {
      id: 'family-portraits-review-1',
      name: 'Sarah W',
      quote:
        'Rachel has photographed my children on many occasions over the last 5 years, both indoors and outdoors. This really isn’t an easy job! Her patience and skill never ceases to amaze me, and my family have so many treasured pictures as a result. She isn’t just a photographer - she’s a magician!',
      serviceIds: ['family-portraits'],
    },
    {
      id: 'family-portraits-review-2',
      name: 'Mark H',
      quote:
        'We were recommended by a friend to contact The Whitley Captures. Our visit was brilliant, a relaxed atmosphere and very accommodating for our boisterous boy. Very highly recommend!',
      serviceIds: ['family-portraits'],
    },
    {
      id: 'on-location-review-1',
      name: 'Jayne S',
      quote:
        'I was a bit nervous about trying to get my two girls to sit/stand/smile but Rachel was so patient and made the shoot fun which the girls loved. The photos have come out better than I could have imagined and couldn’t recommend Rachel enough. Love love love them.',
      serviceIds: ['on-location'],
    },
    {
      id: 'on-location-review-2',
      name: 'Lyndsay R',
      quote:
        'So in love with these photos. Rachel is so lovely too which made the experience of having them done ever better. Would highly recommend! ( My parents cried lots when they saw them 😂 ) thanks again!!',
      serviceIds: ['on-location'],
    },
    {
      id: 'cake-smash-bath-review-1',
      name: 'Hannah R',
      quote:
        'Rachel is absolutely amazing and is so lovely and patient with the kids! The photos we received were fantastic and I couldn’t have been happier with them. We have rebooked with Rachel for a Christmas and a 1st birthday shoot !',
      serviceIds: ['cake-smash-bath'],
    },
    {
      id: 'cake-smash-bath-review-2',
      name: 'Helen O',
      quote:
        'Rachel deserves a medal for managing to get the photos she did of our family for Christmas - she made everyone feel so comfortable and then the props she had helped the boys have some fun really naturally. My family all want copies and it was such amazing value. Thank you and we will definitely be back to capture more memories in the future.',
      serviceIds: ['cake-smash-bath'],
    },
  ],
);

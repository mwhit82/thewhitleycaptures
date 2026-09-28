import portfolio from './portfolio-images.json' with { type: 'json' };
import type { Gallery } from '../types';
import i from './images.json' with { type: 'json' };
export const galleries: Gallery[] = [
  {
    id: 'featured',
    title: 'A few favourite moments',
    images: [i.gallery3, i.gallery2, i.newborn0],
    featuredImageIds: ['gallery3', 'gallery2', 'newborn0'],
  },
  {
    id: 'baby-newborn',
    title: 'The smallest details, remembered',
    images: [
      i.newborn0,
      i.gallery2,
      i.gallery1,
      i.newborn1,
      i.gallery0,
      i.gallery3,
    ],
    featuredImageIds: ['newborn0'],
  },
  {
    id: 'maternity',
    title: 'A moment before everything changes',
    images: [i.maternity0, i.maternity2],
    featuredImageIds: ['maternity0'],
  },
  ...[
    { id: 'portraits', image: i.portraits },
    { id: 'family-portraits', image: i.family },
    { id: 'on-location', image: i.location },
    { id: 'cake-smash-bath', image: i.cake },
    { id: 'sitter', image: i.sitter },
  ].map(({ id, image }) => ({
    id,
    title: 'Through my lens',
    images: [image],
    featuredImageIds: [image.id],
  })),
];

for (const gallery of galleries) {
  const extra = portfolio[gallery.id as keyof typeof portfolio] || [];
  gallery.images = [
    ...gallery.images,
    ...extra.filter(
      (image) => !gallery.images.some((existing) => existing.id === image.id),
    ),
  ];
}

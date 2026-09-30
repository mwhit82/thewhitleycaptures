import type { AboutPage } from '../types';
import { homepage } from './homepage';
export const about: AboutPage = {
  id: 'about-rachel',
  heading: 'A little about me',
  paragraphs: homepage.introduction.paragraphs,
  portrait: homepage.introduction.image,
  closingHeading: 'Small moments. Lasting keepsakes.',
  cta: { label: 'Check availability', href: '/#enquire' },
  seo: {
    title: 'About Rachel',
    description:
      'Meet Rachel, the family photographer behind The Whitley Captures in Sherburn Hill, Durham.',
    image: homepage.introduction.image,
  },
};

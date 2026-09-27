import type { SiteSettings } from '../types';
import images from './images.json';
export const settings: SiteSettings = {
  id: 'site-settings',
  name: 'The Whitley Captures',
  logo: images.logo,
  email: 'thewhitleycaptures@gmail.com',
  location: 'Sherburn Hill, Durham',
  areaServed: 'North East England',
  navigation: [
    { label: 'Photography', href: '/#photography' },
    { label: 'A little about me', href: '/#about' },
    { label: 'Kind words', href: '/#kind-words' },
  ],
  socials: [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/thewhitleycaptures/',
    },
    { label: 'Facebook', href: 'https://www.facebook.com/TheWhitleyCaptures/' },
  ],
  privacyUrl: 'https://www.thewhitleycaptures.com/privacy-policy',
  seo: {
    title: 'Family photography in Durham',
    description:
      'Natural studio and location photography with Rachel Whitley. Baby, maternity and family photographs in Sherburn Hill, Durham and the North East.',
    image: images.location,
  },
};

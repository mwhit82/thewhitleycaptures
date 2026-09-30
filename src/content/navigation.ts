export const reviewLinks = [
  { label: 'About Rachel', href: '/about-me' },
  { label: 'Client guides', href: '/client-guides' },
  { label: 'Awards', href: '/post/we-won-an-award' },
];
export const portfolioTabs: Record<string, string> = {
  'baby-newborn': 'baby',
  maternity: 'maternity',
  portraits: 'portraits',
  'family-portraits': 'family',
  'on-location': 'on-location',
  'cake-smash-bath': 'cake-smash',
  sitter: 'sitter',
};
export function portfolioHref(slug: string) {
  return `/portfolio?tab=${portfolioTabs[slug] || slug}`;
}
export function guideSlugsForService(slug: string) {
  return slug === 'baby-newborn'
    ? [
        'our-baby-photo-shoot-beanbag-backdrop-library',
        'a-guide-to-printing-your-images',
      ]
    : slug === 'on-location'
      ? ['a-guide-to-printing-your-images']
      : ['our-backdrop-library', 'a-guide-to-printing-your-images'];
}

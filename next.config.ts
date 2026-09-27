import type { NextConfig } from 'next';
import { networkInterfaces } from 'node:os';
const config: NextConfig = {
  poweredByHeader: false,
  // Permit only this computer's own addresses for same-Wi-Fi phone review.
  allowedDevOrigins: Object.values(networkInterfaces())
    .flat()
    .filter((entry) => entry?.family === 'IPv4')
    .map((entry) => entry!.address),
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return process.env.SITE_MODE === 'production'
      ? []
      : [
          {
            source: '/:path*',
            headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
          },
        ];
  },
};
export default config;

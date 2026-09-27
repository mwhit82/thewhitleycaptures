import type { ContentImage } from './types';
// Provider adapters resolve local assets or Sanity images into this common shape.
export function imageStyle(image: ContentImage) {
  return {
    objectPosition: `${image.position?.x ?? 50}% ${image.position?.y ?? 50}%`,
  };
}

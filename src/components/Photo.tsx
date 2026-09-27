import Image from 'next/image';
import type { ContentImage } from '@/content/types';
import { imageStyle } from '@/content/images';
export function Photo({
  image,
  className = '',
  sizes = '100vw',
  priority = false,
}: {
  image: ContentImage;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      style={imageStyle(image)}
    />
  );
}

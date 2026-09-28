'use client';
import Image, { type ImageLoaderProps } from 'next/image';
function sanityLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality || 80));
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'max');
  return url.href;
}
// Hero and enlarged images receive extra detail; thumbnails use smaller files.
// Distinct URLs also avoid Next's src-keyed LCP tracking confusing duplicate images.
function detailedSanityLoader(props: ImageLoaderProps) {
  return sanityLoader({ ...props, quality: 85 });
}
import type { ContentImage } from '@/content/types';
import { imageStyle } from '@/content/images';
export function Photo({
  image,
  className = '',
  sizes = '100vw',
  priority = false,
  onLoad,
}: {
  image: ContentImage | null | undefined;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
}) {
  if (!image?.src || !image.width || !image.height)
    return (
      <div
        className={`photo-placeholder ${className}`}
        role="img"
        aria-label="Photograph not selected yet"
      />
    );
  return (
    <Image
      onLoad={onLoad}
      src={image.src}
      loader={
        image.src.startsWith('https://cdn.sanity.io/')
          ? priority
            ? detailedSanityLoader
            : sanityLoader
          : undefined
      }
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

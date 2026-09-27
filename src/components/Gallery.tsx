import type { Gallery as GalleryContent } from '@/content/types';
import { Photo } from './Photo';
// Deliberately static: photographs stay visible, with natural proportions and no carousel JS.
export function Gallery({ gallery }: { gallery: GalleryContent }) {
  return (
    <div className={`gallery gallery-count-${gallery.images.length}`}>
      {gallery.images.map((image) => (
        <figure key={image.id}>
          <Photo
            image={image}
            sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 40vw"
          />
          {image.caption && <figcaption>{image.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

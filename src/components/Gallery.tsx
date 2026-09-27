'use client';
import { useRef, useState } from 'react';
import type { Gallery as GalleryContent } from '@/content/types';
import { Photo } from './Photo';
export function Gallery({ gallery }: { gallery: GalleryContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const move = (offset: number) =>
    setIndex(
      (current) =>
        (current + offset + gallery.images.length) % gallery.images.length,
    );
  if (!gallery.images.length) return null;
  const selectedIndex = Math.min(index, gallery.images.length - 1);
  const selected = gallery.images[selectedIndex];
  return (
    <>
      <div className={`gallery gallery-count-${gallery.images.length}`}>
        {gallery.images.map((image, n) => (
          <figure key={image.id}>
            <button
              className="gallery-open"
              aria-label={`View photograph ${n + 1}: ${image.alt || gallery.title}`}
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setIndex(n);
                setIsOpen(true);
                dialog.current?.showModal();
              }}
            >
              <Photo
                image={image}
                sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 40vw"
              />
              <span className="gallery-zoom" aria-hidden="true">
                View photograph ↗
              </span>
            </button>
            {image.caption && <figcaption>{image.caption}</figcaption>}
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={`${gallery.title} — enlarged photograph`}
        onClose={() => {
          setIsOpen(false);
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            move(1);
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        <div className="lightbox-content">
          <button
            autoFocus
            className="lightbox-close"
            onClick={() => dialog.current?.close()}
            aria-label="Close photograph"
          >
            Close ×
          </button>
          {isOpen && (
            <Photo
              image={selected}
              sizes="(max-width: 800px) 94vw, 85vw"
              priority
            />
          )}
          <div className="lightbox-controls">
            <button
              disabled={gallery.images.length < 2}
              onClick={() => move(-1)}
              aria-label="Previous photograph"
            >
              ← Previous
            </button>
            <p aria-live="polite">
              {selectedIndex + 1} / {gallery.images.length}
              {selected.caption ? ` — ${selected.caption}` : ''}
            </p>
            <button
              disabled={gallery.images.length < 2}
              onClick={() => move(1)}
              aria-label="Next photograph"
            >
              Next →
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

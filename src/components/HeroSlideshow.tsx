'use client';
import { useEffect, useState } from 'react';
import { Photo } from './Photo';
import type { ContentImage } from '@/content/types';
export function HeroSlideshow({
  images,
  fallback,
}: {
  images?: ContentImage[];
  fallback: ContentImage;
}) {
  const photos = images?.length ? images.slice(0, 3) : [fallback];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    const visibility = () => setHidden(document.hidden);
    change();
    visibility();
    // Let the first, prioritised image render before requesting later slides.
    const timeout = setTimeout(() => setReady(true), 1500);
    media.addEventListener('change', change);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clearTimeout(timeout);
      media.removeEventListener('change', change);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  useEffect(() => {
    if (paused || focused || hidden || reduced || photos.length < 2) return;
    const timer = setInterval(
      () => setActive((n) => (n + 1) % photos.length),
      6000,
    );
    return () => clearInterval(timer);
  }, [paused, focused, hidden, reduced, photos.length]);
  const index = Math.min(active, photos.length - 1);
  const visibleIndex = index === 0 || loaded[photos[index].src] ? index : 0;
  return (
    <div
      className="hero-slideshow"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured photography"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      {photos.map(
        (photo, n) =>
          (n === 0 || ready || n === index) && (
            <div
              key={photo.src}
              className={`hero-slide ${n === visibleIndex ? 'is-active' : ''}`}
              aria-hidden={n !== visibleIndex}
            >
              <Photo
                image={photo}
                priority={n === 0}
                sizes="(max-width: 700px) 100vw, 60vw"
                onLoad={() =>
                  setLoaded((values) => ({ ...values, [photo.src]: true }))
                }
              />
            </div>
          ),
      )}
      {photos.length > 1 && (
        <div className="hero-slideshow-controls">
          {photos.map((photo, n) => (
            <button
              key={photo.src}
              type="button"
              aria-label={`Show photograph ${n + 1}: ${photo.alt}`}
              aria-pressed={index === n}
              onClick={() => {
                setReady(true);
                setActive(n);
                setPaused(true);
              }}
            >
              {n + 1}
            </button>
          ))}
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
            >
              {paused ? 'Play' : 'Pause'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

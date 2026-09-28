'use client';
import { ArrowIcon } from '@/components/ArrowIcon';

import { useEffect, useRef, useState } from 'react';

type SessionFunction = ((
  command: 'inline',
  options: { selector: string; link: string },
) => void) & { q?: unknown[] };
declare global {
  interface Window {
    Session?: SessionFunction;
  }
}
let scriptReady: Promise<void> | undefined;
let persistentMount: HTMLDivElement | undefined;
// The vendor has no public unmount API. Keep one vendor-owned tree for the document's
// lifetime, moving it between React hosts so its postMessage listeners don't accumulate.
function getMount() {
  if (!persistentMount) {
    persistentMount = document.createElement('div');
    persistentMount.id = 'session-embed-0Ll72MoGY';
  }
  return persistentMount;
}
function loadSession() {
  if (scriptReady) return scriptReady;
  scriptReady = new Promise<void>((resolve, reject) => {
    const queue: SessionFunction = (...args) => {
      queue.q = queue.q || [];
      queue.q.push(args);
    };
    window.Session = window.Session || queue;
    const script = document.createElement('script');
    script.id = 'session-inline-script';
    script.src = 'https://embed.sessioncdn.com/v1/embed.js';
    script.async = true;
    const timeout = window.setTimeout(
      () => reject(new Error('Session timed out')),
      15000,
    );
    script.onload = () => {
      window.clearTimeout(timeout);
      if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', () => resolve(), {
          once: true,
        });
      else resolve();
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error('Session could not load'));
    };
    document.head.appendChild(script);
  });
  return scriptReady;
}
export function SessionInquiryForm({ email }: { email: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    let cancelled = false;
    const container = host.current;
    if (!container) return;
    const mount = getMount();
    let iframe: HTMLIFrameElement | null = null;
    let timer: number | undefined;
    let started = false;
    const loaded = () => {
      if (!cancelled) {
        setState('ready');
        window.clearTimeout(timer);
      }
    };
    const observeFrame = () => {
      const next = mount.querySelector('iframe');
      if (!next || next === iframe) return;
      iframe = next;
      iframe.title = 'Enquire with Rachel at The Whitley Captures';
      if (!iframe.dataset.loadObserved) {
        iframe.dataset.loadObserved = 'true';
        // This listener survives detached routes, so a late load is remembered.
        iframe.addEventListener(
          'load',
          () => {
            next.dataset.loaded = 'true';
          },
          { once: true },
        );
      }
      iframe.addEventListener('load', loaded, { once: true });
      if (iframe.dataset.loaded) loaded();
    };
    const observer = new MutationObserver(observeFrame);
    observer.observe(mount, { childList: true, subtree: true });
    const start = () => {
      if (started || cancelled) return;
      started = true;
      container.appendChild(mount);
      timer = window.setTimeout(() => {
        if (!cancelled) setState('error');
      }, 20000);
      loadSession()
        .then(() => {
          if (cancelled) return;
          if (!mount.querySelector('iframe'))
            window.Session?.('inline', {
              selector: '#session-embed-0Ll72MoGY',
              link: '0Ll72MoGY',
            });
          observeFrame();
        })
        .catch(() => {
          if (!cancelled) setState('error');
        });
    };
    // Keep Session's application off the initial mobile rendering path. Start
    // before the form enters view, including when an enquiry anchor is followed.
    const visibility = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          visibility.disconnect();
          start();
        }
      },
      { rootMargin: '300px' },
    );
    visibility.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
      visibility.disconnect();
      window.clearTimeout(timer);
      iframe?.removeEventListener('load', loaded);
      if (mount.parentElement === container) mount.remove();
    };
  }, []);
  return (
    <div className="session-form" data-state={state}>
      {state === 'loading' && (
        <p className="form-status" role="status">
          Getting your enquiry form ready…
        </p>
      )}
      {state === 'error' && (
        <div className="form-status" role="status">
          <p>
            The enquiry form is taking a little longer to load. You can refresh
            this page or email me below.
          </p>
          <button
            type="button"
            className="text-link"
            onClick={() => window.location.reload()}
          >
            Try again{' '}
            <span aria-hidden="true">
              <ArrowIcon direction="up-right" />
            </span>
          </button>
        </div>
      )}
      <div ref={host} className="session-mount" />
      <noscript>
        <p>
          Please enable JavaScript to use the enquiry form, or email me below.
        </p>
      </noscript>
      <p className="form-alternative">
        Prefer email? <a href={`mailto:${email}`}>{email}</a>
      </p>
    </div>
  );
}

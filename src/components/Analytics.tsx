'use client';
import Script from 'next/script';
import { useSyncExternalStore } from 'react';
const subscribe = (callback: () => void) => {
  window.addEventListener('analytics-consent', callback);
  return () => window.removeEventListener('analytics-consent', callback);
};
const consent = () => localStorage.getItem('analytics-consent') || 'unset';
const server = () => 'unset';
export function Analytics() {
  const choice = useSyncExternalStore(subscribe, consent, server);
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;
  const choose = (value: string) => {
    localStorage.setItem('analytics-consent', value);
    window.dispatchEvent(new Event('analytics-consent'));
  };
  return (
    <>
      {choice === 'accepted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
          <Script id="google-analytics">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(id)});`}</Script>
        </>
      )}
      <aside className="analytics-choice">
        {choice === 'unset' ? (
          <>
            May I use analytics cookies to understand how this website is used?{' '}
            <button onClick={() => choose('accepted')}>Accept</button>
            <button onClick={() => choose('declined')}>No thanks</button>
          </>
        ) : (
          <button
            onClick={() => {
              choose('unset');
              window.location.reload();
            }}
          >
            Cookie preferences
          </button>
        )}
      </aside>
    </>
  );
}

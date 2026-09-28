'use client';
import dynamic from 'next/dynamic';

// Studio is an authenticated editing app. Load it in the browser so its Node
// oriented dependencies are never evaluated while Workers renders the shell.
const StudioClient = dynamic(
  () => import('./StudioClient').then((module) => module.WebsiteStudio),
  {
    ssr: false,
    loading: () => <p role="status">Loading your editing workspace…</p>,
  },
);
export function WebsiteStudio({ previewEnabled }: { previewEnabled: boolean }) {
  return <StudioClient previewEnabled={previewEnabled} />;
}

import { WebsiteStudio } from '@/components/WebsiteStudio';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Edit your website | The Whitley Captures',
  robots: { index: false, follow: false },
};
export { viewport } from 'next-sanity/studio';
export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
    return (
      <main>
        <h1>Studio setup</h1>
        <p>
          Copy .env.example to .env.local and restart the development server to
          connect Sanity.
        </p>
      </main>
    );
  return (
    <WebsiteStudio
      previewEnabled={
        Boolean(process.env.SANITY_API_READ_TOKEN) &&
        process.env.CONTENT_SOURCE !== 'local'
      }
    />
  );
}

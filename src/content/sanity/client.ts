import 'server-only';
import { createClient } from 'next-sanity';
export function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset)
    throw new Error(
      'Sanity configuration missing. Copy .env.example to .env.local, or use CONTENT_SOURCE=local.',
    );
  return createClient({
    projectId,
    dataset,
    apiVersion: process.env.SANITY_API_VERSION || '2026-09-27',
    useCdn: false,
  });
}

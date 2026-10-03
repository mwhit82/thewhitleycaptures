import policy from '@/content/local/privacy.json';
import { getSiteSettings } from '@/content';
import { pageMetadata } from '@/lib/seo';
export async function generateMetadata() {
  const settings = await getSiteSettings();
  return pageMetadata(
    {
      ...settings.seo,
      title: 'Privacy policy',
      description:
        'How The Whitley Captures handles your personal information.',
    },
    '/privacy-policy',
    settings.seo,
  );
}
export default function PrivacyPolicy() {
  return (
    <main id="main" className="section container privacy-page">
      <h1>Privacy policy</h1>
      {policy.blocks.map((b, i) =>
        b.kind === 'heading' ? (
          <h2 key={i}>{b.text}</h2>
        ) : (
          <p key={i}>{b.text}</p>
        ),
      )}
      <h2>Services used by this website</h2>
      <p>
        This website uses Cloudflare for hosting and delivery, Sanity for
        website content and photographs, and Session for the enquiry form.
        Information entered into the enquiry form is processed through Session
        so Rachel can respond.
      </p>
      <p>
        For privacy enquiries, contact{' '}
        <a href="mailto:thewhitleycaptures@gmail.com">
          thewhitleycaptures@gmail.com
        </a>
        .
      </p>
    </main>
  );
}

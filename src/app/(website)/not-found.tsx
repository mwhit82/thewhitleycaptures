import { ArrowIcon } from '@/components/ArrowIcon';
import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="not-found container">
      <p className="eyebrow">A LITTLE DETOUR</p>
      <h1>This page isn’t here.</h1>
      <p>Let’s find your way back to something lovely.</p>
      <Link className="button" href="/">
        Back to the homepage{' '}
        <span aria-hidden="true">
          <ArrowIcon direction="up-right" />
        </span>
      </Link>
    </main>
  );
}

import { VisualEditing } from 'next-sanity/visual-editing';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
async function exitPreview() {
  'use server';
  (await draftMode()).disable();
  redirect('/');
}
export async function DraftBanner() {
  if (!(await draftMode()).isEnabled) return null;
  return (
    <>
      <VisualEditing />
      <aside className="draft-banner">
        Draft preview — refresh after saving changes in Studio.
        <form action={exitPreview}>
          <button type="submit">Exit preview</button>
        </form>
      </aside>
    </>
  );
}

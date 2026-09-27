'use client';
export function PreviewSetup() {
  return (
    <main style={{ padding: '2rem', maxWidth: '42rem', lineHeight: 1.6 }}>
      <h1>Draft preview needs one more setup step</h1>
      <p>
        You can edit and save your content in Edit website. Draft preview is not
        connected yet.
      </p>
      <p>
        Mark needs to configure the server’s Sanity Viewer token and enable
        Sanity content mode, then restart the website. The setup instructions
        are in docs/CMS-GUIDE.md.
      </p>
      <p>
        <a href="/" target="_blank" rel="noopener noreferrer">
          Open the website in a new tab
        </a>{' '}
        to review published content. Unpublished edits will not appear there.
      </p>
    </main>
  );
}

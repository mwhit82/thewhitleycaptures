export function ArrowIcon({
  direction = 'up-right',
}: {
  direction?: 'up-right' | 'down' | 'left' | 'right';
}) {
  const paths = {
    'up-right': 'M5 19 19 5M5 5h14v14',
    down: 'M12 4v16m-6-6 6 6 6-6',
    left: 'M20 12H4m6-6-6 6 6 6',
    right: 'M4 12h16m-6-6 6 6-6 6',
  };
  return (
    <svg
      className="arrow-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[direction]} />
    </svg>
  );
}

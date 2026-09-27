// Preserve asset crop, dimensions and focal point without exposing transformation controls in Studio.
export function resolveImages(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(resolveImages);
  if (!value || typeof value !== 'object') return value;
  const v = value as Record<string, unknown>;
  if (
    typeof v.src === 'string' &&
    typeof v.width === 'number' &&
    typeof v.height === 'number'
  ) {
    const crop = v.crop as
      { left: number; right: number; top: number; bottom: number } | undefined;
    const url = new URL(v.src);
    if (crop) {
      const x = Math.round(crop.left * v.width),
        y = Math.round(crop.top * v.height);
      const width = Math.max(
        1,
        Math.round(v.width * (1 - crop.left - crop.right)),
      );
      const height = Math.max(
        1,
        Math.round(v.height * (1 - crop.top - crop.bottom)),
      );
      url.searchParams.set('rect', `${x},${y},${width},${height}`);
      const pos = v.position as { x: number; y: number };
      v.position = {
        x: Math.max(
          0,
          Math.min(100, (((pos.x / 100) * v.width - x) / width) * 100),
        ),
        y: Math.max(
          0,
          Math.min(100, (((pos.y / 100) * v.height - y) / height) * 100),
        ),
      };
      v.width = width;
      v.height = height;
    }
    url.searchParams.set('w', String(Math.min(2000, v.width as number)));
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'max');
    return { ...v, src: url.href };
  }
  return Object.fromEntries(
    Object.entries(v).map(([key, item]) => [key, resolveImages(item)]),
  );
}

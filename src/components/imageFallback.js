export function imageFallback(event) {
  const image = event.currentTarget;
  const fallback = new URL('/photos/memory-1.svg', window.location.href).href;
  if (image.src !== fallback) image.src = fallback;
}

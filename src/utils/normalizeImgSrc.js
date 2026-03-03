export function normalizeImgSrc(src) {
  if (!src || typeof src !== 'string') return '';

  if (/^(https?:)?\/\//i.test(src) || src.startsWith('data:')) {
    return src;
  }

  const prefix = (
    import.meta.env?.VITE_API_URL_IMG || import.meta.env?.VITE_API_URL || ''
  ).replace(/\/$/, '');

  const cleanPath = src.replace(/^\/+/, '');
  return prefix ? `${prefix}/${cleanPath}` : `/${cleanPath}`;
}

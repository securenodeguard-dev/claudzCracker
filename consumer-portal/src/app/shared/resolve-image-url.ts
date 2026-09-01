import { environment } from '../../environments/environment';

// Local-disk fallback uploads return a relative path like "/uploads/x.jpg"
// while production hosting may serve the app and API from the same origin or a
// different one. Resolve relative asset paths against the API origin if it is
// configured; otherwise fall back to the current browser origin.
const apiOrigin = environment?.apiBaseUrl ? environment.apiBaseUrl.replace(/\/api\/v1\/?$/, '') : window.location.origin;

export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  const normalized = url.startsWith('/') ? url : `/${url}`;
  return `${apiOrigin}${normalized}`;
}
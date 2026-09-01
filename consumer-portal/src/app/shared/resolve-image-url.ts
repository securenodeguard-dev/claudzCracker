import { environment } from '../../environments/environment';

// Local-disk fallback uploads return a relative path like "/uploads/x.jpg"
// (Cloudinary uploads return a full https:// URL already). A relative path
// needs to resolve against the API host, not wherever this Angular app is
// served from, so it can't be used as an <img src> directly.
const apiOrigin = environment.apiBaseUrl.replace(/\/api\/v1\/?$/, '');

export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  return url.startsWith('http') ? url : `${apiOrigin}${url}`;
}
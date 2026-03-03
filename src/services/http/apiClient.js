import { fetchWithTimeout } from './fetchWithTimeout';

const TIMEZONE_EXCEPTIONS = new Set(['/login', '/login/valida_token']);

function withTimezone(url, init = {}) {
  const headers = new Headers(init.headers || {});
  if (!TIMEZONE_EXCEPTIONS.has(url)) {
    headers.set('x-timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
  }
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  return { ...init, headers };
}

export async function requestJson(url, init = {}) {
  const response = await fetchWithTimeout(url, withTimezone(url, init), 10000);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

import Cookies from 'js-cookie';

export const TOKEN_COOKIE_KEY = 'token';

export function getToken() {
  return Cookies.get(TOKEN_COOKIE_KEY) || sessionStorage.getItem(TOKEN_COOKIE_KEY);
}

export function saveToken(token, lembrar = false) {
  const cookieOptions = { sameSite: 'Strict' };
  if (window.location.protocol === 'https:') {
    cookieOptions.secure = true;
  }
  if (lembrar) {
    cookieOptions.expires = 7;
  }

  Cookies.set(TOKEN_COOKIE_KEY, token, cookieOptions);

  if (lembrar) {
    sessionStorage.removeItem(TOKEN_COOKIE_KEY);
  } else {
    sessionStorage.setItem(TOKEN_COOKIE_KEY, token);
  }
}

export function clearToken() {
  Cookies.remove(TOKEN_COOKIE_KEY);
  sessionStorage.removeItem(TOKEN_COOKIE_KEY);
}

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { loginRequest, validateToken } from './auth.api';
import { clearToken, getToken, saveToken } from './token.storage';

export const AuthContext = createContext(null);

const USER_CACHE_KEY = 'usuario_cache';
const USER_CACHE_TTL = 60 * 60 * 1000;

function readUserCache() {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp < USER_CACHE_TTL) {
      return parsed.value;
    }
    localStorage.removeItem(USER_CACHE_KEY);
  } catch {
    localStorage.removeItem(USER_CACHE_KEY);
  }
  return null;
}

function writeUserCache(value) {
  localStorage.setItem(
    USER_CACHE_KEY,
    JSON.stringify({ value, timestamp: Date.now() })
  );
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [logado, setLogado] = useState(null);

  const logout = useCallback(() => {
    setUsuario(null);
    setLogado(false);
    clearToken();
    localStorage.removeItem(USER_CACHE_KEY);
  }, []);

  const login = useCallback(
    async ({ email, senha, lembrar }) => {
      const { token } = await loginRequest({ email, senha });
      saveToken(token, lembrar);

      try {
        const response = await validateToken(token);
        setUsuario(response.usuario ?? null);
        writeUserCache(response.usuario ?? null);
        setLogado(true);
      } catch (error) {
        logout();
        throw error;
      }
    },
    [logout]
  );

  useEffect(() => {
    async function bootstrap() {
      const token = getToken();
      const cachedUser = readUserCache();

      if (!token) {
        setLogado(false);
        return;
      }

      if (cachedUser) {
        setUsuario(cachedUser);
        setLogado(true);
        return;
      }

      try {
        const response = await validateToken(token);
        setUsuario(response.usuario ?? null);
        writeUserCache(response.usuario ?? null);
        setLogado(true);
      } catch {
        logout();
      }
    }

    bootstrap();
  }, [logout]);

  const value = useMemo(
    () => ({ usuario, logado, login, logout }),
    [usuario, logado, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

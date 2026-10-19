import Cookies from 'js-cookie';

const TOKEN_KEY = 'keepalive_session_token';

export const setSessionToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 3, // 3 jours = 72 heures
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const getSessionToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const clearSession = (): void => {
  Cookies.remove(TOKEN_KEY);
};
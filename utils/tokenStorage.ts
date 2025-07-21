import { secureGet, secureSave, secureRemove } from './secureStore';
import { TokenObj } from '@/types';

const KEYS = {
  access: 'accessToken',
  refresh: 'refreshToken',
  expires: 'expiresIn',
};

export const saveToken = async (value: TokenObj) => {
  await secureSave(KEYS.access, value.access_token);
  await secureSave(KEYS.refresh, value.refresh_token);
  await secureSave(KEYS.expires, value.expires_in);
};

export const getToken = async (): Promise<TokenObj | null> => {
  const access = await secureGet<string>(KEYS.access);
  const refresh = await secureGet<string>(KEYS.refresh);
  const expires = await secureGet<string>(KEYS.expires);

  if (!access || !refresh || !expires) return null;

  return {
    access_token: access,
    refresh_token: refresh,
    expires_in: expires,
  };
};

export const removeToken = async () => {
  await Promise.all([
    secureRemove(KEYS.access),
    secureRemove(KEYS.refresh),
    secureRemove(KEYS.expires),
  ]);
};

export const isTokenExpired = async (): Promise<boolean> => {
  const token = await getToken();
  const exp = Number(token?.expires_in);
  return !token || !exp || isNaN(exp) || Date.now() >= exp;
};

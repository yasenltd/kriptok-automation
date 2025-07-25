import { secureGet, secureSave, secureRemove } from './secureStore';
import { TokenObj } from '@/types';

const KEYS = {
  access: 'accessToken',
  refresh: 'refreshToken',
  expires: 'expiresIn',
  refresh_expires: 'refreshExpiresIn',
};

export const saveToken = async (value: TokenObj) => {
  const now = Date.now();
  const accessExpiry = (now + Number(value.expires_in) * 1000).toString();
  const refreshExpiry = (now + Number(value.refresh_expires_in) * 1000).toString();
  await secureSave(KEYS.access, value.access_token);
  await secureSave(KEYS.refresh, value.refresh_token);
  await secureSave(KEYS.expires, accessExpiry);
  await secureSave(KEYS.refresh_expires, refreshExpiry);
};

export const getToken = async (): Promise<TokenObj | null> => {
  const access = await secureGet<string>(KEYS.access);
  const refresh = await secureGet<string>(KEYS.refresh);
  const expires = await secureGet<string>(KEYS.expires);
  const refresh_expires = await secureGet<string>(KEYS.refresh_expires);

  if (!access || !refresh || !expires || !refresh_expires) return null;

  return {
    access_token: access,
    refresh_token: refresh,
    expires_in: expires,
    refresh_expires_in: refresh_expires,
  };
};

export const removeToken = async () => {
  await Promise.all([
    secureRemove(KEYS.access),
    secureRemove(KEYS.refresh),
    secureRemove(KEYS.expires),
    secureRemove(KEYS.refresh_expires),
  ]);
};

export const isAccessTokenExpired = async (): Promise<boolean> => {
  const token = await getToken();
  const exp = Number(token?.expires_in);
  return !token || !exp || isNaN(exp) || Date.now() >= exp;
};

export const isRefreshTokenExpired = async (): Promise<boolean> => {
  const token = await getToken();
  const exp = Number(token?.refresh_expires_in);
  return !token || !exp || isNaN(exp) || Date.now() >= exp;
};

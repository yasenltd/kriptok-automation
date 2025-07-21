import { get, post } from '@/services';

export const getAuthMessage = (address: string) =>
  get<{ message: string }>(`/auth/message`, { params: { address } });

export const verifySignature = (address: string, signature: string) =>
  post<{ access_token: string; refresh_token: string; expires_in: number }>(`/auth/verify`, {
    body: { address, signature },
  });

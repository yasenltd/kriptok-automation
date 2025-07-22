import { get, post } from '@/services';
import { IUser, RegisterUserDto } from '@/types';
import { Wallet } from 'ethers';

export const getLoginMessage = (address: string) =>
  get<{ message: string }>(`/users/login/${address}`);

export const verifySignature = (message: string, signature: string) =>
  post<{ access_token: string; expires_in: number }>(`/auth/verify`, {
    body: { message, signature },
  });

export const signSiweMessage = async (message: string, privateKey: string): Promise<string> => {
  const wallet = new Wallet(privateKey);
  const signature = await wallet.signMessage(message);
  return signature;
};

export const signup = (data: RegisterUserDto) =>
  post<IUser>(`/users/signup`, {
    body: { ...data },
  });

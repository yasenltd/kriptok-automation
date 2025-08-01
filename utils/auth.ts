import { get, post } from '@/services';
import { RegisterType } from '@/types';
import { Wallet } from 'ethers';

export const getSignupMessage = (address: string) =>
  get<{ message: string }>(`/auth/signup-message/${address}`);

export const getLoginMessage = (address: string) =>
  get<{ message: string }>(`/auth/message/${address}`);

export const login = (message: string, signature: string) =>
  post<{
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
  }>(`/auth/login`, {
    body: { message, signature },
  });

export const signup = (data: RegisterType) =>
  post<{
    success: boolean;
  }>(`/auth/signup`, {
    body: data,
  });

export const signSiweMessage = async (message: string, privateKey: string): Promise<string> => {
  const wallet = new Wallet(privateKey);
  const signature = await wallet.signMessage(message);
  return signature;
};

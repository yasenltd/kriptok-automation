import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, saveToken, isTokenExpired } from '@/utils';
import { AuthRefreshResponse } from '@/types';
import Constants from 'expo-constants';
import { externalForceAuth } from '@/context/AuthContext';

export enum REQUEST_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export interface RequestOptions {
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl as string;

if (!BASE_URL) {
  throw new Error('API base URL is not defined. Check your environment variables.');
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 13000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicApi: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const savedTokenData: Record<string, any> | null = await getToken();
    if (!savedTokenData) return null;

    const response = await refreshInstance.post<AuthRefreshResponse>(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${savedTokenData.refresh_token}`,
        },
      },
    );

    if (!response?.data?.access_token) {
      console.error('No access_token in response');
      if (externalForceAuth) {
        externalForceAuth();
      }
      return null;
    }

    const { access_token, expires_in, refresh_token, refresh_expires_in } = response.data;
    const expirationTimestamp = Date.now() + (expires_in - 30) * 1000;
    const refreshExpirationTimestamp = Date.now() + (refresh_expires_in - 30) * 1000;
    const tokenData = {
      access_token,
      refresh_token,
      expires_in: expirationTimestamp.toString(),
      refresh_expires_in: refreshExpirationTimestamp.toString(),
    };

    await saveToken(tokenData);

    return access_token;
  } catch (error) {
    if (externalForceAuth) {
      externalForceAuth();
    }
    return null;
  }
};

api.interceptors.request.use(
  async config => {
    const tokenData = await getToken();
    const isAccessExpired = await isTokenExpired('access');

    if (isAccessExpired) {
      const newToken = await refreshAccessToken();
      if (newToken) config.headers.Authorization = `Bearer ${newToken}`;
    } else if (tokenData && tokenData.access_token) {
      config.headers.Authorization = `Bearer ${tokenData.access_token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

const request = async <T>(
  method: REQUEST_METHOD,
  url: string,
  options: RequestOptions = {},
): Promise<T> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      params: options.params,
      data: options.body,
      headers: { ...options.headers },
      signal: options.signal,
    };

    const response: AxiosResponse<T> = await api(config);
    return response.data;
  } catch (error) {
    console.error(`API Request Failed [${method}] ${url}`, error);
    throw error;
  }
};

export const get = <T>(url: string, options?: RequestOptions): Promise<T> =>
  request<T>(REQUEST_METHOD.GET, url, options);

export const post = <T>(url: string, options?: RequestOptions): Promise<T> =>
  request<T>(REQUEST_METHOD.POST, url, options);

export const put = <T>(url: string, options?: RequestOptions): Promise<T> =>
  request<T>(REQUEST_METHOD.PUT, url, options);

export const del = <T>(url: string, options?: RequestOptions): Promise<T> =>
  request<T>(REQUEST_METHOD.DELETE, url, options);

export const patch = <T>(url: string, options?: RequestOptions): Promise<T> =>
  request<T>(REQUEST_METHOD.PATCH, url, options);

/* -------------------------------------- */

export const requestRaw = async <T>(
  method: REQUEST_METHOD,
  url: string,
  options: RequestOptions = {},
): Promise<AxiosResponse<T>> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      params: options.params,
      data: options.body,
      headers: { ...options.headers },
      signal: options.signal,
    };

    const response = await api(config);
    return response;
  } catch (error) {
    console.error(`Raw Request Failed: ${url}`, error);
    throw error;
  }
};
export const postRaw = <T>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> =>
  requestRaw<T>(REQUEST_METHOD.POST, url, options);

export const getRaw = <T>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> =>
  requestRaw<T>(REQUEST_METHOD.GET, url, options);

export const putRaw = <T>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> =>
  requestRaw<T>(REQUEST_METHOD.PUT, url, options);

export const patchRaw = <T>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> =>
  requestRaw<T>(REQUEST_METHOD.PATCH, url, options);

export const deleteRaw = <T>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> =>
  requestRaw<T>(REQUEST_METHOD.DELETE, url, options);

/* ---------------------------------------------- */

export const publicRequestRaw = async <T>(
  method: REQUEST_METHOD,
  url: string,
  options: RequestOptions = {},
): Promise<AxiosResponse<T>> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      params: options.params,
      data: options.body,
      headers: { ...options.headers },
      signal: options.signal,
    };

    const response = await publicApi(config);
    return response;
  } catch (error) {
    console.error(`Public Raw Request Failed: ${url}`, error);
    throw error;
  }
};

export const getPublicRaw = <T>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> =>
  publicRequestRaw<T>(REQUEST_METHOD.GET, url, options);

export const postPublicRaw = <T>(
  url: string,
  options?: RequestOptions,
): Promise<AxiosResponse<T>> => publicRequestRaw<T>(REQUEST_METHOD.POST, url, options);

export const putPublicRaw = <T>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> =>
  publicRequestRaw<T>(REQUEST_METHOD.PUT, url, options);

export const patchPublicRaw = <T>(
  url: string,
  options?: RequestOptions,
): Promise<AxiosResponse<T>> => publicRequestRaw<T>(REQUEST_METHOD.PATCH, url, options);

export const deletePublicRaw = <T>(
  url: string,
  options?: RequestOptions,
): Promise<AxiosResponse<T>> => publicRequestRaw<T>(REQUEST_METHOD.DELETE, url, options);

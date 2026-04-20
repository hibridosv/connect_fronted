import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let unauthorizedCount = 0;
const MAX_UNAUTHORIZED = 3;

const httpService = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

httpService.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.url) {
      config.baseURL = `${session.url}/api/v2`;
    }

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    if (
      config.data instanceof FormData &&
      config.headers['Content-Type'] === 'application/json'
    ) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpService.interceptors.response.use(
  (response) => {
    unauthorizedCount = 0;
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      unauthorizedCount++;

      if (unauthorizedCount >= MAX_UNAUTHORIZED) {
        unauthorizedCount = 0;
        await signOut({ callbackUrl: '/' });
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const get = (url: string, config = {}) => httpService.get(url, config);

export const post = (url: string, data: any, config = {}) => httpService.post(url, data, config);

export const put = (url: string, data: any, config = {}) => httpService.put(url, data, config);

export const patch = (url: string, data: any, config = {}) => httpService.patch(url, data, config);

export const del = (url: string, config = {}) => httpService.delete(url, config);

export default httpService;

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import sessionStore, { sessionChecked } from '@/stores/sessionStore';
import { safeSignOut } from '@/lib/safeSignOut';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let unauthorizedCount = 0;
let lastUnauthorizedToken: string | null = null;
const MAX_UNAUTHORIZED = 3;

const httpService = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

httpService.interceptors.request.use(
  async (config) => {
    if (!sessionStore.getState().accessToken) {
      await sessionChecked;
    }
    let session = sessionStore.getState();

    // Without a tenant url the request would hit the Next.js origin and fail with a 404.
    if (!session.url || !session.accessToken) {
      const fresh = await getSession();
      if (fresh?.accessToken && fresh?.url) {
        session.setSession(fresh.accessToken, fresh.url);
        session = sessionStore.getState();
      } else {
        safeSignOut();
        return Promise.reject(new axios.Cancel('Sesión no disponible'));
      }
    }

    config.baseURL = `${session.url}/api/v2`;
    config.headers.Authorization = `Bearer ${session.accessToken}`;

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
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      const failedToken = originalRequest.headers?.Authorization as string | undefined;

      if (failedToken !== lastUnauthorizedToken) {
        lastUnauthorizedToken = failedToken ?? null;
        unauthorizedCount = 1;
      } else {
        unauthorizedCount++;
      }

      if (unauthorizedCount >= MAX_UNAUTHORIZED) {
        unauthorizedCount = 0;
        lastUnauthorizedToken = null;
        safeSignOut();
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

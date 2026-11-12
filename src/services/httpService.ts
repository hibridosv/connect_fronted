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

// Una sola renovacion a la vez: Passport revoca el refresh token al usarlo, y si varias peticiones
// renovaran con el mismo, todas menos la primera fallarian y sacarian al usuario
let renewing: Promise<string | null> | null = null;

function renewSession(): Promise<string | null> {
  if (!renewing) {
    // getSession() corre el callback jwt de NextAuth, que renueva el token si ya vencio
    renewing = getSession()
      .then((fresh) => {
        if (fresh?.accessToken && fresh?.url && !fresh.error) {
          sessionStore.getState().setSession(fresh.accessToken, fresh.url);
          return fresh.accessToken as string;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        renewing = null;
      });
  }
  return renewing;
}

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

      // El token vencio: se renueva y se repite la peticion una vez. El 401 lo da auth:api antes del controller, asi que repetir un POST es seguro
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const currentToken = sessionStore.getState().accessToken;
        const newToken = currentToken && `Bearer ${currentToken}` !== failedToken
          ? currentToken
          : await renewSession();

        if (newToken && `Bearer ${newToken}` !== failedToken) {
          return httpService(originalRequest);
        }
      }

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

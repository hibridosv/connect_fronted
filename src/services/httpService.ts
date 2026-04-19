import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

// Define una interfaz que extiende la configuración de Axios para incluir nuestra propiedad personalizada
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const httpService = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

httpService.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    // console.log('Session:', session);

    // Si la sesión tiene una URL, úsala como baseURL para esta petición
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
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      console.error('401 Unauthorized: Session might be expired or invalid.');
      // NextAuth.js debería manejar la redirección al login si la sesión es inválida.
      // No se necesita lógica de refresco de token aquí.
    }

    if (error.response) {
      console.error(`Error en la petición: ${error.response.status} - ${(error.response.data as any)?.message || error.message}`);
    } else if (originalRequest) {
      console.error('Error en la petición:', error.message);
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


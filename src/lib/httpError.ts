import axios from 'axios';

/**
 * Mensaje para mostrar de un error de la API. Usa el message que manda connect; si no hay
 * (sin conexion, 500 de PHP con HTML, timeout) arma uno en español segun el caso en lugar
 * del texto de axios ("Network Error", "Request failed with status code 500").
 * Devuelve null para las peticiones canceladas (p. ej. sin sesion): no se muestran.
 */
export function getErrorMessage(error: any, fallback = 'No se pudo completar la solicitud'): string | null {
  if (axios.isCancel(error)) return null;

  const message = error?.response?.data?.message;
  if (typeof message === 'string' && message.trim() !== '') return message;

  const status: number | undefined = error?.response?.status;
  if (!status) {
    if (error?.response || error?.request || error?.code === 'ERR_NETWORK' || error?.code === 'ECONNABORTED') {
      return 'No se pudo conectar con el servidor, revise su conexión e intente de nuevo';
    }
    return typeof error?.message === 'string' && error.message ? error.message : fallback;
  }
  if (status === 401) return 'Sesión no válida o expirada, inicie sesión nuevamente';
  if (status === 403) return 'No tiene permisos para realizar esta acción';
  if (status === 404) return 'Recurso no encontrado';
  if (status === 429) return 'Demasiadas solicitudes, espere un momento e intente de nuevo';
  if (status >= 500) return 'Error del servidor, intente de nuevo';
  return fallback;
}

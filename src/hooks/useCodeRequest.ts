import { CodeRequest } from '@/interfaces/codeRequest';
import { permissionExists } from '@/lib/utils';
import { createService, getServices } from '@/services/services';
import useConfigStore from '@/stores/configStore';
import { useMemo, useState } from 'react';

const errorMessage = (error: any, fallback: string): string =>
  error?.response?.data?.message || fallback;

/**
 * Codigos de un solo uso validados en el backend para acciones code-request-*.
 * Quien tiene el permiso no necesita codigo; el resto lo solicita al administrador.
 */
export function useCodeRequest(permission: string) {
  const { permission: permissionsActive } = useConfigStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<CodeRequest | null>(null);
  const [loading, setLoading] = useState(false);

  const isRequired = useMemo(() => {
    return !!permissionsActive && !permissionExists(permissionsActive, permission);
  }, [permissionsActive, permission]);

  // Consulta si el usuario ya tiene un codigo solicitado para esta accion
  const loadActiveRequest = async (): Promise<CodeRequest | null> => {
    setLoading(true);
    try {
      const response = await getServices(`code-requests/mine?permission=${permission}`);
      setActiveRequest(response.data.data);
      return response.data.data;
    } catch {
      setActiveRequest(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const requestCode = async (): Promise<{ ok: boolean; message: string }> => {
    setLoading(true);
    try {
      const response = await createService('code-requests', { permission });
      setActiveRequest(response.data.data);
      return { ok: true, message: response.data.message };
    } catch (error) {
      return { ok: false, message: errorMessage(error, 'No se pudo solicitar el código') };
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code: string): Promise<{ ok: boolean; message: string }> => {
    setLoading(true);
    try {
      await createService('code-requests/verify', { permission, code });
      setActiveRequest(null);
      return { ok: true, message: 'Código válido' };
    } catch (error: any) {
      // Si ya no hay solicitud activa (vencida, anulada o usada) se vuelve a pedir
      if (error?.response?.data?.message !== 'Código incorrecto') setActiveRequest(null);
      return { ok: false, message: errorMessage(error, 'No se pudo validar el código') };
    } finally {
      setLoading(false);
    }
  };

  return {
    isRequired,
    isModalOpen,
    setIsModalOpen,
    activeRequest,
    setActiveRequest,
    loading,
    loadActiveRequest,
    requestCode,
    verifyCode,
  };
}

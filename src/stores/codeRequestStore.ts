import { CodeRequest } from '@/interfaces/codeRequest';
import { createService, deleteService, getServices } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from './toastMessageStore';

interface CodeRequestStoreState {
  requests: CodeRequest[];
  loading: boolean;
  loadRequests: () => Promise<void>;
  cancelRequest: (id: string) => Promise<void>;
  extendRequest: (id: string) => Promise<void>;
}

/**
 * Codigos activos visibles para el administrador (code-view).
 */
const useCodeRequestStore = create<CodeRequestStoreState>((set, get) => ({
  requests: [],
  loading: false,

  loadRequests: async () => {
    set({ loading: true });
    try {
      const response = await getServices('code-requests');
      set({ requests: Array.isArray(response.data.data) ? response.data.data : [] });
    } catch {
      set({ requests: [] });
    } finally {
      set({ loading: false });
    }
  },

  cancelRequest: async (id: string) => {
    try {
      const response = await deleteService(`code-requests/${id}`);
      useToastMessageStore.getState().setMessage(response);
      set({ requests: get().requests.filter((request) => request.id !== id) });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    }
  },

  // Suma 15 minutos al vencimiento; el codigo pasa a ser reutilizable
  extendRequest: async (id: string) => {
    try {
      const response = await createService(`code-requests/${id}/extend`, {});
      useToastMessageStore.getState().setMessage(response);
      set({ requests: get().requests.map((request) => (request.id === id ? response.data.data : request)) });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    }
  },
}));

export default useCodeRequestStore;

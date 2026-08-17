import { createService, deleteService, getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface MaintenanceTypesStoreState {
  types: any | null;
  type: any | null;
  error: boolean;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  loadTypes: (url: string) => Promise<void>;
  loadType: (url: string) => Promise<void>;
  createType: (data: any) => Promise<boolean>;
  updateType: (id: string, data: any) => Promise<boolean>;
  deleteType: (id: string) => Promise<boolean>;
}

const useMaintenanceTypesStore = create<MaintenanceTypesStoreState>((set) => ({
  types: null,
  type: null,
  error: false,
  loading: false,
  saving: false,
  deleting: false,

  loadTypes: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ types: response.data.data, error: false });
    } catch (error) {
      set({ error: true, types: [] });
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loading: false });
    }
  },

  loadType: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ type: response.data.data, error: false });
    } catch (error) {
      set({ error: true });
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loading: false });
    }
  },

  createType: async (data: any) => {
    set({ saving: true });
    try {
      const response = await createService('maintenance-types', data);
      useToastMessageStore.getState().setMessage(response);
      set((state) => ({
        types: state.types ? [response.data.data, ...state.types] : [response.data.data],
        error: false,
      }));
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  updateType: async (id: string, data: any) => {
    set({ saving: true });
    try {
      const response = await updateService(`maintenance-types/${id}`, data);
      useToastMessageStore.getState().setMessage(response);
      set((state) => ({
        types: state.types
          ? state.types.map((item: any) => (item.id === id ? response.data.data : item))
          : state.types,
        type: response.data.data,
        error: false,
      }));
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  deleteType: async (id: string) => {
    set({ deleting: true });
    try {
      const response = await deleteService(`maintenance-types/${id}`);
      useToastMessageStore.getState().setMessage(response);
      set((state) => ({
        types: state.types ? state.types.filter((item: any) => item.id !== id) : state.types,
        error: false,
      }));
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return false;
    } finally {
      set({ deleting: false });
    }
  },
}));

export default useMaintenanceTypesStore;

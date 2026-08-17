import { createService, deleteService, getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface MaintenanceStoreState {
  maintenances: any | null;
  maintenance: any | null;
  error: boolean;
  loading: boolean;
  saving: boolean;
  updatingStatus: boolean;
  deleting: boolean;
  loadMaintenances: (url: string) => Promise<void>;
  loadMaintenance: (url: string) => Promise<void>;
  createMaintenance: (data: any) => Promise<any | null>;
  updateMaintenance: (id: string, data: any) => Promise<boolean>;
  updateMaintenanceStatus: (id: string, data: any) => Promise<boolean>;
  deleteMaintenance: (id: string) => Promise<boolean>;
  clearMaintenance: () => void;
}

const useMaintenanceStore = create<MaintenanceStoreState>((set) => ({
  maintenances: null,
  maintenance: null,
  error: false,
  loading: false,
  saving: false,
  updatingStatus: false,
  deleting: false,

  loadMaintenances: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ maintenances: response.data.data, error: false });
    } catch (error) {
      set({ error: true, maintenances: [] });
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loading: false });
    }
  },

  loadMaintenance: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ maintenance: response.data.data, error: false });
    } catch (error) {
      set({ error: true });
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loading: false });
    }
  },

  createMaintenance: async (data: any) => {
    set({ saving: true });
    try {
      const response = await createService('maintenances', data);
      useToastMessageStore.getState().setMessage(response);
      set({ error: false });
      return response.data.data;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return null;
    } finally {
      set({ saving: false });
    }
  },

  updateMaintenance: async (id: string, data: any) => {
    set({ saving: true });
    try {
      const response = await updateService(`maintenances/${id}`, data);
      useToastMessageStore.getState().setMessage(response);
      set({ maintenance: response.data.data, error: false });
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  updateMaintenanceStatus: async (id: string, data: any) => {
    set({ updatingStatus: true });
    try {
      const response = await updateService(`maintenances/${id}/status`, data);
      useToastMessageStore.getState().setMessage(response);
      set((state) => ({
        maintenance: state.maintenance?.id === id ? response.data.data : state.maintenance,
        maintenances: state.maintenances
          ? {
              ...state.maintenances,
              data: state.maintenances.data?.map((item: any) => (item.id === id ? response.data.data : item)),
            }
          : state.maintenances,
        error: false,
      }));
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return false;
    } finally {
      set({ updatingStatus: false });
    }
  },

  deleteMaintenance: async (id: string) => {
    set({ deleting: true });
    try {
      const response = await deleteService(`maintenances/${id}`);
      useToastMessageStore.getState().setMessage(response);
      set((state) => ({
        maintenances: state.maintenances
          ? { ...state.maintenances, data: state.maintenances.data?.filter((item: any) => item.id !== id) }
          : state.maintenances,
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

  clearMaintenance: () => set({ maintenance: null }),
}));

export default useMaintenanceStore;

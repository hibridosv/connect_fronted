import { CreditPlan, CreditSettings } from '@/interfaces/credits';
import { createService, getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface CreditSettingsStoreI {
  settings: CreditSettings | null;
  plan: CreditPlan | null;
  planError: string | null;
  loading: boolean;
  saving: boolean;
  simulating: boolean;
  error: boolean;

  loadSettings: (url: string) => Promise<void>;
  updateSettings: (url: string, data: any) => Promise<boolean>;
  simulatePlan: (url: string, data: any) => Promise<void>;
  clearPlan: () => void;
}

const creditSettingsStore = create<CreditSettingsStoreI>((set) => ({
  settings: null,
  plan: null,
  planError: null,
  loading: false,
  saving: false,
  simulating: false,
  error: false,

  loadSettings: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ settings: response.data.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ settings: null, error: true });
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (url: string, data: any) => {
    set({ saving: true });
    try {
      const response = await updateService(url, data);
      useToastMessageStore.getState().setMessage(response);
      set({ settings: response.data.data, error: false });
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  simulatePlan: async (url: string, data: any) => {
    set({ simulating: true });
    try {
      const response = await createService(url, data);
      set({ plan: response.data.data, planError: null });
    } catch (error: any) {
      set({ plan: null, planError: error?.response?.data?.message ?? 'No se pudo calcular el plan' });
    } finally {
      set({ simulating: false });
    }
  },

  clearPlan: () => set({ plan: null, planError: null }),
}));

export default creditSettingsStore;

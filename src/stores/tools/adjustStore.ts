import { createService, getServices } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';


interface adjustStoreI {
  adjustments: any | null;
  adjustment: any | null;
  adjustmentActive: any | null;
  error: boolean;
  loading: boolean;
  searching: boolean;
  sending: boolean;
  loadingAdjustment: boolean;
  deleting?: boolean;
  loadAdjustments: (url: string) => Promise<void>;
  loadAdjustment: (url: string) => Promise<void>;
  manageAdjustment: (url: string, data: any) => Promise<void>;
  loadDetails: (url: string) => Promise<void>;
  sendAdjustment: (url: string, data: any) => Promise<boolean>;
}

const adjustStore = create<adjustStoreI>((set) => ({
  adjustments: null,
  adjustment: null,
  adjustmentActive: null,
  error: false,
  loading: false,
  sending: false,
  searching: false,
  loadingAdjustment: false,
  deleting: false,

  loadAdjustments: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ adjustments: response.data.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  /* muestra los produstos ajustados */
    loadAdjustment: async (url: string) => {
    set({ loadingAdjustment: true });
    try {
      const response = await getServices(url);
      if (response.data.data.length === 0) {
        set({ adjustment: null, error: false });
      } else {
        set({ adjustment: response.data.data, error: false });
      }
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loadingAdjustment: false });
    }
  },

  manageAdjustment: async (url, data) => {
        set({ loading: true });
        try {
            const response = await createService(url, data);
            set({ adjustmentActive: response.data.data, error: false });
            useToastMessageStore.getState().setMessage(response);
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },

    loadDetails: async (url: string) => {
    set({ searching: true });
    try {
      const response = await getServices(url);
      set({ adjustmentActive: response.data.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ searching: false });
    }
  },

  sendAdjustment: async (url, data) => {
        set({ sending: true });
        try {
            const response = await createService(url, data);
            useToastMessageStore.getState().setMessage(response);
            set({ error: false });
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            set({ error: true });
            return false;
        } finally {
            set({ sending: false });
        }
    },

}));

export default adjustStore;

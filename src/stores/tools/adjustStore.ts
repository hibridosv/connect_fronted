import { createService, getServices } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';


interface adjustStoreI {
  adjustments: any | null;
  adjustment: any | null;
  adjustmentActive: any | null;
  activeAdjustment: any | null;
  error: boolean;
  loading: boolean;
  searching: boolean;
  sending: boolean;
  loadingAdjustment: boolean;
  deleting?: boolean;
  isAdjustmentActive?: boolean;
  loadAdjustments: (url: string) => Promise<void>;
  loadAdjustment: (url: string) => Promise<void>;
  loadActiveAdjustment: (userId?: string | number) => Promise<void>;
  manageAdjustment: (url: string, data: any) => Promise<void>;
  loadDetails: (url: string) => Promise<void>;
  sendAdjustment: (url: string, data: any) => Promise<boolean>;
}

const adjustStore = create<adjustStoreI>((set) => ({
  adjustments: null,
  adjustment: null,
  adjustmentActive: null,
  activeAdjustment: null,
  error: false,
  loading: false,
  sending: false,
  searching: false,
  loadingAdjustment: false,
  deleting: false,
  isAdjustmentActive: false,

  loadAdjustments: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ adjustments: response.data.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true, adjustments: null });
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
      set({ error: true, adjustment: null });
    } finally {
      set({ loadingAdjustment: false });
    }
  },

  /* ajuste en curso de cualquier usuario: si es del usuario actual lo retoma */
  loadActiveAdjustment: async (userId) => {
    try {
      const response = await getServices('tools/adjust/active');
      const active = response.data.data;
      set({ activeAdjustment: active, isAdjustmentActive: !!userId && active?.employee_id === userId });
    } catch (error) {
      // 404: no hay ajuste en curso
      set({ activeAdjustment: null });
    }
  },

  manageAdjustment: async (url, data) => {
        set({ loading: true });
        try {
            const response = await createService(url, data);
            set({ adjustmentActive: response.data.data, error: false });
            useToastMessageStore.getState().setMessage(response);
            if (data.status === 1) {
                set({ isAdjustmentActive: true });
            }
            if (data.status === 2) {
                set({ adjustmentActive: null, activeAdjustment: null, isAdjustmentActive: false });
            }
          
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
      // useToastMessageStore.getState().setError(error);
      set({ error: true, adjustmentActive: null });
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

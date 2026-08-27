import { getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface ScreenOrdersStoreI {
  orders: any[];
  loading: boolean;
  error: boolean;

  loadOrders: (url: string) => Promise<void>;
  processOrder: (url: string, data: any) => Promise<void>;
}

const screenOrdersStore = create<ScreenOrdersStoreI>((set) => ({
  orders: [],
  loading: false,
  error: false,

  loadOrders: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ orders: response.data.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  processOrder: async (url: string, data: any) => {
    try {
      await updateService(url, data);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    }
  },
}));

export default screenOrdersStore;

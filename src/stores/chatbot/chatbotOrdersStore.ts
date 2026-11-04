import { getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface ChatbotOrdersStoreI {
  orders: any | null;
  order: any | null;
  checks: any[] | null;
  loading: boolean;
  loadingOrder: boolean;
  sending: boolean;
  disabled: boolean;
  loadOrders: (url: string) => Promise<void>;
  loadOrder: (id: string) => Promise<void>;
  chargeOrder: (id: string) => Promise<boolean>;
  cancelOrder: (id: string, reason: string) => Promise<boolean>;
  readyOrder: (id: string) => Promise<boolean>;
  clearOrder: () => void;
}

const chatbotOrdersStore = create<ChatbotOrdersStoreI>((set) => ({
  orders: null,
  order: null,
  checks: null,
  loading: false,
  loadingOrder: false,
  sending: false,
  disabled: false,

  loadOrders: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ orders: response.data.data, disabled: false });
    } catch (error: any) {
      if (error?.response?.status === 403) set({ disabled: true });
      set({ orders: null });
    } finally {
      set({ loading: false });
    }
  },

  loadOrder: async (id: string) => {
    set({ loadingOrder: true, checks: null });
    try {
      const [order, checks] = await Promise.all([
        getServices(`chatbot/orders/${id}`),
        getServices(`chatbot/orders/${id}/check`),
      ]);
      set({ order: order.data.data, checks: checks.data.data });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loadingOrder: false });
    }
  },

  chargeOrder: async (id: string) => {
    set({ sending: true });
    try {
      const response = await updateService(`chatbot/orders/${id}/charge`, {});
      useToastMessageStore.getState().setMessage(response);
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ sending: false });
    }
  },

  cancelOrder: async (id: string, reason: string) => {
    set({ sending: true });
    try {
      const response = await updateService(`chatbot/orders/${id}/cancel`, { reason: reason || null });
      useToastMessageStore.getState().setMessage(response);
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ sending: false });
    }
  },

  readyOrder: async (id: string) => {
    set({ sending: true });
    try {
      const response = await updateService(`chatbot/orders/${id}/ready`, {});
      useToastMessageStore.getState().setMessage(response);
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ sending: false });
    }
  },

  clearOrder: () => set({ order: null, checks: null }),
}));

export default chatbotOrdersStore;

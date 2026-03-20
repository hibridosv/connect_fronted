import { createService, deleteService, getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface CommissionsStoreI {
  commissions: any | null;
  activeCommission: any | null;
  ordersCommission: any | null;
  error: boolean;
  loading: boolean;
  saving: boolean;
  assignProducts: number;
  loadCommissions: (url: string) => Promise<void>;
  loadActiveCommission: () => Promise<boolean>;
  loadOrdersCommission: (referredId: string) => Promise<void>;
  createCommission: (data: any) => Promise<boolean>;
  cancelCommission: (id: string, userId: string) => Promise<boolean>;
  saveCommission: (id: string, userId: string) => Promise<boolean>;
  payCommission: (id: string) => Promise<boolean>;
  deleteCommission: (id: string) => Promise<boolean>;
  toggleOrderPay: (orderId: string, userId: string, active: boolean) => Promise<boolean>;
  clearActive: () => void;
}

const commissionsStore = create<CommissionsStoreI>((set, get) => ({
  commissions: null,
  activeCommission: null,
  ordersCommission: null,
  error: false,
  loading: false,
  saving: false,
  assignProducts: 0,
  loadCommissions: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ commissions: response.data.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  loadActiveCommission: async () => {
    set({ loading: true });
    try {
      const response = await getServices('tools/commissions/active?type=1');
      set({ activeCommission: response.data.data, error: false });
      return true;
    } catch {
      set({ activeCommission: null });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  loadOrdersCommission: async (referredId: string) => {
    try {
      const response = await getServices(`tools/commissions/orders?userId=${referredId}`);
      set({ ordersCommission: response.data.data });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    }
  },

  createCommission: async (data: any) => {
    set({ saving: true });
    try {
      const response = await createService('tools/commissions/create', data);
        set({ activeCommission: response.data.data, error: false });
        useToastMessageStore.getState().setMessage(response);
        return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ saving: false });
    }
  },

  cancelCommission: async (id: string, userId: string) => {
    set({ saving: true });
    try {
      const response = await updateService(`tools/commissions/cancel/${id}`, { userId });
      set({ activeCommission: null, error: false});
      useToastMessageStore.getState().setMessage(response);
      return true;
    } catch (error) {
      set({ error: true})
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ saving: false });
    }
  },

  saveCommission: async (id: string, userId: string) => {
    set({ saving: true });
    try {
      const response = await updateService(`tools/commissions/save/${id}`, { userId });
      if (response.data?.type === 'successful') {
        set({ activeCommission: null });
        return true;
      }
      useToastMessageStore.getState().setError('Error al guardar');
      return false;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ saving: false });
    }
  },

  payCommission: async (id: string) => {
    set({ saving: true });
    try {
      const response = await updateService(`tools/commissions/pay/${id}`, {});
      if (response.data?.type === 'successful') {
        useToastMessageStore.getState().setMessage(response);
        return true;
      }
      useToastMessageStore.getState().setError(response);
      return false;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ saving: false });
    }
  },

  deleteCommission: async (id: string) => {
    set({ saving: true });
    try {
      const response = await deleteService(`tools/commissions/${id}`);
      useToastMessageStore.getState().setMessage(response);
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ saving: false });
    }
  },

  toggleOrderPay: async (orderId: string, userId: string, active: boolean) => {
    try {
      const response = await updateService(`tools/commissions/add/${orderId}`, { userId, active });
      set({ assignProducts: response.data.data})
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    }
  },

  clearActive: () => set({ activeCommission: null, ordersCommission: null }),
}));

export default commissionsStore;

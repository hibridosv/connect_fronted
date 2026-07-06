import { getServices, createService, updateService, deleteService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface GoldPointsStoreI {
  commissions: any | null;
  commissionDetail: any | null;
  error: boolean;
  loading: boolean;
  saving: boolean;

  loadCommissions: (url: string) => Promise<void>;
  loadCommissionDetail: (id: string) => Promise<void>;
  createGoldCommission: (payload: any) => Promise<boolean>;
  payCommission: (id: string) => Promise<boolean>;
  deleteGoldCommission: (id: string) => Promise<boolean>;
}

const goldPointsStore = create<GoldPointsStoreI>((set) => ({
  commissions: null,
  commissionDetail: null,
  error: false,
  loading: false,
  saving: false,

  loadCommissions: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ commissions: response.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  loadCommissionDetail: async (id: string) => {
    try {
      const response = await getServices(`tools/commissions/gold/${id}`);
        set({ commissionDetail: response.data });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    }
  },

  createGoldCommission: async (payload: any) => {
    set({ saving: true });
    try {
      const response = await createService('tools/commissions/create/gold', payload);
      if (response.data?.type === 'error') {
        useToastMessageStore.getState().setError('Faltan algunos datos importantes');
        return false;
      }
      set({ commissions: response.data, error: false });
      return true;
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
      useToastMessageStore.getState().setError('Error al pagar');
      return false;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ saving: false });
    }
  },

  deleteGoldCommission: async (id: string) => {
    set({ saving: true });
    try {
      const response = await deleteService(`tools/commissions/cancel/gold/${id}`);
      if (response.data?.type === 'successful') {
        useToastMessageStore.getState().setMessage(response);
        return true;
      }
      useToastMessageStore.getState().setError('Error al eliminar');
      return false;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ saving: false });
    }
  },
}));

export default goldPointsStore;

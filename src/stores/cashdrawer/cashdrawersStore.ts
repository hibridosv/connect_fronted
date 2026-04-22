import { getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useConfigStore from '../configStore';
import useModalStore from '../modalStorage';
import useToastMessageStore from '../toastMessageStore';
import useCutStore from './cutStore';


interface CashDrawerState {
  cashDrawers: any | null; // Consider defining a more specific type for cashDrawers
  error: boolean;
  loading: boolean;
  loadCashDrawers: () => Promise<void>;
  openCashDrawer: (url: string, data: any) => Promise<void>;
  closeCashDrawer: (url: string, data: any) => Promise<void>;
}

const useCashDrawerStore = create<CashDrawerState>((set) => ({
  cashDrawers: null,
  error: false,
  loading: false,
  loadCashDrawers: async () => {
    set({ loading: true });
    try {
      const response = await getServices("cashdrawers?included=employee&filterWhere[status]=!0");
      set({ cashDrawers: response.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  openCashDrawer: async (url, data) => {
    try {
      set({ loading: true });
      const response = await updateService(url, data);
      await useCashDrawerStore.getState().loadCashDrawers();
      await useConfigStore.getState().reloadConfig();
      await useCutStore.getState().loadCuts('cuts?included=employee,cashdrawer&sort=-updated_at&perPage=10');
      useToastMessageStore.getState().setMessage(response);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
      useModalStore.getState().closeModal('cashDrawerOpen');
    }
  },
  
  
  closeCashDrawer: async (url, data) => {
    try {
      set({ loading: true });
      const response = await updateService(url, data);
      await useCashDrawerStore.getState().loadCashDrawers();
      await useConfigStore.getState().reloadConfig();
      await useCutStore.getState().loadCuts('cuts?included=employee,cashdrawer&sort=-updated_at&perPage=10');
      useToastMessageStore.getState().setMessage(response);
      useModalStore.getState().openModal('cashDrawerDetails');
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
      useModalStore.getState().closeModal('cashDrawerOpen');
    }
  },


}));

export default useCashDrawerStore;

import { deleteService, getServices } from '@/services/services';
import { create } from 'zustand';
import useConfigStore from '../configStore';
import useToastMessageStore from '../toastMessageStore';
import useCashDrawerStore from './cashdrawersStore';



interface CutStoreState {
  cuts: any; 
  cut: any;
  error: boolean;
  loading: boolean;
  deleting: boolean;
  loadCuts: (url: string) => Promise<void>;
  loadCut: (url: string) => Promise<void>;
  deleteCut: (url: string) => Promise<void>;
}

const useCutStore = create<CutStoreState>((set) => ({
  cuts: [],
  cut: null,
  error: false,
  loading: false,
  deleting: false,
  loadCuts: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ cuts: response.data.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  loadCut: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ cut: response.data.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  deleteCut: async (url: string) => {
    set({ deleting: true });
    try {
      const response = await deleteService(url);
      await useCutStore.getState().loadCuts('cuts?included=employee,cashdrawer&sort=-updated_at&perPage=10');
      await useCashDrawerStore.getState().loadCashDrawers();
      await useConfigStore.getState().reloadConfig();
      useToastMessageStore.getState().setMessage(response);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ deleting: false });
    }
  },


}));

export default useCutStore;

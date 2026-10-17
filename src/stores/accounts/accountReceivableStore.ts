import { ClientCreditSummary, CreditAging } from '@/interfaces/credits';
import { createService, deleteService, getServices } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';
import useTempStorage from '../useTempStorage';


interface accountReceivableStoreI {
  accounts: any | null;
  aging: CreditAging | null;
  clientSummary: ClientCreditSummary | null;
  account: any | null;
  error: boolean;
  loading: boolean;
  sending: boolean;
  deleting: boolean;
  loadAccounts: (url: string) => Promise<void>;
  loadAccount: (url: string) => Promise<void>;
  createPayment: (url: string, data: any) => Promise<boolean>;
  deletePayment: (url: string) => Promise<void>;
  waiveLateFee: (url: string) => Promise<boolean>;
  loadAging: (url: string) => Promise<void>;
  loadClientSummary: (url: string) => Promise<void>;
}

const accountReceivableStore = create<accountReceivableStoreI>((set) => ({
  accounts: null,
  aging: null,
  clientSummary: null,
  account: null,
  error: false, 
  loading: false,
  sending: false,
  deleting: false,

  loadAccounts: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ accounts: response.data.data, error: false});
    } catch (error) {
      set({ accounts: null });
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

    loadAccount: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ account: response.data.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },


  createPayment: async (url, data) => {
        set({ sending: true });
        try {
            const response = await createService(url, data);
            useToastMessageStore.getState().setMessage(response);
            useTempStorage.getState().setElement("paymentReceivableAdd", response.data.data);
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


    deletePayment: async (url: string) => {
    set({ deleting: true });
    try {
      const response = await deleteService(url); 
      useToastMessageStore.getState().setMessage(response);
      useTempStorage.getState().setElement("paymentReceivableAdd", response.data.data);
      set({ error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ deleting: false });
    }
  },


    waiveLateFee: async (url: string) => {
        set({ sending: true });
        try {
            const response = await createService(url, {});
            useToastMessageStore.getState().setMessage(response);
            useTempStorage.getState().setElement("paymentReceivableAdd", response.data.data);
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

    loadAging: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ aging: response.data.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ aging: null, error: true });
    } finally {
      set({ loading: false });
    }
  },

    loadClientSummary: async (url: string) => {
    try {
      const response = await getServices(url);
      set({ clientSummary: response.data.data });
    } catch (error) {
      set({ clientSummary: null });
    }
  },

}));

export default accountReceivableStore;

import { createService, deleteService, getServices } from '@/services/services';
import { create } from 'zustand';
import useModalStore from '../modalStorage';
import useToastMessageStore from '../toastMessageStore';
import useTempStorage from '../useTempStorage';


interface AccountPayableStoreStateI {
  accounts: any | null;
  account: any | null;
  error: boolean;
  loading: boolean;
  sending: boolean;
  deleting: boolean;
  loadAccounts: (url: string) => Promise<void>;
  loadAccount: (url: string) => Promise<void>;
  createAccount: (url: string, data: any) => Promise<boolean>;
  deleteAccount: (url: string, id: string) => Promise<void>;
  createPayment: (url: string, data: any) => Promise<boolean>;
  deletePayment: (url: string) => Promise<void>;
  createCreditNote: (url: string, data: any) => Promise<boolean>;
  deleteCreditNote: (url: string) => Promise<boolean>;
}

const useAccountPayableStore = create<AccountPayableStoreStateI>((set) => ({
  accounts: null,
  account: null,
  error: false, 
  loading: false,
  sending: false,
  deleting: false,

  loadAccounts: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ accounts: response.data.data, error: false });
    } catch (error) {
      set({ accounts: null });
      useToastMessageStore.getState().setError(error);
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


    createAccount: async (url, data) => {
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

  deleteAccount: async (url: string, id: string) => {
    set({ deleting: true });
    try {
      const response = await deleteService(url); 
      set((state: any) => {
        const updated = state.accounts.data.filter((account: any) => account.id !== id);
        return {
          accounts: {
            ...state.accounts,
            data: updated,
          }
        };
      });
      useToastMessageStore.getState().setMessage(response);
      useTempStorage.getState().clearElement("paymentPayableAdd");
      useModalStore.getState().closeModal("paymentPayableAdd");
      set({ error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ deleting: false });
    }
  },

  createPayment: async (url, data) => {
        set({ sending: true });
        try {
            const response = await createService(url, data);
            useToastMessageStore.getState().setMessage(response);
            useTempStorage.getState().setElement("paymentPayableAdd", response.data.data);
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
      useTempStorage.getState().setElement("paymentPayableAdd", response.data.data);
      set({ error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ deleting: false });
    }
  },
  

    createCreditNote: async (url, data) => {
        set({ sending: true });
        try {
            const response = await createService(url, data);
            useToastMessageStore.getState().setMessage(response);
            useTempStorage.getState().setElement("paymentPayableAdd", response.data.data);
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

  deleteCreditNote: async (url: string) => {
    set({ deleting: true });
    try {
      const response = await deleteService(url); 
      useToastMessageStore.getState().setMessage(response);
      // el modal queda abierto: la cuenta puede tener mas notas
      useTempStorage.getState().setElement("paymentPayableAdd", response.data.data);
      set({ error: false });
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return false;
    } finally {
      set({ deleting: false });
    }
  },
  

}));

export default useAccountPayableStore;

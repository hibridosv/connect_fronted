import { createService, getServices } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface InvoicesStoreI {
  invoices: any;
  payLink: any;
  loading: boolean;
  sendingLink: boolean;
  error: boolean;

  loadInvoices: (url: string) => Promise<void>;
  loadPayLink: (invoiceId: string) => Promise<void>;
}

const invoicesStore = create<InvoicesStoreI>((set) => ({
  invoices: null,
  payLink: null,
  loading: false,
  sendingLink: false,
  error: false,

  loadInvoices: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      if (response.data) {
        set({ invoices: response.data, error: false });
      }
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  loadPayLink: async (invoiceId: string) => {
    set({ sendingLink: true });
    try {
      const response = await createService(`settings/invoices/payments/${invoiceId}`, {});
      if (response.data) {
        set({ payLink: response.data });
      }
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ sendingLink: false });
    }
  },
}));

export default invoicesStore;

import { postForPrint } from '@/services/OtherServices';
import { createService, getServices } from '@/services/services';
import { create } from 'zustand';
import useConfigStore from '../configStore';
import useModalStore from '../modalStorage';
import useToastMessageStore from '../toastMessageStore';


interface InvoiceDetailsStoreI {
  order: any | null;
  error: boolean;
  loadingOrder: boolean;
  printing: boolean;
  deleting: boolean;
  deletingCreditNote: boolean;
  fetchOrder: (invoiceId: string) => Promise<void>;
  printOrder: (id: string) => Promise<void>;
  deleteOrder: (id: string, invoiceId: string) => Promise<void>;
  deleteCreditNote: (creditNoteId: string, invoiceId: string) => Promise<void>;
}

const useInvoiceDetailsStore = create<InvoiceDetailsStoreI>((set, get) => ({
  order: null,
  error: false,
  loadingOrder: false,
  printing: false,
  deleting: false,
  deletingCreditNote: false,

  fetchOrder: async (invoiceId: string) => {
    set({ loadingOrder: true });
    try {
      const iden = invoiceId.toLowerCase();
      const url = `orders/find?filter[id]==${iden}&included=creditnotes,products,invoiceproducts,employee,client,referred,delivery,casheir,invoiceAssigned`;
      const response = await getServices(url);
      set({ order: response.data.data, error: false });
    } catch (error) {
      set({ order: null, error: true });
    } finally {
      set({ loadingOrder: false });
    }
  },

  printOrder: async (id: string) => {
    set({ printing: true });
    try {
      const response = await createService(`documents/print`, { invoice: id });
      if (response.status === 200) {
        const { system, activeConfig } = useConfigStore.getState();
        if (activeConfig && activeConfig.includes("print-local")) {
          await postForPrint(system?.local_url_print ?? 'http://127.0.0.1/impresiones/', 'POST', response.data.data);
        }
        useToastMessageStore.getState().setMessage(response);
      }
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ printing: false });
    }
  },

  deleteOrder: async (id: string, invoiceId: string) => {
    useModalStore.getState().closeModal('deleteOrder');
    set({ deleting: true });
    try {
      const response = await createService(`documents/delete`, { invoice: id });
      if (response.status === 200 || response.status === 204) {
        useToastMessageStore.getState().setMessage({ message: "Orden anulada correctamente" });
      }
      await get().fetchOrder(invoiceId);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ deleting: false });
    }
  },

  deleteCreditNote: async (creditNoteId: string, invoiceId: string) => {
    set({ deletingCreditNote: true });
    try {
      const response = await createService(`documents/delete`, { invoice: creditNoteId, dte_type: "05" });
      useToastMessageStore.getState().setMessage(response);
      if (response.status === 200 || response.status === 204) {
        await get().fetchOrder(invoiceId);
      }
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ deletingCreditNote: false });
    }
  },
}));

export default useInvoiceDetailsStore;

import { postForPrint } from '@/services/OtherServices';
import { createService, getServices } from '@/services/services';
import { create } from 'zustand';
import useConfigStore from '../configStore';
import useModalStore from '../modalStorage';
import useToastMessageStore from '../toastMessageStore';


export interface InvalidateDocumentPayload {
  tipo_anulacion: number;
  motivo_anulacion: string;
  codigo_generacion_reemplazo: string | null;
}

interface InvoiceDetailsStoreI {
  order: any | null;
  error: boolean;
  loadingOrder: boolean;
  printing: boolean;
  deleting: boolean;
  deletingCreditNote: boolean;
  deletingReturn: boolean;
  fetchOrder: (invoiceId: string) => Promise<void>;
  printOrder: (id: string) => Promise<void>;
  deleteOrder: (id: string, invoiceId: string, data: InvalidateDocumentPayload) => Promise<void>;
  deleteCreditNote: (creditNoteId: string, invoiceId: string, data: InvalidateDocumentPayload) => Promise<void>;
  deleteReturn: (returnId: string, invoiceId: string, data: InvalidateDocumentPayload) => Promise<void>;
}

const useInvoiceDetailsStore = create<InvoiceDetailsStoreI>((set, get) => ({
  order: null,
  error: false,
  loadingOrder: false,
  printing: false,
  deleting: false,
  deletingCreditNote: false,
  deletingReturn: false,

  fetchOrder: async (invoiceId: string) => {
    set({ loadingOrder: true });
    try {
      const iden = invoiceId.toLowerCase();
      const url = `orders/find?filter[id]==${iden}&included=creditnotes,creditnotes.emitedBy,creditnotes.deletedBy,returns,returns.emitedBy,returns.deletedBy,canceledBy,products,invoiceproducts,employee,client,referred,delivery,casheir,invoiceAssigned`;
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

  deleteOrder: async (id: string, invoiceId: string, data: InvalidateDocumentPayload) => {
    useModalStore.getState().closeModal('invalidateOrder');
    set({ deleting: true });
    try {
      const response = await createService(`documents/delete`, { invoice: id, ...data });
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

  deleteCreditNote: async (creditNoteId: string, invoiceId: string, data: InvalidateDocumentPayload) => {
    useModalStore.getState().closeModal('invalidateCreditNote');
    set({ deletingCreditNote: true });
    try {
      const response = await createService(`documents/delete-credit-note`, { invoice: creditNoteId, dte_type: "05", ...data });
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

  // Evento de Retorno: se invalida siempre con tipo 2 y sin documento de reemplazo (connect lo fuerza)
  deleteReturn: async (returnId: string, invoiceId: string, data: InvalidateDocumentPayload) => {
    set({ deletingReturn: true });
    try {
      const response = await createService(`documents/delete-return`, { invoice: returnId, ...data });
      useToastMessageStore.getState().setMessage(response);
      if (response.status === 200 || response.status === 204) {
        await get().fetchOrder(invoiceId);
      }
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ deletingReturn: false });
    }
  },
}));

export default useInvoiceDetailsStore;

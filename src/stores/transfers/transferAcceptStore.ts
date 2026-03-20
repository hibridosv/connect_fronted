import { getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useConfigStore from '../configStore';
import useToastMessageStore from '../toastMessageStore';

interface TransferAcceptStoreI {
  transfers: any;
  selectedTransfer: any;
  loading: boolean;
  loadingDetail: boolean;
  sending: boolean;
  loadTransfers: () => Promise<void>;
  checkTransfer: (id: string) => Promise<void>;
  rejectProduct: (id: string) => Promise<void>;
  createProductRegister: (id: string) => Promise<void>;
  acceptAll: (id: string) => Promise<void>;
  rejectAll: (id: string) => Promise<void>;
  setSelectedTransfer: (transfer: any) => void;
  clearSelectedTransfer: () => void;
}

const transferAcceptStore = create<TransferAcceptStoreI>((set, get) => ({
  transfers: null,
  selectedTransfer: null,
  loading: false,
  loadingDetail: false,
  sending: false,

  loadTransfers: async () => {
    const tenant = useConfigStore.getState().tenant;
    set({ loading: true });
    try {
      const response = await getServices(`transfers?sort=-created_at&filter[to_tenant_id]==${tenant.id}&included=products,to,from`);
      set({ transfers: response.data.data });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loading: false });
    }
  },

  checkTransfer: async (id: string) => {
    set({ loadingDetail: true });
    try {
      const response = await getServices(`transfers/check/${id}`);
      set({ selectedTransfer: response.data.data });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loadingDetail: false });
    }
  },

  rejectProduct: async (id: string) => {
    set({ sending: true });
    try {
      await updateService(`transfers/products/${id}`, { status: 3 });
      useToastMessageStore.getState().setMessage({ data: { message: 'Producto rechazado' } });
      const selected = get().selectedTransfer;
      if (selected) await get().checkTransfer(selected.id);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ sending: false });
    }
  },

  createProductRegister: async (id: string) => {
    set({ sending: true });
    try {
      await updateService(`transfers/products/create/${id}`, { create: 1 });
      useToastMessageStore.getState().setMessage({ data: { message: 'Producto agregado correctamente' } });
      const selected = get().selectedTransfer;
      if (selected) await get().checkTransfer(selected.id);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ sending: false });
    }
  },

  acceptAll: async (id: string) => {
    set({ sending: true });
    try {
      await updateService(`transfers/accept/${id}`, { is_online: 0, status: 4 });
      useToastMessageStore.getState().setMessage({ data: { message: 'Transferencia aceptada' } });
      const selected = get().selectedTransfer;
      if (selected) await get().checkTransfer(selected.id);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ sending: false });
    }
  },

  rejectAll: async (id: string) => {
    set({ sending: true });
    try {
      await updateService(`transfers/cancel/${id}`, { status: 5 });
      useToastMessageStore.getState().setMessage({ data: { message: 'Transferencia rechazada' } });
      const selected = get().selectedTransfer;
      if (selected) await get().checkTransfer(selected.id);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ sending: false });
    }
  },

  setSelectedTransfer: (transfer: any) => set({ selectedTransfer: transfer }),
  clearSelectedTransfer: () => set({ selectedTransfer: null }),
}));

export default transferAcceptStore;

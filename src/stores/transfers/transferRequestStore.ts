import { createService, deleteService, getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useConfigStore from '../configStore';
import useToastMessageStore from '../toastMessageStore';

interface TransferRequestStoreI {
  transfers: any;
  activeTransfer: any;
  linkedSystems: any;
  productsAdded: any[];
  loading: boolean;
  sending: boolean;
  loadTransfers: () => Promise<void>;
  loadLinkedSystems: () => Promise<void>;
  createTransfer: (data: any) => Promise<void>;
  addProduct: (data: any) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<void>;
  cancelTransfer: () => Promise<void>;
  sendRequest: () => Promise<void>;
  updateTransferStatus: (transferId: string, status: number) => Promise<void>;
  getProductsOnline: (transfer: any) => Promise<void>;
  acceptRequest: (transferId: string) => Promise<void>;
}

const getFirstWithStatus6 = (items: any[]) => {
  return items?.find((el: any) => el.status === 6) || null;
};

const transferRequestStore = create<TransferRequestStoreI>((set, get) => ({
  transfers: null,
  activeTransfer: null,
  linkedSystems: null,
  productsAdded: [],
  loading: false,
  sending: false,

  loadTransfers: async () => {
    const tenant = useConfigStore.getState().tenant;
    set({ loading: true });
    try {
      const response = await getServices(`transfers?sort=-created_at&filter[to_tenant_id]==${tenant.id}&included=products,to,from`);
      const data = response.data;
      const first = getFirstWithStatus6(data?.data);
      if (first) {
        set({ activeTransfer: first, productsAdded: first.products || [], transfers: data });
      } else {
        set({ activeTransfer: null, productsAdded: [], transfers: data });
        get().loadLinkedSystems();
      }
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loading: false });
    }
  },

  loadLinkedSystems: async () => {
    try {
      const response = await getServices('tenants/linked');
      set({ linkedSystems: response.data.data });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    }
  },

  createTransfer: async (data: any) => {
    set({ sending: true });
    try {
      const response = await createService('transfers', data);
      set({ activeTransfer: response.data.data, productsAdded: [] });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ sending: false });
    }
  },

  addProduct: async (data: any) => {
    set({ sending: true });
    try {
      const response = await createService('transfers/products', data);
      const newProduct = response.data.data;
      set((state) => ({ productsAdded: [...state.productsAdded, newProduct] }));
      useToastMessageStore.getState().setMessage(response);
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ sending: false });
    }
  },

  deleteProduct: async (id: string) => {
    set({ sending: true });
    try {
      const response = await deleteService(`transfers/products/${id}`);
      set((state) => ({ productsAdded: state.productsAdded.filter((p: any) => p.id !== id) }));
      useToastMessageStore.getState().setMessage(response);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ sending: false });
    }
  },

  cancelTransfer: async () => {
    const activeTransfer = get().activeTransfer;
    if (!activeTransfer) return;
    set({ sending: true });
    try {
      await deleteService(`transfers/${activeTransfer.id}`);
      set({ activeTransfer: null, productsAdded: [] });
      useToastMessageStore.getState().setMessage({ data: { message: 'Solicitud cancelada' } });
      get().loadTransfers();
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ sending: false });
    }
  },

  sendRequest: async () => {
    const activeTransfer = get().activeTransfer;
    if (!activeTransfer) return;
    set({ sending: true });
    try {
      await updateService(`transfers/request/${activeTransfer.id}`, { status: 7 });
      set({ activeTransfer: null, productsAdded: [] });
      useToastMessageStore.getState().setMessage({ data: { message: 'Solicitud enviada' } });
      get().loadTransfers();
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ sending: false });
    }
  },

  updateTransferStatus: async (transferId: string, status: number) => {
    set({ sending: true });
    try {
      await updateService(`transfers/update/${transferId}`, { status });
      useToastMessageStore.getState().setMessage({ data: { message: 'Cambios efectuados' } });
      get().loadTransfers();
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ sending: false });
    }
  },

  getProductsOnline: async (transfer: any) => {
    set({ sending: true });
    try {
      await updateService(`transfers/online/${transfer.id}`, { is_online: 0 });
      useToastMessageStore.getState().setMessage({ data: { message: 'Productos devueltos correctamente' } });
      get().loadTransfers();
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ sending: false });
    }
  },

  acceptRequest: async (transferId: string) => {
    set({ sending: true });
    try {
      await updateService(`transfers/request/${transferId}`, { status: 6 });
      useToastMessageStore.getState().setMessage({ data: { message: 'Solicitud aceptada' } });
      get().loadTransfers();
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ sending: false });
    }
  },
}));

export default transferRequestStore;

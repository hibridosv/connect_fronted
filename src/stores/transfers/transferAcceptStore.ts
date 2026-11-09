import { getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useConfigStore from '../configStore';
import useToastMessageStore from '../toastMessageStore';

// Productos activos sin registro en esta sucursal
export const hasUnregistered = (products: any[]) => {
  if (!products) return false;
  return products.some((p: any) => p.status === 1 && !p.cod_receive);
};

interface TransferAcceptStoreI {
  transfers: any;
  selectedTransfer: any;
  loading: boolean;
  loadingDetail: boolean;
  sending: boolean;
  loadTransfers: () => Promise<void>;
  loadTransfer: (id: string) => Promise<void>;
  checkTransfer: (id: string) => Promise<void>;
  reloadSelected: () => Promise<void>;
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
      // Solo las ultimas 50; la tabla y el resumen esperan una lista, no la paginacion
      const response = await getServices(`transfers?sort=-created_at&filter[to_tenant_id]==${tenant.id}&included=products,to,from&perPage=50&page=1`);
      set({ transfers: response.data.data.data });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loading: false });
    }
  },

  // Trae la transferencia del servidor: los botones dependen de su estado real, no del de la lista
  loadTransfer: async (id: string) => {
    set({ loadingDetail: true });
    try {
      const response = await getServices(`transfers/${id}`);
      const transfer = response.data.data;
      set({ selectedTransfer: transfer });
      // check solo responde con la transferencia enviada (2)
      if (transfer?.status === 2 && hasUnregistered(transfer.products)) {
        await get().checkTransfer(transfer.id);
      }
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loadingDetail: false });
    }
  },

  checkTransfer: async (id: string) => {
    set({ loadingDetail: true });
    try {
      const response = await updateService(`transfers/check/${id}`, {});
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
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      // Con show y no con check: ya no esta en 2 (check fallaba y dejaba el boton activo)
      await get().reloadSelected();
      set({ sending: false });
    }
  },

  rejectAll: async (id: string) => {
    set({ sending: true });
    try {
      await updateService(`transfers/cancel/${id}`, { status: 5 });
      useToastMessageStore.getState().setMessage({ data: { message: 'Transferencia rechazada' } });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      await get().reloadSelected();
      set({ sending: false });
    }
  },

  // Recarga el detalle sin mostrar errores: el toast ya dice si la accion se hizo o no
  reloadSelected: async () => {
    const selected = get().selectedTransfer;
    if (!selected) return;
    try {
      const response = await getServices(`transfers/${selected.id}`);
      set({ selectedTransfer: response.data.data });
    } catch {
      // se queda el detalle anterior
    }
  },

  setSelectedTransfer: (transfer: any) => set({ selectedTransfer: transfer }),
  clearSelectedTransfer: () => set({ selectedTransfer: null }),
}));

export default transferAcceptStore;

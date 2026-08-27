import { getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface ScreenOrdersStoreI {
  orders: any[];
  loading: boolean;
  error: boolean;

  loadOrders: (url: string) => Promise<void>;
  processOrder: (url: string, data: any) => Promise<void>;
  removeOrder: (orderId: number) => void;
  removeOrderProduct: (orderId: number, productId: number) => void;
}

const screenOrdersStore = create<ScreenOrdersStoreI>((set) => ({
  orders: [],
  loading: false,
  error: false,

  loadOrders: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ orders: response.data.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  processOrder: async (url: string, data: any) => {
    try {
      await updateService(url, data);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    }
  },

  removeOrder: (orderId: number) => {
    set((state) => ({
      orders: state.orders.filter((order: any) => order.id !== orderId),
    }));
  },

  removeOrderProduct: (orderId: number, productId: number) => {
    set((state) => ({
      orders: state.orders.map((order: any) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          products: order.products?.filter((product: any) => product.id !== productId),
          invoiceproducts: order.invoiceproducts?.filter((product: any) => product.id !== productId),
        };
      }),
    }));
  },
}));

export default screenOrdersStore;

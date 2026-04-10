import { Order } from '@/interfaces/order';
import { errorSound, successSound } from '@/lib/config/config';
import { createService, deleteService, getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useModalStore from '../modalStorage';
import useToastMessageStore from '../toastMessageStore';
import useTempStorage from '../useTempStorage';
import ordersStore from './ordersStore';

interface ordersRestaurantsStoreI {
  addOrder: (url: string, data: any) => Promise<boolean>;
  loadOrders: (url: string, showToast?: boolean) => Promise<void>;
  loadOrder: (url: string, showToast?: boolean) => Promise<void>;
  payOrder: (url: string, data: any) => Promise<boolean>;
  payOrderSplit: (url: string, data: any) => Promise<boolean>;
  saveOrder: (url: string, data: any) => Promise<void>;
  deleteOrder: (url: string) => Promise<void>;
  updateOrder: (url: string, data: any, showToast?: boolean) => Promise<boolean>;
  saveAs: (url: string, data: any) => Promise<void>;
  deleteProduct: (url: string) => Promise<void>;
  setOrders: (orders: Order[]) => void;
  loadTables: (url: string, showToast?: boolean) => Promise<void>;
}
// clientSelectedByDelivery
const ordersRestaurantsStore = create<ordersRestaurantsStoreI>(() => ({

  addOrder: async (url, data) => {
        const productId: number | null = data.product_id ?? null;
        ordersStore.setState((state) => ({
          sending: true,
          sendingProductIds: productId !== null ? [...state.sendingProductIds, productId] : state.sendingProductIds,
        }));
        try {
            const response = await createService(url, data);
            if (response.status == 200) {
              ordersStore.setState({ order: response.data.data, error: false });
              successSound()
            } else {
              ordersStore.setState({ order: null, error: false });
              ordersRestaurantsStore.getState().loadTables(`tables?included=tables`, false);
            }
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            ordersStore.setState({ error: true });
            errorSound();
            return false;
        } finally {
            ordersStore.setState((state) => {
              const remaining = state.sendingProductIds.filter(id => id !== productId);
              return { sendingProductIds: remaining, sending: remaining.length > 0 };
            });
        }
    },


  loadOrders: async (url: string, showToast: boolean = true) => {
    ordersStore.setState({ loading: true });
    try {
      const response = await getServices(url);
      ordersStore.setState({ orders: response.data.data, error: false });
    } catch (error) {
      ordersStore.setState({ orders: null });
      if (showToast) {
      useToastMessageStore.getState().setError(error);
      }
      ordersStore.setState({ error: true });
    } finally {
      ordersStore.setState({ loading: false });
    }
  },

  loadOrder: async (url: string, showToast: boolean = true) => {
    ordersStore.setState({ loading: true });
    try {
      const response = await getServices(url);
      ordersStore.setState({ order: response.data.data, error: false });
    } catch (error) {
      if (showToast) {
        useToastMessageStore.getState().setError(error);
      }
      ordersStore.setState({ order: null });
      ordersStore.setState({ error: true });
      useTempStorage.getState().clearElement('selectedTable');
    } finally {
      ordersStore.setState({ loading: false });
    }
  },


  payOrder: async (url, data) => {
        ordersStore.setState({ collecting: true });
        useModalStore.getState().openModal('paymentSuccess');
        try {
            const response = await createService(url, data);
            ordersStore.setState({ order: null, error: false, lastResponse: response.data.data.order });
            useTempStorage.getState().setElement("paymentSuccess", response.data.data.order);
            ordersRestaurantsStore.getState().loadTables(`tables?included=tables`, false);
            useTempStorage.getState().clearElement('selectedTable');
            useTempStorage.getState().clearElement('clientOrder');
            useTempStorage.getState().clearElement('clientSelectedByDelivery');
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            useModalStore.getState().closeModal('paymentSuccess');
            ordersStore.setState({ error: true });
            return false;
        } finally {
            ordersStore.setState({ collecting: false });
        }
    },

      payOrderSplit: async (url, data) => {
        ordersStore.setState({ collecting: true });
        useModalStore.getState().openModal('paymentSuccess');
        try {
            const response = await createService(url, data);
            ordersStore.setState({ order: response.data.data.invoice, error: false, lastResponse: response.data.data.order });
            useTempStorage.getState().setElement("paymentSuccess", response.data.data.order);
            ordersRestaurantsStore.getState().loadTables(`tables?included=tables`, false);
            // useTempStorage.getState().clearElement('selectedTable');
            // useTempStorage.getState().clearElement('clientOrder');
            // useTempStorage.getState().clearElement('clientSelectedByDelivery');
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            useModalStore.getState().closeModal('paymentSuccess');
            ordersStore.setState({ error: true });
            return false;
        } finally {
            ordersStore.setState({ collecting: false });
        }
    },

  saveOrder: async (url, data) => {
    // Solo guarada el estadp de la orden para enviar comandas
        ordersStore.setState({ saving: true });
        try {
            const response = await updateService(url, data);
            ordersStore.setState({ order: response.data.data, error: false });
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            ordersStore.setState({ error: true });
        } finally {
            ordersStore.setState({ saving: false });
        }
    },

  deleteOrder: async (url: string) => {
    ordersStore.setState({ deleting: true });
    try {
      const response = await deleteService(url);
      ordersStore.setState({ order: null, error: false });
      ordersRestaurantsStore.getState().loadTables(`tables?included=tables`, false);
      useToastMessageStore.getState().setMessage(response);
      useTempStorage.getState().clearElement('selectedTable');
      useTempStorage.getState().clearElement('clientOrder');
      useTempStorage.getState().clearElement('clientSelectedByDelivery');
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      ordersStore.setState({ error: true });
    } finally {
      ordersStore.setState({ deleting: false });
    }
  },

  updateOrder: async (url, data, showToast: boolean = true) => {
        ordersStore.setState({ sending: true });
        try {
            const response = await updateService(url, data);
            ordersStore.setState({ order: response.data.data, error: false });
            if (showToast) {
              useToastMessageStore.getState().setMessage(response);
            }
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            ordersStore.setState({ error: true });
            return false;
        } finally {
            ordersStore.setState({ sending: false });
        }
    },

  saveAs: async (url, data) => {
    // Guarda la orden y sale de la pantalla
        ordersStore.setState({ saving: true });
        try {
            const response = await createService(url, data);
            ordersStore.setState({ order: null, error: false });
            // ordersRestaurantsStore.getState().loadTables(`tables?included=tables`, false);
            useToastMessageStore.getState().setMessage(response);
            useTempStorage.getState().clearElement('clientOrder');
            useTempStorage.getState().clearElement('clientSelectedByDelivery');
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            ordersStore.setState({ error: true });
        } finally {
            ordersStore.setState({ saving: false });
        }
  },

  deleteProduct: async (url: string) => {
    ordersStore.setState({ deleting: true });
    try {
      const response = await deleteService(url);
      if (response.status == 200) {
        ordersStore.setState({ order: response.data.data, error: false });
      } else {
        ordersStore.setState({ order: null, error: false });
        ordersRestaurantsStore.getState().loadTables(`tables?included=tables`, false);
        useTempStorage.getState().clearElement('selectedTable');
        useTempStorage.getState().clearElement('clientOrder');
        useTempStorage.getState().clearElement('clientSelectedByDelivery');
      }
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      ordersStore.setState({ error: true });
    } finally {
      ordersStore.setState({ deleting: false });
    }
  },


  setOrders: (orders: any) => {
    ordersStore.setState({ orders: Array.isArray(orders) ? orders : [] });
  },

  loadTables: async (url: string, showToast: boolean = true) => {
    ordersStore.setState({ loading: true });
    try {
      const response = await getServices(url);
      ordersStore.setState({ tables: response.data.data, error: false });
    } catch (error) {
      ordersStore.setState({ tables: null });
      if (showToast) {
        useToastMessageStore.getState().setError(error);
      }
      ordersStore.setState({ error: true });
    } finally {
      ordersStore.setState({ loading: false });
    }
  },



}));

export default ordersRestaurantsStore;

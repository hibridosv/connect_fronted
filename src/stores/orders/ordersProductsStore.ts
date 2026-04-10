import { Order } from '@/interfaces/order';
import { errorSound, successSound } from '@/lib/config/config';
import { createService, deleteService, getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useModalStore from '../modalStorage';
import useToastMessageStore from '../toastMessageStore';
import useTempStorage from '../useTempStorage';
import ordersStore from './ordersStore';

interface ordersProductsStoreI {
  addOrder: (url: string, data: any) => Promise<boolean>;
  loadOrders: (url: string, showToast?: boolean) => Promise<void>;
  loadOrder: (url: string, showToast?: boolean) => Promise<void>;
  payOrder: (url: string, data: any) => Promise<boolean>;
  saveOrder: (url: string, data: any) => Promise<void>;
  deleteOrder: (url: string) => Promise<void>;
  updateOrder: (url: string, data: any, showToast?: boolean) => Promise<boolean>;
  saveAs: (url: string, data: any) => Promise<boolean>;
  deleteProduct: (url: string) => Promise<void>;
  setOrders: (orders: Order[]) => void;
}

const ordersProductsStore = create<ordersProductsStoreI>(() => ({

  addOrder: async (url, data) => {
        ordersStore.setState({ sending: true });
        try {
            const response = await createService(url, data);
            if (response.status == 200) {
              ordersStore.setState({ order: response.data.data, error: false });
              successSound()
            } else {
              ordersStore.setState({ order: null, error: false });
              ordersProductsStore.getState().loadOrders(`orders?included=employee,client,invoiceproducts&filterWhere[status]==2`, false);
            }
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            ordersStore.setState({ error: true });
            errorSound();
            return false;
        } finally {
            ordersStore.setState({ sending: false });
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
    } finally {
      ordersStore.setState({ loading: false });
    }
  },


  payOrder: async (url, data) => {
        ordersStore.setState({ collecting: true });
        try {
            const response = await createService(url, data);
            ordersStore.setState({ order: null, error: false });
            useTempStorage.getState().setElement("paymentSuccess", response.data.data);
            ordersProductsStore.getState().loadOrders(`orders?included=employee,client,invoiceproducts&filterWhere[status]==2`, false);
            useToastMessageStore.getState().setMessage(response);
            useModalStore.getState().closeModal('payOrder');
            useModalStore.getState().openModal('paymentSuccess');
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            ordersStore.setState({ error: true });
            return false;
        } finally {
            ordersStore.setState({ collecting: false });
        }
    },

  saveOrder: async (url, data) => {
        ordersStore.setState({ saving: true });
        try {
            const response = await createService(url, data);
            ordersStore.setState({ order: null, error: false });
            ordersProductsStore.getState().loadOrders(`orders?included=employee,client,invoiceproducts&filterWhere[status]==2`, false);
            useToastMessageStore.getState().setMessage(response);
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
      ordersProductsStore.getState().loadOrders(`orders?included=employee,client,invoiceproducts&filterWhere[status]==2`, false);
      useToastMessageStore.getState().setMessage(response);
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
        ordersStore.setState({ sending: true });
        try {
            const response = await updateService(url, data);
            ordersStore.setState({ order: null, error: false });
            ordersProductsStore.getState().loadOrders(`orders?included=employee,client,invoiceproducts&filterWhere[status]==2`, false);
            useToastMessageStore.getState().setMessage(response);
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            ordersStore.setState({ error: true });
            return false;
        } finally {
            ordersStore.setState({ sending: false });
        }
    },

  deleteProduct: async (url: string) => {
    ordersStore.setState({ deleting: true });
    try {
      const response = await deleteService(url);
      if (response.status == 200) {
        ordersStore.setState({ order: response.data.data, error: false });
        useToastMessageStore.getState().setMessage(response);
      } else {
        ordersStore.setState({ order: null, error: false });
        ordersProductsStore.getState().loadOrders(`orders?included=employee,client,invoiceproducts&filterWhere[status]==2`, false);
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

}));

export default ordersProductsStore;

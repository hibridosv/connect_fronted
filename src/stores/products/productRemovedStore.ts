import { createService, deleteService, getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';


interface ProductRemovedStoreState {
  products: any | null;
  product: any | null;
  error: boolean;
  loading: boolean;
  deleting: boolean;
  loadProducts: (url: string) => Promise<void>;
  loadProduct: (url: string) => Promise<void>;
  createPrincipal: (data: any) => Promise<void>;
  createProduct: (data: any) => Promise<void>;
  deleteProduct: (url: string) => Promise<void>;
  deletePrincipal: (url: string) => Promise<void>;
  savePrincipal: (url: string) => Promise<void>;
}

const productRemovedStore = create<ProductRemovedStoreState>((set) => ({
    products: null,
    product: null,
    loading: false,
    error: false,
    deleting: false,
    loadProducts: async (url: string) => {
        set({ loading: true });
        try {
            const response = await getServices(url);
            set({ products: response.data.data, error: false });
        } catch (error) {
            set({ error: true });
            useToastMessageStore.getState().setError(error);
        } finally {
            set({ loading: false });
        }
    },

    loadProduct: async (url: string) => {
        set({ loading: true });
        try {
            const response = await getServices(url);
            set({ product: response.data.data, error: false });
        } catch (error) {
            set({ error: true });
            console.error('Error fetching data:', error);
        } finally {
            set({ loading: false });
        }
    },


    createPrincipal: async (data) => {
        set({ loading: true });
        try {
            const response = await createService("removes", data);
            set({ product: response.data.data, error: false });
            useToastMessageStore.getState().setMessage(response);
        } catch (error) {
            set({ error: true });
            useToastMessageStore.getState().setError(error);
        } finally {
            set({ loading: false });
        }
    },

    createProduct: async (data) => {
        set({ loading: true });
        try {
            const response = await createService("removes/product", data);
            set({ product: response.data.data, error: false });
            useToastMessageStore.getState().setMessage(response);
        } catch (error) {
            set({ error: true });
            useToastMessageStore.getState().setError(error);
        } finally {
            set({ loading: false });
        }
    },
    
    deleteProduct: async (url: string) => {
        set({ deleting: true });
        try {
            const response = await deleteService(url); 
            set({ product: response.data.data, error: false });
            useToastMessageStore.getState().setMessage(response);
        } catch (error) {
            set({ error: true });
            useToastMessageStore.getState().setError(error);
        } finally {
            set({ deleting: false });
        }
    },

    deletePrincipal: async (url: string) => {
        set({ deleting: true });
        try {
            const response = await deleteService(url); 
            set({ product: null, error: false });
            useToastMessageStore.getState().setMessage(response);
            await productRemovedStore.getState().loadProducts(`removes?sort=-created_at&included=employee,failures,failures.employee,failures.deleted_by,failures.product&filter[status]=2&perPage=12`);
        } catch (error) {
            set({ error: true });
            useToastMessageStore.getState().setError(error);
        } finally {
            set({ deleting: false });
        }
    },

    savePrincipal: async (url: string) => {
        set({ deleting: true });
        try {
            const response = await updateService(url, { status: 2 }); 
            set({ product: null, error: false });
            useToastMessageStore.getState().setMessage(response);
            await productRemovedStore.getState().loadProducts(`removes?sort=-created_at&included=employee,failures,failures.employee,failures.deleted_by,failures.product&filter[status]=2&perPage=12`);
        } catch (error) {
            set({ error: true });
            useToastMessageStore.getState().setError(error);
        } finally {
            set({ deleting: false });
        }
    },

}));

export default productRemovedStore;

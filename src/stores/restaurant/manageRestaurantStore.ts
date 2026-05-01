import { createService, deleteService, getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import restauranMenuStore from '../orders/restauranMenuStore';
import useToastMessageStore from '../toastMessageStore';
import useTempStorage from '../useTempStorage';


interface manageRestaurantStoreI {
  products: any;
  categories: any;
  category: any;
  options: any;
  workStations: any;
  productAdded: any;
  error: boolean;
  loadingCategories: boolean;
  loadingOptions: boolean;
  loadingWorkStations: boolean;
  loadingProducts: boolean;
  sending: boolean;
  deleting: boolean;
  lastProductUrl: string;
  loadProducts: (url: string) => Promise<void>;
  reloadProducts: () => Promise<void>;
  loadCategories: (url: string) => Promise<void>;
  deleteCategory: (url: string) => Promise<void>;
  loadOptions: (url: string) => Promise<void>;
  deleteOption: (url: string) => Promise<void>;
  loadWorkStations: (url: string) => Promise<void>;
  addProduct: (url: string, data: any) => Promise<boolean>;
  addCategory: (url: string, data: any) => Promise<boolean>;
  addOption: (url: string, data: any) => Promise<boolean>;
  updateProduct: (id: string, data: any) => Promise<boolean>;
  updateProductStatus: (id: string, status: number) => Promise<boolean>;
  deleteRestaurantProduct: (id: string) => Promise<boolean>;
  updateCategory: (id: string, data: any) => Promise<boolean>;
  addModifier: (productOptionsId: string, productId: string) => Promise<any>;
  removeModifier: (assigmentId: string) => Promise<boolean>;
}

const manageRestaurantStore = create<manageRestaurantStoreI>((set) => ({
  products: null,
  categories: null,
  category: null,
  options: null,
  workStations: null,
  productAdded: null,
  error: false,
  loadingCategories: false,
  loadingOptions: false,
  loadingWorkStations: false,
  loadingProducts: false,
  sending: false,
  deleting: false,
  lastProductUrl: '',
  loadProducts: async (url: string) => {
    set({ loadingProducts: true, lastProductUrl: url });
    try {
      const response = await getServices(url);
      set({ products: response.data.data, error: false });
    } catch (error) {
      set({ error: true });
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loadingProducts: false });
    }
  },
  reloadProducts: async () => {
    const { lastProductUrl } = manageRestaurantStore.getState();
    if (lastProductUrl) await manageRestaurantStore.getState().loadProducts(lastProductUrl);
  },
  loadCategories: async (url: string) => {
    set({ loadingCategories: true });
    try {
      const response = await getServices(url);
      set({ categories: response.data.data, error: false });
    } catch (error) {
      set({ error: true });
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loadingCategories: false });
    }
  },
  deleteCategory: async (url: string) => {
    set({ deleting: true });
    try {
      const response = await deleteService(url); 
      restauranMenuStore.getState().clearConfig()
      manageRestaurantStore.getState().loadCategories("categories?sort=created_at&filterWhere[category_type]==2&filterWhere[is_restaurant]==1");
      useToastMessageStore.getState().setMessage(response);
      set({ error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ deleting: false });
    }
  },
  loadOptions: async (url: string) => {
    set({ loadingOptions: true });
    try {
      const response = await getServices(url);
      set({ options: response.data.data, error: false });
    } catch (error) {
      set({ error: true });
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loadingOptions: false });
    }
  },
  deleteOption: async (url: string) => {
    set({ deleting: true });
    try {
      const response = await deleteService(url); 
      manageRestaurantStore.getState().loadOptions("restaurant/options?included=variants");
      restauranMenuStore.getState().clearConfig()
      useToastMessageStore.getState().setMessage(response);
      set({ error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ deleting: false });
    }
  },
  loadWorkStations: async (url: string) => {
    set({ loadingWorkStations: true });
    try {
      const response = await getServices(url);
      set({ workStations: response.data.data, error: false });
    } catch (error) {
      set({ error: true });
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loadingWorkStations: false });
    }
  },

  addProduct: async (url, data) => {
        set({ sending: true });
        try {
            const response = await createService(url, data);
            set({ productAdded: response.data.data, error: false });
            restauranMenuStore.getState().clearConfig()
            useToastMessageStore.getState().setMessage(response);
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            set({ error: true });
            return false;
        } finally {
            set({ sending: false });
        }
    },
  addCategory: async (url, data) => {
        set({ sending: true });
        try {
            const response = await createService(url, data);
            set({ error: false });
            restauranMenuStore.getState().clearConfig()
            manageRestaurantStore.getState().loadCategories("categories?sort=created_at&filterWhere[category_type]==2&filterWhere[is_restaurant]==1");
            useToastMessageStore.getState().setMessage(response);
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            set({ error: true });
            return false;
        } finally {
            set({ sending: false });
        }
    },
  addOption: async (url, data) => {
        set({ sending: true });
        try {
            const response = await createService(url, data);
            set({ error: false });
            restauranMenuStore.getState().clearConfig()
            manageRestaurantStore.getState().loadOptions("restaurant/options?included=variants");
            useToastMessageStore.getState().setMessage(response);
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            set({ error: true });
            return false;
        } finally {
            set({ sending: false });
        }
    },

  updateProduct: async (id, data) => {
    set({ sending: true });
    try {
      const response = await updateService(`restaurant/products/${id}`, data);
      useToastMessageStore.getState().setMessage(response);
      restauranMenuStore.getState().clearConfig()
      await manageRestaurantStore.getState().reloadProducts();
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ sending: false });
    }
  },
  updateProductStatus: async (id, status) => {
    set({ sending: true });
    try {
      const response = await updateService(`restaurant/products/${id}/status`, { status });
      useToastMessageStore.getState().setMessage(response);
      restauranMenuStore.getState().clearConfig()
      await manageRestaurantStore.getState().reloadProducts();
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ sending: false });
    }
  },
  deleteRestaurantProduct: async (id) => {
    set({ deleting: true });
    try {
      const response = await deleteService(`restaurant/products/${id}`);
      useToastMessageStore.getState().setMessage(response);
      await manageRestaurantStore.getState().reloadProducts();
      restauranMenuStore.getState().clearConfig()
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ deleting: false });
    }
  },
  updateCategory: async (id, data) => {
    set({ sending: true });
    try {
      const response = await updateService(`categories/${id}`, data);
      restauranMenuStore.getState().clearConfig()
      manageRestaurantStore.getState().loadCategories("categories?sort=created_at&filterWhere[category_type]==2&filterWhere[is_restaurant]==1");
      useToastMessageStore.getState().setMessage(response);
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ sending: false });
    }
  },
  addModifier: async (productOptionsId, productId) => {
    try {
      await createService('restaurant/options', { product_options_id: productOptionsId, product_id: productId });
      await manageRestaurantStore.getState().reloadProducts();
      const { products } = manageRestaurantStore.getState();
      const list = products?.data ?? products;
      const updatedProduct = list?.find((p: any) => p.id === productId);
      if (updatedProduct) useTempStorage.getState().setElement('menuProduct', updatedProduct);
      restauranMenuStore.getState().clearConfig()
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return null;
    }
  },
  removeModifier: async (assigmentId) => {
    try {
      await deleteService(`restaurant/options/${assigmentId}/product`);
      await manageRestaurantStore.getState().reloadProducts();
      const { products } = manageRestaurantStore.getState();
      const list = products?.data ?? products;
      const productId = useTempStorage.getState().getElement('menuProduct')?.id;
      const updatedProduct = list?.find((p: any) => p.id === productId);
      if (updatedProduct) useTempStorage.getState().setElement('menuProduct', updatedProduct);
      restauranMenuStore.getState().clearConfig()
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    }
  },
}));

export default manageRestaurantStore;

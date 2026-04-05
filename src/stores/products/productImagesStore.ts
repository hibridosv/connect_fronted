import { createService, deleteService, getServices } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface ProductImagesStoreI {
  images: any[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  loadImages: (productId: string) => Promise<void>;
  uploadImage: (data: FormData, productId: string) => Promise<boolean>;
  deleteImage: (imageId: string, productId: string) => Promise<void>;
}

const productImagesStore = create<ProductImagesStoreI>((set, get) => ({
  images: [],
  loading: false,
  saving: false,
  deleting: false,

  loadImages: async (productId: string) => {
    set({ loading: true });
    try {
      const response = await getServices(`images/${productId}`);
      set({ images: response.data.data ?? response.data ?? [] });
    } catch {
      useToastMessageStore.getState().setError({ message: 'Error al cargar imágenes' });
    } finally {
      set({ loading: false });
    }
  },

  uploadImage: async (data: FormData, productId: string) => {
    set({ saving: true });
    try {
      const response = await createService('images', data);
      useToastMessageStore.getState().setMessage(response);
      set({ images: response.data.data ?? response.data ?? [] });
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ saving: false });
    }
  },

  deleteImage: async (imageId: string, productId: string) => {
    set({ deleting: true });
    try {
      const response = await deleteService(`images/${imageId}`);
      useToastMessageStore.getState().setMessage(response);
      set({ images: response.data.data ?? response.data ?? [] });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ deleting: false });
    }
  },
}));

export default productImagesStore;

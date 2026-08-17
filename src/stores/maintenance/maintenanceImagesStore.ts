import { createService, deleteService, getServices } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface MaintenanceImagesStoreState {
  images: any[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  loadImages: (maintenanceId: string) => Promise<void>;
  uploadImage: (data: FormData) => Promise<boolean>;
  deleteImage: (imageId: string) => Promise<void>;
  clearImages: () => void;
}

const useMaintenanceImagesStore = create<MaintenanceImagesStoreState>((set) => ({
  images: [],
  loading: false,
  saving: false,
  deleting: false,

  loadImages: async (maintenanceId: string) => {
    set({ loading: true });
    try {
      const response = await getServices(`maintenance-images/${maintenanceId}`);
      set({ images: response.data.data ?? [] });
    } catch (error: any) {
      set({ images: [] });
      if (error?.response?.status !== 404) {
        useToastMessageStore.getState().setError(error);
      }
    } finally {
      set({ loading: false });
    }
  },

  uploadImage: async (data: FormData) => {
    set({ saving: true });
    try {
      const response = await createService('maintenance-images', data);
      useToastMessageStore.getState().setMessage(response);
      set({ images: response.data.data ?? [] });
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ saving: false });
    }
  },

  deleteImage: async (imageId: string) => {
    set({ deleting: true });
    try {
      const response = await deleteService(`maintenance-images/${imageId}`);
      useToastMessageStore.getState().setMessage(response);
      set({ images: response.data.data ?? [] });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ deleting: false });
    }
  },

  clearImages: () => set({ images: [] }),
}));

export default useMaintenanceImagesStore;

import { createService, deleteService, getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from './toastMessageStore';


interface UserStoreProps {
  users: any;
  user: any;
  error: boolean;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  loadUsers: (url: string) => Promise<void>;
  createUser: (data: any) => Promise<boolean>;
  deleteUser: (url: string) => Promise<boolean>;
  updateUserName: (url: string, data: any) => Promise<boolean>;
  updateUserPhone: (url: string, data: any) => Promise<boolean>;
  updateUserPassword: (url: string, data: any) => Promise<boolean>;
  updateUserRole: (data: any) => Promise<boolean>;
}

const useUserStore = create<UserStoreProps>((set) => ({
  users: null,
  user: null,
  error: false,
  loading: false,
  saving: false,
  deleting: false,

  loadUsers: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ users: response.data.data, error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  createUser: async (data: any) => {
    set({ saving: true });
    try {
      const response = await createService('users', data);
      useToastMessageStore.getState().setMessage(response);
      set({ error: false });
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  deleteUser: async (url: string) => {
    set({ deleting: true });
    try {
      const response = await deleteService(url);
      useToastMessageStore.getState().setMessage(response);
      set({ error: false });
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return false;
    } finally {
      set({ deleting: false });
    }
  },

  updateUserName: async (url: string, data: any) => {
    set({ saving: true });
    try {
      const response = await updateService(url, data);
      useToastMessageStore.getState().setMessage(response);
      set({ error: false });
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  updateUserPhone: async (url: string, data: any) => {
    set({ saving: true });
    try {
      const response = await updateService(url, data);
      useToastMessageStore.getState().setMessage(response);
      set({ error: false });
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  updateUserPassword: async (url: string, data: any) => {
    set({ saving: true });
    try {
      const response = await updateService(url, data);
      useToastMessageStore.getState().setMessage(response);
      set({ error: false });
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  updateUserRole: async (data: any) => {
    set({ saving: true });
    try {
      const response = await createService('roles/update', data);
      useToastMessageStore.getState().setMessage(response);
      set({ error: false });
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
      return false;
    } finally {
      set({ saving: false });
    }
  },

}));

export default useUserStore;

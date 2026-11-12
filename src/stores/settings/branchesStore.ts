import { createService, getServices } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface BranchesStoreI {
  remoteUrls: any;
  tenants: any;
  linkedSystems: any[];
  loading: boolean;
  loadingTenants: boolean;
  loadingLinked: boolean;
  sending: boolean;
  error: boolean;

  loadRemoteUrls: (email: string) => Promise<void>;
  loadTenants: () => Promise<void>;
  loadLinked: () => Promise<void>;
  linkTenant: (tenantId: number) => Promise<boolean>;
}

const branchesStore = create<BranchesStoreI>((set) => ({
  remoteUrls: null,
  tenants: null,
  linkedSystems: [],
  loading: false,
  loadingTenants: false,
  loadingLinked: false,
  sending: false,
  error: false,

  loadRemoteUrls: async (email: string) => {
    set({ loading: true });
    try {
      const response = await getServices(`remoteurl/${email}`);
      if (response.data) {
        set({ remoteUrls: response.data, error: false });
      }
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  loadTenants: async () => {
    set({ loadingTenants: true });
    try {
      const response = await getServices('tenants');
      if (response.data) {
        set({ tenants: response.data });
      }
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loadingTenants: false });
    }
  },

  // Sistemas ya vinculados con el actual
  loadLinked: async () => {
    set({ loadingLinked: true });
    try {
      const response = await getServices('tenants/linked');
      set({ linkedSystems: response.data?.data ?? [] });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loadingLinked: false });
    }
  },

  linkTenant: async (tenantId: number) => {
    set({ sending: true });
    try {
      const response = await createService('tenants/linked', { to_tenant_id: tenantId });
        useToastMessageStore.getState().setMessage(response);
        return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ sending: false });
    }
  },
}));

export default branchesStore;

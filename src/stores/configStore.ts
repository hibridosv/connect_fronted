import { CashDrawer } from '@/interfaces/cashdrawers';
import { User } from '@/interfaces/user';
import { getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import useToastMessageStore from './toastMessageStore';

interface ConfigStoreState {
  configurations: any;
  activeConfig: any;
  system: any;
  payMethods: any;
  permission: any;
  user: User | null;
  invoiceExist: boolean;
  isInvoiceExpires: number;
  role: string | null;
  cashdrawer: CashDrawer | null;
  client: any | null;
  tenant: any;
  invoiceTypes: any;
  hasLinked: boolean;
  isLoaded: boolean;
  loading: boolean;
  error: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  loadConfig: () => Promise<void>;
  updateConfiguration: (id: number, active: number) => Promise<void>;
  setActiveConfig: (activeConfig: any) => void;
  clearConfig: () => void;
}

const useConfigStore = create(
  persist<ConfigStoreState & { _hasHydrated: boolean; setHasHydrated: (v: boolean) => void }>(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),
      configurations: null,
      activeConfig: null,
      system: null,
      payMethods: null,
      permission: null,
      user: null,
      invoiceExist: false,
      isInvoiceExpires: 0,
      role: null,
      cashdrawer: null,
      client: null,
      tenant: null,
      invoiceTypes: null,
      hasLinked: false,
      isLoaded: false,
      loading: false,
      error: false,

      loadConfig: async () => {
        set({ loading: true });
        try {
          const response = await getServices('config/find');
          let data = response.data.data;
          set({ configurations: data.configurations });
          set({ system: data.system });
          set({ payMethods: data.payMethods });
          set({ permission: data.permission });
          set({ user: data.user });
          set({ invoiceExist: data.invoiceExist });
          set({ isInvoiceExpires: data.isInvoiceExpires });
          set({ role: data.role });
          set({ cashdrawer: data.cashdrawer });
          set({ client: data.client });
          set({ tenant: data.tenant });
          set({ invoiceTypes: data.invoiceTypes });
          set({ hasLinked: data.hasLinked });
          set({ isLoaded: true });
          set({ error: false });
        } catch (error) {
          useToastMessageStore.getState().setError(error);
          set({ error: true, isLoaded: false });
        } finally {
          set({ loading: false });
        }
      },

      updateConfiguration: async (id: number, active: number) => {
        try {
          const response = await updateService(`config/${id}`, { active });
          set({ configurations: response.data.data });
          useToastMessageStore.getState().setMessage('Configuración actualizada');
        } catch (error) {
          useToastMessageStore.getState().setError(error);
        }
      },

      setActiveConfig: (activeConfig: any) => {
        set({ activeConfig });
      },

      clearConfig: () => {
        set({ 
            configurations: null,
            activeConfig: null,
            system: null,
            payMethods: null,
            permission: null,
            user: null,
            invoiceExist: false,
            isInvoiceExpires: 0,
            role: null,
            cashdrawer: null,
            client: null,
            tenant: null,
            invoiceTypes: null,
            hasLinked: false,
            isLoaded: false,
            loading: false,
            error: false,
         });
      },

    }),
    {
      name: 'config-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);




export default useConfigStore;

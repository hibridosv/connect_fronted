import { CashDrawer } from '@/interfaces/cashdrawers';
import { User } from '@/interfaces/user';
import { extractActiveFeature } from '@/lib/config/config';
import { encryptedStorage } from '@/lib/encryptedStorage';
import { getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import useToastMessageStore from './toastMessageStore';

export const MAX_CONFIG_RETRIES = 3

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
  retryCount: number;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  loadConfig: () => Promise<void>;
  updateConfiguration: (id: number, active: number) => Promise<void>;
  clearConfig: () => void;
}

type PersistedConfigState = Pick<ConfigStoreState,
  'configurations' | 'activeConfig' | 'system' | 'payMethods' | 'permission' |
  'user' | 'invoiceExist' | 'isInvoiceExpires' | 'role' | 'cashdrawer' |
  'client' | 'tenant' | 'invoiceTypes' | 'hasLinked'
>;

const useConfigStore = create(
  persist<ConfigStoreState, [], [], PersistedConfigState>(
    (set, get) => ({
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
      retryCount: 0,

      loadConfig: async () => {
        const { loading, configurations, retryCount } = get()
        if (loading || configurations !== null || retryCount >= MAX_CONFIG_RETRIES) return
        set({ loading: true, retryCount: retryCount + 1 });
        try {
          const response = await getServices('config/find');
          let data = response.data.data;
          let extracted = extractActiveFeature(data.configurations)
          set({ configurations: data.configurations });
          set({ activeConfig: extracted });
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
          let extracted = extractActiveFeature(response.data.data)
          set({ configurations: response.data.data });
          set({ activeConfig: extracted });
          useToastMessageStore.getState().setMessage({ message: 'Configuración actualizada'});
        } catch (error) {
          useToastMessageStore.getState().setError(error);
        }
      },

      clearConfig: () => {
        set({
          _hasHydrated: false,
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
          retryCount: 0,
         });
      },

    }),
    {
      name: 'config-storage',
      storage: createJSONStorage(() => encryptedStorage),
      partialize: (state): PersistedConfigState => ({
        configurations: state.configurations,
        activeConfig: state.activeConfig,
        system: state.system,
        payMethods: state.payMethods,
        permission: state.permission,
        user: state.user,
        invoiceExist: state.invoiceExist,
        isInvoiceExpires: state.isInvoiceExpires,
        role: state.role,
        cashdrawer: state.cashdrawer,
        client: state.client,
        tenant: state.tenant,
        invoiceTypes: state.invoiceTypes,
        hasLinked: state.hasLinked,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);




export default useConfigStore;
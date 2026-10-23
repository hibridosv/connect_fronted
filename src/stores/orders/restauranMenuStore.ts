import { getServices } from '@/services/services';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import useToastMessageStore from '../toastMessageStore';

interface restauranMenuI {
  restaurantMenu: any;
  isLoaded: boolean;
  loading: boolean;
  error: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  getRestauranMenu: (url: string) => Promise<void>;
  invalidate: () => void;
  clearConfig: () => void;
}

const restauranMenuStore = create(
  persist<restauranMenuI & { _hasHydrated: boolean; setHasHydrated: (v: boolean) => void }>(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),
      restaurantMenu: null,
      isLoaded: false,
      loading: false,
      error: false,

      getRestauranMenu: async (url) => {
        set({ loading: true });
        try {
          const response = await getServices(url);
          let data = response.data.data;
          set({ restaurantMenu: data, isLoaded: true, error: false });
        } catch (error) {
          useToastMessageStore.getState().setError(error);
          set({ error: true, isLoaded: false });
        } finally {
          set({ loading: false });
        }
      },


    // Marca el menu como desactualizado sin borrarlo: se sigue mostrando y useMenuLogic lo vuelve a descargar
    invalidate: () => {
        set({ isLoaded: false });
      },

    clearConfig: () => {
        set({ 
            restaurantMenu: null,
            isLoaded: false,
            loading: false,
            error: false,
         });
      },

    }),
    {
      name: 'menu-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);




export default restauranMenuStore;

import { Contact } from '@/interfaces/contact';
import { getServices } from '@/services/services';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DefaultContactStoreState {
  defaultContact: Contact | null;
  loading: boolean;
  loadDefaultContact: () => Promise<void>;
}

const useDefaultContactStore = create<DefaultContactStoreState>()(
  persist(
    (set, get) => ({
      defaultContact: null,
      loading: false,

      loadDefaultContact: async () => {
        const { defaultContact, loading } = get();
        if (defaultContact !== null || loading) return;
        set({ loading: true });
        try {
          const response = await getServices(
            'contacts?filterWhere[status]==1&filterWhere[is_client]==1&filterWhere[is_provider]==1&filterWhere[is_employee]==1&filterWhere[is_referred]==1&perPage=1&page=1'
          );
          const contacts = response.data.data?.data;
          if (contacts && contacts.length > 0) {
            set({ defaultContact: contacts[0] });
          }
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'default-contact-storage',
    }
  )
);

export default useDefaultContactStore;

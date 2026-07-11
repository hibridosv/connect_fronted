import { Notification } from '@/interfaces/notification';
import { createService, getServices } from '@/services/services';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import useToastMessageStore from './toastMessageStore';

interface NotificationStoreState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  saving: boolean;
  lastCountLoadedAt: number | null;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  loadUnreadCount: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

type PersistedNotificationState = Pick<NotificationStoreState, 'unreadCount' | 'lastCountLoadedAt'>;

const useNotificationStore = create(
  persist<NotificationStoreState, [], [], PersistedNotificationState>(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      loading: false,
      saving: false,
      lastCountLoadedAt: null,
      _hasHydrated: false,
      setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),

      loadUnreadCount: async () => {
        try {
          const response = await getServices('notifications/unread-count');
          set({ unreadCount: response.data.data.count, lastCountLoadedAt: Date.now() });
        } catch {
          // el badge no es crítico, falla silenciosamente
        }
      },

  loadNotifications: async () => {
    set({ loading: true });
    try {
      const response = await getServices('notifications');
      const data = response.data.data;
      set({ notifications: Array.isArray(data) ? data : [] });
    } catch {
      set({ notifications: [] });
    } finally {
      set({ loading: false });
    }
  },

  markRead: async (id: string) => {
    set({ saving: true });
    try {
      await createService(`notifications/${id}/read`, {});
      const { notifications, unreadCount } = get();
      set({
        notifications: notifications.filter((notification) => notification.id !== id),
        unreadCount: Math.max(0, unreadCount - 1),
      });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ saving: false });
    }
  },

  markAllRead: async () => {
    set({ saving: true });
    try {
      await createService('notifications/read-all', {});
      set({ notifications: [], unreadCount: 0 });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ saving: false });
    }
  },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedNotificationState => ({
        unreadCount: state.unreadCount,
        lastCountLoadedAt: state.lastCountLoadedAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useNotificationStore;

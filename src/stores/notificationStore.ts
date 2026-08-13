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
  isInitialized: boolean;
  setInitialized: () => void;
  resetInitialized: () => void;
  loadUnreadCount: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

type PersistedNotificationState = Pick<NotificationStoreState, 'unreadCount' | 'isInitialized'>;

const useNotificationStore = create(
  persist<NotificationStoreState, [], [], PersistedNotificationState>(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      loading: false,
      saving: false,
      isInitialized: false,

      setInitialized: () => set({ isInitialized: true }),
      resetInitialized: () => set({ isInitialized: false, unreadCount: 0, notifications: [] }),

      loadUnreadCount: async () => {
        try {
          const response = await getServices('notifications/unread-count');
          set({ unreadCount: response.data.data.count });
        } catch {
          // el badge no es crítico, falla silenciosamente
        }
      },

  loadNotifications: async () => {
    set({ loading: true });
    try {
      const response = await getServices('notifications/all?perPage=5');
      const data = response.data.data?.data;
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
      const target = notifications.find((notification) => notification.id === id);
      set({
        notifications: notifications.map((notification) =>
          notification.id === id ? { ...notification, is_read: true } : notification
        ),
        unreadCount: target && !target.is_read ? Math.max(0, unreadCount - 1) : unreadCount,
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
      const { notifications } = get();
      set({
        notifications: notifications.map((notification) => ({ ...notification, is_read: true })),
        unreadCount: 0,
      });
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
        isInitialized: state.isInitialized,
      }),
    }
  )
);

export default useNotificationStore;

'use client';

import useNotificationStore from '@/stores/notificationStore';
import { useEffect, useRef, useState } from 'react';

export const useNotificationsLogic = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    notifications,
    unreadCount,
    loading,
    saving,
    loadUnreadCount,
    loadNotifications,
    markRead,
    markAllRead,
  } = useNotificationStore();

  useEffect(() => {
    loadUnreadCount();

    intervalRef.current = setInterval(() => {
      loadUnreadCount();
    }, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openPanel = () => {
    setIsPanelOpen(true);
    loadNotifications();
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  return {
    notifications,
    unreadCount,
    loading,
    saving,
    isPanelOpen,
    openPanel,
    closePanel,
    markRead,
    markAllRead,
  };
};

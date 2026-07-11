'use client';

import useConfigStore from '@/stores/configStore';
import useNotificationStore from '@/stores/notificationStore';
import { useEffect, useState } from 'react';
import useReverb from '../useReverb';

export const useNotificationsLogic = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { tenant, activeConfig } = useConfigStore();
  const isPushNotifications = activeConfig && activeConfig.includes('notifications');
  const { data: pusherEventData, random: pusherRandom } = useReverb(`${tenant?.id}-channel-notify`, 'ReverbNotify', isPushNotifications);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (!pusherEventData) return;
    loadUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pusherEventData, pusherRandom]);

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

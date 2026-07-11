'use client';

import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import { useNotificationsLogic } from '@/hooks/notifications/useNotificationsLogic';
import { useRelativeTime } from '@/hooks/useRelativeTime';
import { Notification } from '@/interfaces/notification';
import { useState } from 'react';
import { IoNotifications, IoNotificationsOutline } from 'react-icons/io5';

const importanceStyles: Record<Notification['importance'], { label: string; panelClasses: string; dotClass: string }> = {
  info:        { label: 'Info',          panelClasses: 'border-l-2 border-info bg-info/5',        dotClass: 'bg-info' },
  warning:     { label: 'Aviso',         panelClasses: 'border-l-2 border-warning bg-warning/5',  dotClass: 'bg-warning' },
  critical:    { label: 'Crítico',       panelClasses: 'border-l-2 border-danger bg-danger/5',    dotClass: 'bg-danger' },
  maintenance: { label: 'Mantenimiento', panelClasses: 'border-l-2 border-text-muted bg-bg-subtle', dotClass: 'bg-text-muted' },
};

const NotificationRelativeTime = ({ timestamp }: { timestamp: string }) => {
  const relativeTime = useRelativeTime(timestamp);
  return <span className="text-[11px] text-text-muted shrink-0">{relativeTime}</span>;
};

export const NotificationBell = () => {
  const { notifications, unreadCount, loading, saving, isPanelOpen, openPanel, closePanel, markRead, markAllRead } = useNotificationsLogic();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleNotificationClick = async (notification: Notification) => {
    closePanel();
    setSelectedNotification(notification);
    await markRead(notification.id);
  };

  const handleCloseModal = () => setSelectedNotification(null);

  const hasUnread = unreadCount > 0;

  return (
    <div className="relative">
      <button
        onClick={isPanelOpen ? closePanel : openPanel}
        className="relative text-text-inverted hover:text-secondary clickeable"
        title="Notificaciones"
      >
        {hasUnread
          ? <IoNotifications size={22} className="sm:w-7 sm:h-7" />
          : <IoNotificationsOutline size={22} className="sm:w-7 sm:h-7" />
        }
        {hasUnread && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-0.5 flex items-center justify-center bg-danger text-white text-[10px] font-bold rounded-full leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isPanelOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={closePanel} />
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-bg-content border border-bg-subtle rounded-lg shadow-lg z-50 flex flex-col max-h-[480px]">

            <div className="flex items-center justify-between px-4 py-3 border-b border-bg-subtle flex-shrink-0">
              <span className="font-semibold text-text-base text-sm uppercase tracking-wide">
                Notificaciones
              </span>
              {notifications.length > 0 && (
                <button
                  onClick={markAllRead}
                  disabled={saving}
                  className="text-xs text-info hover:underline disabled:opacity-50 transition-opacity"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1">
              {loading && (
                <div className="p-6 text-center text-text-muted text-sm">Cargando...</div>
              )}
              {!loading && notifications.length === 0 && (
                <div className="p-8 text-center text-text-muted text-sm">
                  Sin notificaciones pendientes
                </div>
              )}
              {!loading && notifications.map((notification) => {
                const style = importanceStyles[notification.importance] ?? importanceStyles.info;
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left px-4 py-3 flex flex-col gap-1 hover:bg-bg-subtle/60 transition-colors duration-150 border-b border-bg-subtle/50 ${style.panelClasses}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${style.dotClass}`} />
                      <span className="font-semibold text-sm text-text-base leading-snug flex-1">
                        {notification.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-[10px] uppercase font-medium text-text-muted tracking-wide">
                        {style.label}
                      </span>
                      <NotificationRelativeTime timestamp={notification.created_at} />
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </>
      )}

      <Modal
        show={selectedNotification !== null}
        onClose={handleCloseModal}
        headerTitle={selectedNotification?.title ?? ''}
        size="xl2"
      >
        <Modal.Body>
          {selectedNotification && (
            <div
              className="text-text-base [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:mb-1 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_li]:mb-1 [&_strong]:font-semibold [&_a]:text-info [&_a]:underline [&_a]:hover:opacity-80"
              dangerouslySetInnerHTML={{ __html: selectedNotification.content }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button preset={Preset.close} onClick={handleCloseModal} disabled={false} />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

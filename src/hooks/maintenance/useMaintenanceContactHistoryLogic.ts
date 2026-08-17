'use client'
import useMaintenanceStore from '@/stores/maintenance/maintenanceStore';
import { useEffect } from 'react';

export function useMaintenanceContactHistoryLogic(contactId: string | undefined) {
  const { loadMaintenances, maintenances, loading } = useMaintenanceStore();

  useEffect(() => {
    if (!contactId) return;
    loadMaintenances(`maintenances?sort=-received_at&included=type&filterWhere[contact_id]==${contactId}&perPage=5&page=1`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  return { history: contactId ? (maintenances?.data ?? []) : [], loading };
}

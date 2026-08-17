'use client'
import useMaintenanceStore from '@/stores/maintenance/maintenanceStore';
import { useEffect } from 'react';

export function useMaintenanceDetailsLogic(id: string) {
  const { loadMaintenance, maintenance, loading, saving, updatingStatus, updateMaintenance, updateMaintenanceStatus, clearMaintenance } = useMaintenanceStore();

  useEffect(() => {
    if (id) {
      loadMaintenance(`maintenances/${id}?included=type,contact,employee,order,images,statusHistory`);
    }
    return () => clearMaintenance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const reload = () => {
    if (id) loadMaintenance(`maintenances/${id}?included=type,contact,employee,order,images,statusHistory`);
  };

  return { maintenance, loading, saving, updatingStatus, updateMaintenance, updateMaintenanceStatus, reload };
}

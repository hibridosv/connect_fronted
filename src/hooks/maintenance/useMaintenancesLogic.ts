'use client'
import useMaintenanceStore from '@/stores/maintenance/maintenanceStore';
import { useEffect, useState } from 'react';

export function useMaintenancesLogic(currentPage: string, searchTerm: string, status: number | 0, typeId: string) {
  const { loadMaintenances, maintenances, loading } = useMaintenanceStore();
  const [prevKey, setPrevKey] = useState('');

  useEffect(() => {
    const statusFilter = status ? `&filterWhere[status]==${status}` : '';
    const typeFilter = typeId ? `&filterWhere[maintenance_type_id]==${typeId}` : '';
    const key = `${searchTerm}|${status}|${typeId}`;

    if (key !== prevKey) {
      setPrevKey(key);
      loadMaintenances(`maintenances?sort=-created_at&included=type,contact,employee&perPage=15&page=1${statusFilter}${typeFilter}${searchTerm}`);
    } else {
      loadMaintenances(`maintenances?sort=-created_at&included=type,contact,employee&perPage=15${currentPage}${statusFilter}${typeFilter}${searchTerm}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, status, typeId]);

  return { maintenances, loading };
}

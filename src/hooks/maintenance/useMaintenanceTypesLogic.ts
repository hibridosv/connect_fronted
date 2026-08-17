'use client'
import useMaintenanceTypesStore from '@/stores/maintenance/maintenanceTypesStore';
import { useEffect } from 'react';

export function useMaintenanceTypesLogic(searchTerm: string) {
  const { loadTypes, types, loading } = useMaintenanceTypesStore();

  useEffect(() => {
    loadTypes(`maintenance-types?sort=name&filterWhere[status]==1${searchTerm}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return { types, loading };
}

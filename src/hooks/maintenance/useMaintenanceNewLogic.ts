'use client'
import useMaintenanceStore from '@/stores/maintenance/maintenanceStore';
import useMaintenanceTypesStore from '@/stores/maintenance/maintenanceTypesStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useMaintenanceNewLogic() {
  const router = useRouter();
  const { createMaintenance, saving } = useMaintenanceStore();
  const { loadTypes, types, loading: loadingTypes } = useMaintenanceTypesStore();

  useEffect(() => {
    loadTypes('maintenance-types?sort=name&filterWhere[status]==1');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (payload: any) => {
    const maintenance = await createMaintenance(payload);
    if (maintenance) {
      router.push(`/maintenance/${maintenance.id}`);
    }
    return maintenance;
  };

  return { types, loadingTypes, onSubmit, saving };
}

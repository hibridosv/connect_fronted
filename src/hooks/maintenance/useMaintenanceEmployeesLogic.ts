'use client'
import useUserStore from '@/stores/UserStore';
import { useEffect } from 'react';

export function useMaintenanceEmployeesLogic() {
  const { loadUsers, users, loading } = useUserStore();

  useEffect(() => {
    loadUsers('users?filterWhere[is_visible]==1&filterWhere[status]==1&perPage=200');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { employees: users?.data ?? users ?? [], loading };
}

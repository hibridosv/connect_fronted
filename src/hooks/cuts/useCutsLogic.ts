'use client'
import useCutStore from '@/stores/cashdrawer/cutStore';
import useConfigStore from '@/stores/configStore';
import { useEffect } from 'react';

export function useCutsLogic(currentPage: any, showAll: boolean) {
  const { loadCuts } = useCutStore()
  const { user } = useConfigStore();

  
  useEffect(() => {
      const employeeFilter = !showAll && user?.id ? `&filterWhere[employee_id]==${user.id}` : ''
      const url = `cuts?included=employee,cashdrawer${employeeFilter}&sort=-created_at&perPage=10${currentPage}`
      loadCuts(url)
  }, [loadCuts, currentPage, showAll, user])

}

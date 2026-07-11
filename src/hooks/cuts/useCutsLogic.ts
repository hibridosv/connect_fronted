'use client'
import useCutStore from '@/stores/cashdrawer/cutStore';
import useConfigStore from '@/stores/configStore';
import { useEffect } from 'react';

export function useCutsLogic(currentPage: any, showAll: boolean) {
  const { loadCuts } = useCutStore()
  const { user } = useConfigStore();

  
  useEffect(() => {
      const url = `cuts?included=employee,cashdrawer${!showAll && user?.id && `&filterWhere[employee_id]==${user.id}`}&sort=-created_at&perPage=10${currentPage}`
      loadCuts(url)
  }, [loadCuts, currentPage, showAll, user])

}

'use client'
import useConfigStore from '@/stores/configStore';
import adjustStore from '@/stores/tools/adjustStore';
import { useEffect } from 'react';

export function useAjustmentLogic(currentPage?: any, initialLoad: boolean = false) {
  const { loadAdjustments, error, manageAdjustment, loadActiveAdjustment } = adjustStore()
  const { user } = useConfigStore();

  useEffect(() => {
    if (initialLoad) {
        loadAdjustments(`tools/adjust?sort=-created_at&filterWhere[status]==1&perPage=20${currentPage}`)
    }
  }, [loadAdjustments, currentPage, initialLoad])

  useEffect(() => {
    if (initialLoad) loadActiveAdjustment(user?.id)
  }, [loadActiveAdjustment, user, initialLoad])


  const start = async () => {
      try {
        await manageAdjustment('tools/adjust', {status: 1});
        // si otro usuario lo inicio antes, muestra quien
        await loadActiveAdjustment(user?.id);
      } catch (error) {
        console.error(error);
      }
    }

  const end = async () => {
      try {
        await manageAdjustment('tools/adjust/finish', {status: 2});
        await loadAdjustments(`tools/adjust?sort=-created_at&filterWhere[status]==1&perPage=20${currentPage}`);
      } catch (error) {
        console.error(error);
      }
  }



  return {  start, end };

}

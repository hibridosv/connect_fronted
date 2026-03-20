'use client'
import commissionsStore from '@/stores/tools/commissionsStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect } from 'react';
import { usePagination } from '../usePagination';

export function useCommissionsLogic() {
  const {
    activeCommission,
    loadCommissions,
    loadActiveCommission,
    createCommission,
    cancelCommission,
    saveCommission,
    deleteCommission,
  } = commissionsStore();
  const { currentPage, handlePageNumber } = usePagination('&page=1');
  const { getElement } = useTempStorage();

  const contactSelected = getElement('searchReferred');
  const contactFilter = contactSelected ? `filterWhere[referred_id]==${contactSelected.id}&` : '';
  const url = `tools/commissions?${contactFilter}filterWhere[type]==1&included=employee_deleted,referred,linked.product.order&sort=-created_at&perPage=25${currentPage}`;

  useEffect(() => {
    const fetchData = async () => {
      const hasActive = await loadActiveCommission();
      if (!hasActive) {
        loadCommissions(url);
      }
    };
    fetchData();
  }, [url, loadActiveCommission, loadCommissions]);


  const handleCreateCommission = async () => {
    const success = await createCommission({ "userId" : contactSelected?.id, "type" : 1 });
  };



  const handleCancelCommission = async () => {
    if (!activeCommission) return;
    const success = await cancelCommission(activeCommission.id, activeCommission.referred_id);
    if (success) {
      await loadCommissions(url);
    }
  };

  const handleSaveCommission = async () => {
    if (!activeCommission) return;
    const success = await saveCommission(activeCommission.id, activeCommission.referred_id);
    if (success) {
      await loadCommissions(url);
    }
  };

  const handelDeleteCommission = async (id: string) => {
    const success = await deleteCommission(id);
    if (success) {
      await loadCommissions(url);
    }
  };




  return {
    contactSelected,
    handleCancelCommission,
    handleSaveCommission,
    handleCreateCommission,
    currentPage,
    handlePageNumber,
    handelDeleteCommission,
    url
  };
}

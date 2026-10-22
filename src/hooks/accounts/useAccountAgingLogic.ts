'use client'
import accountReceivableStore from '@/stores/accounts/accountReceivableStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect } from 'react';

export function useAccountAgingLogic() {
  const { aging, loading, loadAging } = accountReceivableStore();
  const { getElement } = useTempStorage();
  const contactSelected = getElement('clientSelectedBySearch');

  useEffect(() => {
    loadAging(`accounts/receivable/aging${contactSelected?.id ? `?client=${contactSelected.id}` : ''}`);
  }, [loadAging, contactSelected]);

  const downloadHref = `route=download.excel.creditsAging${contactSelected?.id ? `&client=${contactSelected.id}` : ''}`;

  return { aging, loading, contactSelected, downloadHref };
}

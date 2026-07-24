'use client'
import useModalStore from '@/stores/modalStorage';
import adjustStore from '@/stores/tools/adjustStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect, useState } from 'react';

export function useAjustmentProductsLogic(currentPage?: any, searchTerm?: any, initialLoad: boolean = false) {
  const { loadDetails, sendAdjustment: send, error } = adjustStore()
  const [searchTermNew, setSearchTermNew] = useState("");
  const { closeModal } = useModalStore();
  const { getElement } = useTempStorage();
  const record = getElement('setAdjustment') || null;


  useEffect(() => {
    if (initialLoad) {
        if (searchTerm != searchTermNew) {
          setSearchTermNew(searchTerm);
          loadDetails(`tools/adjust/products?sort=-cod&filterWhere[status]==1&perPage=25&page=1${searchTerm}`)
        } else {
           loadDetails(`tools/adjust/products?sort=-cod&filterWhere[status]==1&perPage=25${currentPage}${searchTerm}`)
        }
    }
  }, [loadDetails, currentPage, searchTerm, searchTermNew, initialLoad])


    const sendAdjustment = async(product: any) =>{
      if (!product.id) {
        let stablished: number = Number(product.stablished);
        product = record;
        product.stablished = stablished;
      } else {
        product.stablished = Number(product.quantity)
      }
      try {
        const success = await send('tools/adjust/update', product);
          if (success) {
            loadDetails(`tools/adjust/products?sort=-cod&filterWhere[status]==1&perPage=25&page=1${searchTerm}`)
            closeModal('setAdjustment');
          }
      } catch (error) {
        console.error(error);
      } 
    }

  return { sendAdjustment };

}

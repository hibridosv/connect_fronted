'use client'
import useModalStore from '@/stores/modalStorage';
import adjustStore from '@/stores/tools/adjustStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect, useRef } from 'react';

export function useAjustmentProductsLogic(currentPage?: any, searchTerm?: any, initialLoad: boolean = false) {
  const { loadDetails, sendAdjustment: send, error } = adjustStore()
  // ultima busqueda pedida; es un ref (no estado) para no volver a disparar el efecto
  const lastQuery = useRef<string | null>(null);
  const { closeModal } = useModalStore();
  const { getElement } = useTempStorage();
  const record = getElement('setAdjustment') || null;


  useEffect(() => {
    if (initialLoad) {
        const query = String(searchTerm);
        // busqueda nueva: vuelve a la pagina 1
        const page = query !== lastQuery.current ? "&page=1" : currentPage;
        lastQuery.current = query;
        loadDetails(`tools/adjust/products?sort=-cod&filterWhere[status]==1&perPage=25${page}${searchTerm}`)
    }
  }, [loadDetails, currentPage, searchTerm, initialLoad])


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

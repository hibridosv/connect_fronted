'use client'
import useProductStore from '@/stores/products/productStore';
import { useEffect, useRef } from 'react';

export function useLowStockLogic(currentPage: any, searchTerm: string, sortBy: string) {
  const { loadProducts } = useProductStore()
  // ultima busqueda pedida; es un ref (no estado) para no volver a disparar el efecto
  const lastQuery = useRef<string | null>(null);

  useEffect(() => {
        const query = `${searchTerm}|${sortBy}`;
        // busqueda u orden nuevo: vuelve a la pagina 1
        const page = query !== lastQuery.current ? "&page=1" : currentPage;
        lastQuery.current = query;
        loadProducts(`lowstock?sort=${sortBy}&filterWhere[is_restaurant]==0&included=prices,category,quantityUnit,provider,brand,location&perPage=15${page}${searchTerm}`)
  }, [loadProducts, currentPage, searchTerm, sortBy])

}

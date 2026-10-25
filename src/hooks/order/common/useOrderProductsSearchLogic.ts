'use client'
import useProductStore from '@/stores/products/productStore';
import { useEffect, useRef } from 'react';

export function useOrderProductsSearchLogic(currentPage: any, searchTerm: string, sortBy: string) {
  const { loadProducts } = useProductStore()
  // ultima busqueda pedida; es un ref (no estado) para no volver a disparar el efecto
  const lastQuery = useRef("");

  useEffect(() => {
        if (searchTerm == "") {
          // al limpiar el buscador se puede volver a pedir la misma busqueda
          lastQuery.current = "";
          return;
        }
        const query = `${searchTerm}|${sortBy}`;
        if (query != lastQuery.current) {
          lastQuery.current = query;
          loadProducts(`products?sort=${sortBy}&filterWhere[status]==1&filterWhere[is_restaurant]==0&included=prices&perPage=50&page=1${searchTerm}`)
        }
  }, [loadProducts, searchTerm, sortBy])

}

'use client'
import productSearchModalStore from '@/stores/productSearchModalStore';
import { useEffect, useRef } from 'react';

export function useProductsSearchModalLogic(currentPage: any, searchTerm: string) {
  const { loadProducts } = productSearchModalStore()
  // ultima busqueda pedida; es un ref (no estado) para no volver a disparar el efecto
  const lastQuery = useRef("");

  useEffect(() => {
        if (searchTerm == "") {
          // al limpiar el buscador se puede volver a pedir la misma busqueda
          lastQuery.current = "";
          return;
        }
        const query = searchTerm;
        if (query != lastQuery.current) {
          lastQuery.current = query;
          loadProducts(`products?sort=description&filterWhere[status]==1&filterWhere[is_restaurant]==0&included=prices&perPage=300&page=1${searchTerm}`)
        }
  }, [loadProducts, searchTerm])

}

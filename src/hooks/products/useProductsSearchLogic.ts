'use client'
import useProductStore from '@/stores/products/productStore';
import { useEffect, useRef } from 'react';

// filtro por defecto: productos normales (sin platillos ni compuestos)
const defaultFilter = 'filterWhere[status]==1&filterWhere[is_restaurant]==0&filterWhere[product_type]==1';

export function useProductsSearchLogic(currentPage: any, searchTerm: string, sortBy: string, filter: string = defaultFilter) {
  const { loadProducts } = useProductStore()
  // ultima busqueda pedida; es un ref (no estado) para no volver a disparar el efecto
  const lastQuery = useRef("");

  useEffect(() => {
        if (searchTerm == "") {
          // al limpiar el buscador se puede volver a pedir la misma busqueda
          lastQuery.current = "";
          return;
        }
        const query = `${searchTerm}|${sortBy}|${filter}`;
        if (query != lastQuery.current) {
          lastQuery.current = query;
          loadProducts(`products?sort=${sortBy}&${filter}&included=prices&perPage=100&page=1${searchTerm}`)
        }
  }, [loadProducts, searchTerm, sortBy, filter])

}

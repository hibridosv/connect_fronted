'use client'
import useProductStore from '@/stores/products/productStore';
import { useEffect, useState } from 'react';

// filtro por defecto: productos normales (sin platillos ni compuestos)
const defaultFilter = 'filterWhere[status]==1&filterWhere[is_restaurant]==0&filterWhere[product_type]==1';

export function useProductsSearchLogic(currentPage: any, searchTerm: string, sortBy: string, filter: string = defaultFilter) {
  const { loadProducts } = useProductStore()
  const [searchTermNew, setSearchTermNew] = useState("");
  const [sortByNew, setSortByNew] = useState("");

  useEffect(() => {
        if ((searchTerm != searchTermNew || sortBy != sortByNew) && searchTerm != "") {
          setSearchTermNew(searchTerm);
          setSortByNew(sortBy);
          loadProducts(`products?sort=${sortBy}&${filter}&included=prices&perPage=100&page=1${searchTerm}`)
        }
  }, [loadProducts, currentPage, searchTerm, sortBy, searchTermNew, sortByNew, filter])

}

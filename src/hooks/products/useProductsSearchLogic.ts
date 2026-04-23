'use client'
import useProductStore from '@/stores/products/productStore';
import { useEffect, useState } from 'react';

export function useProductsSearchLogic(currentPage: any, searchTerm: string, sortBy: string) {
  const { loadProducts } = useProductStore()
  const [searchTermNew, setSearchTermNew] = useState("");
  const [sortByNew, setSortByNew] = useState("");

  useEffect(() => {
        if ((searchTerm != searchTermNew || sortBy != sortByNew) && searchTerm != "") {
          setSearchTermNew(searchTerm);
          setSortByNew(sortBy);
          loadProducts(`products?sort=${sortBy}&filterWhere[status]==1&filterWhere[is_restaurant]==0&filterWhere[product_type]==1&included=prices&perPage=100&page=1${searchTerm}`)
        }
  }, [loadProducts, currentPage, searchTerm, sortBy, searchTermNew, sortByNew])

}

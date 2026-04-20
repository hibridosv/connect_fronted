'use client'
import productSearchModalStore from '@/stores/productSearchModalStore';
import { useEffect, useState } from 'react';

export function useProductsSearchModalLogic(currentPage: any, searchTerm: string) {
  const { loadProducts } = productSearchModalStore()
  const [searchTermNew, setSearchTermNew] = useState("");

  useEffect(() => {
        if ((searchTerm != searchTermNew) && searchTerm != "") {
          setSearchTermNew(searchTerm);
          loadProducts(`products?sort=description&filterWhere[status]==1&filterWhere[is_restaurant]==0&included=prices&perPage=50&page=1${searchTerm}`)
        }
  }, [loadProducts, currentPage, searchTerm, searchTermNew])

}

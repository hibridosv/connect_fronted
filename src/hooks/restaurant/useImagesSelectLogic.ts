'use client'
import useConfigStore from '@/stores/configStore';
import imagesStore from '@/stores/restaurant/imagesStore';
import { useEffect, useState } from 'react';

export function useImagesSelectLogic(currentPage: any, searchTerm: string) {
  const { loadImages } = imagesStore()
  const { tenant } = useConfigStore();
  const [searchTermNew, setSearchTermNew] = useState("");

  useEffect(() => {
        if (!tenant?.id) return;
        // Solo las imagenes del tenant actual. La busqueda va como filterWhere (AND):
        // con filter[tags] la API arma un OR y traeria imagenes de otros tenants.
        const tenantFilter = `&filterWhere[tenant_id]==${tenant.id}`;
        const tagsFilter = searchTerm.replace('filter[', 'filterWhere[');
        if (searchTerm != searchTermNew) {
          setSearchTermNew(searchTerm);
          loadImages(`restaurant/images?perPage=28&page=1${tenantFilter}${tagsFilter}`)
        } else {
           loadImages(`restaurant/images?perPage=28${currentPage}${tenantFilter}${tagsFilter}`)
        }
  }, [loadImages, currentPage, searchTerm, searchTermNew, tenant?.id])

}

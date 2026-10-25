'use client'
import { useEffect, useRef } from 'react';
import { useGetRequest } from '../request/useGetRequest';

export function useSearchDocumentLogic(currentPage: any, searchTerm: string) {
  const { getRequest, responseData, loading } = useGetRequest();
  // ultima busqueda pedida; es un ref (no estado) para no volver a disparar el efecto
  const lastQuery = useRef<string | null>(null);



  useEffect(() => {

        const query = searchTerm;
        // busqueda nueva: vuelve a la pagina 1
        const page = query !== lastQuery.current ? "&page=1" : currentPage;
        lastQuery.current = query;
        getRequest(`orders?filterWhereIn[status]=3,4&included=invoiceAssigned,client,casheir&sort=-charged_at&perPage=15${page}${searchTerm}`, false)
  }, [currentPage, searchTerm, getRequest])

  return { loading, responseData};

}

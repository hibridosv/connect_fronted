'use client'
import { useEffect, useRef } from 'react';
import { useGetRequest } from '../request/useGetRequest';

export function useRemissionNoteLogic(currentPage: any, searchTerm: string) {
  const { getRequest, responseData, loading } = useGetRequest();
  // ultima busqueda pedida; es un ref (no estado) para no volver a disparar el efecto
  const lastQuery = useRef<string | null>(null);

  useEffect(() => {

        const query = searchTerm;
        // busqueda nueva: vuelve a la pagina 1
        const page = query !== lastQuery.current ? "&page=1" : currentPage;
        lastQuery.current = query;
        getRequest(`remissions?sort=-created_at&included=products,client,employee,delivery,referred,invoiceAssigned,order&perPage=10${page}${searchTerm}`, false)
  }, [currentPage, searchTerm, getRequest])

  return { loading, responseData};

}

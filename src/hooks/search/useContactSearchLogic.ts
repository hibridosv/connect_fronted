'use client'
import useContactStore from '@/stores/ContactStore';
import { useEffect, useRef } from 'react';

export function useContactSearchLogic(currentPage: any, searchTerm: string, sortBy: string, param: string, pagination: number) {
  const { loadContacts } = useContactStore()
  // ultima busqueda pedida; es un ref (no estado) para no volver a disparar el efecto
  const lastQuery = useRef("");

  useEffect(() => {
        if (searchTerm == "") {
          // al limpiar el buscador se puede volver a pedir la misma busqueda
          lastQuery.current = "";
          return;
        }
        const query = `${searchTerm}|${sortBy}|${param}|${pagination}`;
        if (query != lastQuery.current) {
          lastQuery.current = query;
          loadContacts(`contacts?sort=-created_at&included=employee&filterWhere[status]==1${param}&perPage=${pagination}&page=1${searchTerm}`)
        }
  }, [loadContacts, searchTerm, sortBy, pagination, param])

}

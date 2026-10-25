'use client'
import { updateService } from '@/services/services';
import useModalStore from '@/stores/modalStorage';
import useStateStore from '@/stores/stateStorage';
import useToastMessageStore from '@/stores/toastMessageStore';
import quotesStore from '@/stores/tools/quotesStore';
import useTempStorage from '@/stores/useTempStorage';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function useQuotesLogic(currentPage?: any, searchTerm?: any, initialLoad: boolean = false) {
  const { loadQuotes, deleteQuote, error } = quotesStore()
  // ultima busqueda pedida; es un ref (no estado) para no volver a disparar el efecto
  const lastQuery = useRef<string | null>(null);
  const router = useRouter();
  const { openLoading, closeLoading, loading: sending } = useStateStore()
  const { clearElement } = useTempStorage();
  const { setError } = useToastMessageStore();
  const { closeModal } = useModalStore();

  useEffect(() => {
    if (initialLoad) {
        const query = String(searchTerm);
        // busqueda nueva: vuelve a la pagina 1
        const page = query !== lastQuery.current ? "&page=1" : currentPage;
        lastQuery.current = query;
        loadQuotes(`tools/quotes?sort=-created_at&included=products,client&perPage=10${page}${searchTerm}`)
    }
  }, [loadQuotes, currentPage, searchTerm, initialLoad])

  const deleteRegister = async (url: string) => {
    const success = await deleteQuote(url);
    if (success) {
            loadQuotes(`tools/quotes?sort=-created_at&included=products,client&perPage=10&page=1`)
    }
  };

  const chargeRegisters = async (id: string) => {
      openLoading("sendQuote")
      try {
          const response = await updateService(`tools/quotes/${id}/charge`, {});
          if (response.status === 200) {
            router.push("/orders");
          }
        } catch (error) {
          setError(error)
        } finally {
          closeLoading("sendQuote");
          clearElement("quoteDetail");
          closeModal("quoteDetail");
      }
  }

  return { deleteRegister, chargeRegisters, sending };

}

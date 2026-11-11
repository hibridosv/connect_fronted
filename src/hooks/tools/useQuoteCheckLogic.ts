'use client'
import { getServices } from '@/services/services';
import useStateStore from '@/stores/stateStorage';
import { useEffect, useState } from 'react';
import useToastMessageStore from '@/stores/toastMessageStore';

export function useQuoteCheckLogic(url: string, initialLoad: boolean = false) {
    const [ checks, setChecks ] = useState(null) as any;
    const { openLoading, closeLoading, loading } = useStateStore()

    useEffect(() => {
        const handleGet = async (url: string) => {
            openLoading("checkAvailables");
            try {
                const response = await getServices(url);
                setChecks(response.data);
            } catch (error) {
                useToastMessageStore.getState().setError(error);
            } finally {
                closeLoading("checkAvailables");
            }
        }

        (async () => { 
          if (initialLoad && url) {
            await handleGet(url)
          }
        })();
    }, [openLoading, closeLoading, url, initialLoad]);



  return { checks, loading };

}

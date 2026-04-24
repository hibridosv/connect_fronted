import { DateRangeValues } from '@/components/button/DateRange';
import { createService, getServices } from '@/services/services';
import useConfigStore from '@/stores/configStore';
import useStateStore from '@/stores/stateStorage';
import { useCallback, useEffect, useState } from 'react';
import { useDownloadLink } from '../useDownloadLink';


export function useDownloadsLogic(url: string) {
    const [ history, setHistory ] = useState(null) as any;
    const { openLoading, closeLoading, loading } = useStateStore()
    const { system } = useConfigStore();
  const { links, addLink} = useDownloadLink();


    const handleGet = useCallback(async (url: string) => {
        openLoading("downloads");
        try {
            const response = await getServices(url);
            setHistory(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            closeLoading("downloads");
        }
    }, [closeLoading, openLoading]);



      const handleGenerateDocuments = async (type: 'pdf' | 'json', months?: number) => {
            openLoading("creating");
            const data = {
              client_id: system?.client_id,
              type,
              ...(months !== undefined && { months }),
            }
            try {
              const response = await createService(`downloads/zip/generate`, data);
              if (response.status === 200) {
                handleGet(url);
              }
            } catch (error) {
              console.error(error);
            } finally {
              closeLoading("creating");
            }
          };
    
    const handleCreateLinks = async (values: DateRangeValues) => { 
        openLoading('loading')
        addLink(values, 'download.excel.electronic', values.anexo ? [{name: "anexo", value: values.anexo } , { name: "sucursal", value: values.sucursal }] : null);
        closeLoading('loading')
    }


  useEffect(() => {
            (async () => { 
                await handleGet(url)
            })();
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, handleGet]);
    

  return { history, handleGet, loading, handleGenerateDocuments, links, handleCreateLinks }

}

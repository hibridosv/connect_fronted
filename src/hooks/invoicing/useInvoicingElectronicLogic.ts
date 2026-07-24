import { DateRangeValues } from '@/components/button/DateRange';
import { urlConstructor } from '@/lib/urlConstructor';
import { getServices, updateService } from '@/services/services';
import useStateStore from '@/stores/stateStorage';
import useToastMessageStore from '@/stores/toastMessageStore';
import useTempStorage from '@/stores/useTempStorage';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { useDownloadLink } from '../useDownloadLink';


export function useInvoicingElectronicLogic(url: string, linkUrl: string, loadAtStart: boolean = true) {
    const [ history, setHistory ] = useState([]) as any;
    const [ lastUrl, setLastUrl ] = useState("");
    const { openLoading, closeLoading } = useStateStore();
    const { links, addLink} = useDownloadLink();
    const { setElement, clearElement } = useTempStorage();
    const { setMessage, setError } = useToastMessageStore();



    const handleGet = useCallback(async (data: DateRangeValues, url: string, linkUrl: string, params: any | null = null) => {
        openLoading("history");
        try {
            const urlScoped = urlConstructor(data, url);
            const response = await getServices(urlScoped);
            setHistory(response.data.data);
            addLink(data, linkUrl, params, 1, "Descargar Documento Excel");
            setLastUrl(urlScoped);
        } catch (error) {
            console.error(error);
            setHistory([]);
        } finally {
            closeLoading("history");
        }
    }, [addLink, closeLoading, openLoading]);

    useEffect(() => {
        if (loadAtStart) {
            (async () => { 
            const actualDate = DateTime.now();
            const formatedDate = actualDate.toFormat('yyyy-MM-dd');
            await handleGet({option: "1", initialDate: `${formatedDate} 00:00:00`}, url, linkUrl)
            })();
        }
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, linkUrl, loadAtStart]);
    

    const resendDocument = async (invoice: string) => {
      try {
         setElement("resendDocument", invoice);
         openLoading("resendDocument");
        const response = await updateService(`electronic/documents/${invoice}`, {});
        if (response.status === 200) {
            setMessage({ message: "Actualizando documentos..."});
           let data =  await getServices(lastUrl);
           let responseData = data.data.data ? data.data.data : [];
           setHistory(responseData);
        }
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        closeLoading("resendDocument");
        clearElement("resendDocument");
      }
    };


  return { history, handleGet, links, resendDocument }

}

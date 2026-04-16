import { DateRangeValues } from '@/components/button/DateRange';
import { urlConstructor } from '@/lib/urlConstructor';
import { getServices } from '@/services/services';
import useStateStore from '@/stores/stateStorage';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { useDownloadLink } from '../useDownloadLink';


export function useInvoicingCorrelativesLogic(url: string, loadAtStart: boolean = true) {
    const [ history, setHistory ] = useState(null);
    const { openLoading, closeLoading, loading } = useStateStore()
    const { links, addLink} = useDownloadLink()


    const handleGet = useCallback(async (data: DateRangeValues, url: string) => {
        openLoading("history");
        try {
            let urlScoped = urlConstructor(data, url);
            const response = await getServices(urlScoped);
            setHistory(response.data.data);
            if (response.status === 200) {
                addLink(data, 'download.excel.invoices.correlatives', [{name: "invoiceId", value: data.invoiceId}, {name: "year", value: data.year}, {name: "month", value: data.month}], 2, "Descargar Excel");
                addLink(data, 'download.pdf.invoices.correlatives', [{name: "invoiceId", value: data.invoiceId}, {name: "year", value: data.year}, {name: "month", value: data.month}], 2, "Descargar PDF");
            }
        } catch (error) {
            console.error(error);
        } finally {
            closeLoading("history");
        }
    }, [addLink, closeLoading, openLoading]);

  useEffect(() => {
        if (loadAtStart) {
            (async () => { 
            const actualDate = DateTime.now();
            const formatedDate = actualDate.toFormat('yyyy-MM-dd');
            await handleGet({option: "1", initialDate: `${formatedDate} 00:00:00`}, url)
            })();
        }
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, loadAtStart]);
    

  return { history, handleGet, loading, links }

}

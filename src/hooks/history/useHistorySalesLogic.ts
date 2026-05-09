import { DateRangeValues } from '@/components/button/DateRange';
import { urlConstructor } from '@/lib/urlConstructor';
import { getServices } from '@/services/services';
import useStateStore from '@/stores/stateStorage';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { useDownloadLink } from '../useDownloadLink';


export function useHistorySalesLogic(url: string, linkUrl: string, loadAtStart: boolean = true) {
    const [ history, setHistory ] = useState(null);
    const { openLoading, closeLoading, loading } = useStateStore()
    const { links, addLink} = useDownloadLink()


    const handleGet = useCallback(async (data: DateRangeValues, url: string, linkUrl: string, params: any | null = null) => {
        openLoading("history");
        try {
            let urlScoped = urlConstructor(data, url);
            const response = await getServices(urlScoped);
            setHistory(response.data.data);
            addLink(data, linkUrl, params);
        } catch (error) {
            console.error(error);
            setHistory(null);
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
    }, [url, linkUrl, handleGet, loadAtStart]);
    

  return { history, handleGet, loading, links }

}

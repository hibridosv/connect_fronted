import { DateRangeValues } from '@/components/button/DateRange';
import { urlConstructor } from '@/lib/urlConstructor';
import { getServices } from '@/services/services';
import useStateStore from '@/stores/stateStorage';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { useDownloadLink } from '../useDownloadLink';


export function useReportsLogic(url: string, linkUrl: string, loadAtStart: boolean = true, currentPage?: string) {
    const [ history, setHistory ] = useState(null) as any;
    const { openLoading, closeLoading, loading } = useStateStore()
    const { links, addLink} = useDownloadLink()
    const [lastConstructedUrl, setLastConstructedUrl] = useState<string | null>(null);


    const handleGet = useCallback(async (data: DateRangeValues, url: string, linkUrl: string, params: any | null = null) => {
        openLoading("history");
        try {
            let urlScoped = urlConstructor(data, url);
            setLastConstructedUrl(urlScoped);
            const response = await getServices(urlScoped);
            setHistory(response.data);
            addLink(data, linkUrl, params);
        } catch (error) {
            setHistory(null);
            console.error(error);
        } finally {
            closeLoading("history");
        }
    }, [addLink, closeLoading, openLoading]);

    useEffect(() => {
        if (!lastConstructedUrl || !currentPage) return;
        const urlWithoutPage = lastConstructedUrl.replace(/[?&]page=\d+/, '');
        const newUrl = urlWithoutPage + currentPage;
        openLoading("history");
        getServices(newUrl)
            .then(response => setHistory(response.data))
            .catch(() => setHistory(null))
            .finally(() => closeLoading("history"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

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

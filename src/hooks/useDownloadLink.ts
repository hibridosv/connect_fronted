'use client'

import { DateRangeValues } from '@/components/button/DateRange';
import { LinkUrls } from '@/components/button/LinkList';
import { formatDate } from '@/lib/date-formats';
import { get } from '@/services/httpService';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';

export function useDownloadLink() {
    const { data: session } = useSession();
    const remoteUrl = session?.url;
    const [links, setLinks] = useState<LinkUrls[]>([]);

    const addLink = useCallback(async (data: DateRangeValues, url: string, params?: any, maxLinks = 3, nameLink = "Descargar Documento") => {
        if (!remoteUrl) return;

        const queryParams = [];

        if (data.option) {
            queryParams.push(`option=${data.option}`);
        }
        if (data.initialDate) {
            queryParams.push(`initialDate=${data.initialDate}`);
        }
        if (data.finalDate) {
            queryParams.push(`finalDate=${data.finalDate}`);
        }
        if (params) {
            params.forEach((param: any) => {
                if (param.value !== undefined && param.value !== null) {
                    queryParams.push(`${param.name}=${param.value}`);
                }
            });
        }

        const queryString = queryParams.length > 0 ? `&${queryParams.join('&')}` : '';
        const name = `${nameLink ? nameLink : data.option == '1' ?
            `Fecha establecida ${formatDate(data.initialDate)}` :
            `Del ${formatDate(data.initialDate)} al ${formatDate(data.finalDate)}`}`;

        const linkId = `${Date.now()}-${Math.random()}`;

        setLinks(prevLinks => {
            const updatedLinks = [...prevLinks, { name, link: '', isUrl: true, loading: true, _id: linkId }];
            if (updatedLinks.length > maxLinks) {
                return updatedLinks.slice(updatedLinks.length - maxLinks);
            }
            return updatedLinks;
        });

        try {
            const response = await get(`config/url?route=${url}${queryString}`);
            const resolvedUrl = response.data?.url;

            setLinks(prevLinks => prevLinks.map(link =>
                link._id === linkId
                    ? { ...link, link: resolvedUrl ?? '', loading: false }
                    : link
            ));
        } catch {
            setLinks(prevLinks => prevLinks.filter(link => link._id !== linkId));
        }
    }, [remoteUrl]);

    return { links, addLink };
}

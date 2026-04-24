'use client'

import { DateRangeValues } from '@/components/button/DateRange';
import { LinkUrls } from '@/components/button/LinkList';
import { formatDate } from '@/lib/date-formats';
import { useCallback, useState } from 'react';

export function useDownloadLink() {
    const [links, setLinks] = useState<LinkUrls[]>([]);

    const addLink = useCallback((data: DateRangeValues, url: string, params?: any, maxLinks = 3, nameLink = "Descargar Documento") => {
        const queryParams = [] as string[];

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.push(`${key}=${value}`);
            }
        });
        if (params) {
            params.forEach((param: any) => {
                if (param.value !== undefined && param.value !== null) {
                    queryParams.push(`${param.name}=${param.value}`);
                }
            });
        }

        const queryString = queryParams.length > 0 ? `&${queryParams.join('&')}` : '';
        const name = nameLink ? nameLink : data.option == '1' ?
            `Fecha establecida ${formatDate(data.initialDate)}` :
            `Del ${formatDate(data.initialDate)} al ${formatDate(data.finalDate)}`;

        const linkId = `${Date.now()}-${Math.random()}`;
        const route = `${url}${queryString}`;

        setLinks(prevLinks => {
            const updatedLinks = [...prevLinks, { name, route, isUrl: true, _id: linkId }];
            if (updatedLinks.length > maxLinks) {
                return updatedLinks.slice(updatedLinks.length - maxLinks);
            }
            return updatedLinks;
        });
    }, []);

    return { links, addLink };
}

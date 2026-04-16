'use client';

import { LinkUrls } from '@/components/button/LinkList';
import { get } from '@/services/httpService';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const DOWNLOAD_LINKS = [
  { name: 'DESCARGAR EN EXCEL', route: 'download.excel.inventory' },
  { name: 'DESCARGAR EN PDF',   route: 'download.web.inventory' },
  { name: 'DESCARGAR PRECIOS',  route: 'download.web.inventory-prices' },
];

export function useSetLinkLogic() {
  const { data: session } = useSession();
  const remoteUrl = session?.url;
  const [links, setLinks] = useState<LinkUrls[]>([]);

  useEffect(() => {
    if (!remoteUrl) return;

    setLinks(DOWNLOAD_LINKS.map(item => ({ name: item.name, link: '', isUrl: true, loading: true, _id: item.route })));

    DOWNLOAD_LINKS.forEach(async (item) => {
      try {
        const response = await get(`config/url?route=${item.route}`);
        const resolvedUrl = response.data?.url ?? '';
        setLinks(prev => prev.map(link =>
          link._id === item.route ? { ...link, link: resolvedUrl, loading: false } : link
        ));
      } catch {
        setLinks(prev => prev.filter(link => link._id !== item.route));
      }
    });
  }, [remoteUrl]);

  return links;
}

'use client';

import { LinkUrls } from '@/components/button/LinkList';

const DOWNLOAD_LINKS: LinkUrls[] = [
  { name: 'DESCARGAR EN EXCEL', route: 'download.excel.inventory', isUrl: true },
  { name: 'DESCARGAR EN PDF',   route: 'download.web.inventory',   isUrl: true },
  { name: 'DESCARGAR PRECIOS',  route: 'download.web.inventory-prices', isUrl: true },
];

export function useSetLinkLogic() {
  return DOWNLOAD_LINKS;
}

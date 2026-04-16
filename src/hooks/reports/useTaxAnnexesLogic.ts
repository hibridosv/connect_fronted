'use client';
import { get } from '@/services/httpService';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';

const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export const ANEXO_OPTIONS = [
  { value: '1', label: 'Ventas CF',       description: 'Ventas a Consumidor Final' },
  { value: '2', label: 'Contribuyentes',  description: 'Ventas a Contribuyentes' },
  { value: '3', label: 'Anulados',        description: 'Documentos Anulados' },
  { value: '4', label: 'Compras SE',      description: 'Compras a Sujetos Excluidos' },
];

export const SUCURSAL_OPTIONS = [
  { value: '0', label: 'Esta Sucursal' },
  { value: '1', label: 'Todas' },
];

type UrlEntry = { url: string; loading: boolean };
type UrlMap = Record<string, UrlEntry>;

export function useTaxAnnexesLogic() {
  const { data: session } = useSession();
  const remoteUrl = session?.url;
  const [selectedSucursal, setSelectedSucursal] = useState('0');
  const [urlMap, setUrlMap] = useState<UrlMap>({});

  const months = useMemo(() => Array.from({ length: 3 }, (_, i) => {
    const dt = DateTime.now().minus({ months: i });
    return {
      monthName:   MONTHS_ES[dt.month - 1],
      year:        String(dt.year),
      initialDate: `${dt.startOf('month').toISODate()} 00:00:00`,
      finalDate:   `${dt.endOf('month').toISODate()} 23:59:59`,
    };
  }), []);

  useEffect(() => {
    if (!remoteUrl) return;

    const initialMap: UrlMap = {};
    months.forEach(month => {
      ANEXO_OPTIONS.forEach(opt => {
        initialMap[`${month.initialDate}-${opt.value}`] = { url: '#', loading: true };
      });
    });
    setUrlMap(initialMap);

    months.forEach(month => {
      ANEXO_OPTIONS.forEach(async (opt) => {
        const key = `${month.initialDate}-${opt.value}`;
        const params = [
          `option=2`,
          `initialDate=${encodeURIComponent(month.initialDate)}`,
          `finalDate=${encodeURIComponent(month.finalDate)}`,
          `anexo=${opt.value}`,
          `sucursal=${selectedSucursal}`,
        ].join('&');

        try {
          const response = await get(`config/url?route=download.excel.electronic&${params}`);
          const resolvedUrl = response.data?.url ?? '#';
          setUrlMap(prev => ({ ...prev, [key]: { url: resolvedUrl, loading: false } }));
        } catch {
          setUrlMap(prev => ({ ...prev, [key]: { url: '#', loading: false } }));
        }
      });
    });
  }, [remoteUrl, selectedSucursal, months]);

  const buildUrl = (month: typeof months[0], anexoValue: string) => {
    return urlMap[`${month.initialDate}-${anexoValue}`]?.url ?? '#';
  };

  const isUrlLoading = (month: typeof months[0], anexoValue: string) => {
    return urlMap[`${month.initialDate}-${anexoValue}`]?.loading ?? true;
  };

  return { months, selectedSucursal, setSelectedSucursal, buildUrl, isUrlLoading };
}

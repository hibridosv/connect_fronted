'use client';
import { get } from '@/services/httpService';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';

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

export function useTaxAnnexesLogic() {
  const { data: session } = useSession();
  const [selectedSucursal, setSelectedSucursal] = useState('0');
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const months = useMemo(() => Array.from({ length: 3 }, (_, i) => {
    const dt = DateTime.now().minus({ months: i });
    return {
      monthName:   MONTHS_ES[dt.month - 1],
      year:        String(dt.year),
      initialDate: `${dt.startOf('month').toISODate()} 00:00:00`,
      finalDate:   `${dt.endOf('month').toISODate()} 23:59:59`,
    };
  }), []);

  const handleDownload = async (month: typeof months[0], anexoValue: string) => {
    const key = `${month.initialDate}-${anexoValue}`;
    if (loadingMap[key]) return;

    const params = [
      `option=2`,
      `initialDate=${encodeURIComponent(month.initialDate)}`,
      `finalDate=${encodeURIComponent(month.finalDate)}`,
      `anexo=${anexoValue}`,
      `sucursal=${selectedSucursal}`,
    ].join('&');

    setLoadingMap(prev => ({ ...prev, [key]: true }));
    try {
      const response = await get(`config/url?route=download.excel.electronic&${params}`);
      const resolvedUrl = response.data?.url;
      if (resolvedUrl) window.open(resolvedUrl, '_blank');
    } finally {
      setLoadingMap(prev => ({ ...prev, [key]: false }));
    }
  };

  const isUrlLoading = (month: typeof months[0], anexoValue: string) => {
    return loadingMap[`${month.initialDate}-${anexoValue}`] ?? false;
  };

  return { months, selectedSucursal, setSelectedSucursal, handleDownload, isUrlLoading };
}

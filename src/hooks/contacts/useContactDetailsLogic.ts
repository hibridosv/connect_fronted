'use client'
import { DateRangeValues } from '@/components/button/DateRange';
import { ContactSummary } from '@/interfaces/contact';
import { urlConstructor } from '@/lib/urlConstructor';
import { getServices } from '@/services/services';
import useToastMessageStore from '@/stores/toastMessageStore';
import { useCallback, useEffect, useState } from 'react';

// Sin periodo se muestra todo el historial del contacto
export function useContactDetailsLogic(id: string) {
  const [summary, setSummary] = useState<ContactSummary | null>(null);
  const [sales, setSales] = useState<any>(null);
  const [period, setPeriod] = useState<DateRangeValues>({});
  const [page, setPage] = useState('page=1');
  const [loading, setLoading] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const loadSummary = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await getServices(urlConstructor(period, `contacts/${id}/summary`));
      setSummary(response.data.data);
      setNotFound(false);
    } catch (error: any) {
      if (error?.response?.status === 404) setNotFound(true);
      useToastMessageStore.getState().setError(error);
    } finally {
      setLoading(false);
    }
  }, [id, period]);

  const loadSales = useCallback(async () => {
    if (!id) return;
    setLoadingSales(true);
    try {
      const response = await getServices(urlConstructor(period, `contacts/${id}/sales?perPage=10&${page}`));
      setSales(response.data.data);
    } catch (error) {
      setSales(null);
    } finally {
      setLoadingSales(false);
    }
  }, [id, period, page]);

  useEffect(() => { loadSummary(); }, [loadSummary]);
  useEffect(() => { loadSales(); }, [loadSales]);

  const changePeriod = (values: DateRangeValues) => {
    setPage('page=1');
    setPeriod({ option: values.option, initialDate: values.initialDate, finalDate: values.finalDate });
  };

  const clearPeriod = () => {
    setPage('page=1');
    setPeriod({});
  };

  const handlePageNumber = (url: string) => {
    const query = url.split('?');
    setPage(query[query.length - 1]);
  };

  return { summary, sales, period, loading, loadingSales, notFound, changePeriod, clearPeriod, handlePageNumber };
}

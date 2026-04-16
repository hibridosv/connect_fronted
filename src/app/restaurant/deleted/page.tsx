'use client';

import { DateRange, DateRangeValues } from '@/components/button/DateRange';
import { LinksList } from '@/components/button/LinkList';
import { DeletedOrdersTable } from '@/components/restaurant/DeletedOrdersTable';
import { ToasterMessage } from '@/components/toaster-message';
import { ViewTitle } from '@/components/ViewTitle';
import { useHistorySalesLogic } from '@/hooks/history/useHistorySalesLogic';

export default function Page() {
  const { history, handleGet, loading, links } = useHistorySalesLogic('histories/orders-deleted', 'download.excel.deleted');
  const isLoading = loading.history ?? false;

  const handleFormSubmit = async (values: DateRangeValues) => {
    await handleGet(values, 'histories/orders-deleted', 'download.excel.deleted');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="ORDENES ELIMINADAS" />
        <div className="p-4">
          <DeletedOrdersTable records={history} isLoading={isLoading} />
        </div>
      </div>
      <div className="md:col-span-3">
        <ViewTitle text="Seleccionar fechas" />
        <div className="mt-2 p-2">
          <DateRange onSubmit={handleFormSubmit} loading={isLoading} />
        </div>
        <div className="p-4">
          <LinksList links={links} text="DESCARGAS" />
        </div>
      </div>
      <ToasterMessage />
    </div>
  );
}

'use client';
import { DateRange, DateRangeValues } from "@/components/button/DateRange";
import { HistoryActivityTable } from "@/components/history/HistoryActivityTable";
import { Pagination } from "@/components/Pagination";
import { ViewTitle } from "@/components/ViewTitle";
import { useHistoryActivityLogic } from "@/hooks/history/useHistoryActivityLogic";
import { usePagination } from "@/hooks/usePagination";


export default function Page() {
  const { currentPage, handlePageNumber } = usePagination("&page=1");
  const { history, setValues, additionalFields, loading } = useHistoryActivityLogic(currentPage);
  const isLoading = loading.history ?? false;

    const handleFormSubmit = async (values: DateRangeValues) => {
        handlePageNumber("?page=1");
        setValues(values);
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Historial de acciones" />
        <div className="p-4">
          <HistoryActivityTable records={history?.data ?? null} isLoading={isLoading} />
          <Pagination records={history} handlePageNumber={handlePageNumber} />
        </div>
    </div>
    <div className="md:col-span-3">
        <ViewTitle text="Seleccionar fechas" />
          <div className="mt-2 p-2">
            <DateRange onSubmit={handleFormSubmit} loading={isLoading} additionalFields={additionalFields} />
          </div>
          <p className="px-4 text-xs text-text-muted">Se guardan las acciones de los últimos 5 días.</p>
    </div>
</div>
  );
}

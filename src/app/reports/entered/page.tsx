'use client';
import { DateRange, DateRangeValues } from "@/components/button/DateRange";
import { LinksList } from "@/components/button/LinkList";
import { ReportEnteredTable } from "@/components/reports/ReportEnteredTable";
import { ViewTitle } from "@/components/ViewTitle";
import { useReportsLogic } from "@/hooks/reports/useReportsLogic";


export default function Page() {
  const { history, setHistory, handleGet, loading, links } = useReportsLogic('reports/products-in', 'download.excel.reports.products-in');
  const isLoading = loading.history ?? false; 

    const handleFormSubmit = async (values: DateRangeValues) => { 
        await handleGet(values, 'reports/products-in', 'download.excel.reports.products-in');
    }

    const handleUpdated = (updated: any) => {
        setHistory((records: any) => records?.map((record: any) => record.id === updated.id ? updated : record));
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Productos Ingresados" />
        <div className="p-4">
          <ReportEnteredTable records={history} isLoading={isLoading} onUpdated={handleUpdated} />
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
</div>
  );
}

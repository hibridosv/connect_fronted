'use client';
import { DateRange, DateRangeValues } from "@/components/button/DateRange";
import { LinksList } from "@/components/button/LinkList";
import { ReportInventoryTable } from "@/components/reports/ReportInventoryTable";
import { ViewTitle } from "@/components/ViewTitle";
import { useReportsLogic } from "@/hooks/reports/useReportsLogic";


export default function Page() {
  // loadAtStart en false: el usuario elige la fecha y aplica
  const { history, handleGet, loading, links } = useReportsLogic('reports/inventory', 'download.excel.reports.inventory', false);
  const isLoading = loading.history ?? false;

  const handleFormSubmit = async (values: DateRangeValues) => {
    // el inventario se consulta al cierre del día: solo se envía la fecha, sin hora
    const initialDate = String(values.initialDate ?? '').slice(0, 10);
    await handleGet({ option: '1', initialDate }, 'reports/inventory', 'download.excel.reports.inventory');
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Inventario a una fecha" />
        <div className="p-4">
          <ReportInventoryTable records={history} isLoading={isLoading} />
        </div>
      </div>
      <div className="md:col-span-3">
        <ViewTitle text="Seleccionar fecha" />
        <div className="mt-2 p-2">
          <DateRange onSubmit={handleFormSubmit} loading={isLoading} singleDate />
        </div>
        <div className="p-4">
          <LinksList links={links} text="DESCARGAS" />
        </div>
      </div>
    </div>
  );
}

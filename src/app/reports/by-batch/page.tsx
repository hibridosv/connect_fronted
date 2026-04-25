'use client';
import { DateRange, DateRangeValues } from "@/components/button/DateRange";
import { LinksList } from "@/components/button/LinkList";
import { ReportLotTable } from "@/components/reports/ReportLotTable";
import { ProductsSearch } from "@/components/search/ProductsSearch";
import { ShowProductSearched } from "@/components/search/ShowProductSearched";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useReportsLogic } from "@/hooks/reports/useReportsLogic";
import useTempStorage from "@/stores/useTempStorage";
import { DateTime } from "luxon";
import { useEffect } from "react";



export default function Page() {
  const { getElement } = useTempStorage();
  const elementSelected = getElement('productSearched');
  const { history, handleGet, loading, links } = useReportsLogic(`registers?perPage=20&page=1${elementSelected?.id ? `&filterWhere[product_id]==${elementSelected?.id}` : ''}&included=product&sort=-created_at`, 'download.excel.reports.by-lot');
  const isLoading = loading.history ?? false;

  useEffect(() => {
    if (!elementSelected) return;
    const today = DateTime.now().toFormat('yyyy-MM-dd');
    handleGet(
      { option: "1", initialDate: `${today} 00:00:00`, product_id: elementSelected.id },
      'reports/lot',
      'download.excel.reports.by-lot',
      [{ name: "product_id", value: elementSelected.id }]
    );
  }, [elementSelected, handleGet]);


    const handleFormSubmit = async (values: DateRangeValues) => {
        await handleGet(values, `registers?perPage=20&page=1${elementSelected?.id ? `&filterWhere[product_id]==${elementSelected?.id}` : ''}&included=product&sort=-created_at`, 'download.excel.reports.by-lot', elementSelected?.id ? [{ name: "product_id", value: elementSelected.id }] : null);
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Ingresos por lotes" />
        <div className="p-4">
          <ReportLotTable records={history} isLoading={isLoading} />
        </div>
    </div>
    <div className="md:col-span-3">
        <ViewTitle text="Seleccionar fechas" />
          <div className="mt-2 p-2">
            <ProductsSearch />
            <ShowProductSearched />
          </div>
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

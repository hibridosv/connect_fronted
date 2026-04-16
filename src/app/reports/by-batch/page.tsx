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



export default function Page() {
  const { getElement } = useTempStorage();
  const elementSelected = getElement('productSearched');
  const { history, handleGet, loading, links } = useReportsLogic(`reports/lot?perPage=20&page=1`, 'download.excel.reports.by-lot');
  const isLoading = loading.history ?? false; 


    const handleFormSubmit = async (values: DateRangeValues) => { 
        let urlFixed = '';
        if (elementSelected) {
          values.product_id = elementSelected?.id
        } else {
          urlFixed = '?perPage=20&page=1';
        }
        await handleGet(values, `reports/lot${urlFixed}`, 'download.excel.reports.by-lot', elementSelected ? [{name: "product_id", value: elementSelected?.id}] : []);
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

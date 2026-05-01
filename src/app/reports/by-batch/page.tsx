'use client';
import { DateRange, DateRangeValues } from "@/components/button/DateRange";
import { LinksList } from "@/components/button/LinkList";
import { Pagination } from "@/components/Pagination";
import { ReportLotTable } from "@/components/reports/ReportLotTable";
import { ProductsSearch } from "@/components/search/ProductsSearch";
import { ShowProductSearched } from "@/components/search/ShowProductSearched";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useReportsLogic } from "@/hooks/reports/useReportsLogic";
import { usePagination } from "@/hooks/usePagination";
import useTempStorage from "@/stores/useTempStorage";

export default function Page() {
  const { getElement } = useTempStorage();
  const elementSelected = getElement('productSearched');
  const productFilter = elementSelected?.id ? `&filterWhere[product_id]==${elementSelected.id}` : '';
  const baseUrl = `registers?perPage=15&included=product&sort=-created_at${productFilter}`;
  const { currentPage, handlePageNumber } = usePagination("&page=1");
  const { history, handleGet, loading, links } = useReportsLogic(baseUrl, 'download.excel.reports.by-lot', true, currentPage);
  const isLoading = loading.history ?? false;

  const handleFormSubmit = async (values: DateRangeValues) => {
    const params = elementSelected?.id ? [{ name: "product_id", value: elementSelected.id }] : null;
    await handleGet(values, `${baseUrl}&page=1`, 'download.excel.reports.by-lot', params);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Ingresos por lotes" />
        <div className="p-4">
          <ReportLotTable records={history?.data} isLoading={isLoading} />
          <Pagination records={history} handlePageNumber={handlePageNumber} />
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

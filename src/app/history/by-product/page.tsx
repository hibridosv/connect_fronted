'use client';
import { DateRange, DateRangeValues } from "@/components/button/DateRange";
import { LinksList } from "@/components/button/LinkList";
import { HistoryByProductTable } from "@/components/history/HistoryByProductTable";
import { ProductLotSearch } from "@/components/search/ProductLotSearch";
import { ProductsSearch } from "@/components/search/ProductsSearch";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useHistorySalesLogic } from "@/hooks/history/useHistorySalesLogic";
import useConfigStore from "@/stores/configStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { DateTime } from "luxon";



export default function Page() {
  const { getElement } = useTempStorage();
  const elementSelected = getElement('productSearched');
  const { history, handleGet, loading, links } = useHistorySalesLogic('histories/by-product', 'download.excel.by-product', false);
  const isLoading = loading.history ?? false;
  const { activeConfig } = useConfigStore();
  const isShowLot = activeConfig && activeConfig.includes('sales-change-lot')

  const handleFormSubmit = async (values: DateRangeValues) => {
    if (!elementSelected) {
      useToastMessageStore.getState().setError({ message: "Seleccione un producto" });
      return;
    }
    values.product_id = elementSelected?.id;
    await handleGet(values, 'histories/by-product', 'download.excel.by-product', [{ name: "product_id", value: elementSelected?.id }]);
  };

  const handleLotSearch = async (lot: string) => {
    if (!elementSelected) {
      useToastMessageStore.getState().setError({ message: "Seleccione un producto" });
      return;
    }
    const formatedDate = DateTime.now().toFormat('yyyy-MM-dd');
    const params: any = { option: "1", initialDate: `${formatedDate} 00:00:00`, product_id: elementSelected?.id };
    if (lot) params.lot = lot;
    await handleGet(
      params,
      'histories/by-product',
      'download.excel.by-product',
      [{ name: "product_id", value: elementSelected?.id }, ...(lot ? [{ name: "lot", value: lot }] : [])]
    );
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Listado de ventas por producto" />
        <div className="p-4">
          <HistoryByProductTable records={history} isLoading={isLoading} />
        </div>
      </div>
      <div className="md:col-span-3">
        <ViewTitle text="Seleccionar fechas" />
        <div className="mt-2 p-2">
          <ProductsSearch />
          <ProductLotSearch onLotSearch={handleLotSearch} loading={isLoading} showLot={isShowLot} />
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

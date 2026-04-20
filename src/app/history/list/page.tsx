'use client';
import { DateRange, DateRangeValues } from "@/components/button/DateRange";
import { LinksList } from "@/components/button/LinkList";
import { HistoryListTable } from "@/components/history/HistoryListTable";
import { InvoiceDetailsModal } from "@/components/invoicing/InvoiceDetailsModal";
import { ViewTitle } from "@/components/ViewTitle";
import { useHistorySalesLogic } from "@/hooks/history/useHistorySalesLogic";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";


export default function Page() {
  const { history, handleGet, loading, links } = useHistorySalesLogic('histories/list', 'download.excel.list');
  const isLoading = loading.history ?? false; 
  const { modals, closeModal } = useModalStore();
  const { getElement } = useTempStorage();
  const documentSelected = getElement('documentSelected') ?? {};
  
    const handleFormSubmit = async (values: DateRangeValues) => { 
        await handleGet(values, 'histories/list', 'download.excel.list');
    }


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Listado de ventas" />
        <div className="p-4">
          <HistoryListTable records={history} isLoading={isLoading} />
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
    <InvoiceDetailsModal isShow={modals.documentDetail} onClose={() => closeModal('documentDetail')} documentId={documentSelected?.id} />
</div>
  );
}

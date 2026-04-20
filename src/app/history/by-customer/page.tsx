'use client';
import { DateRange, DateRangeValues } from "@/components/button/DateRange";
import { LinksList } from "@/components/button/LinkList";
import { HistoryByCustomerTable } from "@/components/history/HistoryByCustomerTable";
import { InvoiceDetailsModal } from "@/components/invoicing/InvoiceDetailsModal";
import { ClientsSearch } from "@/components/search/ClientsSearch";
import { ShowClientSearched } from "@/components/search/ShowClientSearched";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useHistorySalesLogic } from "@/hooks/history/useHistorySalesLogic";
import useModalStore from "@/stores/modalStorage";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";



export default function Page() {
  const { getElement } = useTempStorage();
  const elementSelected = getElement('clientSelectedBySearch');
  const { history, handleGet, loading, links } = useHistorySalesLogic('histories/by-client', 'download.excel.by-client', false);
  const isLoading = loading.history ?? false; 
  const { modals, closeModal } = useModalStore();
  const documentSelected = getElement('documentSelected') ?? {};


    const handleFormSubmit = async (values: DateRangeValues) => { 
        if (!elementSelected) {
          useToastMessageStore.getState().setError({ message: "Seleccione un contacto"});
          return
        }
        values.clientId = elementSelected?.id
        await handleGet(values, 'histories/by-client', 'download.excel.by-client', [{name: "clientId", value: elementSelected?.id}]);
    }


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Listado de ventas por cliente" />
        <div className="p-4">
          <HistoryByCustomerTable records={history} isLoading={isLoading} />
        </div>
    </div>
    <div className="md:col-span-3">
        <ViewTitle text="Seleccionar fechas" />
          <div className="mt-2 p-2">
            <ClientsSearch param="customers" />
            <ShowClientSearched />
          </div>
          <div className="mt-2 p-2">
            <DateRange onSubmit={handleFormSubmit} loading={isLoading} />
          </div>
          <div className="p-4">
            <LinksList links={links} text="DESCARGAS" />
          </div>
    </div> 
    <InvoiceDetailsModal isShow={modals.documentDetail} onClose={() => closeModal('documentDetail')} documentId={documentSelected?.id} />
    <ToasterMessage />
</div>
  );
}

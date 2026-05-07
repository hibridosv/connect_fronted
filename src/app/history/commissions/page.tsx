'use client';
import { DateRange, DateRangeValues } from "@/components/button/DateRange";
import { LinksList } from "@/components/button/LinkList";
import { HistoryCommisionsTable } from "@/components/history/HistoryCommisionsTable";
import { ClientsSearch } from "@/components/search/ClientsSearch";
import { ShowClientSearched } from "@/components/search/ShowClientSearched";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useHistorySalesLogic } from "@/hooks/history/useHistorySalesLogic";
import useTempStorage from "@/stores/useTempStorage";



export default function Page() {
  const { getElement } = useTempStorage();
  const elementSelected = getElement('clientSelectedBySearch');
  const { history, handleGet, loading, links } = useHistorySalesLogic('histories/commissions', 'download/pdf/commissions', false);
  const isLoading = loading.history ?? false; 


    const handleFormSubmit = async (values: DateRangeValues) => { 
        values.referredId = elementSelected?.id
        let data = {};
        if (elementSelected?.id) {
          data = {name: "referredId", value: elementSelected?.id};
        }
        await handleGet(values, 'histories/commissions', 'download/pdf/commissions', [data]);
    }


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Listado de comisiones por cliente" />
        <div className="p-4">
          <HistoryCommisionsTable records={history} isLoading={isLoading} />
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
            <LinksList links={links} text="DESCARGAS EN PDF" />
          </div>
    </div> 
    <ToasterMessage />
</div>
  );
}

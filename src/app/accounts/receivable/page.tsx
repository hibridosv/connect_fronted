'use client';
import { AccountsReceivableTable } from "@/components/accounts/AccountsReceivableTable";
import { AddReceivableAddModal } from "@/components/accounts/AddReceivableAddModal";
import { DateRange, DateRangeValues } from "@/components/button/DateRange";
import { LinksList } from "@/components/button/LinkList";
import { Option, RadioButton } from "@/components/button/RadioButton";
import { InvoiceDetailsModal } from "@/components/invoicing/InvoiceDetailsModal";
import { Pagination } from "@/components/Pagination";
import { ClientsSearch } from "@/components/search/ClientsSearch";
import { ShowClientSearched } from "@/components/search/ShowClientSearched";
import { ShowTotal } from "@/components/ShowTotal";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useAccountReceivableLogic } from "@/hooks/accounts/useAccountReceivableLogic";
import { usePagination } from "@/hooks/usePagination";
import { countItemsWithStatus, getTotalOfItem } from "@/lib/utils";
import accountReceivableStore from "@/stores/accounts/accountReceivableStore";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";

export default function Page() {
  let optionsRadioButton: Option[] = [
    { id: 2, name: "Todos" },
    { id: 0, name: "Pagadas" },
    { id: 1, name: "Pendientes" },
  ];

  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { modals, closeModal, openModal} = useModalStore();

  const { links, handleGet } = useAccountReceivableLogic(currentPage, true);
  const { accounts, loading } = accountReceivableStore();

  const data = accounts?.data || [];
  const { getElement} = useTempStorage();
  const documentSelected = getElement('documentSelected') ?? {};

  const handleFormSubmit = async (values: DateRangeValues) => {
    await handleGet(values);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
          <ViewTitle text="Cuentas por cobrar" />
        <div className="p-4">
          <AccountsReceivableTable records={data} isLoading={loading} />
          <Pagination records={accounts} handlePageNumber={handlePageNumber } />
        </div>
    </div>
    <div className="md:col-span-3">
        <ViewTitle text="Resumen" />
            <div className="p-4">
              <ShowTotal quantity={countItemsWithStatus(data, "status", 1)} text="Creditos Pendientes" number={true} />
            </div>
            <div className="p-4">
              <ShowTotal quantity={getTotalOfItem(data, "balance")} text="Total Pendiente" number={false} />
            </div>

            <div className="p-4">
              <ClientsSearch param="customers" placeholder="Buscar Cliente" />
              <ShowClientSearched />
            </div>
            <RadioButton options={optionsRadioButton} />
            <ViewTitle text="Rango de fechas" />
            <div className="mt-2 p-2">
              <DateRange onSubmit={handleFormSubmit} loading={loading} />
            </div>
            <div className="p-4">
              <LinksList links={links} text="DESCARGAS" />
            </div>

    </div> 
    <AddReceivableAddModal onClose={() => closeModal('paymentReceivableAdd')} isShow={modals.paymentReceivableAdd} />
    <InvoiceDetailsModal isShow={modals.documentDetail} onClose={() => closeModal('documentDetail')} documentId={documentSelected?.id} />
    <ToasterMessage />
</div>
  );
}

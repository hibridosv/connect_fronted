'use client';
import { AccountsPayableTable } from "@/components/accounts/AccountsPayableTable";
import { AddPayableAddModal } from "@/components/accounts/AddPayableAddModal";
import { AddPayableCreditNoteModal } from "@/components/accounts/AddPayableCreditNoteModal";
import { AddPayableModal } from "@/components/accounts/AddPayableModal";
import { Option, RadioButton } from "@/components/button/RadioButton";
import { Pagination } from "@/components/Pagination";
import { ClientsSearch } from "@/components/search/ClientsSearch";
import { ShowClientSearched } from "@/components/search/ShowClientSearched";
import { ShowTotal } from "@/components/ShowTotal";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useAccountPayableLogic } from "@/hooks/accounts/useAccountPayableLogic";
import { usePagination } from "@/hooks/usePagination";
import { countItemsWithStatus, getTotalOfItem } from "@/lib/utils";
import useAccountPayableStore from "@/stores/accounts/accountPayableStore";
import useModalStore from "@/stores/modalStorage";
import { BiPlusCircle } from "react-icons/bi";


export default function Page() {
  let optionsRadioButton: Option[] = [
    { id: 2, name: "Todos" },
    { id: 0, name: "Pagadas" },
    { id: 1, name: "Pendientes" },
  ];

  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { modals, closeModal, openModal} = useModalStore();

  useAccountPayableLogic(currentPage, true);
  const { accounts, loading } = useAccountPayableStore();

  const data = accounts?.data || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <div className="flex justify-between">
          <ViewTitle text="Cuentas por pagar" />
          <BiPlusCircle size={28} className="clickeable text-primary mt-3 mr-4" onClick={()=>{openModal('payableAdd'); }} />
        </div>
        <div className="p-4">
          <AccountsPayableTable records={data} isLoading={loading} />
          <Pagination records={accounts} handlePageNumber={handlePageNumber } />
        </div>
    </div>
    <div className="md:col-span-3">
        <ViewTitle text="Resumen" />
            <div className="p-4">
              <ClientsSearch param="suppliers" placeholder="Buscar Proveedor" />
              <ShowClientSearched />
            </div>
            <RadioButton options={optionsRadioButton} />
            <div className="p-4">
              <ShowTotal quantity={countItemsWithStatus(data, "status", 1)} text="Creditos Pendientes" number={true} />
            </div>
            <div className="p-4">
              <ShowTotal quantity={getTotalOfItem(data, "balance")} text="Total Pendiente" number={false} />
            </div>
    </div> 
    <AddPayableModal onClose={() => closeModal('payableAdd')} isShow={modals.payableAdd} />
    <AddPayableAddModal onClose={() => closeModal('paymentPayableAdd')} isShow={modals.paymentPayableAdd} />
    <AddPayableCreditNoteModal onClose={() =>closeModal('creditNoteAdd')} isShow={modals.creditNoteAdd} />
    <ToasterMessage />
</div>
  );
}

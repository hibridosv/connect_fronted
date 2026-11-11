'use client';
import { Pagination } from "@/components/Pagination";
import { ViewTitle } from "@/components/ViewTitle";
import { Button, Preset } from "@/components/button/button";
import { AccountsTransfersModal } from "@/components/cash/accounts/AccountsTransfersModal";
import { CashTotal } from "@/components/cash/history/CashTotal";
import { HistoryTable } from "@/components/cash/history/HistoryTable";
import { useCashHistoryLogic } from "@/hooks/cash/useCashHistoryLogic";
import { usePagination } from "@/hooks/usePagination";
import cashTransferStore from "@/stores/cash/cashTransferStore";
import useModalStore from "@/stores/modalStorage";


export default function Page() {
    const {currentPage, handlePageNumber} = usePagination("&page=1");
    useCashHistoryLogic(currentPage);
    const { history } = cashTransferStore();
    const { modals, openModal, closeModal } = useModalStore();


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Historial de transacciones" />
        <div className="p-4">
          <HistoryTable />
        </div>
        <Pagination records={history} handlePageNumber={handlePageNumber } />
    </div>
    <div className="md:col-span-3">
        <ViewTitle text="Total en cuentas" />
        <div className="p-4">
          <CashTotal />
        </div>
        <div className="p-4 flex justify-center">
          <Button preset={Preset.primary} text="Transferir entre cuentas" onClick={()=> openModal("AccountsTransfers")}/>
        </div>
    </div>  
    <AccountsTransfersModal isShow={modals.AccountsTransfers} onClose={()=>{ closeModal("AccountsTransfers")}} />
</div>
  );
}

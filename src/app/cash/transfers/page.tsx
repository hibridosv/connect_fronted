'use client';
import { TransfersForm } from "@/components/cash/transfers/TransfersForm";
import { TransfersTable } from "@/components/cash/transfers/TransfersTable";
import { Pagination } from "@/components/Pagination";
import { ViewTitle } from "@/components/ViewTitle";
import { useCashTransfersLogic } from "@/hooks/cash/useCashTransfersLogic";
import { usePagination } from "@/hooks/usePagination";
import cashTransferStore from "@/stores/cash/cashTransferStore";


export default function Page() {
    const {currentPage, handlePageNumber} = usePagination("&page=1");
    useCashTransfersLogic(currentPage);
    const { transfers } = cashTransferStore();



  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-4 md:border-r md:border-primary">
        <ViewTitle text="Entradas y salidas de efectivo" />
        <div className="p-4">
          <TransfersForm />
        </div>
    </div>
    <div className="md:col-span-6">
        <ViewTitle text="Listado de transacciones" />
        <div className="p-4">
          <TransfersTable />
        </div>
        <Pagination records={transfers} handlePageNumber={handlePageNumber } />
    </div> 
</div>
  );
}

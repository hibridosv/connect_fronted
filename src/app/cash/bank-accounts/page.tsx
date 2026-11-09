'use client';
import { ViewTitle } from "@/components/ViewTitle";
import { AccountForm } from "@/components/cash/accounts/AccountForm";
import { AccountsTable } from "@/components/cash/accounts/AccountsTable";
import { AccountsTransfersModal } from "@/components/cash/accounts/AccountsTransfersModal";
import { useCashAccountLogic } from "@/hooks/cash/useCashAccountLogic";
import useModalStore from "@/stores/modalStorage";
import { MdCurrencyExchange } from "react-icons/md";


export default function Page() {
  useCashAccountLogic(); 
  const { modals, openModal, closeModal } = useModalStore();



  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-4 md:border-r md:border-primary">
        <ViewTitle text="Nueva Cuenta" />
        <div className="p-4">
          <AccountForm />
        </div>
    </div>
    <div className="md:col-span-6">
        <div className="flex justify-between items-center">
          <ViewTitle text="Listado de cuentas" />
          <MdCurrencyExchange size={28} className="clickeable mr-4 animate-pulse" color="red" onClick={()=> openModal("AccountsTransfers")} />
        </div>
        <div className="p-4">
          <AccountsTable />
        </div>
    </div> 
    <AccountsTransfersModal isShow={modals.AccountsTransfers} onClose={()=>{ closeModal("AccountsTransfers")}} />
</div>
  );
}

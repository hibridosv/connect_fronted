'use client';

import { CashdrawerDetails } from "@/components/cashdrawer/CashDrawerDetails";
import { CashdrawerModal } from "@/components/cashdrawer/CashDrawerModal";
import { ExpiresInvoice } from "@/components/cashdrawer/ExpiresInvoice";
import { Drawers } from "@/components/cuts/Drawers";
import { ShowCutsTable } from "@/components/cuts/ShowCutsTable";
import { Pagination } from "@/components/Pagination";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useCashDrawersLogic } from "@/hooks/cuts/useCashDrawersLogic";
import { useCutsLogic } from "@/hooks/cuts/useCutsLogic";
import { usePagination } from "@/hooks/usePagination";
import useCutStore from "@/stores/cashdrawer/cutStore";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";
import { useState } from "react";
import { FaUser, FaUsers } from "react-icons/fa";

export default function Page() {
  const { currentPage, handlePageNumber } = usePagination("&page=1");
  useCashDrawersLogic();
  const { cuts, loading } = useCutStore();
  const { user, invoiceExist, isInvoiceExpires } = useConfigStore();
  const { modals, closeModal } = useModalStore();
  const [showAll, setShowAll] = useState(true);
  useCutsLogic(`cuts?included=employee,cashdrawer${!showAll && `&filterWhere[employee_id]==${user?.id}`}&sort=-updated_at&perPage=10${currentPage}`, currentPage, showAll);
  const { getElement } = useTempStorage();
  const selectDrawer = getElement("selectDrawer");

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">

      <div className="md:col-span-5 md:border-r md:border-primary">
        <ViewTitle text="Cajas disponibles" />
        <ExpiresInvoice isShow={invoiceExist && isInvoiceExpires > 0} expiresDays={isInvoiceExpires} />
        <Drawers />
      </div>

      <div className="md:col-span-5">
        <div className="flex items-center justify-between pr-4">
          <ViewTitle text="Últimos cortes" />
          <div className="flex rounded-lg border border-bg-subtle overflow-hidden bg-bg-content shrink-0">
            <button
              onClick={() => setShowAll(true)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors ${showAll ? 'bg-primary text-text-inverted' : 'text-text-muted hover:bg-bg-subtle'}`}
            >
              <FaUsers size={11} />
              Todos
            </button>
            <button
              onClick={() => setShowAll(false)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors ${!showAll ? 'bg-primary text-text-inverted' : 'text-text-muted hover:bg-bg-subtle'}`}
            >
              <FaUser size={11} />
              Míos
            </button>
          </div>
        </div>
        {loading
          ? <SkeletonTable columns={4} rows={10} />
          : <ShowCutsTable records={cuts?.data} />
        }
        <Pagination records={cuts} handlePageNumber={handlePageNumber} />
      </div>

      <CashdrawerModal isShow={modals.cashDrawerOpen} onClose={() => closeModal('cashDrawerOpen')} drawer={selectDrawer} />
      <CashdrawerDetails isShow={modals.cashDrawerDetails} onClose={() => closeModal('cashDrawerDetails')} />
      <ToasterMessage />
    </div>
  );
}

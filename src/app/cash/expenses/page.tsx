'use client';
import { useState } from 'react';
import { Pagination } from "@/components/Pagination";
import { ExpenseImageDeleteModal } from "@/components/cash/expenses/ExpenseImageDeleteModal";
import { ExpenseImageModal } from "@/components/cash/expenses/ExpenseImageModal";
import { ExpenseImagePreviewModal } from "@/components/cash/expenses/ExpenseImagePreviewModal";
import { ExpensesForm } from "@/components/cash/expenses/ExpensesForm";
import { ExpensesTable } from "@/components/cash/expenses/ExpensesTable";
import { NewCategoryModal } from "@/components/cash/NewCategoryModal";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { usePagination } from "@/hooks/usePagination";
import cashExpensesStore from "@/stores/cash/cashExpensesStore";
import useModalStore from "@/stores/modalStorage";
import { FaCalendarDay, FaListUl } from "react-icons/fa";



export default function Page() {
  const { modals, closeModal} = useModalStore();
  const { expenses } = cashExpensesStore();
  const { currentPage, handlePageNumber } = usePagination("&page=1");
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-4 md:border-r md:border-primary">
        <ViewTitle text="Gastos" />
        <div className="p-4">
          <ExpensesForm showAll={showAll} currentPage={currentPage} />
        </div>
    </div>
    <div className="md:col-span-6">
        <div className="flex justify-between items-center">
          <ViewTitle text="Ultimos movimientos" />
          <div className="flex rounded-lg border border-bg-subtle overflow-hidden bg-bg-content shrink-0 mr-4">
            <button
              onClick={() => setShowAll(false)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors ${!showAll ? 'bg-primary text-text-inverted' : 'text-text-muted hover:bg-bg-subtle'}`}
            >
              <FaCalendarDay size={11} />
              Hoy
            </button>
            <button
              onClick={() => setShowAll(true)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors ${showAll ? 'bg-primary text-text-inverted' : 'text-text-muted hover:bg-bg-subtle'}`}
            >
              <FaListUl size={11} />
              Todos
            </button>
          </div>
        </div>
        <div className="p-4">
          <ExpensesTable showAll={showAll} />
        </div>
        {showAll && <Pagination records={expenses} handlePageNumber={handlePageNumber} />}
    </div>
    <NewCategoryModal isShow={modals.NewCategory} onClose={() => closeModal("NewCategory")} />
    <ExpenseImageModal isShow={modals.expenseImage} onClose={() => closeModal("expenseImage")} />
    <ExpenseImageDeleteModal isShow={modals.expenseImageDelete} onClose={() => closeModal("expenseImageDelete")} />
    <ExpenseImagePreviewModal isShow={modals.expenseImagePreview} onClose={() => closeModal("expenseImagePreview")} />
    <ToasterMessage />
  </div>
  )}

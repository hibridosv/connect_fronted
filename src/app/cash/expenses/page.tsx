'use client';
import { ExpenseImageDeleteModal } from "@/components/cash/expenses/ExpenseImageDeleteModal";
import { ExpenseImageModal } from "@/components/cash/expenses/ExpenseImageModal";
import { ExpenseImagePreviewModal } from "@/components/cash/expenses/ExpenseImagePreviewModal";
import { ExpensesForm } from "@/components/cash/expenses/ExpensesForm";
import { ExpensesTable } from "@/components/cash/expenses/ExpensesTable";
import { NewCategoryModal } from "@/components/cash/NewCategoryModal";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import useModalStore from "@/stores/modalStorage";



export default function Page() {
  const { modals, closeModal} = useModalStore();


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-4 md:border-r md:border-primary">
        <ViewTitle text="Gastos" />
        <div className="p-4">
          <ExpensesForm />
        </div>
    </div>
    <div className="md:col-span-6">
        <ViewTitle text="Ultimos movimientos" />
        <div className="p-4">
          <ExpensesTable />
        </div>
    </div> 
    <NewCategoryModal isShow={modals.NewCategory} onClose={() => closeModal("NewCategory")} />
    <ExpenseImageModal isShow={modals.expenseImage} onClose={() => closeModal("expenseImage")} />
    <ExpenseImageDeleteModal isShow={modals.expenseImageDelete} onClose={() => closeModal("expenseImageDelete")} />
    <ExpenseImagePreviewModal isShow={modals.expenseImagePreview} onClose={() => closeModal("expenseImagePreview")} />
    <ToasterMessage />
  </div>
  )}

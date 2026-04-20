'use client';
import { PurchasesBooksList } from "@/components/reports/PurchasesBooksList";
import { PurchasesDetailsModal } from "@/components/reports/PurchasesDetailsModal";
import { PurchasesDuplicateReviewModal } from "@/components/reports/PurchasesDuplicateReviewModal";
import { PurchasesImportSection } from "@/components/reports/PurchasesImportSection";
import { ReportPurchasesTable } from "@/components/reports/ReportPurchasesTable";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { usePurchasesLogic } from "@/hooks/reports/usePurchasesLogic";
import useModalStore from "@/stores/modalStorage";
import purchasesStore from "@/stores/reports/purchasesStore";
import useTempStorage from "@/stores/useTempStorage";
import { useState } from "react";

export default function Page() {
  const { setElement, elements } = useTempStorage();
  const selectedBookId: string | null = elements['selectedPurchaseBook'] ?? null;
  const [isUploading, setIsUploading] = useState(false);
  usePurchasesLogic(selectedBookId);
  const { purchases, loading, loadingInvoices, invoices } = purchasesStore();
  const { modals, closeModal } = useModalStore();

  const selectedBook = purchases?.find((p: { id: string }) => p.id === selectedBookId) ?? purchases?.[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">

      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Libro de compras" />
        <ReportPurchasesTable
          records={invoices}
          isLoading={loading || loadingInvoices}
        />
      </div>

      <div className="md:col-span-3 p-4 space-y-5">

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Libros disponibles</p>
          <PurchasesBooksList
            purchases={purchases}
            invoicesCount={invoices?.length ?? 0}
            selectedId={selectedBookId}
            onSelect={(id) => setElement('selectedPurchaseBook', id)}
            disabled={isUploading}
          />
        </div>
        <PurchasesImportSection
          bookName={selectedBook?.name}
          bookId={selectedBook?.id}
          onUploadingChange={setIsUploading}
          hasBooks={!!purchases?.length}
        />
      </div>

      <PurchasesDetailsModal isShow={modals.purchasesDetailsModal} onClose={() => closeModal('purchasesDetailsModal')} />
      <PurchasesDuplicateReviewModal isShow={modals.purchasesDuplicateReviewModal} onClose={() => closeModal('purchasesDuplicateReviewModal')} />
      <ToasterMessage />
    </div>
  );
}

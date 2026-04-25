'use client';
import { AutomationFlowIllustration } from "@/components/reports/AutomationFlowIllustration";
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
import { LuFileJson, LuShieldCheck, LuScanLine, LuSparkles, LuMail, LuZap } from "react-icons/lu";

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
        {!loading && !loadingInvoices && (!invoices || invoices.length === 0) ? (
          <div className="m-4 space-y-4">
            <div className="bg-bg-content rounded-xl border border-bg-subtle shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <LuFileJson size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-base mb-1">Registre sus compras fácilmente</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Importe los archivos <span className="font-semibold text-text-base">JSON</span> que su proveedor le entrega al momento de la compra. El sistema analiza cada campo del documento en busca de inconsistencias, errores de formato y datos faltantes antes de registrar cualquier información.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-info/5 border border-info/25">
                  <LuScanLine size={16} className="text-info mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-text-base">Análisis completo</p>
                    <p className="text-xs text-text-muted mt-0.5">Verifica todos los campos y estructura del JSON al momento de la carga.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-danger/5 border border-danger/25">
                  <LuShieldCheck size={16} className="text-danger mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-text-base">Detección de errores</p>
                    <p className="text-xs text-text-muted mt-0.5">Identifica duplicados, montos incorrectos y datos inconsistentes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/25">
                  <LuSparkles size={16} className="text-success mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-text-base">Generación de anexos</p>
                    <p className="text-xs text-text-muted mt-0.5">Produce el libro de compras listo para presentación fiscal.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-xl border border-cyan-400/30 p-5 overflow-hidden bg-gradient-to-br from-cyan-500/8 via-blue-500/8 to-primary/8">
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400/40 animate-ping opacity-75" />
                  <LuZap size={14} className="relative text-cyan-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">Automatización inteligente</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0">
                  <LuMail size={18} className="text-cyan-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-base mb-1">Procesamiento automático desde su correo</p>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Olvídese de importar archivos manualmente. Nuestro sistema lee directamente el email que su proveedor le envía, extrae el JSON adjunto, lo procesa y lo registra en su libro de compras de forma automática — sin intervención de su parte.
                  </p>
                  <div className="mt-3 relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-xs font-semibold text-cyan-600 overflow-hidden cursor-default select-none">
                    <span className="absolute inset-0 rounded-full animate-pulse bg-cyan-400/10" />
                    <LuZap size={11} className="relative z-10 animate-bounce" style={{ animationDuration: '1s' }} />
                    <span className="relative z-10">Función premium — consulte con su asesor</span>
                  </div>
                </div>
              </div>
            </div>

            <AutomationFlowIllustration />
          </div>
        ) : (
          <ReportPurchasesTable
            records={invoices}
            isLoading={loading || loadingInvoices}
          />
        )}
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
          isEmpty={!loading && !loadingInvoices && (!invoices || invoices.length === 0)}
        />
      </div>

      <PurchasesDetailsModal isShow={modals.purchasesDetailsModal} onClose={() => closeModal('purchasesDetailsModal')} />
      <PurchasesDuplicateReviewModal isShow={modals.purchasesDuplicateReviewModal} onClose={() => closeModal('purchasesDuplicateReviewModal')} />
      <ToasterMessage />
    </div>
  );
}

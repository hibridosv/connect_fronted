'use client';
import { DocumentErrorsModal } from "@/components/invoicing/DocumentErrorsModal";
import { DocumentsElectronicTable } from "@/components/invoicing/DocumentsElectronicTable";
import { InvoiceDetailsModal } from "@/components/invoicing/InvoiceDetailsModal";
import { ShowTotal } from "@/components/ShowTotal";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useInvoicingElectronicLogic } from "@/hooks/invoicing/useInvoicingElectronicLogic";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";


export default function Page() {
  const { history, resendDocument } = useInvoicingElectronicLogic('electronic/documents/rejected', 'download.excel.electronic', true);
  const { getElement} = useTempStorage();
  const { modals, closeModal } = useModalStore();
  const documentSelected = getElement('documentSelected') ?? {};
  const quantity = history?.length ?? 0;


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="REPORTE DOCUMENTOS ELECTRONICOS RECHAZADOS" />
        <div className="p-4">
          <DocumentsElectronicTable records={history} resendDocument={resendDocument} />
        </div>
    </div>
    <div className="md:col-span-3">
        <ViewTitle text="TOTAL DE DOCUMENTOS" />
        <div className="p-4">
          <ShowTotal quantity={quantity} text="Cantidad de documentos" number={true} />
        </div>
    </div> 
    <InvoiceDetailsModal isShow={modals.documentDetail} onClose={() => closeModal('documentDetail')} documentId={documentSelected?.codigo_generacion} />
    <DocumentErrorsModal isShow={modals.documentErrors} onClose={() => closeModal('documentErrors')} document={documentSelected} />
    <ToasterMessage />
</div>
  );
}

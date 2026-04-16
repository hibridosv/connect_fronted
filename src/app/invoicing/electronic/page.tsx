'use client';
import { DateRange, DateRangeValues } from "@/components/button/DateRange";
import { LinksList } from "@/components/button/LinkList";
import { DocumentErrorsModal } from "@/components/invoicing/DocumentErrorsModal";
import { DocumentsElectronicTable } from "@/components/invoicing/DocumentsElectronicTable";
import { InvoiceDetailsModal } from "@/components/invoicing/InvoiceDetailsModal";
import { SendEmailDocumentModal } from "@/components/invoicing/SendEmailDocumentModal";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useInvoiceTypesElectronicLogic } from "@/hooks/invoicing/useInvoiceTypesElectronicLogic";
import { useInvoicingElectronicLogic } from "@/hooks/invoicing/useInvoicingElectronicLogic";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";


export default function Page() {
  const { history, handleGet,links, resendDocument } = useInvoicingElectronicLogic('electronic/documents', 'download.excel.electronic');
  const { Additionalfields, loading: loadingFields} =  useInvoiceTypesElectronicLogic('invoice/type?filterWhere[type]=!9&filterWhere[is_electronic]==1&FilterWhereIn[status]==1,0');
  const isLoadingField = loadingFields.invoiceTypes ?? false; 
  const { getElement} = useTempStorage();
  const { modals, closeModal } = useModalStore();
  const documentSelected = getElement('documentSelected') ?? {};

    const handleFormSubmit = async (values: DateRangeValues) => { 
      if (values.invoiceId == 2) values.invoiceId = '01';
      if (values.invoiceId == 3) values.invoiceId = '03';
      if (values.invoiceId == 4) values.invoiceId = '14';
      if (values.invoiceId == 5) values.invoiceId = '05';
      if (values.invoiceId == 8) values.invoiceId = '04';
        await handleGet(values, 'electronic/documents', 'download.excel.electronic');
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="REPORTE DOCUMENTOS ELECTRONICOS" />
        <div className="p-4">
          <DocumentsElectronicTable records={history} resendDocument={resendDocument} />
        </div>
    </div>
    <div className="md:col-span-3">
        <ViewTitle text="Seleccionar fechas" />
          <div className="mt-2 p-2">
           <DateRange onSubmit={handleFormSubmit} loading={isLoadingField} additionalFields={Additionalfields}  />
          </div>
          <div className="p-4">
            <LinksList links={links} text="DESCARGAR" />
          </div>
    </div> 
    <SendEmailDocumentModal isShow={modals.documentEmail} onClose={() => closeModal('documentEmail')} document={documentSelected} />
    <InvoiceDetailsModal isShow={modals.documentDetail} onClose={() => closeModal('documentDetail')} documentId={documentSelected?.codigo_generacion} />
    <DocumentErrorsModal isShow={modals.documentErrors} onClose={() => closeModal('documentErrors')} document={documentSelected} />
    <ToasterMessage />
</div>
  );
}

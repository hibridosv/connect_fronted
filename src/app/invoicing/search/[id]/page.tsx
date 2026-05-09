'use client'

import { Button, Preset } from "@/components/button/button";
import { CreateCreditNoteModal } from "@/components/invoicing/CreateCreditNoteModal";
import { InvoiceDetails } from "@/components/invoicing/InvoiceDetails";
import { InvoiceDetailsButtons } from "@/components/invoicing/InvoiceDetailsButtons";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useInvoiceDetailsLogic } from "@/hooks/invoicing/useInvoiceDetailsLogic";
import useModalStore from "@/stores/modalStorage";
import { useRouter } from "next/navigation";



export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const { order, loading, deleteCreditNote } = useInvoiceDetailsLogic(id, true);
  const isLoading = loading.getOrder ?? false;
  const isDeletingCreditNote = loading.deletingCreditNote ?? false;
  const router = useRouter();
  const { modals, closeModal } = useModalStore();

  console.log(order);
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
          <ViewTitle text="Detalles de la factura" />
          <InvoiceDetails isLoading={isLoading} order={order} onElectronic={false} onDeleteCreditNote={deleteCreditNote} isDeletingCreditNote={isDeletingCreditNote} />
      </div>
      <div className="md:col-span-3">
          <ViewTitle text="Detalles" />
          <div className="w-full p-4">
            <InvoiceDetailsButtons order={order} />
          </div>
          <div className="w-full p-4 flex justify-end">
            <Button text="Regresar" preset={Preset.back} onClick={() => router.back()} />   
          </div>  
      </div> 
      <CreateCreditNoteModal isShow={modals.createCreditNote} onClose={() => closeModal('createCreditNote')} record={order} />
      <ToasterMessage />
    </div>
  );
}
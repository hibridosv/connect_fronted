import { useInvoiceDetailsLogic } from "@/hooks/invoicing/useInvoiceDetailsLogic";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useToastMessageStore from "@/stores/toastMessageStore";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { MdCreditScore } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import { ButtonDownloadGet } from "../button/button-download-get";
import { DeleteModal } from "../DeleteModal";


export interface InvoiceDetailsButtonsI {
  order: any;
}



export function InvoiceDetailsButtons(props: InvoiceDetailsButtonsI) {
    const { order } = props;
    const { activeConfig, client } = useConfigStore();
    const { setError } = useToastMessageStore();
    const { printOrder, loading, deleteOrder } = useInvoiceDetailsLogic(order?.id, false);
    const { modals, closeModal, openModal} = useModalStore();
    const API_URL = process.env.NEXT_PUBLIC_URL_API;
    const isSending = loading.printing ?? false;
    const isCreditNoteAvailable = (order?.invoice_assigned?.type == 3 || order?.invoice_assigned?.type == 2);
    const isActive = order?.status == 3;
    const isDeleted = order?.status == 4;
    const isElectronic = order?.invoice_assigned?.is_electronic === 1;
    
  if (!order) return null;


  return (
            <div className="bg-bg-content border border-bg-subtle rounded-lg p-4">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">

                { activeConfig && activeConfig.includes("print-link") ? (
                  <ButtonDownloadGet
                    autoclass={false} 
                    href={`id=${order?.id}&route=download.pdf.invoice`}
                    style="flex flex-col items-center justify-center gap-1 text-text-muted hover:text-blue-600 transition-colors duration-200 clickeable"
                  >
                    <div className="p-3 bg-bg-subtle rounded-full">
                      <FaPrint size={28} />
                    </div>
                    <span className="text-xs font-medium">Imprimir</span>
                  </ButtonDownloadGet>
                ) : (
                  <button
                    title="Imprimir"
                    disabled={isSending}
                    onClick={() => printOrder(order?.id)}
                    className="flex flex-col items-center justify-center gap-1 text-text-muted hover:text-blue-600 transition-colors duration-200 clickeable"
                  >
                    <div className="p-3 bg-bg-subtle rounded-full">
                      <FaPrint size={28} />
                    </div>
                    <span className="text-xs font-medium">Imprimir</span>
                  </button>
                )}

                {isElectronic && (
                  <a
                    href={`${API_URL}documents/download/pdf/${order?.id}/${client?.id}`}
                    target="_blank"
                    title="Descargar PDF electrónico"
                    className="flex flex-col items-center justify-center gap-1 text-text-muted hover:text-red-600 transition-colors duration-200 clickeable"
                  >
                    <div className="p-3 bg-bg-subtle rounded-full">
                      <FaFilePdf size={28} />
                    </div>
                    <span className="text-xs font-medium">PDF DTE</span>
                  </a>
                )}

                {isCreditNoteAvailable && (
                  <button
                    title="Crear nota de crédito"
                    onClick={() => {
                      if (isDeleted) {
                        setError({ message: "Este documento ya se encuentra eliminado" });
                      } else {
                        openModal('createCreditNote');
                      }
                    }}
                    disabled={isDeleted || isSending}
                    className="flex flex-col items-center justify-center gap-1 text-text-muted hover:text-sky-600 disabled:text-text-muted/50 disabled:cursor-not-allowed transition-colors duration-200 clickeable"
                  >
                    <div className="p-3 bg-bg-subtle rounded-full">
                      <MdCreditScore size={28} />
                    </div>
                    <span className="text-xs font-medium">Nota C.</span>
                  </button>
                )}

                <button
                  title="Anular orden"
                  onClick={() => {
                    if (isDeleted) {
                      setError({ message: "Este documento ya se encuentra eliminado" });
                    } else {
                      openModal('deleteOrder'); // Placeholder for modal logic
                    }
                  }}
                  disabled={isDeleted || isSending}
                  className="flex flex-col items-center justify-center gap-1 text-text-muted hover:text-danger disabled:text-text-muted/50 disabled:cursor-not-allowed transition-colors duration-200 clickeable"
                >
                  <div className="p-3 bg-bg-subtle rounded-full">
                    <RiDeleteBin2Line size={28} />
                  </div>
                  <span className="text-xs font-medium">Anular</span>
                </button>
              </div>
              <DeleteModal
                      isShow={modals.deleteOrder}
                      text={`¿Estas seguro de eliminar este contacto?`}
                      onDelete={() =>{ deleteOrder(order?.id) }}
                      onClose={() => closeModal('deleteOrder')} />
            </div>
  )
}
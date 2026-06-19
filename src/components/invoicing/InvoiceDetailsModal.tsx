import { useInvoiceDetailsLogic } from "@/hooks/invoicing/useInvoiceDetailsLogic";
import Link from "next/link";
import { Button, Preset } from "../button/button";
import Modal from "../modal/Modal";
import { InvoiceDetails } from "./InvoiceDetails";

export interface InvoiceDetailsModalI {
  onClose: () => void;
  isShow: boolean;
  documentId: string;
  onElectronic?: boolean;
}
export function InvoiceDetailsModal(props: InvoiceDetailsModalI) {
    const { onClose, isShow, documentId, onElectronic = true } = props;
    const { order, loadingOrder } = useInvoiceDetailsLogic(documentId, isShow);
    const isLoading = loadingOrder;

  if (!isShow || !documentId) return null;


  return (
    <Modal show={isShow} onClose={onClose} size="xl4" headerTitle={`Detalles del Documento: #${order?.invoice || ''}`}>
      <Modal.Body>
        <InvoiceDetails isLoading={isLoading} order={order} onElectronic={onElectronic} />
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end w-full gap-4">
          <Link href={`/invoicing/search/${order?.id}`} className="button-href">Ver Opciones</Link>
          <Button onClick={onClose} preset={Preset.close} text="Cerrar" />
        </div>
      </Modal.Footer>
    </Modal>
  );
}
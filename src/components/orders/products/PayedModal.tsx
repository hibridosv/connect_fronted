"use client";
import { Button, Preset } from "@/components/button/button";
import { ButtonDownloadGet } from "@/components/button/button-download-get";
import Modal from "@/components/modal/Modal";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import ordersStore from "@/stores/orders/ordersStore";
import useTempStorage from "@/stores/useTempStorage";
import { nameOfPaymentType } from "./PayModal";

export interface PayedModal {
  onClose: () => void;
  isShow: boolean;
}

export function PayedModal(props: PayedModal) {
  const { onClose, isShow } = props;
  const { system, activeConfig } = useConfigStore();
  const { getElement, clearElement  } = useTempStorage();
  const orderPayed = getElement('paymentSuccess') ?? null;
  const paymentType = getElement('paymentType') ?? 1;
  const { sending } = ordersStore();

  if (!isShow || !orderPayed) return null;

  const handleClose = () => {
    clearElement('paymentSuccess');
    onClose();
  }


  return (
    <Modal show={isShow} onClose={handleClose} size="md" headerTitle="" closeOnOverlayClick={false} removeTitle={true}>
      <Modal.Body>
        <div className="p-6">
        <div>
        <div className="w-full my-4 clickeable" onClick={handleClose}>
          { orderPayed?.invoice_assigned?.type != 8 &&
          <div  className='flex justify-between py-2 border-y border-bg-subtle text-text-base'>
            <div className="flex flex-col items-center">
              <span className="text-sm text-text-muted">Descuentos</span>
              <span className="text-base font-semibold">{numberToMoney(orderPayed?.discount, system)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-text-muted">Impuestos</span>
              <span className="text-base font-semibold">{numberToMoney(orderPayed?.taxes, system)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-text-muted">Sub Total</span>
              <span className="text-base font-semibold">{numberToMoney(orderPayed?.subtotal, system)}</span>
            </div>
          </div>
          }

          <div className="flex justify-center mt-6 text-text-muted text-lg">TOTAL</div>
          <div className="flex justify-center text-7xl mb-6 font-bold text-primary">{numberToMoney(orderPayed?.total - orderPayed?.retention, system)}</div>
          { paymentType === 1 && orderPayed?.invoice_assigned?.type != 8 ? <>
          <div className="flex justify-center text-text-muted text-lg">CAMBIO</div>
          <div className="flex justify-center text-7xl mb-6 text-danger font-bold">{numberToMoney(orderPayed?.change, system)}
          </div></> : 
          <div className='flex justify-center text-xl font-semibold uppercase text-info'>
            { paymentType === 5 ? 
            <span>Crédito Otorgado Correctamente</span> : orderPayed?.invoice_assigned?.type == 8 ? <span>Nota de Envío Realizada</span> :
            <span>Pago Realizado con {nameOfPaymentType(paymentType)}</span> }
          </div>}
        
        </div>
      </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
       { activeConfig && activeConfig.includes("print-link") && 
       <ButtonDownloadGet href={`id=${orderPayed.id}&route=download.pdf.invoice`}><Button text="Imprimir" preset={Preset.primary} isFull disabled={sending} /></ButtonDownloadGet>  }
        <Button onClick={handleClose} preset={Preset.close} isFull disabled={sending} /> 
      </Modal.Footer>
    </Modal>
  );

}

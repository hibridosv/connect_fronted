"use client";
import { Button, Preset } from "@/components/button/button";
import { ButtonDownloadGet } from "@/components/button/button-download-get";
import Modal from "@/components/modal/Modal";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import ordersStore from "@/stores/orders/ordersStore";
import useTempStorage from "@/stores/useTempStorage";
import { HiCurrencyDollar } from "react-icons/hi";
import { nameOfPaymentType } from "../products/PayModal";

export interface PayedRestaurantModalI {
  onClose: () => void;
  isShow: boolean;
}

export function PayedRestaurantModal(props: PayedRestaurantModalI) {
  const { onClose, isShow } = props;
  const { system, activeConfig } = useConfigStore();
  const { getElement, clearElement  } = useTempStorage();
  const orderPayed = getElement('paymentSuccess') ?? null;
  const paymentType = getElement('paymentType') ?? 1;
  const { sending, collecting } = ordersStore();
  const tips =  orderPayed?.attributes?.tips ?? 0;
  const total = (paymentType === 1) ? (orderPayed?.total - orderPayed?.retention + tips) : 0;

  if (!isShow) return null;

  const handleClose = () => {
    clearElement('paymentSuccess');
    onClose();
  }


  return (
    <Modal show={isShow} onClose={handleClose} size="md" headerTitle="" closeOnOverlayClick={false} removeTitle={true}>
      <Modal.Body>
        <div className="p-6">
          {collecting ? (
            <div className="w-full my-4 h-32 flex items-center justify-center relative">
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-bg-content/80 animate-fade-in">
              <div className="absolute w-2 h-2 top-6 left-10 bg-primary/20 rounded-full animate-float" />
              <div className="absolute w-1.5 h-1.5 top-14 right-12 bg-accent/20 rounded-full animate-float-slow" />
              <div className="absolute w-1 h-1 bottom-20 left-14 bg-primary/15 rounded-full animate-float-diagonal" />
              <div className="absolute w-2 h-2 bottom-10 right-20 bg-accent/15 rounded-full animate-float" />

              <div className="relative flex items-center justify-center mb-5">
                <div className="absolute w-16 h-16 rounded-full bg-primary/10 animate-ping" />
                <div className="absolute w-20 h-20 rounded-full border-2 border-transparent border-t-primary/50 animate-spin" />
                <div className="absolute w-24 h-24 rounded-full border border-transparent border-b-accent/30 animate-[spin_3s_linear_infinite_reverse]" />
                <div className="relative w-14 h-14 bg-bg-content rounded-full flex items-center justify-center border-2 border-primary/20 shadow-lg shadow-primary/10 animate-pulse-glow">
                  <HiCurrencyDollar className="w-7 h-7 text-primary" />
                </div>
              </div>

              <p className="text-base font-semibold text-text-base animate-slide-up">
                Procesando cobro
              </p>
              <p className="text-xs text-text-muted mt-1 animate-slide-up-delay">
                Espere un momento...
              </p>

              <div className="w-44 h-1 bg-bg-subtle rounded-full mt-4 overflow-hidden animate-slide-up-delay-2">
                <div className="h-full w-1/2 bg-gradient-to-r from-primary/40 via-primary to-primary/40 rounded-full animate-shimmer" />
              </div>
            </div>
            </div>
          ) : (
                      
        <div className="w-full my-4 clickeable" onClick={handleClose}>
          { orderPayed && orderPayed?.invoice_assigned?.type != 8 &&
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
          <div className="flex justify-center text-7xl mb-6 font-bold text-primary">{numberToMoney(total, system)}</div>
          { paymentType === 1 && orderPayed?.invoice_assigned?.type != 8 ? <>
          <div className="flex justify-center text-text-muted text-lg">CAMBIO</div>
          <div className="flex justify-center text-7xl mb-6 text-danger font-bold">{numberToMoney(orderPayed?.change - tips, system)}
          </div></> : 
          <div className='flex justify-center text-xl font-semibold uppercase text-info'>
            { paymentType === 5 ? 
            <span>Crédito Otorgado Correctamente</span> : orderPayed?.invoice_assigned?.type == 8 ? <span>Nota de Envío Realizada</span> :
            <span>Pago Realizado con {nameOfPaymentType(paymentType)}</span> }
          </div>}
        
      </div> )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        { !collecting &&
          <div>
            { activeConfig && activeConfig.includes("print-link") &&
            <ButtonDownloadGet autoclass={false} href={`id=${orderPayed.id}&route=download.pdf.invoice`}><Button text="Imprimir" preset={Preset.primary} isFull disabled={sending} /></ButtonDownloadGet>  }
            <Button onClick={handleClose} preset={Preset.close} isFull disabled={sending || collecting} /> 
          </div> 
       }
      </Modal.Footer>
    </Modal>
  );

}

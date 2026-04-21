"use client";
import { Alert } from "@/components/Alert/Alert";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useOrderFnLogic } from "@/hooks/order/product/useOrderFnLogic";
import useConfigStore from "@/stores/configStore";
import ordersStore from "@/stores/orders/ordersStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiCurrencyDollar } from "react-icons/hi2";
import { OrderTotal } from "./OrderTotal";

export interface PayModalI {
  onClose: () => void;
  isShow: boolean;
}

export const nameOfPaymentType = (type: number) => {
  switch (type) {
    case 1: return "Efectivo"
    case 2: return "Tarjeta"
    case 3: return "Transferencia"
    case 4: return "Cheque"
    case 5: return "Credito"
    default: return "N/A"
  }
}

export function PayModal(props: PayModalI) {
  const { onClose, isShow } = props;
  const { payMethods } = useConfigStore();
  const { order, collecting, sending } = ordersStore();
  const { register, handleSubmit, reset, setFocus, setValue, watch, formState: { errors } } = useForm();
  const { setElement, getElement} = useTempStorage();
  const paymentType = getElement('paymentType') ?? 1;
  const { pay } = useOrderFnLogic();

  useEffect(() => {
    if (isShow) {
      setFocus('cash');
      setValue('cash', '');
    }
  }, [setFocus, isShow, paymentType, setValue])

  if (!isShow || !order) return null;

  return (
    <Modal show={isShow} onClose={onClose} size="md" headerTitle="" closeOnOverlayClick={false} removeTitle={true}>
      <Modal.Body>
        <div className="relative overflow-hidden min-h-[220px]">
          <div className={`p-4 space-y-6 transition-all duration-500 ${collecting ? 'blur-sm opacity-20 pointer-events-none' : ''}`}>
            <OrderTotal />
              <div>
                <form onSubmit={handleSubmit(pay)} className="w-full">
                {paymentType === 1 ? (
                  <div>
                      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white" >Search</label>
                      <div className="relative">
                        <input
                          type={`${order?.invoice_assigned?.type == 8 ? "hidden" : "number"}`}
                          step="any"
                          id="cash"
                          className="input"
                          placeholder="Ingrese la cantidad de efectivo"
                          {...register("cash")}
                        />
                      </div>
                        <div className="flex justify-center mt-2">
                          <Button type="submit" text={`${order?.invoice_assigned?.type == 8 ? "Crear nota de Envío" : "Cobrar"}`} disabled={collecting} preset={collecting ? Preset.saving : Preset.save} isFull />
                        </div>
                    </div>
                  ) :
                  (
                    <div className="flex justify-center">
                      { paymentType === 5 && !order?.client_id ?
                       <Alert text="Debe agregar un cliente para continuar con el credito" type="danger" isDismissible={false} /> :
                       paymentType === 5 && order?.client_id && order?.client?.is_credit_block == 1 ?
                        <Alert text="Cliente bloqueado para otrorgar credito" type="danger" isDismissible={false} /> :
                        <Button type="submit" preset={collecting ? Preset.saving : Preset.primary}
                        text={ paymentType === 5  ? `Asignar Credito` : `Pagar con ${nameOfPaymentType(paymentType)}`} disabled={collecting} />
                      }
                    </div>
                  )}
                </form>
              </div>
          </div>

          {collecting && (
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
          )}
        </div>
      </Modal.Body>
          { !collecting && order?.invoice_assigned?.type != 8 &&
          <div className='flex justify-between px-4 py-2 text-sm font-semibold border border-bg-subtle rounded-lg transition-colors duration-150'>
            {
              payMethods && payMethods.length > 0 && payMethods.map((method: any) => {
                if (method.status == 0) return null;
                return (<span key={method.id} className={`mx-1 text-sm clickeable transition-colors duration-150 ${paymentType === method.iden ? 'font-bold text-primary' : 'text-text-muted'}`}
                  onClick={()=>setElement('paymentType', method.iden)}>{method.name}</span>);
              })
            }
          </div> }
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} isFull disabled={collecting} /> 
      </Modal.Footer>
    </Modal>
  );

}

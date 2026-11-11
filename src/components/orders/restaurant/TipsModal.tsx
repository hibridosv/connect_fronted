"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useOrderFnLogic } from "@/hooks/order/product/useOrderFnLogic";
import ordersStore from "@/stores/orders/ordersStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { sumarCantidad } from "../utils";

export interface TipsModalI {
  onClose: () => void;
  isShow: boolean;
}




export function TipsModal(props: TipsModalI) {
  const { onClose, isShow } = props;

  const { order, sending } = ordersStore();
  const { tips } = useOrderFnLogic();
  const { getElement, clearElement, setElement } = useTempStorage();
  const typeOfTips = getElement('typeOfTips') ?? 1; // 1: cantidad o 2: porcentaje
  const { register, handleSubmit, resetField, setFocus, setValue } = useForm();
  const { setError } = useToastMessageStore();

  useEffect(() => {
    if (isShow) {
      setValue("quantity", null)
      setFocus('quantity', {shouldSelect: true})
    }
  }, [setFocus, setValue, isShow, typeOfTips])


  if (!isShow || !order) return null;

 const onSubmit = async(data: any) => {
    if (!data.quantity || data.quantity < 0) {
        return; 
    }
      const total = sumarCantidad(order?.invoiceproducts);
      let tipValue: number;
      let percentageValue: number;

      if (typeOfTips === 2) {
          percentageValue = parseFloat(data.quantity);
          tipValue = (percentageValue / 100) * total;
      } else {
          tipValue = parseFloat(data.quantity);
          percentageValue = (tipValue / total) * 100;
      }
    
      let values = {
          type_tip: typeOfTips,
          tips: tipValue,
          percentage: percentageValue,
      };
      const success = await tips(order.id, values);

      if (success) {
        clearElement('typeOfTips');
        onClose();
      } else {
        setError({ message: `Existe un error, No se efectuo correctamente la propina. Vuelva a intentarlo.`})
     }
 }

 const handleClose = ()=>{
        clearElement('typeOfTips');
        onClose();
 }



  return (
    <Modal show={isShow} onClose={handleClose} size="sm" headerTitle="Establecer Propina" >
      <Modal.Body>
        <div className="p-4 space-y-4">
          <div className="bg-bg-base rounded-lg border border-bg-subtle/80 divide-y divide-bg-subtle flex justify-between">
              <div className={`m-2 uppercase font-semibold w-full h-full text-center rounded-lg ${ typeOfTips == 1 ? 'bg-bg-subtle' : 'bg-bg-subtle/60 clickeable-table'}`} 
              onClick={()=> { setElement('typeOfTips', 1)}}>Cantidad</div>
              <div className={`m-2 uppercase font-semibold w-full h-full text-center rounded-lg ${ typeOfTips == 2 ? 'bg-bg-subtle' : 'bg-bg-subtle/60 clickeable-table'}`} 
              onClick={()=> { setElement('typeOfTips', 2)}}>Porcentaje</div>
          </div>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)} >
            <div className="w-full mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-text-muted mb-1">{ typeOfTips == 1 ? "Cantidad" : "Porcentaje" }</label>
              <input type="number" step="any" {...register("quantity", { required: true })} className="input" />
            </div>
            <div className="flex justify-center">
              <Button type="submit" disabled={sending} preset={sending ? Preset.saving : Preset.save} />
            </div>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} preset={Preset.close} disabled={sending} />
      </Modal.Footer>
    </Modal>
  );

}

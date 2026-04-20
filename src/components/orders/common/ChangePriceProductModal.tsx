"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useOrderFnLogic } from "@/hooks/order/product/useOrderFnLogic";
import ordersStore from "@/stores/orders/ordersStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface ChangePriceProductModalI {
  onClose: () => void;
  isShow: boolean;
}




export function ChangePriceProductModal(props: ChangePriceProductModalI) {
  const { onClose, isShow } = props;
  const { order, sending } = ordersStore();
  const { updatePrice } = useOrderFnLogic();
  const { getElement, clearElement } = useTempStorage();
  const product = getElement('productSelected');
  const { setError } = useToastMessageStore();

  const { register, handleSubmit, resetField, setFocus, setValue } = useForm();

  useEffect(() => {
    if (product && isShow) {
      setValue("quantity", product?.unit_price)
      setFocus('quantity', {shouldSelect: true}) 
    }
  }, [setFocus, isShow, product, setValue])

  if (!isShow || !order) return null;

 const onSubmit = async(data: any) => {
     if (!data.quantity || !product || !order) return;
    let values = {
      order_id: order.id,
      quantity: data.quantity,
    };
    const success = await updatePrice(product.id, values);
     if (success) {
       clearElement('productSelected');
       onClose();
     } else {
      setError({ message: `Existe un error, No se actualizo correctamente el precio. Vuelva a intentarlo.`})
     }
 }



  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle="Cambiar Precio" >
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <div className="bg-bg-base rounded-lg border border-bg-subtle/80 p-4">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} >
              <div>
                <label htmlFor="quantity" className="input-label" >Nuevo Precio</label>
                <input type="number" step="any" {...register("quantity", { required: true, min: 0})} className="input" />
              </div>
              <Button type="submit" disabled={sending} preset={sending ? Preset.saving : Preset.save} />
            </form>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={sending} /> 
      </Modal.Footer>
    </Modal>
  );

}

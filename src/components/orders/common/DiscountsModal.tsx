"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useOrderFnLogic } from "@/hooks/order/product/useOrderFnLogic";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import ordersStore from "@/stores/orders/ordersStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { sumarDiscount, sumarTotales, sumarTotalesWithoutDiscount } from "../utils";

export interface DiscountsModalI {
  onClose: () => void;
  isShow: boolean;
  byCode?: boolean;
}




export function DiscountsModal(props: DiscountsModalI) {
  const { onClose, isShow, byCode } = props;
  const { system } = useConfigStore();
  const { setError } = useToastMessageStore();
  const { order, sending } = ordersStore();
  const { discount } = useOrderFnLogic();
  const { getElement, clearElement, setElement } = useTempStorage();
  const product = getElement('productSelected');
  const typeOfDiscount = getElement('typeOfDiscount') ?? 1; // 1: cantidad o 2: porcentaje
  const discountType = getElement('discountType') ?? 1;// 1: producto o 2: orden 
  const { register, handleSubmit, resetField, setFocus, setValue } = useForm();

  useEffect(() => {
    if (isShow) {
      setValue("quantity", null)
      setFocus('quantity', {shouldSelect: true})
    }
  }, [setFocus, setValue, isShow, typeOfDiscount])


  if (!isShow || !order) return null;

 const onSubmit = async(data: any) => {
  if (!data.quantity || !order || !discountType || !typeOfDiscount) return;
  // descuento por porductos no lleva el id por url por que puede ser po codigo (un rango) // orders/product/discount
  // descuentos por orden si lleva el id por parametros // orders/{id}/discount
  // definido por discountType 
    let values = {
        product_id: product ? product.id : null,
        order: order.id, // deben ir por parametros
        typeOfDiscount: typeOfDiscount,
        quantityDiscount: data.quantity,
        product_cod: product ? product.cod : null,
        byCode
      };
      const success = await discount(order.id, values, discountType);
      if (success) {
        clearElement('productSelected');
        clearElement('discountType');
        clearElement('typeOfDiscount');
        onClose();
      } else {
        setError({ message: `Existe un error, No se efectuo correctamente el descuento. Vuelva a intentarlo.`})
     }
 }

 const handleClose = ()=>{
        clearElement('productSelected');
        clearElement('discountType');
        clearElement('typeOfDiscount');
        onClose();
 }



  return (
    <Modal show={isShow} onClose={handleClose} size="sm" headerTitle={`Descuento a ${discountType == 1 ? "Producto" : "Orden"}`} >
      <Modal.Body>
        <div className="p-4 space-y-4">
          <div className="bg-bg-base rounded-lg border border-bg-subtle/80 divide-y divide-bg-subtle flex justify-between">
              <div className={`m-2 uppercase font-semibold w-full h-full text-center rounded-lg ${ typeOfDiscount == 1 ? 'bg-bg-subtle' : 'bg-bg-subtle/60 clickeable-table'}`} 
              onClick={()=> { setElement('typeOfDiscount', 1)}}>Cantidad</div>
              <div className={`m-2 uppercase font-semibold w-full h-full text-center rounded-lg ${ typeOfDiscount == 2 ? 'bg-bg-subtle' : 'bg-bg-subtle/60 clickeable-table'}`} 
              onClick={()=> { setElement('typeOfDiscount', 2)}}>Porcentaje</div>
          </div>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)} >
            <div className="w-full mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-text-muted mb-1">{ typeOfDiscount == 1 ? "Cantidad" : "Porcentaje" }</label>
              <input type="number" step="any" {...register("quantity", { required: true })} className="input" />
            </div>
            <div className="flex justify-center">
              <Button type="submit" disabled={sending} preset={sending ? Preset.saving : Preset.save} />
            </div>
          </form>

          { byCode ?
          <div className="bg-bg-base rounded-lg border border-bg-subtle/80 divide-y divide-bg-subtle">
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-sm text-text-muted">Precio sin descuento:</span>
              <span className="text-sm font-semibold text-text-base">{discountType == 1 ? numberToMoney(product?.unit_price, system) : numberToMoney(sumarTotalesWithoutDiscount(order?.invoiceproducts), system)}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-sm text-text-muted">Descuento aplicado:</span>
              <span className="text-sm font-semibold text-danger">{discountType == 1 ? numberToMoney(product?.discount, system)  : numberToMoney(sumarDiscount(order?.invoiceproducts), system)}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5 bg-primary/5">
              <span className="text-sm font-semibold text-text-base">Total con descuento:</span>
              <span className="text-sm font-bold text-primary">{discountType == 1 ? numberToMoney((parseFloat(product?.unit_price)) - (parseFloat(product?.discount)), system)  : numberToMoney(sumarTotales(order?.invoiceproducts), system)}</span>
            </div>
          </div>
          :
          <div className="bg-bg-base rounded-lg border border-bg-subtle/80 divide-y divide-bg-subtle">
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-sm text-text-muted">Precio sin descuento:</span>
              <span className="text-sm font-semibold text-text-base">{discountType == 1 ? numberToMoney(parseFloat(product?.discount) + parseFloat(product?.total ), system) : numberToMoney(sumarTotalesWithoutDiscount(order?.invoiceproducts), system)}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-sm text-text-muted">Descuento aplicado:</span>
              <span className="text-sm font-semibold text-danger">{discountType == 1 ? numberToMoney(product?.discount, system)  : numberToMoney(sumarDiscount(order?.invoiceproducts), system)}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5 bg-primary/5">
              <span className="text-sm font-semibold text-text-base">Total con descuento:</span>
              <span className="text-sm font-bold text-primary">{discountType == 1 ? numberToMoney(product?.total)  : numberToMoney(sumarTotales(order?.invoiceproducts), system)}</span>
            </div>
          </div>
          }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} preset={Preset.close} disabled={sending} />
      </Modal.Footer>
    </Modal>
  );

}

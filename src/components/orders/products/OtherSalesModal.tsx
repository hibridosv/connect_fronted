"use client";
import { Button, Preset } from "@/components/button/button";
import { Option, RadioButton } from "@/components/button/RadioButton";
import Modal from "@/components/modal/Modal";
import ordersProductsStore from "@/stores/orders/ordersProductsStore";
import ordersStore from "@/stores/orders/ordersStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface OtherSalesModalI {
  onClose: () => void;
  isShow: boolean;
}




export function OtherSalesModal(props: OtherSalesModalI) {
  const { onClose, isShow } = props;
  const { order, sending } = ordersStore();
  const { updateOrder } = ordersProductsStore();
  const { getElement, clearElement } = useTempStorage();
  const option = getElement('optionSelected');
  const optionType = getElement('optionSelectedType');

  const { register, handleSubmit, reset, setFocus, setValue, formState: { errors } } = useForm({ mode: 'onTouched' });
  let optionsRadioButton: Option[] = [
      { id: 1, name: "Gravado" },
      { id: 2, name: "Exento" },
      { id: 3, name: "No Sujeto" },
  ];

  let optionsRadioButtonType: Option[] = [
      { id: 1, name: "Producto" },
      { id: 2, name: "Servicio" },
    ];

  useEffect(() => {
    if (isShow) {
      setValue("quantity", 1)
      setFocus('quantity', {shouldSelect: true}) 
    }
  }, [setFocus, isShow, setValue])

  if (!isShow ) return null;

 const onSubmit = async(data: any) => {
      if (!data.quantity || !data.description|| !data.total) return;
     
          let values = {
              description: data.description,
              quantity: data.quantity,
              total: data.total,
              order_id: order ? order.id : null,
              exempt: option?.id,
              product_type: optionType?.id
          };
      const success = await updateOrder(`orders/others`, values);
      if (success) {
        clearElement('optionSelected');
        clearElement('optionSelectedType');
        reset();
      }
 }


  const handleClose = ()=>{
        clearElement('optionSelected');
        clearElement('optionSelectedType');
        onClose();
  }



  return (
    <Modal show={isShow} onClose={handleClose} size="md" headerTitle="Otras Ventas" >
      <Modal.Body>
        <div className="p-4">
          <form className="w-full space-y-2" onSubmit={handleSubmit(onSubmit)} >
            <div className="flex gap-3">
              <div className="w-1/2">
                <label htmlFor="quantity" className="block text-sm font-medium text-text-muted mb-1">Cantidad</label>
                <input type="number" step="any" {...register("quantity", {
                  required: "La cantidad es requerida",
                  min: { value: 0, message: "La cantidad debe ser mayor o igual a 0" },
                })} className="input" />
              </div>
              <div className="w-1/2">
                <label htmlFor="total" className="block text-sm font-medium text-text-muted mb-1">Precio</label>
                <input type="number" step="any" {...register("total", {
                  required: "El precio es requerido",
                  min: { value: 0, message: "El precio debe ser mayor o igual a 0" },
                })} className="input" />
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="description" className="block text-sm font-medium text-text-muted mb-1">Descripción</label>
              <input type="text" {...register("description", {
                required: "La descripción es requerida",
                minLength: { value: 3, message: "La descripción debe tener mínimo 3 caracteres" },
                maxLength: { value: 250, message: "La descripción debe tener máximo 250 caracteres" },
                pattern: { value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s.,;:¿?¡!()\-\/#$%@+"&'*=_\[\]°]+$/, message: "La descripción contiene caracteres no permitidos"},
              })} className="input" />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-text-muted mb-1">Tipo de Operación</label>
              <RadioButton options={optionsRadioButton} />
            </div>
            <div className="w-full border-t border-bg-subtle pt-2">
              <label className="block text-sm font-medium text-text-muted mb-1">Tipo de Venta</label>
              <RadioButton options={optionsRadioButtonType} optionName="optionSelectedType" />
            </div>
            {Object.values(errors).length > 0 && (
              <div className="flex flex-col gap-1 p-2 rounded-md bg-danger/10 border border-danger/30">
                {Object.values(errors).map((error, index) => (
                  <span key={index} className="text-xs text-danger">{error?.message as string}</span>
                ))}
              </div>
            )}
            <div className="flex justify-center pt-1">
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

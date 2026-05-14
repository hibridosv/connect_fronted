"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useOrderFnLogic } from "@/hooks/order/product/useOrderFnLogic";
import { UpdateServiceInterface } from "@/services/Interfaces";
import ordersStore from "@/stores/orders/ordersStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdDeleteSweep } from "react-icons/md";

export interface AddCommentModalI {
  onClose: () => void;
  isShow: boolean;
}



export function AddCommentModal(props: AddCommentModalI) {
  const { onClose, isShow } = props;
  const { order, sending } = ordersStore();
  const { update} = useOrderFnLogic();
  const { getElement, clearElement } = useTempStorage();
  const { setError } = useToastMessageStore();



  const { register, handleSubmit, resetField, setFocus, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (order && isShow) {
        setValue("value", order?.comment);
        setFocus('value', { shouldSelect: true });
      }
  }, [setFocus, isShow, order, setValue,]);

  if (!isShow || !order) return null;

 const onSubmit = async(data: any) => {
     if (!data.value || !order) return;
     let values: UpdateServiceInterface = {
       row: "comment",
       value: data.value
     }
    const success = await update(order.id, values);
     if (success) {
       clearElement('rowToUpdate');
       clearElement('productSelected');
       onClose();
     } else {
      setError({ message: `Existe un error, No se actualizo correctamente el registro. Vuelva a intentarlo.`})
     }
 }

 const clean = async ()=>{
    if (!order) return;
     let values: UpdateServiceInterface = {
       row: "comment",
       value: null
     }
    const success = await update(order.id, values);
     if (success) {
       clearElement('rowToUpdate');
       clearElement('productSelected');
       onClose();
     } else {
      setError({ message: `Existe un error, No se actualizo correctamente el registro. Vuelva a intentarlo.`})
     }
 }


  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle="Agregar Comentario" >
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <div className="bg-bg-base rounded-lg border border-bg-subtle/80 p-4">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} >
              <div>
                <label htmlFor="value" className="input-label" >Comentario</label>
                  <textarea rows={8} {...register("value", {
                    required: "El comentario es requerido",
                    minLength: { value: 5, message: "Mínimo 5 caracteres" },
                    maxLength: { value: 250, message: "Máximo 250 caracteres" },
                    pattern: { value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s.,;:¿?¡!()\-\/#$%@+"&'*=_\[\]°]+$/, message: "La descripción contiene caracteres no permitidos"},
                  })} className="input" />
                  {errors.value && <span className="text-xs text-danger mt-1">{errors.value.message as string}</span>}
              </div>
              <Button type="submit" disabled={sending} preset={sending ? Preset.saving : Preset.save} />
            </form>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <MdDeleteSweep title="Eliminar Comentario" size={32} className="text-red-700 clickeable justify-start w-full" onClick={clean} />
        <Button onClick={onClose} preset={Preset.close} disabled={sending} /> 
      </Modal.Footer>
    </Modal>
  );

}

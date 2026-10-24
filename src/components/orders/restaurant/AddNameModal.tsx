"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useOrderRestaurantFnLogic } from "@/hooks/order/restaurant/useOrderRestaurantFnLogic";
import ordersStore from "@/stores/orders/ordersStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdDeleteSweep } from "react-icons/md";

export interface AddNameModalI {
  onClose: () => void;
  isShow: boolean;
}


/**
 * Cambia el nombre de la mesa principal de la orden.
 * Desde la pantalla de mesas la orden no esta cargada: usa el elemento temporal 'renameTable' ({ orderId, name }).
 */
export function AddNameModal(props: AddNameModalI) {
  const { onClose, isShow } = props;
  const { order, sending } = ordersStore();
  const { addName, renameTable } = useOrderRestaurantFnLogic();
  const { setError } = useToastMessageStore();
  const { getElement, setElement } = useTempStorage();
  const fromTables = getElement('renameTable');
  const orderId = fromTables?.orderId ?? order?.id;


  const { register, handleSubmit, setFocus, setValue } = useForm();

  useEffect(() => {
    if (orderId && isShow) {
        setValue("value", fromTables ? fromTables.name : order?.attributes?.table?.name ?? null);
        setFocus('value', { shouldSelect: true });
      }
  }, [setFocus, isShow, order, orderId, fromTables, setValue,]);

  if (!isShow || !orderId) return null;

  const handleClose = () => {
    setElement('renameTable', null);
    onClose();
  }

  const saveName = (values: any) => fromTables ? renameTable(orderId, values) : addName(orderId, values);

 const onSubmit = async(data: any) => {
     if (!data.value) return;
     let values: any = {
       name_table: data.value
     }
    const success = await saveName(values);
     if (success) {
       handleClose();
     } else {
      setError({ message: `Existe un error, No se actualizo correctamente el registro. Vuelva a intentarlo.`})
     }
 }

 const clean = async ()=>{
     let values: any = {
       name_table: null
     }
    const success = await saveName(values);
     if (success) {
       handleClose();
     }
 }


  return (
    <Modal show={isShow} onClose={handleClose} size="sm" headerTitle="Agregar Nombre de la mesa" >
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <div className="bg-bg-base rounded-lg border border-bg-subtle/80 p-4">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} >
              <div>
                <label htmlFor="value" className="input-label" >Nombre de la mesa</label>
                  <input type="text" {...register("value", { required: true, max:50, min:5 })} className="input" />
              </div>
              <Button type="submit" disabled={sending} preset={sending ? Preset.saving : Preset.save} />
            </form>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <MdDeleteSweep title="Eliminar Comentario" size={32} className="text-red-700 clickeable justify-start w-full" onClick={clean} />
        <Button onClick={handleClose} preset={Preset.close} disabled={sending} />
      </Modal.Footer>
    </Modal>
  );

}

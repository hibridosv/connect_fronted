"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useOrderRestaurantFnLogic } from "@/hooks/order/restaurant/useOrderRestaurantFnLogic";
import useConfigStore from "@/stores/configStore";
import ordersStore from "@/stores/orders/ordersStore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface ShippingModalI {
  onClose: () => void;
  isShow: boolean;
}



export function ShippingModal(props: ShippingModalI) {
  const { onClose, isShow } = props;
  const { order, sending } = ordersStore();
  const { system } = useConfigStore();
  const { shipping } = useOrderRestaurantFnLogic();
  const { register, handleSubmit, setFocus, setValue } = useForm();

  useEffect(() => {
    if (isShow) {
      setValue("amount", system?.shipping_amount > 0 ? system.shipping_amount : null); // monto sugerido desde data_systems
      setFocus('amount', { shouldSelect: true });
    }
  }, [setFocus, setValue, isShow, system]);

  if (!isShow || !order) return null;

 const onSubmit = async(data: any) => {
     const amount = parseFloat(data.amount);
     if (!amount || amount <= 0) return;
     const success = await shipping(order.id, amount);
     if (success) onClose();
 }


  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle="Agregar envío" >
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <div className="bg-bg-base rounded-lg border border-bg-subtle/80 p-4">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} >
              <div>
                <label htmlFor="amount" className="input-label" >Monto del envío</label>
                  <input type="number" step="any" min={0} {...register("amount", { required: true })} className="input" />
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

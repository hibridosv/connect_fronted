import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useAccountPayableLogic } from "@/hooks/accounts/useAccountPayableLogic";
import useAccountPayableStore from "@/stores/accounts/accountPayableStore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ClientsSearch } from "../search/ClientsSearch";
import { ShowClientSearched } from "../search/ShowClientSearched";

export interface AddPayableModal {
  onClose: () => void;
  isShow: boolean;
}

export function AddPayableModal({ onClose, isShow }: AddPayableModal) {
        const { savePayable } = useAccountPayableLogic();
        const { register, handleSubmit, reset, setValue, watch } = useForm();
        const { sending } = useAccountPayableStore();


  const onSubmit = async (data: any) => {
    await savePayable(data);
    reset();
    onClose();
  }


  useEffect(() => {
    if (isShow) {
      setValue("invoice", 1);
    }
  }, [isShow, setValue]);

  return (
    <Modal show={isShow} onClose={onClose} size="md" headerTitle="Agregar Cuenta por Pagar">
      <Modal.Body>
        <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full px-3 mb-2">
              <ClientsSearch param="suppliers" placeholder="Buscar Proveedor" tempSelectedName="clientSelectedBySearchModal" />
              <ShowClientSearched tempSelectedName="clientSelectedBySearchModal" />
              </div>

              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="name" className="input-label"> Nombre de la cuenta *</label>
                    <input
                          type="text"
                          id="name"
                          {...register("name")}
                          className="input"
                          step="any"
                          min={0}
                        />
                </div>

                <div className="w-full md:w-full px-3 mb-2">
                  <label htmlFor="description" className="input-label"> Descripción{" "} </label>
                  <textarea {...register("description")} rows={2} className="input w-full"  />
                </div>


                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="invoice" className="input-label"> Tipo de Documento </label>
                    <select id="invoice" {...register("invoice")} className="input-select" >
                        <option value="0">Ninguno</option>
                        <option value="1">Ticket</option>
                        <option value="2">Factura</option>
                        <option value="3">Credito Fiscal</option>
                    </select>
                </div>



                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="invoice_number" className="input-label">Numero de Documento</label>
                    <input type="number" id="invoice_number" {...register("invoice_number", {disabled: watch("invoice") == 0})}
                          className={` ${watch("invoice") == 0 && "!bg-danger/20"} input`}
                          step="any"
                          min={0}
                        />
                </div> 

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="quantity" className="input-label"> Cantidad *</label>
                    <input type="number" id="quantity"
                          {...register("quantity")}
                          className="input"
                          step="any"
                          min={0}
                        />
                </div>

                
                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="expiration" className="input-label">
                      Fecha de vencimiento
                    </label>
                    <input type="date" id="expiration" {...register("expiration")}  className="input" />
                  </div>
               
              </div>

              <div className="flex justify-center">
              <Button type="submit" disabled={sending} preset={sending ? Preset.saving : Preset.save} />
              </div>

            </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={sending} />
      </Modal.Footer>
    </Modal>
  );
}
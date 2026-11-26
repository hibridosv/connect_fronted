import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import cashAccountStore from "@/stores/cash/cashAccountStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import { useForm } from "react-hook-form";

export interface AccountsTransfersModalProps {
  onClose: () => void;
  isShow: boolean;
}

export interface INewCategory {
  name: string;
}


export function AccountsTransfersModal({ onClose, isShow }: AccountsTransfersModalProps) {
    const { register, handleSubmit, reset, setValue } = useForm();
    const {  accounts, transfering, transferAccount, error } = cashAccountStore();
  
    const onSubmit = async(data: any)=>{
        if (data.from_cash_accounts_id == data.to_cash_accounts_id) {
            useToastMessageStore.getState().setError({ message: "No puede transferir a la misma cuenta"});
            return 
        }
        if (data.quantity <= 0) {
            useToastMessageStore.getState().setError({ message: "La cantidad debe ser mayor a cero"});
            return 
        }
         const success = await transferAccount(data);
        if (success) {
            reset();
        }
    }


  return (
    <Modal show={isShow} onClose={onClose} size="md" headerTitle="Transferir entre cuentas">
      <Modal.Body>
        <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="from_cash_accounts_id" className="input-label"> Cuenta origen </label>
                    <select id="from_cash_accounts_id" {...register("from_cash_accounts_id")} className="input-select" >
                        {accounts && accounts?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.account}{" | "}{value.bank}{" | $"}{value.balance}</option>
                          );
                        })}
                    </select>
                </div> 

                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="to_cash_accounts_id" className="input-label"> Cuenta destino </label>
                    <select id="to_cash_accounts_id" {...register("to_cash_accounts_id")} className="input-select" >
                        {accounts && accounts?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.account}{" | "}{value.bank}{" | $"}{value.balance}</option>
                          );
                        })}
                    </select>
                </div> 


                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="quantity" className="input-label"> Cantidad a transferir *</label>
                    <input type="number" id="quantity" {...register("quantity", { required: true})} className="input" step="any" min={0}/>
                </div>
               
              </div>

              <div className="flex justify-center">
              <Button type="submit" disabled={transfering} preset={transfering ? Preset.saving : Preset.save} />
              </div>

            </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={transfering} />
      </Modal.Footer>
    </Modal>
  );
}
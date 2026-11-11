import { Button, Preset } from "@/components/button/button";
import cashAccountStore from "@/stores/cash/cashAccountStore";
import cashTransferStore from "@/stores/cash/cashTransferStore";
import { useForm } from "react-hook-form";


export function TransfersForm() {
    const { register, handleSubmit, reset } = useForm();
    const {  accounts } = cashAccountStore();
    const {  createTransfer, error, sending } = cashTransferStore();



    const onSubmit = async(data: any)=>{
        const success = await createTransfer(data);
        if (success) {
            reset();
        }
    }

  return (
    <div className="bg-bg-content rounded-2xl shadow-lg border border-bg-subtle p-4 w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">


              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="transaction_type" className="input-label"> Tipo de gasto *</label>
                    <select defaultValue={0} id="transaction_type" {...register("transaction_type", { required: true })} className="input-select" >
                        <option value="1">Ingreso de efectivo</option>
                        <option value="0">Salida de efectivo</option>
                    </select>
                </div>

                <div className="w-full md:w-full px-3 mb-2">
                  <label htmlFor="description" className="input-label"> Descripción </label>
                  <textarea {...register("description", { required: true })} rows={2} className={"input w-full"}/>
                </div>


                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="cash_accounts_id" className="input-label"> Cuenta de tranferencia </label>
                    <select defaultValue={accounts && accounts && accounts.length > 0 ? accounts[0].id : 0} 
                    id="cash_accounts_id" {...register("cash_accounts_id", { required: true })} className="input-select" >
                        {accounts?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.account}{" | "}{value.bank}{" | $"}{value.balance}</option>
                          );
                        })}
                    </select>
                </div> 

                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="quantity" className="input-label"> Cantidad *</label>
                    <input type="number" id="quantity" {...register("quantity", { required: true })} className="input" step="any" min={0}/>
                </div>
               
              </div>


              <div className="flex justify-center">
              <Button type="submit" disabled={sending} preset={sending ? Preset.saving : Preset.save} />
              </div>

            </form>
    </div>
  );
}

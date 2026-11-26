import { Alert } from "@/components/Alert/Alert";
import { Button, Preset } from "@/components/button/button";
import { NothingHere } from "@/components/NothingHere";
import { useCashRemittancesLogic } from "@/hooks/cash/useCashRemittancesLogic";
import cashAccountStore from "@/stores/cash/cashAccountStore";
import cashRemittancesStore from "@/stores/cash/cashRemittancesStore";
import useConfigStore from "@/stores/configStore";
import { useForm } from "react-hook-form";


export function RemittanceForm() {
    useCashRemittancesLogic(); 
    const { register, handleSubmit, setValue, watch, reset } = useForm();
    const {  accounts } = cashAccountStore();
    const { createRemittance, sending, error } = cashRemittancesStore();
    const { cashdrawer } = useConfigStore();

    const onSubmit = async(data: any)=>{
        const success = await createRemittance(data);
        if (success) {
            reset();
        }
    }

  return (
    <div className="bg-bg-content rounded-2xl shadow-lg border border-bg-subtle p-4 w-full max-w-4xl mx-auto">
      { !cashdrawer ? 
      (<div>
        <NothingHere />
        <Alert title="Importante" type="danger" text="Debe aperturar caja para agregar remesas" className="mt-4" />
      </div>) : (
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="name" className="input-label">Nombre de la remesa *</label>
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
                <textarea
                  {...register("description", {})}
                  rows={2}
                  className="input w-full" 
                />
              </div>



              <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="cash_accounts_id" className="input-label"> Cuenta a transferir </label>
                <select
                  defaultValue={accounts  && accounts.length > 0 ? accounts[0].id : 0}
                  id="cash_accounts_id"
                  {...register("cash_accounts_id")}
                  className="input-select">
                  {accounts && accounts?.map((value: any) => {
                    return (
                      <option key={value.id} value={value.id}> {value.account}{" | "}{value.bank}{" | $"}{value.balance}</option>
                    );
                  })}
                </select>
              </div>


              <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="quantity" className="input-label"> Cantidad *</label>
                <input
                  type="number"
                  id="quantity"
                  {...register("quantity")}
                  className="input"
                  step="any"
                  min={0}
                />
              </div>

            </div>

            <div className="flex justify-center">
              <Button type="submit" disabled={sending} preset={sending ? Preset.saving : Preset.save} />
            </div>

          </form>
      )}
    </div>
  );
}

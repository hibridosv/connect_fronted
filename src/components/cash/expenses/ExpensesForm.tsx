import { Alert } from "@/components/Alert/Alert";
import { Button, Preset } from "@/components/button/button";
import { NothingHere } from "@/components/NothingHere";
import { useCashExpensesLogic } from "@/hooks/cash/useCashExpensesLogic";
import cashAccountStore from "@/stores/cash/cashAccountStore";
import cashExpensesStore from "@/stores/cash/cashExpensesStore";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";

interface ExpensesFormProps {
  showAll: boolean;
  currentPage: string;
}

export function ExpensesForm({ showAll, currentPage }: ExpensesFormProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const {  onSubmit } = useCashExpensesLogic(reset, setValue, showAll, currentPage);
  const { expensesCategories: categories, } = cashExpensesStore();
  const { accounts } = cashAccountStore();
  const { cashdrawer } = useConfigStore();
  const { sending } = cashExpensesStore();
  const { openModal } = useModalStore()

  return (
    <div className="bg-bg-content rounded-2xl shadow-lg border border-bg-subtle p-4 w-full max-w-4xl mx-auto">
      { !cashdrawer ? 
      (<div>
        <NothingHere />
        <Alert title="Importente" type="danger" text="Debe aperturar caja para agregar gastos" className="mt-4" />
      </div>) : (
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-full px-3 mb-2">
            <label htmlFor="name" className="input-label">
              Nombre del Gasto *
            </label>
            <input type="text" id="name" {...register("name", { required: true })} className="input" />
          </div>

          <div className="w-full md:w-full px-3 mb-2">
            <label htmlFor="description" className="input-label">
              Descripción
            </label>
            <textarea {...register("description", {})} rows={2} className={"input w-full"} />
          </div>

          <div className="w-full md:w-full px-3 mb-2">
            <label htmlFor="type" className="input-label">
              Tipo de gasto *
            </label>
            <select defaultValue={0} id="type" {...register("type")} className="input-select" >
              <option value="0">Sin Comprobante</option>
              <option value="1">Con Comprobante</option>
            </select>
          </div>

          {watch("type") == 1 && (
            <>
              <div className="w-full md:w-1/2 px-3 mb-2">
                <label htmlFor="invoice" className="input-label">
                  Tipo de Documento
                </label>
                <select id="invoice" {...register("invoice")} className="input-select" >
                  <option value="1">Ticket</option>
                  <option value="2">Factura</option>
                  <option value="3">Credito Fiscal</option>
                </select>
              </div>
              <div className="w-full md:w-1/2 px-3 mb-2">
                <label htmlFor="invoice_number" className="input-label">
                  Numero de Documento
                </label>
                <input type="number" id="invoice_number" {...register("invoice_number")} className="input" min={0} />
              </div>
            </>
          )}

          <div className="w-full md:w-1/2 px-3 mb-2">
            <label htmlFor="payment_type" className="input-label">
              Tipo de pago
            </label>
            <select defaultValue="1" id="payment_type" {...register("payment_type")} className="input-select" >
              <option value="1">Efectivo</option>
              <option value="2">Tarjeta</option>
              <option value="3">Transferencia</option>
              <option value="4">Cheque</option>
              <option value="6">BTC</option>
              <option value="0">Otro</option>
            </select>
          </div>

          <div className="w-full md:w-1/2 px-3 mb-2">
            <label htmlFor="cash_bills_categories_id" className="input-label clickeable" title="Agregar categoria de gasto" onClick={()=> openModal("NewCategory")}>
              <span className="flex items-center"><span>Categoria de gasto</span> <FaPlus className="ml-2" color="green" size={12} /></span>
            </label>
            <select defaultValue={ categories && categories?.length > 0 ? categories[0].id : 0 } id="cash_bills_categories_id" {...register("cash_bills_categories_id")} className="input-select" >
              {categories &&
                categories?.map((value: any) => {
                  return (
                    <option key={value.id} value={value.id}>
                      {value.name}
                    </option>
                  );
                })}
            </select>
          </div>

          {watch("payment_type") != 1 && (
            <div className="w-full md:w-full px-3 mb-2">
              <label htmlFor="cash_accounts_id" className="input-label">
                Cuenta de tranferencia
              </label>
              <select defaultValue={ accounts && accounts?.length > 0 ? accounts[0].id : 0 } id="cash_accounts_id" {...register("cash_accounts_id")} className="input-select" >
                {accounts && accounts?.map((value: any) => {
                    return (
                      <option key={value.id} value={value.id}>
                        {value.account}
                        {" | "}
                        {value.bank}
                        {" | $"}
                        {value.balance}
                      </option>
                    );
                  })}
              </select>
            </div>
          )}

          <div className="w-full md:w-full px-3 mb-2">
            <label htmlFor="quantity" className="input-label">
              Cantidad *
            </label>
            <input type="number" id="quantity" {...register("quantity", { required: true})} className="input" step="any" min={0}/>
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

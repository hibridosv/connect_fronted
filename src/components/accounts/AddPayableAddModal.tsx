import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useAccountPayableLogic } from "@/hooks/accounts/useAccountPayableLogic";
import { useCashAccountLogic } from "@/hooks/cash/useCashAccountLogic";
import { formatDateAsDMY } from "@/lib/date-formats";
import { documentType, numberToMoney } from "@/lib/utils";
import useAccountPayableStore from "@/stores/accounts/accountPayableStore";
import cashAccountStore from "@/stores/cash/cashAccountStore";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "../Alert/Alert";
import { NothingHere } from "../NothingHere";
import { AccountsPayablePaymentsTable } from "./AccountsPayablePaymentsTable";

export interface AddPayableModal {
  onClose: () => void;
  isShow: boolean;
}

export function AddPayableAddModal({ onClose, isShow }: AddPayableModal) {
        const { getElement } = useTempStorage();
        const { cashdrawer, system, activeConfig } = useConfigStore();

        const { register, handleSubmit, reset, setValue, watch } = useForm();
        const payableRecord = getElement('paymentPayableAdd');
        useCashAccountLogic();
        const { accounts } = cashAccountStore();
        const { savePayment, deletePayableAccount } = useAccountPayableLogic();
        const { sending, deleting } = useAccountPayableStore();
        const { setError } = useToastMessageStore();
        const { openModal, closeModal } = useModalStore();


  const onSubmit = async (data: any) => {
      if (payableRecord?.balance < data.quantity) {
      setError({ message: "No puede ingresar una cantidad mayor al saldo pendiente"});
      return;
      }
      await savePayment(data);
      reset();
      setValue("payment_type", 1);
  }

  useEffect(() => {
    if (isShow) {
      setValue("payment_type", 1);
    }
  }, [isShow, setValue]);

  return (
    <Modal show={isShow} onClose={onClose} size="xl3" headerTitle="AGREGAR ABONO">
      <Modal.Body>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mx-1">
            <div className="md:col-span-7">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-bg-content border border-bg-subtle shadow-sm rounded-lg p-4 flex flex-col items-center justify-center">
                        <div className="text-text-muted text-sm font-medium uppercase tracking-wide mb-1">Abonos</div>
                        <div className="text-2xl font-bold text-text-base">{ numberToMoney((payableRecord?.quantity - payableRecord?.balance), system) }</div>
                    </div>
                    <div className="bg-bg-content border border-bg-subtle shadow-sm rounded-lg p-4 flex flex-col items-center justify-center">
                        <div className="text-text-muted text-sm font-medium uppercase tracking-wide mb-1">Saldo</div>
                        <div className="text-2xl font-bold text-text-base">{numberToMoney(payableRecord?.balance ?? 0, system)}</div>
                    </div>
                </div>
                <div>
              { cashdrawer ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-content border border-bg-subtle shadow-sm rounded-lg p-4">
              <div className="flex flex-wrap -mx-3 mb-2">

              <div className="w-full px-3 mb-4">
                    <label htmlFor="payment_type" className="input-label mb-2"> Tipo de pago </label>
                    <div className="relative">
                        <select
                              defaultValue={1}
                              id="payment_type"
                              {...register("payment_type", {disabled: payableRecord?.balance == 0 ? true : false})}
                              className="input-select"
                            >
                            <option value={1}>Efectivo</option>
                            <option value={2}>Tarjeta</option>
                            <option value={3}>Transferencia</option>
                            <option value={4}>Cheque</option>
                            <option value={6}>BTC</option>
                            <option value={0}>Otro</option>
                        </select>
                    </div>
                </div>


                { watch("payment_type") != 1 && <div className="w-full px-3 mb-4">
                    <label htmlFor="cash_accounts_id" className="input-label mb-2"> Cuenta de tranferencia </label>
                    <div className="relative">
                        <select
                              defaultValue={accounts && accounts.length > 0 ? accounts[0].id : 0}
                              id="cash_accounts_id"
                              {...register("cash_accounts_id", {disabled: payableRecord?.balance == 0 ? true : false})}
                              className="input-select"
                            >
                            {accounts?.map((value: any) => {
                              return (
                                <option key={value.id} value={value.id}> {value.account}{" | "}{value.bank}{" | $"}{value.balance}</option>
                              );
                            })}
                        </select>
                    </div>
                </div> }


                <div className="w-full px-3 mb-4">
                    <label htmlFor="quantity" className="input-label mb-2"> Cantidad *</label>
                    <input
                          type="number"
                          id="quantity"
                          {...register("quantity", {disabled: payableRecord?.balance == 0 ? true : false})}
                          className="input"
                          step="any"
                          min={0}
                        />
                </div>
               
              </div>

              <div className="flex justify-end mt-4">
              <Button type="submit" disabled={sending || payableRecord?.payments?.balance == 0} preset={sending ? Preset.saving : Preset.save} />
              </div>

            </form>) : 
                <>
                <Alert
                type="danger"
                title="Error"
                text="Debe seleccionar una caja para este proceso"
                />
                <NothingHere text="" width="110" height="110" />
                </>}
                </div>
            </div>
            <div className="md:col-span-5">

                    <div className="w-full mb-6">
                        <div className="bg-bg-content border border-bg-subtle shadow-sm rounded-lg p-4 flex flex-col items-center justify-center">
                            <div className="text-text-muted text-sm font-medium uppercase tracking-wide mb-1">Total</div>
                            <div className="text-2xl font-bold text-text-base">{ numberToMoney(payableRecord?.quantity ? payableRecord?.quantity : 0, system) }</div>
                        </div>
                    </div>
               <div className="bg-bg-content border border-bg-subtle shadow-sm rounded-lg p-5 grid grid-cols-2 gap-4"> 

                    <div className="col-span-2">
                        <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Nombre</div>
                        <div className="text-lg font-medium text-text-base">{ payableRecord?.name }</div>
                    </div>
                    
                    {payableRecord?.description && (
                        <div className="col-span-2">
                            <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Descripción</div>
                            <div className="text-sm text-text-base">{ payableRecord?.description }</div>
                        </div>
                    )}

                    <div>
                        <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Expira</div>
                        <div className="text-base text-text-base">{ payableRecord?.expiration ? formatDateAsDMY(payableRecord?.expiration) : "N/A" }</div>
                    </div>

                    <div>
                         <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">{documentType(payableRecord?.invoice)}</div>
                         <div className="text-base text-text-base">{ payableRecord?.invoice_number}</div>
                    </div>

                    <div>
                        <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Usuario</div>
                        <div className="text-base text-text-base">{ payableRecord?.employee?.name}</div>
                    </div>

                    <div>
                        <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Proveedor</div>
                        <div className="text-base text-text-base">{ payableRecord?.provider?.name}</div>
                    </div>
               </div>
            </div>
        </div>
        {payableRecord?.payments &&
        <div className="mt-3">
                <AccountsPayablePaymentsTable records={payableRecord?.payments} />
        </div>}
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-4">
        {
          activeConfig && activeConfig.includes("payable-credit-notes") && 
          <Button preset={payableRecord?.notes?.length ? Preset.accept : Preset.add} text={payableRecord?.notes?.length ? `Notas de credito (${payableRecord.notes.length})` : "Agregar Nota de credito"}
          onClick={()=>{openModal('creditNoteAdd'); }} />
        }
        {/* el servidor solo impide eliminar con abonos activos; las notas activas tambien son abonos */}
        { !payableRecord?.payments?.some((payment: any) => payment.status == 1) &&
        <Button preset={deleting ? Preset.loading : Preset.danger}  text="ELIMINAR CUENTA" style="mr-2" onClick={deletePayableAccount} disabled={deleting} />}
        <Button onClick={onClose} preset={Preset.close} disabled={deleting} />
        </div>
      </Modal.Footer>
    </Modal>
  );
}
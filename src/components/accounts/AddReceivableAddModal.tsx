import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useAccountReceivableLogic } from "@/hooks/accounts/useAccountReceivableLogic";
import { useCashAccountLogic } from "@/hooks/cash/useCashAccountLogic";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import accountReceivableStore from "@/stores/accounts/accountReceivableStore";
import cashAccountStore from "@/stores/cash/cashAccountStore";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "../Alert/Alert";
import { NothingHere } from "../NothingHere";
import { ButtonDownloadGet } from "../button/button-download-get";
import { AccountsReceivableInstallmentsTable } from "./AccountsReceivableInstallmentsTable";
import { AccountsReceivablePaymentsTable } from "./AccountsReceivablePaymentsTable";
import { calculateNewBalance, creditTotal, frequencyName, isInstallments, nextInstallment, overdueInstallments, sumBalance } from "./utils";

export interface AddReceivableAddModalI {
  onClose: () => void;
  isShow: boolean;
}

export function AddReceivableAddModal({ onClose, isShow }: AddReceivableAddModalI) {
        const { getElement } = useTempStorage();
        const { cashdrawer, system } = useConfigStore();

        const { register, handleSubmit, reset, setValue, watch } = useForm();
        const receivableRecord = getElement('paymentReceivableAdd');
        useCashAccountLogic();
        const { accounts } = cashAccountStore();
        const { savePayment } = useAccountReceivableLogic();
        const { sending, deleting } = accountReceivableStore();
        const { setError } = useToastMessageStore();
        const { setElement} = useTempStorage();
        const { openModal } = useModalStore();


  const onSubmit = async (data: any) => {
      let isMax = calculateNewBalance( creditTotal(receivableRecord), receivableRecord?.balance ?? 0, data.quantity ?? 0 ) > creditTotal(receivableRecord) ? true : false;
      if (isMax) {
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

  const installments = isInstallments(receivableRecord);
  const overdue = overdueInstallments(receivableRecord);
  const next = nextInstallment(receivableRecord);

  return (
    <Modal show={isShow} onClose={onClose} size="xl3" headerTitle="AGREGAR ABONO">
      <Modal.Body>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mx-1">
            <div className="md:col-span-7">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-bg-content border border-bg-subtle shadow-sm rounded-lg p-4 flex flex-col items-center justify-center">
                        <div className="text-text-muted text-sm font-medium uppercase tracking-wide mb-1">Abonos</div>
                        <div className="text-2xl font-bold text-text-base">{ numberToMoney((creditTotal(receivableRecord) - receivableRecord?.balance), system) }</div>
                    </div>
                    <div className="bg-bg-content border border-bg-subtle shadow-sm rounded-lg p-4 flex flex-col items-center justify-center">
                        <div className="text-text-muted text-sm font-medium uppercase tracking-wide mb-1">Saldo</div>
                        <div className="text-2xl font-bold text-text-base">{numberToMoney(receivableRecord?.balance ?? 0, system)}</div>
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
                              {...register("payment_type", {disabled: receivableRecord?.balance == 0 ? true : false})}
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
                              {...register("cash_accounts_id", {disabled: receivableRecord?.balance == 0 ? true : false})}
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


                { installments && receivableRecord?.balance > 0 && <div className="w-full px-3 mb-3 flex flex-wrap gap-2">
                    { overdue.length > 0 &&
                      <Button type="button" preset={Preset.danger} text={`Pagar vencido ${numberToMoney(sumBalance(overdue), system)}`} onClick={() => setValue("quantity", sumBalance(overdue))} /> }
                    { next &&
                      <Button type="button" preset={Preset.info} text={`Cuota ${next.number}: ${numberToMoney(next.balance, system)}`} onClick={() => setValue("quantity", Number(next.balance))} /> }
                </div> }

                <div className="w-full px-3 mb-4">
                    <label htmlFor="quantity" className="input-label mb-2"> Cantidad *</label>
                    <input
                          type="number"
                          id="quantity"
                          {...register("quantity", {disabled: receivableRecord?.balance == 0 ? true : false})}
                          className="input"
                          step="any"
                          min={0}
                        />
                </div>
               
              </div>

              <div className="flex justify-end mt-4">
              <Button type="submit" disabled={sending || receivableRecord?.balance == 0} preset={sending ? Preset.saving : Preset.save} />
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
                            <div className="text-2xl font-bold text-text-base">{ numberToMoney(creditTotal(receivableRecord), system) }</div>
                        </div>
                    </div>
               <div className="bg-bg-content border border-bg-subtle shadow-sm rounded-lg p-5 grid grid-cols-2 gap-4"> 

                    <div className="col-span-2">
                        <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Cliente</div>
                        <div className="text-lg font-medium text-text-base">{ receivableRecord?.client?.name }</div>
                    </div>
                    
                        <div>
                        <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Documento</div>
                        <div className="text-base text-text-base">{ receivableRecord?.order?.invoice_assigned?.name }</div>
                    </div>

                    <div>
                        <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Numero</div>
                        <div className="text-base text-text-base">{ receivableRecord?.order?.invoice }</div>
                    </div>

                    <div>
                        <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Productos</div>
                        <div className="text-base text-text-base">{ receivableRecord?.order?.products.length }</div>
                    </div>

                    <div>
                         <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Usuario</div>
                         <div className="text-base text-text-base">{ receivableRecord?.employee?.name}</div>
                    </div>

                    <div>
                        <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Asiganado</div>
                        <div className="text-base text-text-base">{ formatDateAsDMY(receivableRecord?.created_at) }</div>
                    </div>

                    <div>
                        <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Expira</div>
                        <div className="text-base text-text-base">{ formatDateAsDMY(receivableRecord?.expiration) }</div>
                    </div>
               </div>
            </div>
        </div>
        {installments &&
        <div className="mt-3">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-semibold text-text-base">
                    Plan: { receivableRecord?.installments_count } cuotas { frequencyName(receivableRecord?.frequency).toLowerCase() }
                    { Number(receivableRecord?.down_payment) > 0 && ` · prima ${numberToMoney(receivableRecord?.down_payment, system)}` }
                    { Number(receivableRecord?.interest_total) > 0 && ` · interés ${numberToMoney(receivableRecord?.interest_total, system)}` }
                  </span>
                  <ButtonDownloadGet autoclass={false} href={`id=${receivableRecord?.id}&route=download.pdf.creditPlan`}>
                    <span className="text-sm text-primary font-semibold clickeable">Plan de pagos (PDF)</span>
                  </ButtonDownloadGet>
                </div>
                <AccountsReceivableInstallmentsTable records={receivableRecord?.installments} />
        </div>}
        {receivableRecord?.payments &&
        <div className="mt-3">
                <AccountsReceivablePaymentsTable records={receivableRecord?.payments} />
        </div>}
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-4">
        <Button onClick={()=>{ setElement('documentSelected',  receivableRecord?.order); openModal('documentDetail')  }} preset={Preset.success} disabled={deleting} text="Factura Asociada" />
        <Button onClick={onClose} preset={Preset.close} disabled={deleting} />
        </div>
      </Modal.Footer>
    </Modal>
  );
}
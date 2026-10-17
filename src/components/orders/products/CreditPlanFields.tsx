'use client';
import { frequencyName } from "@/components/accounts/utils";
import { useCashAccountLogic } from "@/hooks/cash/useCashAccountLogic";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import { createService, getServices } from "@/services/services";
import cashAccountStore from "@/stores/cash/cashAccountStore";
import useConfigStore from "@/stores/configStore";
import { useEffect, useState } from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

export interface CreditPlanFieldsI {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  total: number;
}

const frequencySettings: Record<number, string> = { 1: 'allow_daily', 2: 'allow_weekly', 3: 'allow_biweekly', 4: 'allow_monthly' };

/** Modalidad del credito al cobrar: libre (abonos) o por cuotas con su vista previa */
export function CreditPlanFields({ register, watch, setValue, total }: CreditPlanFieldsI) {
  const { system } = useConfigStore();
  const [settings, setSettings] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [planError, setPlanError] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  useCashAccountLogic();
  const { accounts } = cashAccountStore();

  useEffect(() => {
    getServices('settings/credits')
      .then((response) => setSettings(response.data.data))
      .catch(() => setSettings(null));
  }, []);

  const enabled = settings?.installments_available && settings?.installments_enabled;
  const frequencies = enabled ? [1, 2, 3, 4].filter((frequency) => settings[frequencySettings[frequency]]) : [];

  useEffect(() => {
    if (enabled) {
      setValue('credit.modality', '1');
      setValue('credit.frequency', String(frequencies[frequencies.length - 1] ?? ''));
      setValue('credit.installments_count', Math.min(3, settings.max_installments));
      setValue('credit.down_payment_type', '1');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const modality = watch('credit.modality');
  const frequency = watch('credit.frequency');
  const count = watch('credit.installments_count');
  const firstDueDate = watch('credit.first_due_date');
  const downPayment = watch('credit.down_payment');
  const downPaymentType = watch('credit.down_payment_type');

  useEffect(() => {
    if (!enabled || modality !== '2' || !frequency || !count) {
      setPlan(null);
      return;
    }
    const timer = setTimeout(async () => {
      setSimulating(true);
      try {
        const response = await createService('accounts/receivable/simulate', {
          amount: total,
          down_payment: downPayment || 0,
          frequency,
          installments_count: count,
          first_due_date: firstDueDate || null,
        });
        setPlan(response.data.data);
        setPlanError(null);
      } catch (error: any) {
        setPlan(null);
        setPlanError(error?.response?.data?.message ?? 'No se pudo calcular el plan');
      } finally {
        setSimulating(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [enabled, modality, frequency, count, firstDueDate, downPayment, total]);

  if (!enabled) return null;

  const installments = plan?.installments ?? [];
  const last = installments[installments.length - 1];

  return (
    <div className="mt-4 space-y-3 text-sm">
      <div className="flex justify-center gap-6">
        <label className="flex items-center gap-2 clickeable">
          <input type="radio" value="1" {...register('credit.modality')} /> Libre (abonos)
        </label>
        <label className="flex items-center gap-2 clickeable">
          <input type="radio" value="2" {...register('credit.modality')} /> Por cuotas
        </label>
      </div>

      {modality === '2' && <>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="credit_frequency" className="input-label">Frecuencia</label>
            <select id="credit_frequency" className="input-select" {...register('credit.frequency')}>
              {frequencies.map((option) => <option key={option} value={option}>{frequencyName(option)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="credit_count" className="input-label">Cuotas (máx. {settings.max_installments})</label>
            <input id="credit_count" type="number" min={1} max={settings.max_installments} className="input" {...register('credit.installments_count')} />
          </div>
          <div>
            <label htmlFor="credit_first_due_date" className="input-label">Primera cuota (opcional)</label>
            <input id="credit_first_due_date" type="date" className="input" {...register('credit.first_due_date')} />
          </div>
          <div>
            <label htmlFor="credit_down_payment" className="input-label">Prima</label>
            <input id="credit_down_payment" type="number" step="any" min={0} className="input" {...register('credit.down_payment')} />
          </div>
          {Number(downPayment) > 0 && <div>
            <label htmlFor="credit_down_payment_type" className="input-label">Pago de la prima</label>
            <select id="credit_down_payment_type" className="input-select" {...register('credit.down_payment_type')}>
              <option value={1}>Efectivo</option>
              <option value={2}>Tarjeta</option>
              <option value={3}>Transferencia</option>
              <option value={4}>Cheque</option>
              <option value={6}>BTC</option>
              <option value={0}>Otro</option>
            </select>
          </div>}
          {Number(downPayment) > 0 && downPaymentType !== '1' && <div>
            <label htmlFor="credit_cash_account" className="input-label">Cuenta</label>
            <select id="credit_cash_account" className="input-select" {...register('credit.cash_accounts_id')}>
              {accounts?.map((account: any) => <option key={account.id} value={account.id}>{account.account} | {account.bank}</option>)}
            </select>
          </div>}
        </div>

        <div className="rounded-lg border border-bg-subtle bg-bg-subtle/40 p-3">
          {simulating && <span className="text-text-muted">Calculando plan...</span>}
          {!simulating && planError && <span className="text-danger">{planError}</span>}
          {!simulating && plan && <>
            <div className="font-semibold text-text-base">
              {installments.length} cuota(s) de {numberToMoney(plan.installment_amount, system)}
            </div>
            <div className="text-text-muted">
              Primera {formatDateAsDMY(installments[0]?.due_date)} · última {formatDateAsDMY(last?.due_date)}
            </div>
            <div className="text-text-muted">
              {Number(plan.interest_total) > 0 && <>Interés {numberToMoney(plan.interest_total, system)} · </>}
              Total a pagar {numberToMoney(Number(plan.down_payment) + Number(plan.total_amount), system)}
            </div>
          </>}
        </div>
      </>}
    </div>
  );
}

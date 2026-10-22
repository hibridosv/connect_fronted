'use client';
import { Button, Preset } from "@/components/button/button";
import { useCreditRestructureLogic } from "@/hooks/accounts/useCreditRestructureLogic";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { frequencyName } from "./utils";

export interface RestructureCreditFormI {
  credit: any;
  sending: boolean;
  onConfirm: (data: any) => Promise<boolean>;
  onCancel: () => void;
}

export function RestructureCreditForm({ credit, sending, onConfirm, onCancel }: RestructureCreditFormI) {
  const { system } = useConfigStore();
  const { register, handleSubmit, watch, setValue } = useForm();
  const values = watch();
  const { settings, enabled, frequencies, preview, previewError, previewing } = useCreditRestructureLogic(credit?.id, values, true);

  useEffect(() => {
    if (enabled && settings) {
      setValue('frequency', String(credit?.frequency && frequencies.includes(credit.frequency) ? credit.frequency : frequencies[frequencies.length - 1] ?? ''));
      setValue('installments_count', Math.min(credit?.installments_count ?? 3, settings.max_installments));
    }
  }, [enabled, settings, frequencies, credit, setValue]);

  const onSubmit = async (data: any) => {
    const success = await onConfirm({
      frequency: Number(data.frequency),
      installments_count: Number(data.installments_count),
      first_due_date: data.first_due_date || null,
    });
    if (success) onCancel();
  };

  if (!enabled || !settings) {
    return <p className="text-sm text-text-muted">Los créditos por cuotas no están habilitados en la configuración.</p>;
  }

  const installments = preview?.plan?.installments ?? [];
  const last = installments[installments.length - 1];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-content border border-bg-subtle shadow-sm rounded-lg p-4 space-y-3 text-sm">
      <div className="font-semibold text-text-base">Reestructurar crédito</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label htmlFor="restructure_frequency" className="input-label">Frecuencia</label>
          <select id="restructure_frequency" className="input-select" {...register('frequency')}>
            {frequencies.map((option) => <option key={option} value={option}>{frequencyName(option)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="restructure_count" className="input-label">Cuotas (máx. {settings.max_installments})</label>
          <input id="restructure_count" type="number" min={1} max={settings.max_installments} className="input" {...register('installments_count')} />
        </div>
        <div>
          <label htmlFor="restructure_first_due_date" className="input-label">Primera cuota (opcional)</label>
          <input id="restructure_first_due_date" type="date" className="input" {...register('first_due_date')} />
        </div>
      </div>

      <div className="rounded-lg border border-bg-subtle bg-bg-subtle/40 p-3">
        {previewing && <span className="text-text-muted">Calculando plan...</span>}
        {!previewing && previewError && <span className="text-danger">{previewError}</span>}
        {!previewing && preview && <>
          <div className="font-semibold text-text-base">
            Capital pendiente {numberToMoney(preview.principal, system)} en {installments.length} cuota(s) de {numberToMoney(preview.plan.installment_amount, system)}
          </div>
          <div className="text-text-muted">
            Primera {formatDateAsDMY(installments[0]?.due_date)} · última {formatDateAsDMY(last?.due_date)}
            {Number(preview.plan.interest_total) > 0 && <> · interés {numberToMoney(preview.plan.interest_total, system)}</>}
          </div>
          {(Number(preview.waived_interest) > 0 || Number(preview.waived_late_fee) > 0) &&
            <div className="text-warning">
              Se condonan {numberToMoney(preview.waived_interest, system)} de interés y {numberToMoney(preview.waived_late_fee, system)} de mora sin pagar.
            </div>}
        </>}
      </div>

      <div className="flex justify-end gap-3">
        <Button preset={Preset.cancel} onClick={onCancel} disabled={sending} />
        <Button type="submit" preset={sending ? Preset.saving : Preset.save} text="Reestructurar" disabled={sending || !preview} />
      </div>
    </form>
  );
}

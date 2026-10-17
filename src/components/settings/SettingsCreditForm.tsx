'use client';
import { Button, Preset } from '@/components/button/button';
import { Switch } from '@/components/button/Switch';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { useCreditSettingsLogic } from '@/hooks/settings/useCreditSettingsLogic';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface SettingsCreditFormProps {
  changes: boolean;
}

const frequencies = [
  { name: 'allow_daily', label: 'Diaria' },
  { name: 'allow_weekly', label: 'Semanal' },
  { name: 'allow_biweekly', label: 'Cada 15 días' },
  { name: 'allow_monthly', label: 'Mensual' },
];

export default function SettingsCreditForm({ changes }: SettingsCreditFormProps) {
  const { settings, loading, saving, onSave } = useCreditSettingsLogic();
  const { register, handleSubmit, reset, control, watch } = useForm();
  const available = !!settings?.installments_available;

  useEffect(() => {
    if (settings) {
      const { installments_available, ...values } = settings;
      reset(values);
    }
  }, [settings, reset]);

  const onSubmit = async (data: any) => {
    const { id, created_at, updated_at, ...values } = data;
    await onSave(values);
  };

  if (loading || !settings) return <SkeletonTable rows={6} columns={2} />;

  const installmentsEnabled = available && watch('installments_enabled');
  const interestMethod = Number(watch('interest_method'));
  const lateFeeType = Number(watch('late_fee_type'));
  const disabled = !changes || saving;

  const switchField = (name: string, label: string, isDisabled = disabled) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Switch checked={!!field.value} onChange={(checked) => field.onChange(checked)} label={label} sizing="sm" disabled={isDisabled} />
      )}
    />
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
      <div>
        <span className="text-sm font-semibold text-text-base">Créditos</span>
        {!changes && <p className="text-xs text-text-muted mt-1">No tiene permiso para modificar esta configuración.</p>}
      </div>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Crédito libre (abonos)</h3>
        <div className="w-full md:w-1/2">
          <label htmlFor="free_credit_days" className="input-label">Días de crédito</label>
          <input id="free_credit_days" type="number" min={1} className="input" disabled={disabled} {...register('free_credit_days', { valueAsNumber: true })} />
          <p className="text-xs text-text-muted mt-1">Fecha de vencimiento de los créditos sin cuotas.</p>
        </div>
      </section>

      <section className="space-y-3 border-t border-bg-subtle pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Crédito por cuotas</h3>
        {available ? switchField('installments_enabled', 'Permitir créditos por cuotas') : (
          <p className="text-sm text-text-muted">Los créditos por cuotas están disponibles para comercio en los planes Estándar y Premium.</p>
        )}

        {installmentsEnabled && <>
          <div>
            <span className="input-label">Frecuencias permitidas</span>
            <div className="flex flex-wrap gap-4 mt-2">
              {frequencies.map((frequency) => <div key={frequency.name}>{switchField(frequency.name, frequency.label)}</div>)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="max_installments" className="input-label">Máximo de cuotas</label>
              <input id="max_installments" type="number" min={1} className="input" disabled={disabled} {...register('max_installments', { valueAsNumber: true })} />
            </div>
            <div className="flex items-end pb-2">
              {switchField('skip_sundays', 'Las cuotas diarias no caen en domingo')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="interest_method" className="input-label">Interés</label>
              <select id="interest_method" className="input-select" disabled={disabled} {...register('interest_method', { valueAsNumber: true })}>
                <option value={0}>Sin interés</option>
                <option value={1}>Simple (sobre el monto inicial)</option>
                <option value={2}>Sobre saldo</option>
              </select>
            </div>
            {interestMethod > 0 && <div>
              <label htmlFor="interest_rate" className="input-label">Tasa mensual (%)</label>
              <input id="interest_rate" type="number" step="any" min={0} className="input" disabled={disabled} {...register('interest_rate', { valueAsNumber: true })} />
            </div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="late_fee_type" className="input-label">Mora</label>
              <select id="late_fee_type" className="input-select" disabled={disabled} {...register('late_fee_type', { valueAsNumber: true })}>
                <option value={0}>Sin mora</option>
                <option value={1}>Monto fijo por cuota vencida</option>
                <option value={2}>Porcentaje de la cuota vencida</option>
              </select>
            </div>
            {lateFeeType > 0 && <>
              <div>
                <label htmlFor="late_fee_value" className="input-label">{lateFeeType === 1 ? 'Monto' : 'Porcentaje (%)'}</label>
                <input id="late_fee_value" type="number" step="any" min={0} className="input" disabled={disabled} {...register('late_fee_value', { valueAsNumber: true })} />
              </div>
              <div>
                <label htmlFor="grace_days" className="input-label">Días de gracia</label>
                <input id="grace_days" type="number" min={0} className="input" disabled={disabled} {...register('grace_days', { valueAsNumber: true })} />
              </div>
            </>}
          </div>
          <p className="text-xs text-text-muted">El interés y la mora se facturan en cada abono, con el mismo tipo de documento de la venta.</p>
        </>}
      </section>

      {changes && (
        <div className="flex justify-end">
          <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
        </div>
      )}
    </form>
  );
}

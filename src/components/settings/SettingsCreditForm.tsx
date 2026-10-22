'use client';
import { Button, Preset } from '@/components/button/button';
import { Switch } from '@/components/button/Switch';
import { InfoTip } from '@/components/InfoTip';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { useCreditSettingsLogic } from '@/hooks/settings/useCreditSettingsLogic';
import SettingsCreditTemplates from './SettingsCreditTemplates';
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
  const { settings, loading, saving, templates, onSave, onAddTemplate, onDeleteTemplate } = useCreditSettingsLogic();
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

  const labelWithTip = (htmlFor: string, label: string, tip: React.ReactNode) => (
    <div className="flex items-center">
      <label htmlFor={htmlFor} className="input-label">{label}</label>
      <InfoTip>{tip}</InfoTip>
    </div>
  );

  const allowedFrequencies = frequencies
    .map((frequency, index) => (settings[frequency.name as keyof typeof settings] ? index + 1 : 0))
    .filter((frequency) => frequency > 0);

  return (
    <div>
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
      <div>
        <span className="text-sm font-semibold text-text-base">Créditos</span>
        {!changes && <p className="text-xs text-text-muted mt-1">No tiene permiso para modificar esta configuración.</p>}
      </div>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Crédito libre (abonos)</h3>
        <div className="w-full md:w-1/2">
          {labelWithTip('free_credit_days', 'Días de crédito', <>
            <p>El crédito libre vence a los días indicados desde la venta. Son también los días de crédito que se declaran en la factura.</p>
            <p>Cambiarlo no afecta los créditos ya otorgados.</p>
          </>)}
          <input id="free_credit_days" type="number" min={1} className="input" disabled={disabled} {...register('free_credit_days', { valueAsNumber: true })} />
          <p className="text-xs text-text-muted mt-1">Fecha de vencimiento de los créditos sin cuotas.</p>
        </div>
      </section>

      <section className="space-y-3 border-t border-bg-subtle pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Crédito por cuotas</h3>
        {available ? <div className="flex items-center">
          {switchField('installments_enabled', 'Permitir créditos por cuotas')}
          <InfoTip>
            <p>Al cobrar a crédito se elige entre <b>Libre</b> (abonos de cualquier monto hasta pagar) y <b>Por cuotas</b> (plan de pagos con fecha en cada cuota).</p>
            <p>El interés, la mora y los domingos se copian al crédito cuando se otorga: los cambios aquí solo aplican a créditos nuevos.</p>
          </InfoTip>
        </div> : (
          <p className="text-sm text-text-muted">Los créditos por cuotas están disponibles para comercio en los planes Estándar y Premium.</p>
        )}

        {installmentsEnabled && <>
          <div>
            <div className="flex items-center">
              <span className="input-label">Frecuencias permitidas</span>
              <InfoTip>
                <p><b>Mensual:</b> el mismo día de cada mes; si el mes no tiene ese día (31 en febrero), cae el último día.</p>
                <p><b>Cada 15 días:</b> suma 15 días a cada fecha; no es el 15 y fin de mes.</p>
                <p><b>Semanal</b> suma 7 días y <b>diaria</b> 1 día.</p>
              </InfoTip>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              {frequencies.map((frequency) => <div key={frequency.name}>{switchField(frequency.name, frequency.label)}</div>)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {labelWithTip('max_installments', 'Máximo de cuotas', <p>Límite de cuotas al dar un crédito y al reestructurarlo.</p>)}
              <input id="max_installments" type="number" min={1} className="input" disabled={disabled} {...register('max_installments', { valueAsNumber: true })} />
            </div>
            <div className="flex items-end pb-2">
              {switchField('skip_sundays', 'Las cuotas diarias no caen en domingo')}
              <InfoTip><p>Solo para la frecuencia diaria: las fechas se saltan los domingos y el plan termina más tarde.</p></InfoTip>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {labelWithTip('interest_method', 'Interés', <>
                <p><b>Sin interés:</b> el monto se divide en cuotas iguales.</p>
                <p><b>Simple:</b> el interés se calcula sobre el monto inicial en todos los períodos. Cuotas iguales.</p>
                <p><b>Sobre saldo:</b> cuota fija, pero cada cuota cobra interés solo sobre el capital que falta, así que el interés total es menor.</p>
                <p className="text-text-muted">Ej.: $600 en 6 cuotas mensuales al 3 %: simple $118 por cuota ($108 de interés); sobre saldo $110.76 ($64.56).</p>
              </>)}
              <select id="interest_method" className="input-select" disabled={disabled} {...register('interest_method', { valueAsNumber: true })}>
                <option value={0}>Sin interés</option>
                <option value={1}>Simple (sobre el monto inicial)</option>
                <option value={2}>Sobre saldo</option>
              </select>
            </div>
            {interestMethod > 0 && <div>
              {labelWithTip('interest_rate', 'Tasa mensual (%)', <>
                <p>Siempre es mensual. En otras frecuencias se convierte: semanal = tasa × 12 / 52, cada 15 días = tasa × 12 × 15 / 365, diaria = tasa × 12 / 365.</p>
              </>)}
              <input id="interest_rate" type="number" step="any" min={0} className="input" disabled={disabled} {...register('interest_rate', { valueAsNumber: true })} />
            </div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              {labelWithTip('late_fee_type', 'Mora', <>
                <p>Se carga <b>una sola vez</b> por cada cuota vencida, cuando pasan los días de gracia.</p>
                <p><b>Monto fijo:</b> el mismo valor por cuota. <b>Porcentaje:</b> sobre el valor de la cuota (capital más interés).</p>
                <p>Un usuario con permiso puede condonarla desde el abono.</p>
              </>)}
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
                {labelWithTip('grace_days', 'Días de gracia', <p>Días después del vencimiento antes de cargar la mora. Con 0 se carga al día siguiente del vencimiento; con 3, una cuota que vence el 15 la carga el 19.</p>)}
                <input id="grace_days" type="number" min={0} className="input" disabled={disabled} {...register('grace_days', { valueAsNumber: true })} />
              </div>
            </>}
          </div>
          <div className="flex items-center">
            <p className="text-xs text-text-muted">El interés y la mora se facturan en cada abono, con el mismo tipo de documento de la venta.</p>
            <InfoTip>
              <p>Cada abono paga primero lo vencido: mora, interés y capital.</p>
              <p>Lo que se paga antes de la fecha se descuenta de las <b>últimas cuotas</b>, solo a capital, y la cuota que queda saldada ya no cobra su interés. La próxima cuota sigue pendiente.</p>
              <p>El capital ya se facturó en la venta; por eso solo el interés y la mora generan documento.</p>
            </InfoTip>
          </div>
        </>}
      </section>

      {changes && (
        <div className="flex justify-end">
          <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
        </div>
      )}
    </form>
    {available && settings.installments_enabled && (
      <div className="px-4 pb-4">
        <SettingsCreditTemplates templates={templates} frequencies={allowedFrequencies} changes={changes} saving={saving} onAdd={onAddTemplate} onDelete={onDeleteTemplate} />
      </div>
    )}
    </div>
  );
}

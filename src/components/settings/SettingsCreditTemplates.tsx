'use client';
import { frequencyName } from '@/components/accounts/utils';
import { Button, Preset } from '@/components/button/button';
import { CreditPlanTemplate } from '@/interfaces/credits';
import { useForm } from 'react-hook-form';

interface SettingsCreditTemplatesProps {
  templates: CreditPlanTemplate[];
  frequencies: number[];
  changes: boolean;
  saving: boolean;
  onAdd: (data: any) => Promise<boolean>;
  onDelete: (id: string) => void;
}

export default function SettingsCreditTemplates({ templates, frequencies, changes, saving, onAdd, onDelete }: SettingsCreditTemplatesProps) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    const success = await onAdd({ name: data.name, frequency: Number(data.frequency), installments_count: Number(data.installments_count) });
    if (success) reset();
  };

  return (
    <section className="space-y-3 border-t border-bg-subtle pt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Plantillas de plan</h3>
      <p className="text-xs text-text-muted">Al cobrar se elige una plantilla para precargar la frecuencia y el número de cuotas.</p>

      {templates.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
              <tr>
                <th className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Nombre</th>
                <th className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Frecuencia</th>
                <th className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cuotas</th>
                {changes && <th className="px-6 py-3 font-bold tracking-wider whitespace-nowrap">OP</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-subtle/50">
              {templates.map((template) => (
                <tr key={template.id} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
                  <td className="px-3 py-2 whitespace-nowrap">{template.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{frequencyName(template.frequency)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{template.installments_count}</td>
                  {changes && <td className="px-3 py-2 whitespace-nowrap">
                    <Button preset={Preset.smallClose} noText disabled={saving} onClick={() => onDelete(template.id)} />
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {changes && (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2">
            <label htmlFor="template_name" className="input-label">Nombre</label>
            <input id="template_name" className="input" placeholder="Ej. 6 meses" {...register('name', { required: true })} />
          </div>
          <div>
            <label htmlFor="template_frequency" className="input-label">Frecuencia</label>
            <select id="template_frequency" className="input-select" {...register('frequency')}>
              {frequencies.map((frequency) => <option key={frequency} value={frequency}>{frequencyName(frequency)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="template_count" className="input-label">Cuotas</label>
            <input id="template_count" type="number" min={1} className="input" {...register('installments_count', { required: true })} />
          </div>
          <div className="md:col-span-4 flex justify-end">
            <Button type="submit" preset={saving ? Preset.saving : Preset.add} disabled={saving} />
          </div>
        </form>
      )}
    </section>
  );
}

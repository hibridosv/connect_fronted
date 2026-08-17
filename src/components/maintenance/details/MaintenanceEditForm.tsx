'use client';
import { Button, Preset } from "@/components/button/button";
import { MaintenanceDynamicFieldsForm } from "@/components/maintenance/MaintenanceDynamicFieldsForm";
import { useMaintenanceEmployeesLogic } from "@/hooks/maintenance/useMaintenanceEmployeesLogic";
import { Maintenance } from "@/interfaces/maintenance";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";

export interface MaintenanceEditFormProps {
  maintenance: Maintenance;
  onSave: (data: any) => Promise<boolean>;
  saving: boolean;
}

function buildDefaults(maintenance: Maintenance) {
  return {
    asset_label: maintenance.asset_label ?? '',
    employee_id: maintenance.employee_id ?? '',
    problem_description: maintenance.problem_description ?? '',
    diagnosis: maintenance.diagnosis ?? '',
    solution: maintenance.solution ?? '',
    total: maintenance.total ?? '',
    custom_fields: maintenance.custom_fields ?? {},
  };
}

export function MaintenanceEditForm({ maintenance, onSave, saving }: MaintenanceEditFormProps) {
  const [editing, setEditing] = useState(false);
  const { employees, loading: loadingEmployees } = useMaintenanceEmployeesLogic();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>({ defaultValues: buildDefaults(maintenance) });

  useEffect(() => {
    reset(buildDefaults(maintenance));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maintenance]);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      total: data.total === '' ? null : Number(data.total),
    };
    const success = await onSave(payload);
    if (success) setEditing(false);
  };

  const handleCancel = () => {
    reset(buildDefaults(maintenance));
    setEditing(false);
  };

  return (
    <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-text-base uppercase tracking-wider">Detalles de la orden</h3>
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
            <MdEdit size={14} /> Editar
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-3">
            <label className="input-label">Bien / Activo</label>
            <input className={editing ? 'input' : 'input-disabled'} disabled={!editing} {...register('asset_label')} />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-3">
            <label className="input-label">Técnico asignado</label>
            <select className={editing ? 'input-select' : 'input-disabled'} disabled={!editing || loadingEmployees} {...register('employee_id')}>
              <option value="">Sin asignar</option>
              {employees?.map((employee: any) => (
                <option key={employee.id} value={employee.id}>{employee.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full px-2 mb-3">
            <label className="input-label">Descripción del problema</label>
            <textarea rows={2} className={`${editing ? 'input' : 'input-disabled'} w-full resize-none`} disabled={!editing} {...register('problem_description')} />
          </div>
          <div className="w-full px-2 mb-3">
            <label className="input-label">Diagnóstico</label>
            <textarea rows={2} className={`${editing ? 'input' : 'input-disabled'} w-full resize-none`} disabled={!editing} {...register('diagnosis')} />
          </div>
          <div className="w-full px-2 mb-3">
            <label className="input-label">Solución</label>
            <textarea rows={2} className={`${editing ? 'input' : 'input-disabled'} w-full resize-none`} disabled={!editing} {...register('solution')} />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-3">
            <label className="input-label">Total</label>
            <input type="number" step="any" className={editing ? 'input' : 'input-disabled'} disabled={!editing} {...register('total')} />
          </div>
        </div>

        {maintenance.type?.fields_schema && maintenance.type.fields_schema.length > 0 && (
          <div className="mt-2">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider border-b border-bg-subtle pb-1 mb-2 px-2">
              Campos de &quot;{maintenance.type.name}&quot;
            </h4>
            <MaintenanceDynamicFieldsForm fieldsSchema={maintenance.type.fields_schema} register={register} errors={errors} disabled={!editing} />
          </div>
        )}

        {editing && (
          <div className="flex justify-center gap-3 mt-3">
            <Button type="button" text="Cancelar" preset={Preset.cancel} onClick={handleCancel} disabled={saving} />
            <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
          </div>
        )}
      </form>
    </div>
  );
}

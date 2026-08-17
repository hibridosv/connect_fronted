'use client';
import { MaintenanceFieldSchema } from "@/interfaces/maintenance";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export interface MaintenanceDynamicFieldsFormProps {
  fieldsSchema: MaintenanceFieldSchema[] | undefined;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
}

export function MaintenanceDynamicFieldsForm({ fieldsSchema, register, errors, disabled = false }: MaintenanceDynamicFieldsFormProps) {
  if (!fieldsSchema || fieldsSchema.length === 0) {
    return <p className="text-sm text-text-muted italic px-3">Este tipo de mantenimiento no tiene campos adicionales.</p>;
  }

  return (
    <div className="flex flex-wrap -mx-3">
      {fieldsSchema.map((field) => {
        const name = `custom_fields.${field.name}`;
        const fieldError = (errors as any)?.custom_fields?.[field.name];
        return (
          <div key={field.name} className={`px-3 mb-3 ${field.type === 'textarea' ? 'w-full' : 'w-full md:w-1/2'}`}>
            <label className="input-label">
              {field.label}{field.required && <span className="text-danger"> *</span>}
            </label>
            <FieldControl field={field} name={name} register={register} disabled={disabled} />
            {fieldError && <p className="text-xs text-danger mt-1">Este campo es requerido.</p>}
          </div>
        );
      })}
    </div>
  );
}

function FieldControl({ field, name, register, disabled }: { field: MaintenanceFieldSchema; name: string; register: UseFormRegister<any>; disabled: boolean }) {
  const validation = { required: field.required };
  const inputClass = disabled ? 'input-disabled' : 'input';

  switch (field.type) {
    case 'textarea':
      return <textarea rows={2} disabled={disabled} className={`${inputClass} w-full resize-none`} {...register(name, validation)} />;
    case 'number':
      return <input type="number" step="any" disabled={disabled} className={inputClass} {...register(name, validation)} />;
    case 'date':
      return <input type="date" disabled={disabled} className={inputClass} {...register(name, validation)} />;
    case 'boolean':
      return (
        <div className="mt-2">
          <input type="checkbox" disabled={disabled} className="w-4 h-4" {...register(name)} />
        </div>
      );
    case 'select':
      return (
        <select disabled={disabled} className="input-select" {...register(name, validation)}>
          <option value="">Seleccionar...</option>
          {(field.options ?? []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    default:
      return <input type="text" disabled={disabled} className={inputClass} {...register(name, validation)} />;
  }
}

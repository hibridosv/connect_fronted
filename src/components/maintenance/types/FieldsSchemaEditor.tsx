'use client';
import { Button, Preset } from "@/components/button/button";
import { MAINTENANCE_FIELD_TYPES, slugifyFieldName } from "@/lib/maintenance";
import { useState } from "react";
import { Control, useFieldArray, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";
import { FieldOptionsTagsInput } from "../FieldOptionsTagsInput";

export interface FieldsSchemaEditorProps {
  control: Control<any>;
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export function FieldsSchemaEditor({ control, register, watch, setValue }: FieldsSchemaEditorProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'fields_schema' });
  const [touchedNames, setTouchedNames] = useState<Set<string>>(new Set());

  const addField = () => append({ name: '', label: '', type: 'text', required: false, options: [] });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="input-label mb-0">Campos del formulario</span>
        <Button preset={Preset.add} text="Agregar campo" onClick={addField} />
      </div>

      {fields.length === 0 && (
        <div className="p-4 text-center text-sm text-text-muted border border-dashed border-bg-subtle rounded-lg">
          Sin campos adicionales — agrega al menos uno para construir el formulario dinámico.
        </div>
      )}

      <div className="space-y-3">
        {fields.map((item, index) => {
          const type = watch(`fields_schema.${index}.type`);
          return (
            <div key={item.id} className="p-3 border border-bg-subtle rounded-lg bg-bg-subtle/20 space-y-2">
              <div className="flex flex-wrap -mx-1.5">
                <div className="px-1.5 w-full md:w-5/12 mb-2">
                  <label className="input-label">Etiqueta</label>
                  <input
                    className="input"
                    placeholder="Ej. Kilometraje actual"
                    {...register(`fields_schema.${index}.label`, {
                      required: true,
                      onChange: (e) => {
                        if (!touchedNames.has(item.id)) {
                          setValue(`fields_schema.${index}.name`, slugifyFieldName(e.target.value));
                        }
                      },
                    })}
                  />
                </div>
                <div className="px-1.5 w-full md:w-3/12 mb-2">
                  <label className="input-label">Nombre interno</label>
                  <input
                    className="input"
                    placeholder="kilometraje_actual"
                    {...register(`fields_schema.${index}.name`, {
                      required: true,
                      onChange: () => setTouchedNames((prev) => new Set(prev).add(item.id)),
                    })}
                  />
                </div>
                <div className="px-1.5 w-full md:w-3/12 mb-2">
                  <label className="input-label">Tipo</label>
                  <select className="input-select" {...register(`fields_schema.${index}.type`)}>
                    {MAINTENANCE_FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="px-1.5 w-full md:w-1/12 mb-2 flex items-end justify-center">
                  <button type="button" onClick={() => remove(index)} className="text-danger hover:text-danger/70 p-2" title="Eliminar campo">
                    <MdDeleteOutline size={20} />
                  </button>
                </div>
              </div>

              {type === 'select' && (
                <div className="px-1.5">
                  <label className="input-label">Opciones</label>
                  <FieldOptionsTagsInput
                    value={watch(`fields_schema.${index}.options`) ?? []}
                    onChange={(options) => setValue(`fields_schema.${index}.options`, options)}
                  />
                </div>
              )}

              <div className="px-1.5">
                <label className="inline-flex items-center gap-2 text-sm text-text-base">
                  <input type="checkbox" className="w-4 h-4" {...register(`fields_schema.${index}.required`)} />
                  Campo obligatorio
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

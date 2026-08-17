'use client';
import { Button, Preset } from "@/components/button/button";
import { Switch } from "@/components/button/Switch";
import { MAINTENANCE_FIELD_TYPES, slugifyFieldName } from "@/lib/maintenance";
import { useState } from "react";
import { Control, useFieldArray, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { MdDeleteOutline, MdOutlineListAlt } from "react-icons/md";
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

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-text-muted border border-dashed border-bg-subtle rounded-lg">
          <MdOutlineListAlt size={26} className="opacity-40" />
          <p className="text-sm text-center px-4">
            Sin campos adicionales — agrega al menos uno para construir el formulario dinámico.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((item, index) => {
            const type = watch(`fields_schema.${index}.type`);
            const fieldName = watch(`fields_schema.${index}.name`);
            const required = watch(`fields_schema.${index}.required`);

            return (
              <div key={item.id} className="border border-bg-subtle rounded-lg bg-bg-content shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-bg-subtle/40 border-b border-bg-subtle">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 shrink-0 rounded-full bg-primary text-text-inverted flex items-center justify-center text-[10px] font-bold">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Campo {index + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-text-muted hover:text-danger transition-colors p-1"
                    title="Eliminar campo"
                  >
                    <MdDeleteOutline size={18} />
                  </button>
                </div>

                <div className="p-3 space-y-3">
                  <div className="flex flex-wrap -mx-1.5">
                    <div className="px-1.5 w-full mb-2">
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
                    <div className="px-1.5 w-full md:w-1/2 mb-2">
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
                    <div className="px-1.5 w-full md:w-1/2 mb-2">
                      <label className="input-label">Tipo</label>
                      <select className="input-select" {...register(`fields_schema.${index}.type`)}>
                        {MAINTENANCE_FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                  </div>

                  {type === 'select' && (
                    <div>
                      <label className="input-label">Opciones</label>
                      <FieldOptionsTagsInput
                        value={watch(`fields_schema.${index}.options`) ?? []}
                        onChange={(options) => setValue(`fields_schema.${index}.options`, options)}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-bg-subtle">
                    <Switch
                      checked={!!required}
                      onChange={(checked) => setValue(`fields_schema.${index}.required`, checked)}
                      label="Campo obligatorio"
                      sizing="sm"
                    />
                    {fieldName && (
                      <span
                        className="text-[11px] text-text-muted font-mono truncate max-w-[45%]"
                        title={`custom_fields.${fieldName}`}
                      >
                        custom_fields.{fieldName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

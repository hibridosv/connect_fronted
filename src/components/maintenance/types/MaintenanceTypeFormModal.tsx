'use client';
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { MaintenanceType } from "@/interfaces/maintenance";
import useMaintenanceTypesStore from "@/stores/maintenance/maintenanceTypesStore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FieldsSchemaEditor } from "./FieldsSchemaEditor";

export interface MaintenanceTypeFormModalProps {
  isShow: boolean;
  onClose: () => void;
  record?: MaintenanceType | null;
}

export function MaintenanceTypeFormModal({ isShow, onClose, record }: MaintenanceTypeFormModalProps) {
  const { createType, updateType, saving } = useMaintenanceTypesStore();
  const { register, handleSubmit, reset, control, watch, setValue } = useForm<any>({
    defaultValues: { name: '', description: '', fields_schema: [] },
  });

  const isEdit = !!record;

  useEffect(() => {
    if (isShow) {
      reset({
        name: record?.name ?? '',
        description: record?.description ?? '',
        fields_schema: record?.fields_schema ?? [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow, record]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: any) => {
    const payload = {
      name: data.name,
      description: data.description,
      fields_schema: (data.fields_schema ?? []).map((field: any) => ({
        name: field.name,
        label: field.label,
        type: field.type,
        required: !!field.required,
        ...(field.type === 'select' ? { options: field.options ?? [] } : {}),
      })),
    };

    const success = isEdit ? await updateType(record!.id, payload) : await createType(payload);
    if (success) handleClose();
  };

  if (!isShow) return null;

  return (
    <Modal show={isShow} onClose={handleClose} headerTitle={isEdit ? 'Editar tipo de mantenimiento' : 'Nuevo tipo de mantenimiento'} size="xl2" closeOnOverlayClick={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <div className="space-y-4 p-1">
            <div className="flex flex-wrap -mx-3">
              <div className="w-full md:w-1/2 px-3 mb-3">
                <label className="input-label">Nombre *</label>
                <input className="input" placeholder="Ej. Cambio de aceite" {...register('name', { required: true })} />
              </div>
              <div className="w-full md:w-1/2 px-3 mb-3">
                <label className="input-label">Descripción</label>
                <input className="input" placeholder="Descripción breve" {...register('description')} />
              </div>
            </div>

            <FieldsSchemaEditor control={control} register={register} watch={watch} setValue={setValue} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} preset={Preset.close} disabled={saving} />
          <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
        </Modal.Footer>
      </form>
    </Modal>
  );
}

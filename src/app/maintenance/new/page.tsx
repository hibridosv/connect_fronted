'use client';

import { Button, Preset } from "@/components/button/button";
import { MaintenanceDynamicFieldsForm } from "@/components/maintenance/MaintenanceDynamicFieldsForm";
import { MaintenanceTypeSelectCards } from "@/components/maintenance/new/MaintenanceTypeSelectCards";
import { ContactSearch } from "@/components/search/ContactSearch";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useMaintenanceEmployeesLogic } from "@/hooks/maintenance/useMaintenanceEmployeesLogic";
import { useMaintenanceNewLogic } from "@/hooks/maintenance/useMaintenanceNewLogic";
import { MaintenanceType } from "@/interfaces/maintenance";
import useTempStorage from "@/stores/useTempStorage";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const { types, loadingTypes, onSubmit, saving } = useMaintenanceNewLogic();
  const { employees, loading: loadingEmployees } = useMaintenanceEmployeesLogic();
  const { getElement, clearElement } = useTempStorage();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<MaintenanceType | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>({ defaultValues: { custom_fields: {} } });

  const selectedContact = getElement('maintenanceNewContact');

  const handleSelectType = (type: MaintenanceType) => {
    setSelectedType(type);
    reset({ asset_label: '', employee_id: '', problem_description: '', custom_fields: {} });
  };

  const goToStepTwo = () => {
    if (selectedContact && selectedType) setStep(2);
  };

  const goBack = () => setStep(1);

  const onSubmitForm = async (data: any) => {
    if (!selectedType || !selectedContact) return;
    const payload = {
      maintenance_type_id: selectedType.id,
      contact_id: selectedContact.id,
      employee_id: data.employee_id || undefined,
      asset_label: data.asset_label,
      problem_description: data.problem_description,
      custom_fields: data.custom_fields ?? {},
    };
    const created = await onSubmit(payload);
    if (created) {
      reset();
      clearElement('maintenanceNewContact');
      setSelectedType(null);
      setStep(1);
    }
  };

  return (
    <div className="pb-4 md:pb-10 max-w-3xl mx-auto">
      <ViewTitle text="Nueva Orden de Mantenimiento" />

      <div className="flex items-center gap-2 px-4 mt-2 mb-4">
        <StepDot active={step === 1} done={step > 1} label="Cliente y tipo" number={1} />
        <div className="flex-1 h-px bg-bg-subtle" />
        <StepDot active={step === 2} done={false} label="Detalles" number={2} />
      </div>

      {step === 1 && (
        <div className="px-4 space-y-4">
          <div>
            <label className="input-label">Cliente</label>
            <ContactSearch param="customers" placeholder="Buscar cliente" tempSelectedName="maintenanceNewContact" />
          </div>

          <div>
            <label className="input-label">Tipo de mantenimiento</label>
            {loadingTypes ? (
              <p className="text-sm text-text-muted">Cargando tipos...</p>
            ) : (
              <MaintenanceTypeSelectCards types={types} selectedId={selectedType?.id ?? ''} onSelect={handleSelectType} />
            )}
          </div>

          <div className="flex justify-center pt-2">
            <Button text="Continuar" preset={Preset.primary} onClick={goToStepTwo} disabled={!selectedContact || !selectedType} />
          </div>
        </div>
      )}

      {step === 2 && selectedType && (
        <form onSubmit={handleSubmit(onSubmitForm)} className="px-4 space-y-4">
          <div className="p-3 bg-bg-subtle/40 rounded-lg text-sm text-text-base flex items-center justify-between">
            <span><span className="font-semibold">{selectedContact?.name}</span> — {selectedType.name}</span>
            <button type="button" onClick={goBack} className="text-xs text-primary hover:underline shrink-0">cambiar</button>
          </div>

          <div className="flex flex-wrap -mx-3">
            <div className="w-full px-3 mb-3">
              <label className="input-label">Bien / Activo</label>
              <input className="input" placeholder="Ej. Toyota Corolla 2018 - Placa P123-456" {...register('asset_label')} />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-3">
              <label className="input-label">Técnico asignado</label>
              <select className="input-select" {...register('employee_id')} disabled={loadingEmployees}>
                <option value="">Sin asignar</option>
                {employees?.map((employee: any) => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="px-3">
            <label className="input-label">Descripción del problema</label>
            <textarea rows={3} className="input w-full resize-none" {...register('problem_description')} />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-base border-b border-bg-subtle pb-1 mb-2 px-3">
              Campos de &quot;{selectedType.name}&quot;
            </h4>
            <MaintenanceDynamicFieldsForm fieldsSchema={selectedType.fields_schema} register={register} errors={errors} />
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Button type="button" text="Atrás" preset={Preset.secondary} onClick={goBack} disabled={saving} />
            <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
          </div>
        </form>
      )}

      <ToasterMessage />
    </div>
  );
}

function StepDot({ active, done, label, number }: { active: boolean; done: boolean; label: string; number: number }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs font-semibold ${active ? 'text-primary' : done ? 'text-success' : 'text-text-muted'}`}>
      <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] ${active ? 'bg-primary text-text-inverted' : done ? 'bg-success text-white' : 'bg-bg-subtle'}`}>
        {done ? '✓' : number}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}

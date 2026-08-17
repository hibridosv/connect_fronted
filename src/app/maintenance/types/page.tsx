'use client';

import { Button, Preset } from "@/components/button/button";
import { MaintenanceTypeFormModal } from "@/components/maintenance/types/MaintenanceTypeFormModal";
import { MaintenanceTypesList } from "@/components/maintenance/types/MaintenanceTypesList";
import { SearchInput } from "@/components/Search";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useMaintenanceTypesLogic } from "@/hooks/maintenance/useMaintenanceTypesLogic";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";
import Link from "next/link";

export default function Page() {
  const { searchTerm, handleSearchTerm } = useSearchTerm(["name"], 400, 2);
  const { types, loading } = useMaintenanceTypesLogic(searchTerm);
  const { modals, openModal, closeModal } = useModalStore();
  const { getElement, clearElement } = useTempStorage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Tipos de Mantenimiento" />
        <div className="p-4">
          <MaintenanceTypesList types={types} loading={loading} />
        </div>
      </div>
      <div className="md:col-span-3">
        <ViewTitle text="Buscar Tipo" />
        <div className="p-4">
          <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar tipo de mantenimiento" animating={loading} />
        </div>

        <div className="p-4 flex justify-center">
          <Button
            preset={Preset.add}
            text="Nuevo Tipo"
            onClick={() => { clearElement('maintenanceTypeForm'); openModal('maintenanceTypeForm'); }}
          />
        </div>

        <div className="px-4 text-center">
          <Link href="/maintenance" className="text-xs text-primary hover:underline">
            Volver a órdenes de mantenimiento
          </Link>
        </div>
      </div>

      <MaintenanceTypeFormModal
        isShow={!!modals.maintenanceTypeForm}
        onClose={() => closeModal('maintenanceTypeForm')}
        record={getElement('maintenanceTypeForm')}
      />

      <ToasterMessage />
    </div>
  );
}

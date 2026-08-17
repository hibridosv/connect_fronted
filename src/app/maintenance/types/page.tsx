'use client';

import { MaintenanceTypesList } from "@/components/maintenance/types/MaintenanceTypesList";
import { SearchInput } from "@/components/Search";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useMaintenanceTypesLogic } from "@/hooks/maintenance/useMaintenanceTypesLogic";
import { useSearchTerm } from "@/hooks/useSearchTerm";

export default function Page() {
  const { searchTerm, handleSearchTerm } = useSearchTerm(["name"], 400, 2);
  const { types, loading } = useMaintenanceTypesLogic(searchTerm);

  return (
    <div className="pb-4 md:pb-10 max-w-3xl mx-auto">
      <ViewTitle text="Tipos de Mantenimiento" />
      <div className="p-4 max-w-md">
        <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar tipo de mantenimiento" animating={loading} />
      </div>
      <div className="p-4">
        <MaintenanceTypesList types={types} loading={loading} />
      </div>
      <ToasterMessage />
    </div>
  );
}

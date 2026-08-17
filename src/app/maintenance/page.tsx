'use client';

import { MaintenanceStatusTabs } from "@/components/maintenance/MaintenanceStatusTabs";
import { ShowMaintenancesTable } from "@/components/maintenance/ShowMaintenancesTable";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/Search";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { Button, Preset } from "@/components/button/button";
import { useMaintenanceTypesLogic } from "@/hooks/maintenance/useMaintenanceTypesLogic";
import { useMaintenancesLogic } from "@/hooks/maintenance/useMaintenancesLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const { currentPage, handlePageNumber } = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["asset_label"], 400);
  const [status, setStatus] = useState<number | 0>(0);
  const [typeId, setTypeId] = useState("");
  const { maintenances, loading } = useMaintenancesLogic(currentPage, searchTerm, status, typeId);
  const { types } = useMaintenanceTypesLogic("");

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Órdenes de Mantenimiento" />
        <div className="p-2">
          <div className="px-2 mb-3">
            <MaintenanceStatusTabs status={status} setStatus={setStatus} />
          </div>
          <ShowMaintenancesTable records={maintenances?.data} loading={loading} />
          <Pagination records={maintenances} handlePageNumber={handlePageNumber} />
        </div>
      </div>
      <div className="md:col-span-3">
        <ViewTitle text="Buscar Orden" />
        <div className="p-4">
          <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar por bien / activo" animating={loading} />
        </div>

        <div className="px-4">
          <label className="input-label">Tipo de mantenimiento</label>
          <select className="input-select" value={typeId} onChange={(e) => setTypeId(e.target.value)}>
            <option value="">Todos los tipos</option>
            {types?.map((type: any) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div className="p-4 flex justify-center">
          <Link href="/maintenance/new">
            <Button preset={Preset.add} text="Nueva Orden" />
          </Link>
        </div>

        <div className="px-4 text-center">
          <Link href="/maintenance/types" className="text-xs text-primary hover:underline">
            Administrar tipos de mantenimiento
          </Link>
        </div>
      </div>
      <ToasterMessage />
    </div>
  );
}

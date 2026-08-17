'use client';
import { DeleteModal } from "@/components/DeleteModal";
import { Dropdown } from "@/components/dropDown/Dropdown";
import { DropdownDivider } from "@/components/dropDown/DropdownDivider";
import { DropdownItem } from "@/components/dropDown/DropdownItem";
import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { Maintenance } from "@/interfaces/maintenance";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useMaintenanceStore from "@/stores/maintenance/maintenanceStore";
import Link from "next/link";
import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { MaintenanceStatusBadge } from "./MaintenanceStatusBadge";

export interface ShowMaintenancesTableProps {
  records: Maintenance[];
  loading?: boolean;
}

export function ShowMaintenancesTable({ records, loading }: ShowMaintenancesTableProps) {
  const { system } = useConfigStore();
  const { deleteMaintenance, deleting } = useMaintenanceStore();
  const [deleteTarget, setDeleteTarget] = useState<Maintenance | null>(null);

  if (loading) return <SkeletonTable rows={15} columns={8} />;
  if (!records || records.length === 0) return <NothingHere />;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const success = await deleteMaintenance(deleteTarget.id);
    if (success) setDeleteTarget(null);
  };

  const listItems = records.map((record) => (
    <tr key={record.id} className="whitespace-nowrap transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
      <td className="px-2 py-2">{formatDateAsDMY(record.received_at)}</td>
      <td className="px-2 py-2 clickeable-table font-medium text-primary hover:underline">
        <Link href={`/maintenance/${record.id}`}>{record.asset_label || record.type?.name || 'Sin descripción'}</Link>
      </td>
      <td className="px-2 py-2">{record.type?.name ?? '--'}</td>
      <td className="px-2 py-2">{record.contact?.name ?? '--'}</td>
      <td className="px-2 py-2">{record.employee?.name ?? '--'}</td>
      <td className="px-2 py-2 text-center"><MaintenanceStatusBadge status={record.status} /></td>
      <td className="px-2 py-2 text-right">{record.total ? numberToMoney(record.total, system) : '--'}</td>
      <td className="px-2 py-2 text-center">
        <Dropdown label={<FiSettings size={18} />}>
          <DropdownItem as={`/maintenance/${record.id}`}>Ver Orden</DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={() => setDeleteTarget(record)}><span className="text-danger font-semibold">Eliminar</span></DropdownItem>
        </Dropdown>
      </td>
    </tr>
  ));

  return (
    <div>
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
            <tr className="border-b-2 border-bg-subtle">
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle">Recibido</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle">Bien / Activo</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle">Tipo</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle">Cliente</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle">Técnico</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider text-center border-r border-bg-subtle">Estado</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider text-right border-r border-bg-subtle">Total</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider text-center">OP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle">
            {listItems}
          </tbody>
        </table>
      </div>
      <DeleteModal
        isShow={!!deleteTarget}
        header="Eliminar orden de mantenimiento"
        text="¿Estás seguro de eliminar esta orden? Se eliminarán también sus imágenes y bitácora de estados."
        onDelete={handleDelete}
        onClose={() => setDeleteTarget(null)}
        isSending={deleting}
      />
    </div>
  );
}

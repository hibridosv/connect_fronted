'use client';

import { Button, Preset } from "@/components/button/button";
import { NothingHere } from "@/components/NothingHere";
import { ReportEnteredEditModal } from "@/components/reports/ReportEnteredEditModal";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney, permissionExists } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { useState } from "react";


export interface ReportEnteredTableI {
  records: any;
  isLoading?: boolean;
  onUpdated?: (record: any) => void;
}

export function ReportEnteredTable(props: ReportEnteredTableI) {
  const { records, isLoading, onUpdated } = props;
  const { system, permission } = useConfigStore();
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const canEdit = permissionExists(permission, 'reports-products-edit');

  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }

  const listItems = records.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary">
        { formatDateAsDMY(record?.created_at) }
      </td>
      <td className="px-3 py-2 whitespace-nowrap font-semibold">
        { record?.product?.description }
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap" >
        { record?.product?.cod }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.document_number ?? "N/A" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.quantity }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.unit_cost ?? 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.provider?.name }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.expiration ? formatDateAsDMY(record?.expiration) : "N/A" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.lot ?? "N/A" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.employee?.name }
      </td>
      { canEdit && (
        <td className={`px-3 py-2 text-center whitespace-nowrap`}>
          <Button preset={Preset.smallEdit} onClick={() => setSelectedRecord(record)} />
        </td>
      )}
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Codigo </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Documento </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cantidad</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Precio Costo</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Proveedor</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Caduca</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Lote</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Usuario</th>
              { canEdit && <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap"></th> }
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
        </table>
      </div>
      <ReportEnteredEditModal
        isShow={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
        onUpdated={(record) => onUpdated?.(record)}
      />
    </div>
  );
}

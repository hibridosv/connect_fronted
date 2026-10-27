'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { ActivityLog } from "@/interfaces/activityLog";
import { formatDate, formatHourAsHM } from "@/lib/date-formats";
import { useState } from "react";
import { HistoryActivityDetailModal } from "./HistoryActivityDetailModal";


export interface HistoryActivityTableI {
  records: ActivityLog[] | null;
  isLoading?: boolean;
}

export function HistoryActivityTable(props: HistoryActivityTableI) {
  const { records, isLoading } = props;
  const [ selected, setSelected ] = useState<ActivityLog | null>(null);

  if(isLoading) return <SkeletonTable rows={5} columns={5} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }

  const listItems = records.map((record: ActivityLog) => (
    <tr key={record.id} onClick={() => setSelected(record)} className="clickeable transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline">
        { formatDate(record.created_at) } { formatHourAsHM(record.created_at) }
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        { record.user?.name ?? 'Usuario eliminado' }
      </td>
      <td className="px-3 py-2 whitespace-nowrap font-medium">
        { record.event_label }
        <p className="text-xs text-text-muted">{ record.module_label }</p>
      </td>
      <td className="px-3 py-2">
        { record.description }
      </td>
      <td className="px-3 py-2 text-center whitespace-nowrap">
        { record.code_request_id ? <span className="px-2 py-0.5 rounded bg-warning/20 text-warning text-xs font-semibold">Con código</span> : '' }
      </td>
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Usuario</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Acción</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Descripción</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Autorización</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
        </table>
      </div>
      <HistoryActivityDetailModal record={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

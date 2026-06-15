'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";


export interface ReportDamageTableI {
  records: any;
  isLoading?: boolean;
}

export function ReportDamageTable(props: ReportDamageTableI) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();

  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }

  const listItems = records.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${record?.status == 2 && '!bg-red-200'}`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary">
        { formatDateAsDMY(record?.created_at) } { formatHourAsHM(record?.created_at) }
      </td>
      <td className="px-3 py-2 whitespace-nowrap font-semibold">
        { record?.product?.cod }
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap" >
       { record?.product?.description }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.product?.unit_cost, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.quantity }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.reason }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.employee?.name }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.deleted_by?.name ? record?.deleted_by?.name : "N/A" }
      </td>
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Codigo</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Costo U</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cantidad</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Razón</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Empleado</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Eliminado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
        </table>
      </div>
    </div>
  );
}

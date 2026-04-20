'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDate, formatHourAsHM } from "@/lib/date-formats";
import { getTotalOfItem, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";


export interface HistoryPaymentsTableI {
  records: any;
  isLoading?: boolean;
}

export function HistoryPaymentsTable(props: HistoryPaymentsTableI) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();

  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }

  const listItems = records.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${record?.status == 0 && 'bg-red-200'}`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline">
        { formatDate(record?.created_at) } { formatHourAsHM(record?.created_at)}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        { record?.employee?.name ?? "--" }
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap font-medium" >
        <span>{ record?.credit?.order?.invoice_assigned?.name ?? "--" }:</span>
        <span className="ml-3">{ record?.credit?.order?.invoice ?? "--" }</span>
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { record?.credit?.order?.client?.name ?? "N/A" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { numberToMoney(record?.quantity ?? 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.balance ?? 0, system) }
      </td>
    </tr>
  ));

  return (
    <div className="m-4 flex flex-col gap-3">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cajero</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Factura </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cliente</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Productos</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
        </table>
      </div>
      <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle flex">
        <div className="flex-1 flex flex-col items-center py-3 px-4">
          <span className="text-xs uppercase font-medium text-text-muted tracking-wider">Total abonos</span>
          <span className="text-xl font-bold text-success mt-0.5">{ numberToMoney(getTotalOfItem(records, "quantity"), system) }</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDate, formatHourAsHM } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";


export interface HistoryClosureTableI {
  records: any;
  isLoading?: boolean;
}

export function HistoryClosureTable(props: HistoryClosureTableI) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();

  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }

  const listItems = records.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${record?.status == 0 && '!bg-red-200'}`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline">
        { formatDate(record?.opening) } { formatHourAsHM(record?.opening)}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        {  formatDate(record?.close) } { formatHourAsHM(record?.close)} 
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap font-medium" >
       { numberToMoney(record?.inicial_cash ? record?.inicial_cash : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { numberToMoney(record?.final_cash ? record?.final_cash : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { record?.employee?.name } 
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.cash_incomes ? record?.cash_incomes : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.cash_expenses ? record?.cash_expenses : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.cash_diference ? record?.cash_diference : 0, system) }
      </td>
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Apertura</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cierre</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Efectivo Inicial</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Efectivo Cierre</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cajero</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Entradas</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Salidas</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Diferencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
        </table>
          <div className="w-full flex justify-center gap-4 p-4 mx-4 my-4 bg-bg-content rounded-lg shadow-sm border border-bg-subtle text-center">
            <div>
                <p className="text-sm text-text-muted">Numero total cortes: </p>
                <p className="text-lg font-semibold text-text-base">{ records.length }</p>
            </div>
          </div>
      </div>
    </div>
  );
}

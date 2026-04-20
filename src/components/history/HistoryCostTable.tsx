'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDate, formatHourAsHM } from "@/lib/date-formats";
import { numberToMoney, percentage } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";


export interface HistoryCostTableI {
  records: any;
  isLoading?: boolean;
}

export function HistoryCostTable(props: HistoryCostTableI) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();

  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere text="Seleccione un producto" />;
  }


  const listItems = records.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${record?.status == 0 && 'bg-red-200'}`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline">
        { formatDate(record?.created_at) } | { formatHourAsHM(record?.created_at)}
      </td>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline" title={record?.product?.cod}>
        {record?.product?.description }
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        { record?.quantity }
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap font-medium" >
        { record?.actual_stock }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { numberToMoney(record?.unit_cost ? record?.unit_cost : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.sale_price ? record?.sale_price : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney((record?.sale_price / 1.13) - (record?.unit_cost), system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(((record?.sale_price / 1.13) * record?.quantity) - (record?.unit_cost * record?.quantity), system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { percentage(record?.unit_cost * record?.quantity, (record?.sale_price /1.13) * record?.quantity).toFixed(2) } %
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.provider?.name }
      </td>
    </tr>
  ));

  return (
    <div className="m-4 flex flex-col gap-3">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Ingreso</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cantidad </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Existencia</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Precio costo</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Precio venta</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Utilidad unit</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Utilidad total</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Porcentaje</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Proveedor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
        </table>
      </div>
      <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle flex">
        <div className="flex-1 flex flex-col items-center py-3 px-4">
          <span className="text-xs uppercase font-medium text-text-muted tracking-wider">Total registros</span>
          <span className="text-xl font-bold text-text-base mt-0.5">{ records?.length }</span>
        </div>
      </div>
    </div>
  );
}

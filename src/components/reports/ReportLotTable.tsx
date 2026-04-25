'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";


export interface ReportLotTableI {
  records: any;
  isLoading?: boolean;
}

export function ReportLotTable(props: ReportLotTableI) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();

  let data = records?.per_page ? records.data : records;


  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!data || data.length === 0) {
    const message = records === null ? "Seleccione un producto" : "No hay resultados";
    return <NothingHere text={message} />;
  }


  const listItems = data.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline">
        { formatDateAsDMY(record?.created_at) }
      </td>
      <td className="px-3 py-2 whitespace-nowrap font-medium">
       { record?.product?.description ?? "--" }
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap" >
        { record?.product?.cod ?? "--" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { record?.quantity ?? "--" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap  font-bold ${record?.actual_stock <= 0 ? 'text-red-600' : 'text-black'}`}>
        { record?.actual_stock ?? "--" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.unit_cost ?? 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.sale_price ?? 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
       { record?.expiration ? formatDateAsDMY(record?.expiration) : "N/A" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.lot ?? "N/A" }
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
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Codigo </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cantidad</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Existencia</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Precio Costo</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Precio Venta</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Caduca</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Lote</th>
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

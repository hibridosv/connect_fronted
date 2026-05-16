'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDate, formatHourAsHM } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { Indicator } from "../Indicators";

  const setStatus = (status: number): any =>{
      switch (status) {
        case 0: return <Indicator text="Eliminado" type="danger" />
        case 1: return <Indicator text="Activo" type="dark" />
        case 2: return <Indicator text="Creado" type="success" />
        case 3: return <Indicator text="Pagado" type="info" />
      }
  }

  const setType = (status: number): any =>{
    switch (status) {
      case 1: return <Indicator text="Normal" type="success" />
      case 2: return <Indicator text="Puntos Oro" type="warning" />
    }
}


export interface HistoryCommisionsTableI {
  records: any;
  isLoading?: boolean;
}

export function HistoryCommisionsTable(props: HistoryCommisionsTableI) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();

  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere text="Seleccione un cliente" />;
  }


  const listItems = records.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${record?.status == 0 && '!!bg-red-200'}`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline">
        { formatDate(record?.updated_at) } { formatHourAsHM(record?.updated_at)}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        { setType(record?.type) }
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap font-medium" >
        { record?.referred?.name }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { record?.invoices }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.total ? record?.total : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.commissions ? record.type == 1 ? record?.commissions : record?.commissions * 0.10 : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { setStatus(record?.status) }
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
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Tipo </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cliente </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Facturas</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Comisiones</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Estado</th>
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

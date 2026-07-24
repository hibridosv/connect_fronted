'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDate, formatHourAsHM } from "@/lib/date-formats";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";
import { Indicator } from "../Indicators";


export interface AdjustmentsTableI {
  records: any;
  isLoading?: boolean;
}

export function AdjustmentsTable(props: AdjustmentsTableI) {
  const { records, isLoading } = props;
  const { openModal } = useModalStore();
  const { setElement } = useTempStorage();


  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }

  const listItems = records.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
      <td className="px-3 py-2 whitespace-nowrap text-primary text-center">
        { formatDate(record?.initial_date) } { formatHourAsHM(record?.initial_date) }
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap font-medium " >
       { formatDate(record?.final_date) } { formatHourAsHM(record?.final_date) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.total_products }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
       { record?.checked_products }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        <span className="clickeable-table" onClick={()=>{ openModal('adjustmentDetails'); setElement('adjustmentDetails', record)}}>
        <Indicator type="success" text="Finalizado" />
        </span>
      </td>
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha Inicial</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha Final</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Productos</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Ajustados</th>
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

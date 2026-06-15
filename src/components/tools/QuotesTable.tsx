'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { useQuotesLogic } from "@/hooks/tools/useQuotesLogic";
import { formatDateAsDMY } from "@/lib/date-formats";
import { formatDuiWithAll } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";
import { RiListRadio } from "react-icons/ri";
import { DeleteButton } from "../button/DeleteButton";


export interface QuotesTableI {
  records: any;
  isLoading?: boolean;
}

export function QuotesTable(props: QuotesTableI) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();
  const { openModal } = useModalStore();
  const { setElement } = useTempStorage();
  const { deleteRegister } = useQuotesLogic();

  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }

  const listItems = records.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${record?.status == 2 && '!bg-red-200'}`}>
      <td className="px-3 py-2 whitespace-nowrap text-primary text-center">
        { record?.quote_number ?? "N/A" }
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap font-medium " >
       { record?.client_name ?? "N/A" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { formatDuiWithAll(record?.client?.document) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { formatDateAsDMY(record?.created_at) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { formatDateAsDMY(record?.expiration) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        <span className="flex justify-between">
        <RiListRadio size={24} title="Ver detalles" className="text-cyan-600 clickeable" onClick={()=>{ openModal('quoteDetail'); setElement('quoteDetail', record)}} />
        <DeleteButton id={record.id} 
                disabled={false}
                url="tools/quotes" 
                onDeleteConfirm={deleteRegister} />
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
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Numero </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cliente </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Documento</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Expira</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">OP</th>
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

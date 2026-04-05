'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDate, formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";
import { AiOutlineFundView } from "react-icons/ai";
import { statusOfTransfer } from "../transfers/utils";

export interface HistoryTransfersTableI {
  records: any;
  isLoading?: boolean;
}

export function HistoryTransfersTable(props: HistoryTransfersTableI) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();
  const { openModal } = useModalStore();
  const { setElement } = useTempStorage();

  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }

  const listItems = records.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${record?.status == 0 && 'bg-red-200'}`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline">
        { formatDateAsDMY(record?.created_at) } { formatHourAsHM(record?.created_at) }
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        { record?.from?.description }
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap font-medium" >
        { record?.to?.description }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { record?.send }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { record?.receive ? record?.receive : "N/A" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.products ? record?.products?.length : "N/A" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.received_at ? formatDate(record?.received_at) : "N/A" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { statusOfTransfer(record?.status) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        <span className="flex justify-between">
          <AiOutlineFundView size={20} title="Ver detalles" className="text-primary clickeable" onClick={() => { setElement('historySelectedTransfer', record); openModal('historyTransferDetails'); }} />
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
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Enviado </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Origen</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Destino </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Envia</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Recibe</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Productos</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Recibido</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Estado</th>
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

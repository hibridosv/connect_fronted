'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";
import { MdAddchart } from "react-icons/md";
import { creditTotal, isInstallments, nextInstallment, overdueInstallments, status } from "./utils";


export interface AccountsReceivableTableI {
  records: any;
  isLoading?: boolean;
}

export function AccountsReceivableTable(props: AccountsReceivableTableI) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();
  const { openModal } = useModalStore();
  const { setElement } = useTempStorage();

  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }

  const listItems = records.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${record?.status == 2 && '!bg-red-200'}`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary" title={`Fecha otorgado: ${formatDateAsDMY(record.created_at)}`}>
        { record?.client?.name ?? "N/A" }
      </td>
      <td className="px-3 py-2 text-center whitespace-nowrap" >
       { record?.order?.invoice == 5 ? "N/A" : record?.order?.invoice }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { isInstallments(record) && nextInstallment(record) ? <>
            <span className={overdueInstallments(record).length > 0 ? 'text-danger font-semibold' : ''}>{ formatDateAsDMY(nextInstallment(record).due_date) }</span>
            <div className="text-xs text-text-muted">
              Cuota { nextInstallment(record).number }/{ record.installments_count }
              { overdueInstallments(record).length > 0 && <span className="text-danger"> · { overdueInstallments(record).length } vencida(s)</span> }
            </div>
          </> : (record?.expiration ? formatDateAsDMY(record?.expiration) : "N/A") }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(creditTotal(record), system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.balance ?? 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { status(record?.status) }
      </td>
      <td className={`px-3 py-2 text-left whitespace-nowrap`}>
        <MdAddchart size={28} className="text-lime-600 clickeable" onClick={()=>{ setElement('paymentReceivableAdd', record); openModal('paymentReceivableAdd'); }} />
      </td>
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cliente </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Factura </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Vence</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Saldo</th>
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

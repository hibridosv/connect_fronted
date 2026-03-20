'use client';

import { NothingHere } from "@/components/NothingHere";
import { useAccountReceivableLogic } from "@/hooks/accounts/useAccountReceivableLogic";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { getFirstElement, numberToMoney } from "@/lib/utils";
import accountReceivableStore from "@/stores/accounts/accountReceivableStore";
import useConfigStore from "@/stores/configStore";
import { FaPrint } from "react-icons/fa";
import { Button, Preset } from "../button/button";
import { ButtonDownload } from "../button/button-download";
import { DeleteButton } from "../button/DeleteButton";
import { nameOfPaymentType } from "../orders/products/PayModal";
import { statusPayment } from "./utils";


export interface AccountsReceivablePaymentsTableI {
  records: any;
}

export function AccountsReceivablePaymentsTable(props: AccountsReceivablePaymentsTableI) {
  const { records } = props;
  const { system, activeConfig } = useConfigStore();
  const { deletePayment, deleting } = accountReceivableStore();
  const { isPrint } = useAccountReceivableLogic();
  const isDisabled = false;

  
  if (!records || records.length === 0) {
    return <NothingHere text="No se encontraron abonos" width="100" height="65" />;
  }

  const reversed = [...records].reverse();

  const listItems = reversed.map((record: any) => {
    console.log(record)
    return (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${record?.status == 0 && 'bg-red-50'}`}>
      <td className="px-2 whitespace-nowrap font-medium text-primary">
        {formatDateAsDMY(record?.created_at)}  {formatHourAsHM(record?.created_at)}
      </td>
      <td className="px-2 text-center whitespace-nowrap font-semibold">
        { numberToMoney(record?.quantity ?? 0, system) }
      </td>
      <td className="px-2 text-left whitespace-nowrap" >
       { record?.employee?.name }
      </td>
      <td className="px-2 text-left whitespace-nowrap" >
        { nameOfPaymentType(record?.payment_type) }
      </td>
      <td className={`px-2 text-center whitespace-nowrap ${record?.status == 0 && 'cursor-help' }`} title={`${record?.status == 0 ? `Borrada por: ${record?.deleted_by?.name} el dia ${formatDateAsDMY(record?.deleted_at)}` : ``}`}>
        { statusPayment(record?.status) }
      </td>
      <td className={`px-2 flex justify-start whitespace-nowrap`}>
        <DeleteButton id={record.id} 
        disabled={record.payment_type == 0 ||
                  record?.status == 0 || 
                  isDisabled || 
                  getFirstElement(reversed, "account_type", record?.account_type)?.id != record.id ||
                  deleting }
        url="accounts/payment" 
        onDeleteConfirm={deletePayment} />
        {
        getFirstElement(reversed, "account_type", record?.account_type)?.id == record.id && (
        activeConfig && activeConfig.includes("print-link") ? 
        <ButtonDownload autoclass={false} href={`/download/pdf/creditPayment/${record.id}`}>
         <FaPrint className="clickeable ml-2" size={25} color="blue" />
        </ButtonDownload> :          
        <Button preset={Preset.smallPrint} noText onClick={isPrint} style="ml-2" />)
        } 
      </td>
    </tr>
  )
  });

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cantidad</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Usuario </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Tipo</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Estado</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Del</th>
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

'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { getPaymentTypeName, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";
import Link from "next/link";
import { BiArrowFromLeft } from "react-icons/bi";
import { Indicator } from "../Indicators";


export interface InvoicingSearchTableI {
  records: any;
  isLoading?: boolean;
}

export function InvoicingSearchTable(props: InvoicingSearchTableI) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();
  const { setElement} = useTempStorage();
  const { openModal } = useModalStore();

  if(isLoading) return <SkeletonTable rows={15} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }


  const listItems = records.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline">
        { formatDateAsDMY(record?.charged_at) } | { formatHourAsHM(record?.charged_at)}
      </td>
      <td className="px-3 py-2 whitespace-nowrap clickeable-table" onClick={()=>{ setElement('documentSelected', record); openModal('documentDetail')  }}>
        { record?.invoice_assigned?.name ?? "--" }
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap font-medium" >
        { record?.invoice ?? "--" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { record?.status == 3 ? <Indicator text="Pagado" type="success" /> : <Indicator text="Anulado" type="danger" /> }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { record?.client?.name ? record?.client?.name : "N/A" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { getPaymentTypeName(record?.payment_type) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.casheir?.name ?? "--" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.total ? record?.total : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        <Link href={`/invoicing/search/${record?.id}`}><BiArrowFromLeft size={24} color="green" /></Link>
      </td>
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Tipo</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">NO</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Estado</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cliente </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Tipo Pago</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cajero</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">ir</th>
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

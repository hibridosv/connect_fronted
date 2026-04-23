'use client';

import { formatDateAsDMY } from "@/lib/date-formats";
import { getCountryProperty, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { ButtonDownloadGet } from "../button/button-download-get";
import { NothingHere } from "../NothingHere";
import SkeletonTable from "../skeleton/skeleton-table";


export interface InvoicingCorrelativeTableI {
  records: any;
  isLoading?: boolean;
  invoiceId?: string;
}

export function InvoicingCorrelativeTable(props: InvoicingCorrelativeTableI) {
  const { records, isLoading, invoiceId } = props;
  const { system } = useConfigStore();

  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }


  const listItems = records && records.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline">
        <ButtonDownloadGet
            href={`invoiceId=${invoiceId}&date=${record?.date}&route=download.pdf.invoices.correlative`}
            autoclass={false}>
            { formatDateAsDMY(record?.date) }
      </ButtonDownloadGet>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        { record?.invoices }
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap font-medium" >
        { record?.initial_correlative } - { record?.final_correlative }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { numberToMoney(record?.subtotal ? record?.subtotal : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { numberToMoney(record?.taxes ? record?.taxes : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.total_exempt ? record?.total_exempt : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.total_recorded ? record?.total_recorded : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { numberToMoney(record?.total ? record?.total : 0, system) }
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
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Facturas</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Factura Inicial -  Factura Final</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Sub Total </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">{ getCountryProperty(parseInt(system?.country)).taxesName }</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Exento</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Gravado</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
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

'use client';

import { NothingHere } from "@/components/NothingHere";
import { Pagination } from "@/components/Pagination";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { getPaymentTypeName, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";

export interface ContactSalesTableProps {
  sales: any;
  loading: boolean;
  handlePageNumber: (url: string) => void;
}

export function ContactSalesTable({ sales, loading, handlePageNumber }: ContactSalesTableProps) {
  const { system } = useConfigStore();
  const { setElement } = useTempStorage();
  const { openModal } = useModalStore();
  const records = sales?.data;

  const content = () => {
    if (loading) return <SkeletonTable rows={5} columns={6} />;
    if (!records || records.length === 0) return <NothingHere text="Sin compras en este período" />;

    return (
      <div className="relative overflow-x-auto rounded-lg border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-3 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha</th>
              <th scope="col" className="px-3 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Documento</th>
              <th scope="col" className="px-3 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cajero</th>
              <th scope="col" className="px-3 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap text-center">Tipo pago</th>
              <th scope="col" className="px-3 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap text-right">Descuento</th>
              <th scope="col" className="px-3 py-3 font-bold tracking-wider whitespace-nowrap text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {records.map((record: any) => (
              <tr key={record.id} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
                <td className="px-3 py-2 whitespace-nowrap">
                  {formatDateAsDMY(record.charged_at)} <span className="text-text-muted text-xs">{formatHourAsHM(record.charged_at)}</span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap font-medium clickeable-table" onClick={() => { setElement('documentSelected', record); openModal('documentDetail'); }}>
                  <span>{record?.invoice_assigned?.name ?? "--"}:</span>
                  <span className="ml-2">{record?.invoice ?? "--"}</span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{record?.casheir?.name ?? "--"}</td>
                <td className="px-3 py-2 whitespace-nowrap text-center">{getPaymentTypeName(record?.payment_type)}</td>
                <td className="px-3 py-2 whitespace-nowrap text-right">{numberToMoney(record?.discount ?? 0, system)}</td>
                <td className="px-3 py-2 whitespace-nowrap text-right font-semibold">{numberToMoney(record?.total ?? 0, system)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text-base">Historial de compras</h3>
          <p className="text-[11px] text-text-muted mt-0.5 font-medium">Haz clic en el documento para ver el detalle</p>
        </div>
        {sales?.total > 0 && <span className="text-xs font-semibold text-text-muted">{sales.total} compra(s)</span>}
      </div>
      {content()}
      <Pagination records={sales} handlePageNumber={handlePageNumber} />
    </div>
  );
}

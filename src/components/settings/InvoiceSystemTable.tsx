'use client';

import { NothingHere } from '@/components/NothingHere';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { formatDateAsDMY } from '@/lib/date-formats';
import { numberToMoney } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import useTempStorage from '@/stores/useTempStorage';

const statusMap: Record<number, { label: string; className: string }> = {
  0: { label: 'Inactivo', className: 'status-info' },
  1: { label: 'Pendiente', className: 'status-danger' },
  2: { label: 'Pagado', className: 'status-success' },
  3: { label: 'Anulado', className: 'status-warning' },
};

interface InvoiceSystemTableProps {
  records: any;
  isLoading?: boolean;
}

export function InvoiceSystemTable({ records, isLoading }: InvoiceSystemTableProps) {
  const { system } = useConfigStore();
  const { openModal } = useModalStore();
  const { setElement } = useTempStorage();

  if (isLoading) return <SkeletonTable rows={6} columns={6} />;
  if (!records?.data || records.data.length === 0) return <NothingHere text="No se encontraron facturas" />;

  const handleShowDetails = (record: any) => {
    setElement('invoicePayDetails', record);
    openModal('invoicePayDetails');
  };

  return (
    <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
          <tr>
            <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Codigo</th>
            <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha Facturación</th>
            <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Expira</th>
            <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Pagada</th>
            <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
            <th scope="col" className="px-4 py-3 font-bold tracking-wider whitespace-nowrap">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bg-subtle/50">
          {records.data.map((record: any) => {
            const status = statusMap[record?.status] || { label: 'N/A', className: '' };
            return (
              <tr key={record.id} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
                <td className="px-4 py-2 uppercase">{record.id?.slice(-4)}</td>
                <td className="px-4 py-2">{formatDateAsDMY(record?.billing_day)}</td>
                <td className="px-4 py-2">{formatDateAsDMY(record?.expires_at)}</td>
                <td className="px-4 py-2">{record?.payed_at ? formatDateAsDMY(record.payed_at) : 'N/A'}</td>
                <td className="px-4 py-2">{numberToMoney(record?.total, system)}</td>
                <td className="px-4 py-2 clickeable-table" onClick={() => handleShowDetails(record)}>
                  <span className={status.className}>{status.label}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

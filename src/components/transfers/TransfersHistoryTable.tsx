'use client';

import { NothingHere } from '@/components/NothingHere';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { statusOfTransfer } from '@/components/transfers/utils';
import { formatDateAsDMY, formatHourAsHM } from '@/lib/date-formats';
import useConfigStore from '@/stores/configStore';
import { FaSpinner } from 'react-icons/fa';
import { IoMdAlert } from 'react-icons/io';
import { MdCheck } from 'react-icons/md';

interface TransfersHistoryTableProps {
  records: any;
  onRowClick: (record: any, tenant: any) => void;
  onGetProductsOnline: (transfer: any) => void;
  sending?: boolean;
  loading?: boolean;
}

export function TransfersHistoryTable({ records, onRowClick, onGetProductsOnline, sending, loading }: TransfersHistoryTableProps) {
  const tenantConf = useConfigStore((s) => s.tenant);
  const tenant = tenantConf?.id;


  if (loading) return <SkeletonTable rows={10} columns={7} />;

  if (!records?.data || records.data.length === 0) return <NothingHere />;

  const getRowClass = (record: any) => {
    if ((record.status === 6 && record.to_tenant_id === tenant) ||
        (record.status === 7 && record.from_tenant_id === tenant)) {
      return 'bg-danger/10 clickeable';
    }
    if (record.status === 8 && record.from_tenant_id === tenant) {
      return 'bg-info/10 clickeable';
    }
    return '';
  };

  const listItems = records.data.map((record: any) => (
    <tr
      key={record.id}
      className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${getRowClass(record)}`}
      onClick={() => onRowClick(record, tenant)}
    >
      <td className="px-3 py-2 whitespace-nowrap">
        {record?.received_at
          ? `${formatDateAsDMY(record.received_at)} ${formatHourAsHM(record.received_at)}`
          : 'N/A'}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">{record?.from?.description}</td>
      <td className="px-3 py-2 whitespace-nowrap">{record?.to?.description}</td>
      <td className="px-3 py-2 whitespace-nowrap">{record?.send}</td>
      <td className="px-3 py-2 whitespace-nowrap">{record?.receive || 'PENDIENTE'}</td>
      <td className="px-3 py-2 whitespace-nowrap">{statusOfTransfer(record?.status)}</td>
      <td className="px-3 py-2 text-center">
        {sending ? (
          <FaSpinner size={18} className="text-primary animate-spin" />
        ) : (record?.status === 3 || record?.status === 5) && record?.is_online === 1 ? (
          <IoMdAlert
            size={22}
            className="clickeable text-warning"
            onClick={(e) => {
              e.stopPropagation();
              onGetProductsOnline(record);
            }}
          />
        ) : (
          <MdCheck size={18} className="text-success" />
        )}
      </td>
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Recibido</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Origen</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Destino</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Envía</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Recibe</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Estado</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider whitespace-nowrap"></th>
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

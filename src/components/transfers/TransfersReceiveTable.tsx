'use client';
import { NothingHere } from '@/components/NothingHere';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { statusOfTransfer } from '@/components/transfers/utils';
import { formatDate, formatDateAsDMY, formatHourAsHM } from '@/lib/date-formats';
import { AiOutlineFundView } from 'react-icons/ai';

interface TransfersReceiveTableProps {
  records: any;
  onShowTransfer: (transfer: any) => void;
  loading?: boolean;
}

export function TransfersReceiveTable({ records, onShowTransfer, loading }: TransfersReceiveTableProps) {
  if (loading) return <SkeletonTable rows={10} columns={9} />;

  if (!records || records.length === 0) return <NothingHere />;

  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-bg-subtle/60 text-text-base border-b-2 border-bg-subtle">
          <tr>
            <th className="py-3 px-4 border-r border-bg-subtle">Enviado</th>
            <th className="py-3 px-4 border-r border-bg-subtle">Origen</th>
            <th className="py-3 px-4 border-r border-bg-subtle">Destino</th>
            <th className="py-3 px-4 border-r border-bg-subtle">Envía</th>
            <th className="py-3 px-4 border-r border-bg-subtle">Recibe</th>
            <th className="py-3 px-4 border-r border-bg-subtle">Productos</th>
            <th className="py-3 px-4 border-r border-bg-subtle">Recibido</th>
            <th className="py-3 px-4 border-r border-bg-subtle">Estado</th>
            <th className="py-3 px-4">OP</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bg-subtle">
          {records.map((record: any) => (
            <tr
              key={record.id}
              className={`hover:bg-bg-subtle ${record.status === 2 ? 'bg-success/10' : ''}`}
            >
              <td className="py-3 px-4 truncate">
                {formatDateAsDMY(record?.created_at)} {formatHourAsHM(record?.created_at)}
              </td>
              <td className="py-3 px-4">{record?.from?.description}</td>
              <td className="py-3 px-4">{record?.to?.description}</td>
              <td className="py-3 px-4">{record?.send}</td>
              <td className="py-3 px-4">{record?.receive || 'N/A'}</td>
              <td className="py-3 px-4 font-extrabold">{record?.products?.length ?? 'N/A'}</td>
              <td className="py-3 px-4 truncate">
                {record?.received_at ? formatDate(record.received_at) : 'N/A'}
              </td>
              <td className="py-3 px-4 truncate clickeable" onClick={() => onShowTransfer(record)}>
                {statusOfTransfer(record?.status)}
              </td>
              <td className="py-3 px-4">
                <AiOutlineFundView
                  size={20}
                  title="Ver detalles"
                  className="text-danger clickeable"
                  onClick={() => onShowTransfer(record)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

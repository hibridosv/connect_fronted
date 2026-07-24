'use client';

import { NothingHere } from '@/components/NothingHere';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { formatDate, formatHourAsHM } from '@/lib/date-formats';
import { numberToMoney } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import useTempStorage from '@/stores/useTempStorage';
import { commissionStatusMap, commissionTypeMap } from './utils';

interface GoldPointsTableProps {
  records: any;
  isLoading?: boolean;
}

export function GoldPointsTable({ records, isLoading }: GoldPointsTableProps) {
  const { system } = useConfigStore();
  const { openModal } = useModalStore();
  const { setElement } = useTempStorage();

  if (isLoading) return <SkeletonTable rows={5} columns={7} />;
  if (!records?.data || records.data.length === 0) return <NothingHere text="No se encontraron datos, seleccione un rango de fechas para crear el reporte" />;

  const handleViewDetail = (record: any) => {
    setElement('goldPointDetail', record);
    openModal('goldPointDetail');
  };

  const listItems = records.data.map((record: any) => {
    const status = commissionStatusMap[record?.status] || { label: '—', className: '' };
    const type = commissionTypeMap[record?.type] || { label: '—', className: '' };
    const goldPoints = record?.commissions
      ? record.type === 1 ? record.commissions : (record.commissions * 0.90) * 0.10
      : 0;

    return (
      <tr key={record.id} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
        <td className="px-3 py-2 whitespace-nowrap truncate">{formatDate(record?.initial_date)} {formatHourAsHM(record?.initial_date)}</td>
        <td className="px-3 py-2 whitespace-nowrap truncate">{formatDate(record?.final_date)} {formatHourAsHM(record?.updated_at)}</td>
        <td className="px-3 py-2"><span className={type.className}>{type.label}</span></td>
        <td className="px-3 py-2 whitespace-nowrap">{record?.referred?.name}</td>
        <td className="px-3 py-2 text-right font-medium">{numberToMoney(record?.commissions ?? 0, system)}</td>
        <td className="px-3 py-2 text-right font-bold">{numberToMoney(goldPoints, system)}</td>
        <td className="px-3 py-2 text-center">
          <span className={`${status.className} clickeable-table`} onClick={() => handleViewDetail(record)}>
            {status.label}
          </span>
        </td>
      </tr>
    );
  });

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha Inicio</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha Fin</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Tipo</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cliente</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total Comisiones</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Puntos de Oro</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider whitespace-nowrap">Estado</th>
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

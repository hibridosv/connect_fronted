'use client';

import { NothingHere } from '@/components/NothingHere';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { formatDate, formatHourAsHM } from '@/lib/date-formats';
import { getTotalOfItem, numberToMoney } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';

interface DeletedOrdersTableProps {
  records: any;
  isLoading?: boolean;
}

export function DeletedOrdersTable({ records, isLoading }: DeletedOrdersTableProps) {
  const { system } = useConfigStore();

  if (isLoading) return <SkeletonTable rows={5} columns={7} />;

  if (!records || records.length === 0) {
    return <NothingHere text="No se encontraron productos eliminados" />;
  }

  const listItems = records.map((record: any) => (
    <tr key={record.id} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary">
        {formatDate(record?.updated_at)} {formatHourAsHM(record?.updated_at)}
      </td>
      <td className="px-3 py-2 text-center whitespace-nowrap font-bold">
        {record?.order?.number ?? 'N/A'}
      </td>
      <td className="px-3 py-2 text-center whitespace-nowrap">
        {record?.quantity}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        {record?.product}
      </td>
      <td className="px-3 py-2 text-center whitespace-nowrap">
        {numberToMoney(record?.total ?? 0, system)}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        {record?.order?.employee?.name ?? 'N/A'}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-danger font-medium">
        {record?.attributes?.deleted_by?.name ?? 'N/A'}
      </td>
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha | Hora</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Orden</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cantidad</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Usuario</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Eliminado por</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
        </table>
        <div className="w-full flex justify-center gap-4 p-4 mx-4 my-4 bg-bg-content rounded-lg shadow-sm border border-bg-subtle text-center">
          <div>
            <p className="text-sm text-text-muted">Total productos: </p>
            <p className="text-lg font-semibold text-text-base">{getTotalOfItem(records, "quantity")}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Total eliminado: </p>
            <p className="text-lg font-semibold text-text-base">{numberToMoney(getTotalOfItem(records, "total"), system)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

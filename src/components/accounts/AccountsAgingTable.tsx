'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { CreditAging } from "@/interfaces/credits";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";

export interface AccountsAgingTableI {
  aging: CreditAging | null;
  isLoading?: boolean;
}

const columns = [
  { key: 'current', label: 'Al día' },
  { key: 'days_1_30', label: '1 - 30 días' },
  { key: 'days_31_60', label: '31 - 60 días' },
  { key: 'days_61_90', label: '61 - 90 días' },
  { key: 'days_over_90', label: 'Más de 90 días' },
  { key: 'total', label: 'Total' },
] as const;

export function AccountsAgingTable({ aging, isLoading }: AccountsAgingTableI) {
  const { system } = useConfigStore();

  if (isLoading) return <SkeletonTable rows={5} columns={7} />;

  if (!aging || aging.clients.length === 0) return <NothingHere />;

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cliente</th>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap text-right">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {aging.clients.map((row) => (
              <tr key={row.client_id ?? row.client} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
                <td className="px-3 py-2 whitespace-nowrap font-medium text-primary">{row.client}</td>
                {columns.map((column) => (
                  <td key={column.key} className={`px-3 py-2 text-right whitespace-nowrap ${column.key === 'total' ? 'font-semibold' : ''} ${column.key !== 'current' && column.key !== 'total' && row[column.key] > 0 ? 'text-danger' : ''}`}>
                    {numberToMoney(row[column.key], system)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="divide-x divide-bg-subtle bg-bg-subtle/60 font-bold text-text-base">
              <td className="px-3 py-2 whitespace-nowrap">Total</td>
              {columns.map((column) => (
                <td key={column.key} className="px-3 py-2 text-right whitespace-nowrap">{numberToMoney(aging.totals[column.key], system)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

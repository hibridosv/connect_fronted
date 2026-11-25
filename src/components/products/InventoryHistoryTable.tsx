'use client';

import { NothingHere } from "@/components/NothingHere";
import { SearchInput } from "@/components/Search";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { InventoryHistoryRecord } from "@/interfaces/inventoryHistory";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { useMemo, useState } from "react";


export interface InventoryHistoryTableI {
  records: InventoryHistoryRecord[] | null;
  isLoading?: boolean;
}

export function InventoryHistoryTable(props: InventoryHistoryTableI) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!records) return [];
    if (!term) return records;
    return records.filter((record) =>
      `${record.cod ?? ''} ${record.description ?? ''}`.toLowerCase().includes(term));
  }, [records, search]);

  // los totales se redondean a 2 decimales para no mostrar residuos de la suma de decimales
  const totals = useMemo(() => {
    const sum = filtered.reduce((acc, record) => ({
      quantity: acc.quantity + Number(record.qty_balance ?? 0),
      total: acc.total + Number(record.total_balance ?? 0),
    }), { quantity: 0, total: 0 });
    return {
      quantity: Math.round(sum.quantity * 100) / 100,
      total: Math.round(sum.total * 100) / 100,
    };
  }, [filtered]);

  if (isLoading) return <SkeletonTable rows={5} columns={5} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }

  const listItems = filtered.map((record) => (
    <tr key={record.id} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
      <td className="px-3 py-2 whitespace-nowrap font-semibold">{record.cod}</td>
      <td className="px-3 py-2 text-left whitespace-nowrap">{record.description}</td>
      <td className="px-3 py-2 text-center whitespace-nowrap">{numberToMoney(record.unit_cost, system)}</td>
      <td className="px-3 py-2 text-center whitespace-nowrap">{record.qty_balance}</td>
      <td className="px-3 py-2 text-center whitespace-nowrap">{numberToMoney(record.total_balance, system)}</td>
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="mb-3">
        <SearchInput handleSearchTerm={setSearch} placeholder="Buscar por código o producto" />
      </div>
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Código</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Costo U</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cantidad</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
          <tfoot className="bg-bg-subtle/60 font-bold text-text-base">
            <tr>
              <td className="px-3 py-2" colSpan={3}>{filtered.length} productos</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{totals.quantity}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{numberToMoney(totals.total, system)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

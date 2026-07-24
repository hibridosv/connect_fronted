'use client';

import { Indicator } from "@/components/Indicators";
import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";


export interface ShowProductsExpiredTableProps {
  records: any;
  isLoading?: boolean;
}

export function ShowProductsExpiredTable(props: ShowProductsExpiredTableProps) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();
  const { openModal } = useModalStore();
  const { setElement } = useTempStorage();


  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }

    const status = (expiration: string) => {
    if (new Date(expiration) <= new Date()) {
        return <Indicator type="danger" text="Expirado" />
    }
    return <Indicator type="success" text="Por Expirar" />
  }

  const listItems = records.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline">
        { record.product.cod }
      </td>
      <td className="px-3 py-2 whitespace-nowrap clickeable-table" onClick={() => { setElement('productDetails', record.product); openModal('productDetails')  }}>
        { record.product.description }
      </td>
      <td className="px-3 py-2 text-right whitespace-nowrap font-medium" >
        { record.lot ? record.lot : "N/A" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { record?.provider?.name }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { record.actual_stock }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { numberToMoney(record.unit_cost ? record.unit_cost : 0, system) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { formatDateAsDMY(record.expiration) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
        { status(record.expiration) }
      </td>
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Cod</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Producto</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Lote</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Proveedor</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Cantidad</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider text-right border-r border-bg-subtle last:border-r-0">Costo</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Expiración</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Estado</th>
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

'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDateAsDMY } from "@/lib/date-formats";
import { getTotalOfItem, numberToMoney, percentage } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";


export interface ReportSalesTableI {
  records: any;
  isLoading?: boolean;
}

export function ReportSalesTable(props: ReportSalesTableI) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();

  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }

  let totalSale = 0;
  let totalCost = 0;


  const listItems = records.map((record: any) => {
    const priceWithoutBill = record?.subtotal / record?.quantity;
    const totalUnitPrice = priceWithoutBill * record?.quantity;
    const totalUnitCost = record?.unit_cost * record?.quantity;

    totalSale += totalUnitPrice;
    totalCost += totalUnitCost;

    return (
      <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
      <td className="px-3 py-2 whitespace-nowrap">
        {formatDateAsDMY(record?.created_at)}
      </td>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline">
        {record?.product}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        {record?.cod}
      </td>
      <td className="px-3 py-2 text-right whitespace-nowrap font-medium" >
        {record?.quantity}
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        {numberToMoney(record?.unit_cost || 0, system)}
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        {numberToMoney(totalUnitCost, system)}
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`} title={numberToMoney(priceWithoutBill, system)}>
        {numberToMoney(record?.unit_price || 0, system)}
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`} title={numberToMoney(totalUnitPrice, system)}>
        {numberToMoney(record?.unit_price ? record?.unit_price * record?.quantity : 0, system)}
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        {record?.discount_percentage || 0} %
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
       {numberToMoney(record?.discount || 0, system)}
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
       {numberToMoney(record?.total || 0, system)}
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap `}>
       {numberToMoney(totalUnitPrice - totalUnitCost, system)}
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap `}>
       {percentage(totalUnitCost, totalUnitPrice).toFixed(2)} %
      </td>
    </tr>
    )
  });

  const totalMargin = totalSale - totalCost;
  const marginPercentage = totalSale > 0 ? percentage(totalCost, totalSale).toFixed(2) : '0.00';

  return (
    <div className="m-4 flex flex-col gap-3">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Codigo</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cantidad</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Costo U</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Costo T</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap" title="Precio Unitario con Impuestos">Precio U</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap" title="Total Precio Unitario con Impuestos">Precio T</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Descuento %</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Monto</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap" title="Total Venta con Impuestos">Total</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap" title="Margen Bruto">Margen $</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider text-right border-r border-bg-subtle whitespace-nowrap" title="Porcentaje de Margen Bruto">Margen %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
        </table>
      </div>
      <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle divide-x divide-bg-subtle flex flex-wrap">
        <div className="flex-1 flex flex-col items-center py-3 px-4">
          <span className="text-xs uppercase font-medium text-text-muted tracking-wider">Subtotal</span>
          <span className="text-xl font-bold text-text-base mt-0.5">{numberToMoney(getTotalOfItem(records, "subtotal"), system)}</span>
        </div>
        <div className="flex-1 flex flex-col items-center py-3 px-4">
          <span className="text-xs uppercase font-medium text-text-muted tracking-wider">Impuestos</span>
          <span className="text-xl font-bold text-info mt-0.5">{numberToMoney(getTotalOfItem(records, "taxes"), system)}</span>
        </div>
        <div className="flex-1 flex flex-col items-center py-3 px-4">
          <span className="text-xs uppercase font-medium text-text-muted tracking-wider">Total ventas</span>
          <span className="text-xl font-bold text-success mt-0.5">{numberToMoney(getTotalOfItem(records, "total"), system)}</span>
        </div>
        <div className="flex-1 flex flex-col items-center py-3 px-4">
          <span className="text-xs uppercase font-medium text-text-muted tracking-wider">Margen bruto</span>
          <span className="text-xl font-bold text-success mt-0.5">{numberToMoney(totalMargin, system)}</span>
        </div>
        <div className="flex-1 flex flex-col items-center py-3 px-4">
          <span className="text-xs uppercase font-medium text-text-muted tracking-wider">Margen %</span>
          <span className="text-xl font-bold text-success mt-0.5">{marginPercentage} %</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { NothingHere } from "@/components/NothingHere";
import { Product } from "@/interfaces/products";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { numberToMoney4Digits } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";


export interface ShowKardexTableProps {
  product: Product;
  kardex: any;
}

export function ShowKardexTable(props: ShowKardexTableProps) {
  const { product, kardex } = props;
  const { system } = useConfigStore();
  const { openModal } = useModalStore();
  const { setElement } = useTempStorage();


  if (!product) {
    return <NothingHere />;
  }

  const listItems = kardex && kardex.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary">{ formatDateAsDMY(record.created_at) } { formatHourAsHM(record.created_at) }</td>
      <td className="px-3 py-2 text-left whitespace-nowrap font-medium hover:underline clickeable-table" onClick={() => { setElement("kardexDetails", record); openModal('kardexDetails'); }}>{ record.description }</td>
      <td className="px-3 py-2 text-center whitespace-nowrap text-text-muted">{ record.unit_cost }</td>
      <td className={`px-3 py-2 text-center whitespace-nowrap  ${record.qty_in ? 'text-text-muted' : 'text-success font-semibold'}`}>{ record.qty_in ? record.qty_in : 0 }</td>
      <td className={`px-3 py-2 text-center whitespace-nowrap  ${record.total_in ? 'text-text-muted' : 'text-success font-semibold'}`}>{ numberToMoney4Digits(record.total_in ? record.total_in : 0, system) }</td>
      <td className={`px-3 py-2 text-center whitespace-nowrap ${record.qty_out ? 'text-text-muted' : 'text-danger font-semibold'}`}>{ record.qty_out ? record.qty_out : 0 }</td>
      <td className={`px-3 py-2 text-center whitespace-nowrap ${record.total_out ? 'text-text-muted' : 'text-danger font-semibold'}`}>{ numberToMoney4Digits(record.total_out ? record.total_out : 0, system) }</td>
      <td className="px-3 py-2 text-center whitespace-nowrap text-text-muted">{ record.qty_balance ? record.qty_balance : 0 }</td>
      <td className="px-3 py-2 text-center whitespace-nowrap text-text-muted">{ numberToMoney4Digits(record.total_balance ? record.total_balance : 0, system) }</td>
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle px-4 mb-2">
        <h3 className="text-2xl font-bold text-text-base mb-1">{product?.description ?? '--'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-text-base text-sm">
          <p><span className="font-semibold text-text-muted">Código:</span> {product?.cod ?? '--'}</p>
          <p><span className="font-semibold text-text-muted">Categoría:</span> {product?.category?.name ?? '--'}</p>
          <p><span className="font-semibold text-text-muted">Stock Actual:</span> {product?.quantity} {product?.quantity_unit?.abbreviation ?? 'Unidad'}</p>
        </div>
        <p className="text-sm text-text-muted mt-2">Método de Cálculo: <span className="font-semibold">COSTO PROMEDIO PONDERADO</span></p>
      </div>
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        { kardex && kardex.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-base uppercase bg-bg-subtle font-bold">
                <tr>
                <th scope="col" colSpan={3} className="py-3 px-4 border text-center text-text-base">Código: {product?.cod}</th>
                <th scope="col" colSpan={2} className="py-3 px-4 border text-center text-text-base">Entradas</th>
                <th scope="col" colSpan={2} className="py-3 px-4 border text-center text-text-base">Salidas</th>
                <th scope="col" colSpan={2} className="py-3 px-4 border text-center text-text-base">Saldo</th>
                </tr>
            </thead>
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Fecha</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Detalle</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider text-right border-r border-bg-subtle last:border-r-0">Costo</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Cantidad</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Total</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Cantidad</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Total</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Cantidad</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
        </table>  
        ) : (
          <NothingHere text="Sin registros, seleccione una fecha" />
        )
        }
      </div>
    </div>
  );
}

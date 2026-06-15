'use client';

import { NothingHere } from "@/components/NothingHere";
import { useOrderFnLogic } from "@/hooks/order/product/useOrderFnLogic";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { groupInvoiceProductsByCodSpecial } from "../utils";


export interface OrderSpecialSalesTableI {
  records: any;
  isLoading?: boolean;
}

export function OrderSpecialSalesTable(props: OrderSpecialSalesTableI) {
  const { records, isLoading } = props;
  const { del } = useOrderFnLogic();
  let special = records && records?.invoiceproducts && groupInvoiceProductsByCodSpecial(records);

  if (!special || special.length === 0) {
    return <NothingHere width="150" height="150" text="Agregue un producto"/>;
  }
  const listItems = special && special.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${record?.status == 2 && '!bg-red-200'}`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary">
        { record.quantity }
      </td>
      <td className="px-3 py-2 whitespace-nowrap font-semibold">
        { record?.product }
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap flex justify-center items-center" >
       <AiFillCloseCircle size={20} title="Editar" className="text-red-600 clickeable" onClick={()=> { del(record.id) }} />
      </td>
    </tr>
  ));

  return (
    <div className="mx-4">
      <div className={`relative overflow-hidden bg-bg-content rounded-lg shadow-sm border transition-all duration-500 ${isLoading ? 'border-primary/25 shadow-lg shadow-primary/10' : 'border-bg-subtle'}`}>
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-bg-subtle overflow-hidden z-10">
            <div className="h-full w-1/2 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full animate-shimmer" />
          </div>
        )}
        <div className={`overflow-x-auto transition-opacity duration-500 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
              <tr>
                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cant</th>
                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap flex justify-center items-center">
                  <MdDelete size={22} title="Eliminar" className="text-text-muted" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-subtle/50">
              {listItems}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { Button, Preset } from "@/components/button/button";
import { NothingHere } from "@/components/NothingHere";
import { formatDateAsDMY } from "@/lib/date-formats";
import productRemovedStore from "@/stores/products/productRemovedStore";
import { FaSpinner } from "react-icons/fa";


export function ProductsRegistersTable() {
    const { loading, product, deleting, deleteProduct } = productRemovedStore();

    if (loading) return null;
    if (!product) return null;
    if (product?.failures && product.failures.length === 0) return (<NothingHere text="Ingrese los productos a descontar" />)

      const listItems = product?.failures && product?.failures.map((record: any) => (
        <tr 
         title={ record?.status === 2 ? `Eliminado por ${record?.deleted_by?.name}` : ``}
          key={record.id} 
          className={`whitespace-nowrap transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle ${record.status === 2 ? 'bg-danger/10 text-danger' : 'text-text-base'}`}>
          <td className="px-3 py-2 font-medium text-primary hover:underline">
            { record?.product?.description }
          </td>
          <td className="px-3 py-2 text-center" >
             { record.quantity }
          </td>
          <td className="px-3 py-2 text-center font-medium">
            { record.reason }
          </td>
          <td className={`px-3 py-2 text-left`}>
            { record?.employee?.name }
          </td>
          <td className="px-3 py-2 text-center">
            {
            deleting ? <FaSpinner className="animate-spin" size={20} color="red" /> :
            (formatDateAsDMY(record?.created_at) == formatDateAsDMY(new Date().toISOString()) && record?.status === 1) ? 
            <Button preset={Preset.smallClose} style="clickeable" noText onClick={()=> deleteProduct(`removes/product/${record.id}`)} disabled={deleting} /> :
            <Button preset={Preset.smallCloseDisable} noText disabled />
            }
           </td>
        </tr>
      ));


  return (
    <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
            <tr className="border-b-2 border-bg-subtle">
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Producto</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Cant</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Razón</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Usuario</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider text-center">Del</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle">
            {listItems}
          </tbody>
        </table>
      </div>
  );
}
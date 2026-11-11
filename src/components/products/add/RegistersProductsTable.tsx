import { Spinner } from "@/components/Spinner";
import { Button, Preset } from "@/components/button/button";
import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import productAddStore from "@/stores/products/productAddStore";


export function RegistersProductsTable() {
    const { loading, product, deleting, deleteProduct } = productAddStore();
    const { system } = useConfigStore();


    if (product && loading) return <SkeletonTable rows={4} columns={7} />;
    if (!product) return null;
    if (product?.registers && product.registers.length === 0) return (<NothingHere text="Ingrese los productos a descontar" />)

    let total = 0;
    const listItems = product?.registers && product?.registers.map((record: any) => {
        const subtotal = (record.unit_cost ? record.unit_cost : 0) * record?.quantity;
            total += subtotal;
        return (
            <tr 
            title={ record?.status === 2 ? `Eliminado por ${record?.deleted_by?.name}` : ``}
            key={record.id} 
            className={`whitespace-nowrap transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle ${record.status === 2 ? 'bg-danger/10 text-danger' : 'text-text-base'}`}>
            <td className="px-3 py-2 font-medium text-primary hover:underline" title={`Codigo: ${record?.product?.cod }`}>
                { record?.product?.description }
            </td>
            <td className="px-3 py-2 text-center" >
                { record.quantity }
            </td>
            <td className="px-3 py-2 text-center font-medium">
                {  numberToMoney(record.unit_cost ? record.unit_cost : 0, system)  }
            </td>
            <td className={`px-3 py-2 text-left`}>
                { numberToMoney((record.unit_cost ? record.unit_cost : 0) * record?.quantity, system) }
            </td>
            <td className={`px-3 py-2 text-left`}>
                { record?.lot }
            </td>
            <td className={`px-3 py-2 text-left`}>
                { formatDateAsDMY(record.created_at) }
            </td>
            <td className="px-3 py-2 text-center">
              { deleting ? <Spinner size={20} /> :
                <Button preset={Preset.smallClose} style="clickeable" noText onClick={()=> deleteProduct(`registers/${record.id}`)} disabled={deleting} />
              }
            </td>
            </tr>
        )
      });


  return (
    <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
            <tr className="border-b-2 border-bg-subtle">
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Producto</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Cant</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Precio Costo</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Total Costo</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Lote</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Fecha</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider text-center">Del</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle">
            {listItems}
          </tbody>
        </table>
        <div className="font-bold uppercase text-right ml-4 text-text-muted p-4">Total ingresado: {numberToMoney(total, system)}</div>
      </div>
  );
}
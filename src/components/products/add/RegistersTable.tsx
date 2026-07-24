
import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDate, formatHourAsHM } from "@/lib/date-formats";
import { documentType } from "@/lib/utils";
import useModalStore from "@/stores/modalStorage";
import productAddStore from "@/stores/products/productAddStore";
import useTempStorage from "@/stores/useTempStorage";


export function RegistersTable() {
    const { loading, product, products } = productAddStore();
    const { openModal } = useModalStore();
    const { setElement } = useTempStorage();

    if (loading) return <SkeletonTable rows={4} columns={5} />;
    if (product) return null;
    if (products && products.data === 0) return (<NothingHere text="No se encuentran registros" />)
    
    const listItems = products?.data && products?.data.map((record: any) => {

        return (
            <tr 
            title={ record?.status === 2 ? `Eliminado por ${record?.deleted_by?.name}` : ``}
            key={record.id} 
            onClick={() => { openModal("viewDetails"); setElement("viewDetails", record);  }}
            className={`clickeable-table whitespace-nowrap transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle ${record.status === 2 ? 'bg-danger/10 text-danger' : 'text-text-base'}`}>
            <td className="px-3 py-2 font-medium text-primary hover:underline">
                <div className="flex justify-between">
                    <span>{ documentType(record.document_type) }</span>  <span className="text-right">{ record.document_number ?? "--"}</span>
                </div>
            </td>
            <td className="px-3 py-2 text-center" >
                { record?.registers?.length ?? "--"}
            </td>
            <td className="px-3 py-2 text-center font-medium">
                { record?.provider?.name ?? "--"}
            </td>
            <td className={`px-3 py-2 text-left`}>
                { record?.employee?.name ?? "--"}
            </td>
            <td className={`px-3 py-2 text-left`}>
                { formatDate(record.created_at)} { formatHourAsHM(record.created_at) }
            </td>
            </tr>
        )
      });


  return (
    <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
            <tr className="border-b-2 border-bg-subtle">
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Documento</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Productos</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Proveedor</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Registro</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle">
            {listItems}
          </tbody>
        </table>
      </div>
  );
}
'use client';
import { useProductLinkedDetailsLogic } from "@/hooks/products/useProductLinkedDetailsLogic";
import { Product } from "@/interfaces/products";
import useModalStore from "@/stores/modalStorage";
import { Button, Preset } from "../button/button";
import { NothingHere } from "../NothingHere";
import SkeletonTable from "../skeleton/skeleton-table";
import { ProductsLinkedModal } from "./new/ProductsLinkedModal";
import { productTypeIcon } from "./utils";

export interface ProductLinkedProps {
  isShow: boolean;
  record: Product; 
  isEditable?: boolean;
}

export function ProductLinked(props: ProductLinkedProps) {
    const {  isShow, record, isEditable = false } = props;
    const { modals, closeModal, openModal } = useModalStore();
    const { productsLinked, loading } = useProductLinkedDetailsLogic(record, isShow);;
        

    if (!isShow) { return null; }
    if (!record) { return <NothingHere />; }

    const listItems = productsLinked && productsLinked.map((product: any) => (
          <tr key={product.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle ${product.status === 0 ? 'bg-danger/10 text-danger' : 'text-text-base'}`}>
          <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline">
              {product?.composed?.cod}
          </td>
          <td className="px-3 py-2 whitespace-nowrap">
              <div className="flex items-center">
              {productTypeIcon(product?.composed?.product_type)}
              <span>{product?.composed?.description}</span>
              </div>
          </td>
          <td className={`px-3 py-2 text-center whitespace-nowrap font-bold ${product.quantity <= product.minimum_stock ? 'text-danger' : ''}`}>
              {product.quantity}
          </td>
          </tr>
      ));

  return (

        <div className="text-text-base"> 
          { record.product_type == 2 && (
          <div className="p-3 text-center bg-blue-500/10 text-blue-500 rounded-lg">
            Este producto es un servicio, por lo que no tiene detalles adicionales.
          </div>
          )}
          { record.product_type == 3 && (  
          <div className="p-4 bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-base">Productos Vinculados</h3>
                {isEditable && <Button preset={Preset.smallEdit} onClick={()=>openModal('productLinked')} /> }
            </div>
            {productsLinked && productsLinked.length > 0 ? loading ? (
                <SkeletonTable columns={3} rows={3} />
            ) : (
                <div className="relative overflow-x-auto border border-bg-subtle rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Cod</th>
                                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Producto</th>
                                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0">Cant</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-bg-subtle/50">
                            {listItems}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-3 text-center bg-blue-500/10 text-blue-500 rounded-lg">
                    <p>No hay productos vinculados a este item.</p>
                </div>
            )}
          </div>
          )}
            <ProductsLinkedModal isShow={modals.productLinked} onClose={() => {closeModal('productLinked') }} product={record} />
        </div>

  );
}
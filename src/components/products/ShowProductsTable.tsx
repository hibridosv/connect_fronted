'use client';

import { Dropdown } from "@/components/dropDown/Dropdown";
import { DropdownDivider } from "@/components/dropDown/DropdownDivider";
import { DropdownItem } from "@/components/dropDown/DropdownItem";
import { NothingHere } from "@/components/NothingHere";
import { useGetRequest } from "@/hooks/request/useGetRequest";
import { Product } from "@/interfaces/products";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useProductStore from "@/stores/products/productStore";
import useTempStorage from "@/stores/useTempStorage";
import { BiLoader } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { DeleteModal } from "../DeleteModal";
import SkeletonTable from "../skeleton/skeleton-table";
import { productTypeIcon, sortBySelected } from './utils';

export interface ShowProductsTableProps {
  records: Product[];
  setSortBy: (sortBy: string) => void;
  sortBy: string;
  loading?: boolean;
}

export function ShowProductsTable(props: ShowProductsTableProps) {
  const { records, setSortBy, sortBy, loading } = props;
  const { system, activeConfig } = useConfigStore();
  const { openModal, closeModal, modals } = useModalStore();
  const isLocation = activeConfig?.includes("product-brand");
  const isBrand = activeConfig?.includes("product-locations");
  const { deleteProduct, deleting } = useProductStore();
  const { getRequest, loading: loadingRequest } = useGetRequest();
  const { setElement, getElement } = useTempStorage();
  const elementSelected = getElement('productDetails');



  if(loading) return <SkeletonTable rows={15} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere />;
  }

  const listItems = records.map((product: Product) => (
    <tr 
      key={product.id} 
      className={`whitespace-nowrap transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle ${product.status === 0 ? 'bg-danger/10 text-danger' : 'text-text-base'}`}>
      <td className="px-2 py-2 clickeable-table font-medium text-primary hover:underline" onClick={() => { setElement('productDetails', product); openModal('productDetails')  }}>
        {product.cod}
      </td>
      <td className="px-2 py-2 clickeable-table" onClick={() => { setElement('productDetails', product); openModal('productDetails')  }}>
        <div className="flex items-center space-x-2">
          {productTypeIcon(product.product_type)}
          <span>{product.description}</span>
        </div>
      </td>
      <td className="px-2 py-2 text-right font-medium" onClick={() => { setElement('productDetails', product); openModal('productDetails')  }}>
        {product.prices[0] ? numberToMoney(product.prices[0].price, system) : numberToMoney(0, system)}
      </td>
      <td className={`px-2 py-2 text-center font-bold ${product.quantity <= product.minimum_stock ? 'text-danger' : ''}`}>
        {product.quantity}
      </td>
      <td className="px-2 py-2 text-center">{product?.category?.name ?? "--"}</td>
      { isLocation && 
      <td className="px-2 py-2 text-center">{product?.location?.name ?? "--"}</td> }
      { isBrand && 
      <td className="px-2 py-2 text-center">{product?.brand?.name ?? "--"}</td> }
      <td className="px-2 py-2 text-center text-text-muted">{product.minimum_stock}</td>
      <td className="px-2 py-2 text-center">
        { deleting || loadingRequest ? <BiLoader className="animate-spin" /> : <Dropdown label={<FiSettings size={18} /> }>
          <DropdownItem onClick={() => { setElement('productDetails', product); openModal('productDetails'); }}>Ver Producto</DropdownItem>
          <DropdownItem onClick={() => { getRequest(`transactions/products/prices/${product.cod}`); }}>Actualizar Precios</DropdownItem>
          <DropdownItem as={`/products/${product.id}/edit`}>Editar</DropdownItem>
          <DropdownItem as={`/products/${product.id}/kardex`}>Kardex</DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={() => { setElement('productDetails', product); openModal('deleteProduct'); }}> <span className="text-danger font-semibold">Eliminar</span> </DropdownItem>
        </Dropdown> }
      </td>
    </tr>
  ));

  return (
    <div>
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
            <tr className="border-b-2 border-bg-subtle">
              <th scope="col" className="px-4 py-3 font-bold tracking-wider clickeable-table border-r border-bg-subtle" onClick={() => setSortBy(sortBySelected("cod", sortBy))}>Cod</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider clickeable-table border-r border-bg-subtle" onClick={() => setSortBy(sortBySelected("description", sortBy))}>Producto</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider text-right border-r border-bg-subtle">Precio</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider clickeable-table border-r border-bg-subtle" onClick={() => setSortBy(sortBySelected("quantity", sortBy))}>Cant</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider clickeable-table border-r border-bg-subtle" onClick={() => setSortBy(sortBySelected("category_id", sortBy))}>Categoria</th>
              { isLocation && 
              <th scope="col" className="px-4 py-3 font-bold tracking-wider clickeable-table border-r border-bg-subtle" onClick={() => setSortBy(sortBySelected("location_id", sortBy))}>Ubicación</th> }
              { isBrand && 
              <th scope="col" className="px-4 py-3 font-bold tracking-wider clickeable-table border-r border-bg-subtle" onClick={() => setSortBy(sortBySelected("brand_id", sortBy))}>Marca</th> }
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle">Min</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider text-center">OP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle">
            {listItems}
          </tbody>
        </table>
      </div>
      <DeleteModal
        isShow={elementSelected?.id && modals.deleteProduct}
        text={`¿Estas seguro de eliminar el producto ${elementSelected?.description}?`}
        onDelete={() =>{ deleteProduct(`products/${elementSelected?.id}`, elementSelected?.id); closeModal('deleteProduct'); }}
        onClose={() => closeModal('deleteProduct')} />
    </div>
)}

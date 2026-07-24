'use client';

import { NothingHere } from "@/components/NothingHere";
import { Product } from "@/interfaces/products";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { useRouter } from 'next/navigation';
import { productTypeIcon } from './utils';


export interface ShowProductsTableLinkProps {
  records: Product[];
  link?: string | null;
}

export function ShowProductsTableLink(props: ShowProductsTableLinkProps) {
  const { records, link } = props;
  const { system } = useConfigStore();
  const router = useRouter();



  if (!records || records.length === 0) {
    return <NothingHere />;
  }

  const listItems = records.map((product: Product) => (
    <tr key={product.id} onClick={link ? () => router.push(`/products/${product.id}/${link}`) : ()=>{}}
      className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle ${product.status === 0 ? 'bg-danger/10 text-danger' : 'text-text-base'} ${ link && 'clickeable-table'}`}>
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary hover:underline">
        {product.cod}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="flex items-center">
          {productTypeIcon(product.product_type)}
          <span>{product.description}</span>
        </div>
      </td>
      <td className="px-3 py-2 text-right whitespace-nowrap font-medium" >
        {product.prices[0] ? numberToMoney(product.prices[0].price, system) : numberToMoney(0, system)}
      </td>
      <td className="px-3 py-2 text-center whitespace-nowrap">{product?.category?.name ?? "--"}</td>
      <td className="px-3 py-2 text-center whitespace-nowrap text-text-muted">{product.minimum_stock}</td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold ${product.quantity <= product.minimum_stock ? 'text-danger' : ''}`}>
        {product.quantity}
      </td>
    </tr>
  ));

  return (
    <div>
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider clickeable-table border-r border-bg-subtle whitespace-nowrap">Cod</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider clickeable-table border-r border-bg-subtle whitespace-nowrap">Producto</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider text-right border-r border-bg-subtle whitespace-nowrap">Precio</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider clickeable-table border-r border-bg-subtle whitespace-nowrap">Categoria</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Min</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider clickeable-table border-r border-bg-subtle whitespace-nowrap">Cant</th>
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

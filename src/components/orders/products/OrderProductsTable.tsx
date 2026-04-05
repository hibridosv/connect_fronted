'use client';

import { Button, Preset } from "@/components/button/button";
import { NothingHere } from "@/components/NothingHere";
import { useOrderFnLogic } from "@/hooks/order/product/useOrderFnLogic";
import { Order } from "@/interfaces/order";
import { getTotalPercentage, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import ordersStore from "@/stores/orders/ordersStore";
import useTempStorage from "@/stores/useTempStorage";
import { FaPen } from "react-icons/fa";
import { MdBallot } from "react-icons/md";
import { useRef } from "react";
import { commissionTotal, sumarDiscount, sumarTotales } from "../utils";


export interface OrderProductsTableI {
  order: Order;
}

export function OrderProductsTable(props: OrderProductsTableI) {
  const { order } = props;
  const { system, activeConfig } = useConfigStore();
  const { addNew, del} = useOrderFnLogic();
  const { setElement } = useTempStorage();
  const { openModal} = useModalStore();
  const { sending } = ordersStore();
  const rowQueuesRef = useRef<Map<string, { queue: number[]; processing: boolean }>>(new Map());

  let data = order?.invoiceproducts ?? [];
  
  const isShowCode = activeConfig && activeConfig.includes("sales-show-code");
  const isDefaultCommission = activeConfig && activeConfig.includes("product-default-commission");
  const isChangeName = activeConfig && activeConfig.includes("sales-change-name");
  const isChangeComment = activeConfig && activeConfig.includes("sales-change-comment");
  const isChangeLot = activeConfig && activeConfig.includes("sales-change-lot");


  if (!data || data.length === 0) {
    return <NothingHere width="150" height="150" text="Agregue un producto" />;
  }
  
  const handleProductSend = async (product: any, type: number) => {
    const key = String(product.id);
    if (!rowQueuesRef.current.has(key)) {
      rowQueuesRef.current.set(key, { queue: [], processing: false });
    }
    const entry = rowQueuesRef.current.get(key)!;
    entry.queue.push(type);
    if (entry.processing) return;
    entry.processing = true;
    while (entry.queue.length > 0) {
      const nextType = entry.queue.shift()!;
      await addNew({ ...product, addOrSubtract: nextType });
    }
    entry.processing = false;
  };
  
  
    const listItems = data.map((record: any, index: number) => {
    const isOtherSales = record.cod == 9999999999;
    const isDisabled = isOtherSales || record.lot_id;

    return (
        <tr key={record.id}
            className={`${sending ? 'opacity-50' : 'opacity-100'} transition-all duration-500 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
          <td className={`px-2 py-1 whitespace-nowrap font-medium text-center ${!isDisabled && 'clickeable'} ${record?.actual_stock <= 0 ? 'text-red-600' : 'text-black'}`} 
            onClick={isOtherSales ? ()=>{} : ()=>{ setElement('productSelected', record); openModal('changeQuantity') }}>
            { record.quantity }
          </td>
          <td className={`px-2 py-1 whitespace-nowrap font-medium ${ !isShowCode && 'hidden'}`}>
          { record.cod }
          </td>
          <td className="px-2 py-1 text-left whitespace-nowrap flex" >
            {/* { record.product.slice(0, 50) } */}
            <span className={`${!isOtherSales && 'clickeable ' } w-full`} 
            onClick={ isOtherSales ? ()=>{} : ()=> { openModal('productDetailsList'); setElement('productDetailsOnNavbar', record.cod); }}>
            { record.product.slice(0, 50) } { record.operation_type == 2 && <span title="Exento" className="text-red-600">(E)</span> }
            </span>
            { isChangeName && <span title="Cambiar Nombre del producto" className="ml-2 clickeable" 
            onClick={()=> { setElement('rowToUpdate', 'product'); openModal('changeRow'); setElement('productSelected', record); }}><FaPen color="black" /></span> }
            { isChangeComment && <span title={record?.comment ?? "Sin comentarios"} className="ml-2 clickeable" 
            onClick={()=> { setElement('rowToUpdate', 'comment'); openModal('changeRow'); setElement('productSelected', record); }}><FaPen color={record.comment ? 'green' : 'black'} /></span> }
            { isChangeLot && <span title="Cambiar lote predeterminado" className="ml-2 clickeable" 
            onClick={()=> { openModal('changeLot'); setElement('productSelected', record); }}><MdBallot color={record.lot_id ? 'red' : 'gray'} /></span> }
          </td>
          <td className={`px-2 py-1 text-center whitespace-nowrap font-bold tabular-nums`}>
            <span className="clickeable" onClick={()=>{ openModal('changePriceProduct'); setElement('productSelected', record); }}>
              { numberToMoney(record.unit_price ?? 0, system) }
            </span>
          </td>
          <td className={`px-2 py-1 text-center whitespace-nowrap font-bold tabular-nums`}>
            <span className="clickeable" onClick={()=> { openModal('discountModal'); setElement('productSelected', record); setElement('discountType', 1) }}>
              { numberToMoney(record.discount ?? 0, system) }
            </span>
          </td>
          <td className={`px-2 py-1 whitespace-nowrap font-medium tabular-nums ${ !isDefaultCommission && 'hidden'}`}>
            <span className="clickeable" onClick={()=>{ setElement('rowToUpdate', 'commission'); openModal('changeRow'); setElement('productSelected', record); }}>
              { record.commission ?? 0 } % -  { numberToMoney(getTotalPercentage(record?.subtotal, record?.commission), system) }
            </span>
          </td>
          <td className={`px-2 py-1 text-center whitespace-nowrap tabular-nums`}>
            { numberToMoney(record.total ?? 0, system) }
          </td>
          <td className={`px-2 py-1 flex justify-center`}>
            <Button disabled={isDisabled} preset={isDisabled ? Preset.smallMinusDisable : Preset.smallMinus} noText onClick={()=> { handleProductSend(record, 2)}} />
            <Button disabled={isDisabled} preset={isDisabled ? Preset.smallPlusDisable : Preset.smallPlus} noText onClick={()=> { handleProductSend(record, 1)}} />
          </td>
          <td className={`px-2 py-1 text-center whitespace-nowrap`}>
            <Button preset={Preset.smallClose} noText onClick={()=> { del(record.id) }} />
          </td>
        </tr>
      )
  });

  return (
    <div className="m-4">
      <div className={`relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border transition-all duration-300
        ${sending ? 'border-primary/30 shadow-md' : 'border-bg-subtle'}`}>

        {sending && (
          <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/10 overflow-hidden z-10">
            <div className="h-full w-1/3 bg-primary rounded-full animate-shimmer" />
          </div>
        )}

        <table className="w-full text-sm text-left">
          <thead className={`text-xs text-text-base uppercase border-b-2 transition-colors duration-300
            ${sending ? 'bg-primary/10 border-primary/20' : 'bg-bg-subtle/60 border-bg-subtle'}`}>
            <tr>
              <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cant</th>
              <th scope="col" className={`px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap ${ !isShowCode && 'hidden'}`}>Cod </th>
              <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
              <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Precio</th>
              <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Descuento</th>
              <th scope="col" className={`px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap ${ !isDefaultCommission && 'hidden'}`}>Comisión</th>
              <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
              <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">OP</th>
              <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Del</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
          <tfoot>
            <tr>
                <th scope="col"></th>
                <th scope="col" className={`${ !isShowCode && 'hidden'}`}></th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col" className="py-2 px-2 border">{ numberToMoney(sumarDiscount(data), system)}</th>
                <th scope="col" className={`py-2 px-2 border ${ !isDefaultCommission && 'hidden'}`}>{ numberToMoney(commissionTotal(data), system) }</th>
                <th scope="col" className="py-2 px-2 border">{ numberToMoney(sumarTotales(data), system) }</th>
                <th scope="col"></th>
                <th scope="col"></th>
                </tr>
            </tfoot>
        </table>
      </div>
    </div>
  );
}

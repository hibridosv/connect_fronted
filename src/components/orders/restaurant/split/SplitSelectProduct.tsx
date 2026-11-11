'use client';

import { NothingHere } from "@/components/NothingHere";
import { useOrderRestaurantFnLogic } from "@/hooks/order/restaurant/useOrderRestaurantFnLogic";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import ordersStore from "@/stores/orders/ordersStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useSession } from 'next-auth/react';
import { AiFillCloseCircle } from "react-icons/ai";
import { FaCheckSquare } from "react-icons/fa";


export function SplitSelectProduct({ order}: any) {
  const { system } = useConfigStore();
  const { order: orderPrincipal, sending, deleting } = ordersStore();
  const { changeClient } = useOrderRestaurantFnLogic();
  const { data: session } = useSession();
  const  remoteUrl  = session?.url;
  const { setElement, getElement } = useTempStorage();
  const { openModal} = useModalStore();
  const { setError } = useToastMessageStore();
  const serviceType: number = getElement('serviceType');
  const clientActive = getElement('clientActive');


  if (serviceType == 3 && !order) return <></>;

            
    if (!order?.invoiceproducts) return (
        <div className="hidden w-full md:grid place-items-center">
            <NothingHere width="500" text="" />
        </div>
    )

      const listItems = order.invoiceproducts && order?.invoiceproducts.map((record: any, index: number) => {
        return (
        <tr key={index}
            className={`${sending ? 'opacity-50 pointer-events-none' : 'opacity-100'} transition-all duration-500 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
            <td className={`px-2 py-1 whitespace-nowrap text-primary text-center font-normal`}>
              { record.quantity }
            </td>
            <td className="px-2 py-1 text-left whitespace-nowrap font-medium " >
            { record.product }
            </td>
            <td className={`px-2 py-1 text-center whitespace-nowrap tabular-nums`}>
              { numberToMoney(record.unit_price, system) }
            </td>
            <td className={`px-2 py-1 text-center whitespace-nowrap tabular-nums`}>
               { record?.attributes?.client ?? "Sin asignar"}
            </td>
            <td className={`px-2 py-1 text-right whitespace-nowrap tabular-nums`}>
              {record.attributes.client == clientActive ? 
                <AiFillCloseCircle size={24} className="text-danger" /> 
                :
                <FaCheckSquare size={24} className="text-success clickeable" onClick={()=>changeClient(record.id)}/>
                }
            </td>
        </tr>
        )
      });

  return (
    <div className="m-2">
      <div className={`relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle transition-all duration-300
        ${sending ? 'border-primary/30 shadow-md' : ''}`}>

        {/* Barra de progreso animada al enviar */}
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
              <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
              <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Precio</th>
              <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cliente</th>
              <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap"></th>
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

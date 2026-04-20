'use client';

import { NothingHere } from "@/components/NothingHere";
import { useOrderRestaurantFnLogic } from "@/hooks/order/restaurant/useOrderRestaurantFnLogic";
import { getLastElement, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import ordersStore from "@/stores/orders/ordersStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { AiFillCloseCircle } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { groupInvoiceProductsByCodAll, isProductPendientToSend } from "../utils";



export function RestaurantProductsAdded({ order } : any) {
  const { system } = useConfigStore();
  const { sending, deleting } = ordersStore();
  const { cancel, del } = useOrderRestaurantFnLogic();
  const { data: session } = useSession();
  const  remoteUrl  = session?.url;
  const { setElement, getElement } = useTempStorage();
  const { openModal} = useModalStore();
  const { setError } = useToastMessageStore();
  const serviceType: number = getElement('serviceType');


  if (serviceType == 3 && !order) return <></>;


    const imageLoader = ({ src, width, quality }: any) => {
        return `${remoteUrl}/images/logo/${src}?w=${width}&q=${quality || 75}`
    }
            
    if (!order?.invoiceproducts) return (
        <div className="hidden w-full md:grid place-items-center">
            { system && system?.logo ? 
            <Image loader={imageLoader} src={system && system?.logo} alt="Hibrido" width={500} height={500} className="w-full max-w-[500px]"
            sizes="(max-width: 768px) 100vw, 500px" /> :
            <NothingHere width="500" text=" " />
            }
        </div>
    )

    order?.invoiceproducts && groupInvoiceProductsByCodAll(order);
        const listItems = order?.invoiceproductsGroup.map((record: any, index: number) => {
           const hasOptions = record.options.length > 0;
        return (
        <tr key={index}
            className={`${sending ? 'opacity-50 pointer-events-none' : 'opacity-100'} transition-all duration-500 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
            <td className={`px-2 py-1 whitespace-nowrap text-primary text-center ${hasOptions ? 'font-normal' : 'clickeable font-bold'}`}
             onClick={ hasOptions ? 
                ()=> setError({ message: 'Opción no disponible en este producto'}) : 
                ()=>{ setElement('productSelected', record); openModal('changeQuantity') 
             }}>
              { record.quantity }
            </td>
            <td className="px-2 py-1 text-left whitespace-nowrap font-medium " >
            { record.product }
            </td>
            <td className={`px-2 py-1 text-right whitespace-nowrap tabular-nums clickeable`} 
              onClick={()=> { 
                openModal('discountModal'); 
                setElement('productSelected', record); 
                setElement('discountType', 1) 
              }}>
              { numberToMoney(record.unit_price, system) }
            </td>
            <td className={`px-2 py-1 text-right whitespace-nowrap tabular-nums`}>
            { numberToMoney(record.total, system) }
            </td>
            <td className={`px-2 py-1 text-center whitespace-nowrap`}>
              {/* <CodeRequestGuard permission="code-request-delete-product" onAuthorized={()=>{ del(order.id, record.cod)} } > */}
                <AiFillCloseCircle size={20} className={`${isProductPendientToSend(getLastElement(order?.invoiceproducts, "cod", record?.cod)) ? 'text-grey-800' : 'text-red-800'} clickeable`}  />
              {/* </CodeRequestGuard> */}
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
              <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
              <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">
                {/* <CodeRequestGuard permission="code-request-delete-product" onAuthorized={()=>{ cancel(order.id)} } > */}
                { deleting ? <CgSpinner size={22} className={`text-red-800 animate-spin`}  /> : <MdDelete size={22} className={`text-red-800 clickeable`}  /> }
                {/* </CodeRequestGuard> */}
              </th>
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

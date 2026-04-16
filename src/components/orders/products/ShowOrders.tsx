'use client'
import { Alert } from '@/components/Alert/Alert';
import { ButtonDownloadGet } from '@/components/button/button-download-get';
import { Popper } from '@/components/popper/Popper';
import { useOrderFnLogic } from '@/hooks/order/product/useOrderFnLogic';
import { formatDateAsDMY, formatHourAsHM } from '@/lib/date-formats';
import { numberToMoney } from '@/lib/utils';
import { TypeOfPrice } from '@/services/enums';
import useConfigStore from '@/stores/configStore';
import ordersStore from '@/stores/orders/ordersStore';
import useTempStorage from '@/stores/useTempStorage';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaDownload } from 'react-icons/fa';
import { MultiPriceChange, setPriceName } from './MultiPriceChange';



export function ShowOrders() {
    const { system } = useConfigStore();
    const { orders, order } = ordersStore();
    const { select } = useOrderFnLogic();
    const { data: session } = useSession();
    const downloadStatus = true;
    const  remoteUrl  = session?.url;
    const { getElement } = useTempStorage();
    const typeOfPriceSelect = getElement('typeOfPrice');

    if (order) return null;

    const imageLoader = ({ src, width, quality }: any) => {
        return `${remoteUrl}/images/logo/${src}?w=${width}&q=${quality || 75}`
    }

    const showProducts = (products: any) =>{
    return (
        <div className="w-8/10">
        <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
            <tr>
                <th scope="col" className="px-2 py-2 font-semibold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cod</th>
                <th scope="col" className="px-2 py-2 font-semibold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
                <th scope="col" className="px-2 py-2 font-semibold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cant</th>
                <th scope="col" className="px-2 py-2 font-semibold tracking-wider whitespace-nowrap">Total</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-bg-subtle">
            {products?.map((product: any):any => (
                <tr key={product.id} className="bg-bg-content border-b border-bg-subtle hover:bg-bg-subtle/50">
                    <td className="py-1.5 px-2 text-text-base">{product.cod }</td>
                    <td className="py-1.5 px-2 text-text-base">{product.product }</td>
                    <td className="py-1.5 px-2 text-text-base">{ product.quantity}</td>
                    <td className="py-1.5 px-2 text-text-base">{ numberToMoney(product.total, system)}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    )
    }


  
    return (
    <div className="sm:mt-3 w-full m-1">
      { !orders || orders.length === 0 ? 
        <div className="w-full flex justify-center p-4">
          { system && remoteUrl && <Image loader={imageLoader} src={system?.logo} alt="Hibrido" width={500} height={500} /> }
        </div> : 
          <div className="w-full rounded-lg shadow-sm border border-bg-subtle bg-bg-content">
          <div className="text-center uppercase rounded-t-lg py-2 bg-primary text-text-inverted font-semibold">ORDENES PENDIENTES</div>

          { Array.isArray(orders) && orders.map((order: any, index: any) => (
            <div key={index} className="flex justify-between items-center p-3 border-b border-bg-subtle last:border-b-0 bg-bg-content hover:bg-bg-subtle/50">
                <Popper label={<span onClick={() => select(order.id)} className="ml-1 clickeable text-text-base font-medium uppercase">{order?.client?.name ? `Cliente: ${order?.client?.name}` : `Usuario: ${order.employee.name}`}</span>}>
                    {showProducts(order.invoiceproducts)}
                </Popper>
                <span className="text-text-muted text-sm">
                  {formatDateAsDMY(order.created_at)} | {formatHourAsHM(order.created_at)}
                </span>
                { downloadStatus && 
                <div className="ml-1">
                  <ButtonDownloadGet autoclass={false} href={`id=${order.id}&route=download.pdf.order`}><FaDownload /></ButtonDownloadGet>
                </div> }
              </div>
          ))}
        </div> 
      }
      <div className="flex justify-center rounded-md bg-primary/10 px-3 py-2 text-sm font-bold uppercase text-primary">
        <MultiPriceChange />
      </div>
        { typeOfPriceSelect != TypeOfPrice.normal && 
        <div className="flex justify-center mt-2"><Alert text={`EL PRECIO ESTA COMO: ${setPriceName(typeOfPriceSelect)}`} type='danger' /></div> }
    </div>
    );
}
'use client';

import { usePopper } from '@/components/popper/popperContext';
import { useOrderRestaurantFnLogic } from '@/hooks/order/restaurant/useOrderRestaurantFnLogic';
import { Order } from '@/interfaces/order';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import useTempStorage from '@/stores/useTempStorage';
import { useRouter } from 'next/navigation';

export interface ButtonsI {
  order: Order;
}

export function Buttons(props: ButtonsI) {
  const { order } = props
  const { activeConfig, system } = useConfigStore();
  const { addClient, save } = useOrderRestaurantFnLogic();
  const { openModal} = useModalStore();
  const { setElement, getElement } = useTempStorage();
  const serviceType: number = getElement('serviceType'); // aqui, mesas, delivery

  const isDiscount = activeConfig && activeConfig.includes("sales-discount");
  const isOtherSeller = activeConfig && activeConfig.includes("sales-other-seller");
  const isReferred = activeConfig && activeConfig.includes("sales-referred");
  const isDelivery = activeConfig && activeConfig.includes("sales-delivery-man");
  const isOtherSales = activeConfig && activeConfig.includes("sales-other-sales");
  const isSpecial = activeConfig && activeConfig.includes("sales-special");
  const isComment = activeConfig && activeConfig.includes("sales-comment");
  const isSpliter = (() => { try { return JSON.parse(order.attributes?.clients ?? '[]').length > 1; } catch { return false; } })();
  const { setIsOpen } = usePopper();
  const router = useRouter();


  //const validateFields = ()=>{
  //  if (invoice?.client_id && (invoice?.invoice_assigned?.type == 2 || invoice?.invoice_assigned?.type == 3)) {
  //    return validateInvoiceFields(invoice?.client, invoice?.invoice_assigned?.type == 2 ? requiredFieldsFactura : requiredFieldsCCF) 
  //  }
  // }

  if(!order) return null;
  
  return (<div>
        <div className="w-8/10">

            { isDiscount && 
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('discountModal'); setElement('discountType', 2) }}>  Agregar Descuento</div>}
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('tips'); setElement('typeOfTips', 1)}}> Asignar Propina</div>
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('searchContact'); setElement('contactSearch', "customerSearch");}}> Asignar Cliente</div>

            { isOtherSeller && 
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('setUser'); setElement('setUser', "setSeller");}}>Asignar Vendedor</div>}
            { isReferred && 
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('searchContact'); setElement('contactSearch', "referralSearch");}}> Asignar Referido</div>}
            { isDelivery && 
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('setUser'); setElement('setUser', "setDriver");}}> Asignar Repartidor </div>}
            { isOtherSales && 
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('otherSales') }}> Otras Ventas</div>}
            { isComment && 
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('addComment') }}> Agregar comentario </div>}
            { isSpecial && 
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('specialSales'); }}> Venta Especial </div>}
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); save(order.id, true) }}> Imprimir pre cuenta</div>
            { serviceType == 2 &&
              <div className='button-options-sales' onClick={()=>{ setIsOpen(false); addClient(order.id) }}> Agregar cliente a la mesa</div>}
            { serviceType == 2 &&
              <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('addName'); }}> Agregar nombre a la mesa</div>}
            { serviceType == 2 && isSpliter &&
              <div className='button-options-sales' onClick={()=>{ setIsOpen(false); router.push(`/orders/restaurant/split`) }}> Dividir Cuenta</div>}
            { system?.country == 3 &&
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); }}> Buscar por NIT</div> }
          </div>
    </div>);
}


'use client';

import CodeRequestGuard from '@/components/modal/CodeRequestGuard';
import { usePopper } from '@/components/popper/popperContext';
import { useOrderFnLogic } from '@/hooks/order/product/useOrderFnLogic';
import { Order } from '@/interfaces/order';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import useToastMessageStore from '@/stores/toastMessageStore';
import useTempStorage from '@/stores/useTempStorage';

export interface ButtonsI {
  order: Order;
}

export function Buttons(props: ButtonsI) {
  const { order } = props
  const { activeConfig } = useConfigStore();
  const { openModal} = useModalStore();
  const { setElement } = useTempStorage();
  const { setError} = useToastMessageStore();
  const isDiscount = activeConfig && activeConfig.includes("sales-discount");
  const isOtherSeller = activeConfig && activeConfig.includes("sales-other-seller");
  const isReferred = activeConfig && activeConfig.includes("sales-referred");
  const isDelivery = activeConfig && activeConfig.includes("sales-delivery-man");
  const isOtherSales = activeConfig && activeConfig.includes("sales-other-sales");
  const isSpecial = activeConfig && activeConfig.includes("sales-special");
  const isComment = activeConfig && activeConfig.includes("sales-comment");
  const isRemission = activeConfig && activeConfig.includes("sales-remission");
  const isQuote = activeConfig && activeConfig.includes("sales-quote");
  const { setIsOpen } = usePopper();
  const { quote } = useOrderFnLogic();


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
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('searchContact'); setElement('contactSearch', "customerSearch");}}> Asignar Cliente</div>
            { isOtherSeller && 
            <div className='button-options-sales'  onClick={()=>{ setIsOpen(false); openModal('setUser'); setElement('setUser', "setSeller");}}>Asignar Vendedor</div>}
            { isReferred && 
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('searchContact'); setElement('contactSearch', "referralSearch");}}> Asignar Referido</div>}
            { isDelivery && 
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('setUser'); setElement('setUser', "setDriver");}}> Asignar Repartidor </div>}
            { isOtherSales && <CodeRequestGuard permission="code-request-others-sales" onAuthorized={()=>{ setIsOpen(false); openModal('otherSales') }} ><div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('otherSales') }}> Otras Ventas</div></CodeRequestGuard>}
            { isSpecial && 
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('specialSales'); }}> Venta Especial </div>}
            { isComment && 
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); openModal('addComment') }}> Agregar comentario </div>}
            { isQuote &&
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); order?.client_id ? quote(order.id) : setError({message: "Debe agregar un cliente primero"}); }}> Guardar como Cotización</div> }
            { isRemission && 
            <div className='button-options-sales' onClick={()=>{ setIsOpen(false); order?.client_id ? openModal('setRemissionNote') : setError({message: "Debe agregar un cliente para la Nota de Remisión"}); }}> Crear Nota de Remisión</div> }
            {/* <div className='button-options-sales' onClick={()=>{ setIsOpen(false); }}> Agregar Retención Renta</div> */}
          </div>
    </div>);
}

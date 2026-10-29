'use client';

import { DeleteModal } from '@/components/DeleteModal';
import { Popper } from '@/components/popper/Popper';
import { useOrderFnLogic } from '@/hooks/order/product/useOrderFnLogic';
import { Order } from '@/interfaces/order';
import { requiredFieldsCCF, validateInvoiceFields } from '@/lib/validator-functions';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import ordersStore from '@/stores/orders/ordersStore';
import { LoaderIcon } from 'react-hot-toast';
import { AiFillSave } from 'react-icons/ai';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { IoMdOptions } from 'react-icons/io';
import { SalesMessages } from '../common/SalesMessages';
import { Buttons } from './Buttons';

export interface OrderButtonsI {
  order: Order;
}

export function OrderButtons(props: OrderButtonsI) {
  const { order } = props
  const { cashdrawer, tenant } = useConfigStore();
  const { save, pay, cancel } = useOrderFnLogic();
  const { saving, sending } = ordersStore();
  const { modals, closeModal, openModal} = useModalStore();

  const invoice = order;

  if(!order) return null;

  const validateFields = ()=>{
    if (invoice?.client_id && invoice?.invoice_assigned?.type == 3) {
      return validateInvoiceFields(invoice?.client, requiredFieldsCCF) 
    }
  }

  let fieldsRequired = validateFields();
  let isSuspended = tenant?.status == 2 ? true : false;
  let payDisabled = sending || !cashdrawer || (!invoice?.client_id && (invoice?.invoice_assigned?.type == 3 || invoice?.invoice_assigned?.type == 4)) || fieldsRequired && fieldsRequired.length > 0 || isSuspended;

  return (<div>

        <SalesMessages />
        
        <div className='grid grid-cols-2 gap-1.5 sm:flex sm:gap-0'>
          <Popper label={ <div className='button-grey rounded-lg sm:rounded-l-lg sm:rounded-r-none text-xs sm:text-sm clickeable w-full h-full py-2.5 sm:py-2'><IoMdOptions className='mr-1' /> Opciones</div>} >
            <Buttons order={order} />
          </Popper>
        <div className={`button-cyan rounded-lg sm:rounded-none text-xs sm:text-sm py-2.5 sm:py-2 ${saving || sending ? 'cursor-not-allowed opacity-60' : 'clickeable'}`} onClick={saving || sending ? ()=>{} : ()=>save(order.id)}>{ saving ? <LoaderIcon className='mr-1' /> : <AiFillSave className='mr-1' />} Guardar</div>
        <div className={`button-lime rounded-lg sm:rounded-none text-xs sm:text-sm py-2.5 sm:py-2 ${payDisabled ? 'cursor-not-allowed opacity-60' : 'clickeable'}`} onClick={payDisabled ? ()=>{} : ()=>{ openModal('payOrder') }}> <FaRegMoneyBillAlt className='mr-1' /> Cobrar</div>
        <div className={`button-red rounded-lg sm:rounded-r-lg sm:rounded-l-none text-xs sm:text-sm py-2.5 sm:py-2 ${sending ? 'cursor-not-allowed opacity-60' : 'clickeable'}`} onClick={sending ? ()=>{} : ()=>{openModal('deleteOrder')}}><GiCancel className='mr-1' /> Cancelar</div>
      </div>
      <DeleteModal
              isShow={modals.deleteOrder}
              text={`¿Estas seguro de eliminar esta orden?`}
              onDelete={() =>{ cancel(order?.id); closeModal('deleteOrder'); }}
              onClose={() => closeModal('deleteOrder')} />
    </div>);
}

'use client';

import { Alert } from '@/components/Alert/Alert';
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
import { Buttons } from './Buttons';

export interface OrderButtonsI {
  order: Order;
}

export function OrderButtons(props: OrderButtonsI) {
  const { order } = props
  const { cashdrawer } = useConfigStore();
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
  let payDisabled = sending || !cashdrawer || (!invoice?.client_id && invoice?.invoice_assigned?.type == 3) || fieldsRequired && fieldsRequired.length > 0;

  return (<div>
        { !cashdrawer && 
        <Alert type="danger" title="Error" text="Debe seleccionar una caja para poder cobrar" isDismissible={false} className='my-1' /> }

        { (!invoice?.client_id && (invoice?.invoice_assigned?.type == 3 || invoice?.invoice_assigned?.type == 4)) && 
        <Alert type="danger" title="Error" text={`Seleccione un cliente para el ${invoice?.invoice_assigned?.type == 3 ? "CCF" : "Sujeto Excluido"}`} isDismissible={false} className='my-1' /> }

        { fieldsRequired && fieldsRequired.length > 0 &&
          <div className="rounded-lg border border-danger/20 bg-danger/10 p-2 m-3 text-sm text-text-base ">
            Faltan los siguientes campos del cliente para facturar:
            <span className="ml-1 font-semibold text-danger">{`${fieldsRequired.join(', ')}.`}</span>
          </div>
        }

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

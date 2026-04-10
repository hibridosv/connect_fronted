'use client'
import { Order } from '@/interfaces/order';
import { formatDuiWithAll, getCountryProperty } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import { sumarTotalRetentionRenta, sumarTotalRetentionSujetoExcluido } from '../utils';
import { MultiPriceChange } from './MultiPriceChange';
import { OrderTotal } from './OrderTotal';

export interface ShowTotalI {
  order: Order;
}

/* decidir si se muestran las retenciones de sujeto excluido y renta aunque esten a cero o no */

export function ShowTotal(props: ShowTotalI) {
  const { order } = props;
  const { system, activeConfig } = useConfigStore();
  const { openModal} = useModalStore();

  const showSeller = activeConfig && activeConfig.includes("sales-show-other-seller");
  const retentionSujetoExcluido = sumarTotalRetentionSujetoExcluido(order);
  const retentionRenta = sumarTotalRetentionRenta(order);

  if (!order || order?.invoiceproducts.length == 0) return null
    
  return (
    <div className='w-full space-y-4 rounded-lg border border-bg-subtle bg-bg-content p-4 shadow-sm'>
      <OrderTotal />

      <div className="space-y-2 text-sm">
        {order?.invoice_assigned?.type === 4 && retentionSujetoExcluido > 0 && (
          <div className="rounded-md bg-danger/10 p-2 text-center font-semibold text-danger">
            Retención Sujeto Excluido: {getCountryProperty(parseInt(system?.country)).currency} {retentionSujetoExcluido.toFixed(2)}
          </div>
        )}
        
        {(order?.retention_rent ?? 0) > 0 && retentionRenta > 0 && (
          <div className="rounded-md bg-danger/10 p-2 text-center font-semibold text-danger">
            Retención Renta: {getCountryProperty(parseInt(system?.country)).currency} {retentionRenta.toFixed(2)}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-md bg-primary/10 px-3 py-2 text-sm font-bold uppercase text-primary">
        <span onClick={() => openModal('invoiceType')} className='clickeable'>{ order?.invoice_assigned?.name }</span> 
        <MultiPriceChange />
      </div>

      <div className="space-y-3 pt-2 text-sm">
        {showSeller && order?.employee?.name && (
          <div className="flex justify-between"> 
            <span className="text-text-muted">Vendedor:</span>
            <span className="font-semibold text-text-base">{order.employee.name}</span>
          </div>
        )}
        {order?.client?.name && (
          <div className="flex justify-between"> 
            <span className="text-text-muted">Cliente:</span>
            <div className="text-right">
              <span className="font-semibold text-text-base">{order.client.name}</span>
              <span className="block text-xs text-text-muted">{order.client.document ? formatDuiWithAll(order.client.document) : formatDuiWithAll(order.client.id_number)}</span>
            </div>
          </div>
        )}
        {order?.referred?.name && (
          <div className="flex justify-between"> 
            <span className="text-text-muted">Referido:</span>
            <div className="text-right">
              <span className="font-semibold text-text-base">{order.referred.name}</span>
              <span className="block text-xs text-text-muted">{order.referred.document ? formatDuiWithAll(order.referred.document) : formatDuiWithAll(order.referred.id_number)}</span>
            </div>
          </div>
        )}
        {order?.delivery?.name && (
          <div className="flex justify-between"> 
            <span className="text-text-muted">Repartidor:</span>
            <span className="font-semibold text-text-base">{order.delivery.name}</span>
          </div>
        )}
      </div>

      {order?.comment && (
        <div className="border-t border-bg-subtle pt-3"> 
          <p className="text-sm">
            <span className="font-semibold text-text-muted">Nota: </span>
            <span className="text-text-base">{order.comment}</span>
          </p>
        </div>
      )}
    </div>
  );
}

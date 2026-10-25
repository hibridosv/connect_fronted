'use client';

import { Popper } from '@/components/popper/Popper';
import { usePopper } from '@/components/popper/popperContext';
import { useOrderRestaurantFnLogic } from '@/hooks/order/restaurant/useOrderRestaurantFnLogic';
import useModalStore from '@/stores/modalStorage';
import ordersStore from '@/stores/orders/ordersStore';
import useTempStorage from '@/stores/useTempStorage';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdTableRestaurant } from 'react-icons/md';
import { TbClock, TbLink } from 'react-icons/tb';
import { TablesTime } from './TablesTime';

interface TableCardProps {
  record: any;
}

export function TableCard({ record }: TableCardProps) {
  const { select } = useOrderRestaurantFnLogic();
  const { tables } = ordersStore();
  const isOccupied = record.status == 1;
  const { setElement } = useTempStorage();
  // mesa principal si esta mesa esta unida a otra (puede estar en otra zona)
  const principal = record.combining_by && Array.isArray(tables)
    ? tables.flatMap((location: any) => location.tables ?? []).find((table: any) => table.id === record.combining_by)
    : null;

  const handleSelect = (option: any) => {
    setElement('selectedTable', option.id);
    if (option.status == 1) {
        select(option.ticket_order_id)
    }
  }


  const status = record.combining_by ? statusConfig.joined
    : statusConfig[record.status] ?? statusConfig[0];

  return (
    <div className="group clickeable animate-scale-in" onClick={() => handleSelect(record)}>
      <div
        className={`relative w-32 overflow-hidden bg-bg-content rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${status.border}`}
        title={principal ? `${record?.name} (unida a ${principal.name})` : record?.name} >
        {/* franja superior con el color del estado */}
        <div className={`h-1 w-full ${status.bar}`} />

        { record.status != 2 &&
          <div className="absolute top-2 right-1 z-10" onClick={(e) => e.stopPropagation()}>
            <Popper label={<BsThreeDotsVertical className="text-text-muted hover:text-primary transition-colors" size={16} title="Opciones de la mesa" />}>
              <TableOptions record={record} principal={principal} onSelect={handleSelect} />
            </Popper>
          </div>
        }

        <div className="flex flex-col items-center px-2 pt-3 pb-2 gap-2">
          <div className={`relative flex items-center justify-center w-14 h-14 rounded-2xl ${status.iconBg}`}>
            <MdTableRestaurant className={`w-8 h-8 ${status.iconText} transition-transform duration-300 group-hover:scale-110`} />
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ring-2 ring-bg-content ${status.dot}`} />
          </div>

          <p className="w-full text-center text-[13px] leading-tight font-bold text-text-base uppercase tracking-wide truncate">
            {record?.name}
          </p>

          {/* alto fijo para que todas las tarjetas midan lo mismo */}
          <div className="h-4 flex items-center justify-center gap-1">
            { isOccupied &&
              <>
                <TbClock className="w-3 h-3 shrink-0 text-danger" />
                <span className="text-[10px] font-semibold tabular-nums">
                  {/* la mesa unida cuenta el tiempo desde que se ocupo la principal */}
                  <TablesTime record={principal ?? record} isShow={true} rowSearch="updated_at" />
                </span>
              </>
            }
          </div>
        </div>

        <div className={`h-7 px-2 flex items-center justify-center gap-1 border-t ${status.footer}`}>
          { principal ? (
            <>
              <TbLink className={`w-3.5 h-3.5 shrink-0 ${status.iconText}`} />
              <span className={`text-[10px] font-semibold truncate ${status.iconText}`}>
                Unida a {principal.name}
              </span>
            </>
          ) : (
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${status.iconText}`}>
              {status.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const statusConfig: Record<string | number, { label: string; bar: string; dot: string; iconBg: string; iconText: string; border: string; footer: string }> = {
  0: { label: 'Disponible', bar: 'bg-success', dot: 'bg-success', iconBg: 'bg-success/10', iconText: 'text-success', border: 'border-success/25 hover:border-success/50', footer: 'bg-success/5 border-success/15' },
  1: { label: 'Ocupada', bar: 'bg-danger', dot: 'bg-danger animate-pulse', iconBg: 'bg-danger/10', iconText: 'text-danger', border: 'border-danger/30 hover:border-danger/50', footer: 'bg-danger/5 border-danger/15' },
  2: { label: 'Reservada', bar: 'bg-warning', dot: 'bg-warning', iconBg: 'bg-warning/10', iconText: 'text-warning', border: 'border-warning/30 hover:border-warning/50', footer: 'bg-warning/5 border-warning/15' },
  joined: { label: 'Unida', bar: 'bg-info', dot: 'bg-info animate-pulse', iconBg: 'bg-info/10', iconText: 'text-info', border: 'border-info/30 hover:border-info/50', footer: 'bg-info/5 border-info/15' },
};


interface TableOptionsProps {
  record: any;
  principal: any;
  onSelect: (table: any) => void;
}

/** Opciones de la mesa en la pantalla de mesas, segun su estado */
function TableOptions({ record, principal, onSelect }: TableOptionsProps) {
  const { setIsOpen } = usePopper();
  const { unjoinTable } = useOrderRestaurantFnLogic();
  const { openModal } = useModalStore();
  const { setElement } = useTempStorage();

  if (record.combining_by) {
    return (<div>
      <div className='button-options-sales' onClick={()=>{ setIsOpen(false); unjoinTable(record.ticket_order_id, record.id) }}> Separar mesa</div>
      { principal &&
        <div className='button-options-sales' onClick={()=>{ setIsOpen(false); onSelect(principal) }}> Ir a la mesa principal</div>}
    </div>);
  }

  if (record.status == 1) {
    return (<div>
      <div className='button-options-sales' onClick={()=>{ setIsOpen(false); setElement('joinTable', { orderId: record.ticket_order_id, tableId: record.id }); openModal('joinTable') }}> Unir mesas</div>
      <div className='button-options-sales' onClick={()=>{ setIsOpen(false); setElement('joinTable', { orderId: record.ticket_order_id, tableId: record.id, move: true }); openModal('joinTable') }}> Cambiar de mesa</div>
      <div className='button-options-sales' onClick={()=>{ setIsOpen(false); setElement('renameTable', { orderId: record.ticket_order_id, name: record.name }); openModal('addName') }}> Renombrar mesa</div>
    </div>);
  }

  return (<div>
    <div className='button-options-sales' onClick={()=>{ setIsOpen(false); setElement('joinTable', { freeTableId: record.id }); openModal('joinTable') }}> Unir a una mesa ocupada</div>
  </div>);
}

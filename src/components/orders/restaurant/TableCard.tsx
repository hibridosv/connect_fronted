'use client';

import { Popper } from '@/components/popper/Popper';
import { usePopper } from '@/components/popper/popperContext';
import { useOrderRestaurantFnLogic } from '@/hooks/order/restaurant/useOrderRestaurantFnLogic';
import useModalStore from '@/stores/modalStorage';
import ordersStore from '@/stores/orders/ordersStore';
import useTempStorage from '@/stores/useTempStorage';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdTableRestaurant } from 'react-icons/md';
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


  return (
    <div
      className="group clickeable animate-scale-in" onClick={() => handleSelect(record)}>
      <div className={` relative w-28 bg-bg-content rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${isOccupied ? 'border-danger/30' : 'border-bg-subtle'}`}>
        { record.status != 2 &&
          <div className="absolute top-1 right-1 z-10" onClick={(e) => e.stopPropagation()}>
            <Popper label={<BsThreeDotsVertical className="text-text-muted hover:text-primary" size={16} title="Opciones de la mesa" />}>
              <TableOptions record={record} principal={principal} onSelect={handleSelect} />
            </Popper>
          </div>
        }
        <div className="flex flex-col items-center px-2 pt-3 pb-2 gap-1.5">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <MdTableRestaurant className="w-7 h-7 text-secondary transition-transform duration-300 group-hover:scale-110" />
            <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-bg-content ${isOccupied ? 'bg-danger animate-pulse' : 'bg-success'} `} />
          </div>

          {isOccupied ? (
            <span className="text-[10px] text-danger font-semibold tabular-nums">
              {/* la mesa unida cuenta el tiempo desde que se ocupo la principal */}
              <TablesTime record={principal ?? record} isShow={true} rowSearch="updated_at" />
            </span>
          ) : (
            <span className="text-[12px] text-success font-medium">Disponible</span>
          )}
        </div>

        <div
          className={`relative px-2 py-1.5 rounded-b-xl text-center border-t ${isOccupied ? 'bg-danger/5 border-danger/15' : 'bg-bg-subtle/30 border-bg-subtle/60'} `} title={record?.name} >
          <p className="text-[11px] font-semibold text-text-base uppercase truncate w-full">
            {record?.name}
          </p>
          { principal &&
            <p className="text-[9px] text-text-muted truncate w-full" title={`Unida a ${principal.name}`}>
              Unida a {principal.name}
            </p>
          }
        </div>
      </div>
    </div>
  );
}


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
    </div>);
  }

  return (<div>
    <div className='button-options-sales' onClick={()=>{ setIsOpen(false); setElement('joinTable', { freeTableId: record.id }); openModal('joinTable') }}> Unir a una mesa ocupada</div>
  </div>);
}

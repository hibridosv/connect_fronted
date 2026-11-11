'use client';

import { useOrderRestaurantFnLogic } from '@/hooks/order/restaurant/useOrderRestaurantFnLogic';
import { numberToMoney } from '@/lib/utils';
import useStateStore from '@/stores/useTempStorage';
import { HiUser } from 'react-icons/hi2';
import { MdDeliveryDining } from 'react-icons/md';
import { TbClock } from 'react-icons/tb';
import { sumarTotales } from '../utils';
import { TablesTime } from './TablesTime';

const statusConfig: Record<number, { label: string; dot: string; iconBg: string; iconText: string; border: string }> = {
  0: { label: 'Pendiente', dot: 'bg-warning animate-pulse', iconBg: 'bg-warning/15', iconText: 'text-warning', border: 'border-warning/25' },
  1: { label: 'Preparando', dot: 'bg-info animate-pulse', iconBg: 'bg-info/15', iconText: 'text-info', border: 'border-info/25' },
  2: { label: 'En camino', dot: 'bg-accent animate-pulse', iconBg: 'bg-accent/15', iconText: 'text-accent', border: 'border-accent/25' },
  3: { label: 'Entregado', dot: 'bg-success', iconBg: 'bg-success/15', iconText: 'text-success', border: 'border-success/25' },
};

interface DeliveryCardProps {
  record: any;
}

export function DeliveryCard({ record }: DeliveryCardProps) {
  const { select } = useOrderRestaurantFnLogic();
  const { setElement } = useStateStore();
  const status = statusConfig[record.status] ?? statusConfig[0];
  const client = record?.client;
  const productCount = record?.invoiceproducts?.length ?? 0;
  const total = sumarTotales(record?.invoiceproducts);

  const handleSelect = () => {
    setElement('selectedTable', null);
    if (record.id) select(record.id);
  };

  return (
    <div className="group clickeable" onClick={handleSelect}>
      <div className={`w-44 bg-bg-content rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${status.border}`}>

        <div className="flex flex-col items-center px-2.5 pt-3 pb-2 gap-1.5">
          <div className={`relative flex items-center justify-center w-11 h-11 rounded-xl ${status.iconBg}`}>
            <MdDeliveryDining className={`w-6 h-6 ${status.iconText} transition-transform duration-300 group-hover:scale-110`} />
            <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-bg-content ${status.dot}`} />
          </div>

          <div className="flex items-center gap-1 w-full justify-center">
            <span className={`text-2xs font-semibold uppercase tracking-wider ${status.iconText}`}>
              {status.label}
            </span>
          </div>

          {record.status !== 3 && (
            <div className="flex items-center gap-1 text-2xs font-semibold text-danger tabular-nums">
              <TbClock className="w-3 h-3" />
              <TablesTime record={record} isShow={true} rowSearch="created_at" />
            </div>
          )}
        </div>

        <div className={`px-2.5 py-1.5 rounded-b-xl border-t bg-bg-subtle/30 ${status.border}`}>
          <div className="flex items-center gap-1.5 mb-0.5" title={client?.name}>
            <HiUser className="w-3 h-3 text-primary/60 shrink-0" />
            <p className="text-xxs font-semibold text-text-base truncate">
              {client?.name ?? 'Sin cliente'}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xs text-text-muted">
              {productCount} {productCount === 1 ? 'producto' : 'productos'}
            </span>
            <span className="text-xxs font-bold text-primary tabular-nums">
              {numberToMoney(total ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

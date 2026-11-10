'use client';

import { NothingHere } from '@/components/NothingHere';
import { DeliveryOrdersSkeleton } from '@/components/skeleton/DeliveryOrdersSkeleton';
import ordersStore from '@/stores/orders/ordersStore';
import useStateStore from '@/stores/useTempStorage';
import { DeliveryCard } from './DeliveryCard';

export function DeliveryOrders() {
  const { orders, loading } = ordersStore();
  const { getElement } = useStateStore();
  const serviceType: number = getElement('serviceType');
  const clientOrder = getElement('clientOrder');


  if (serviceType != 3 || clientOrder) return <></>;
  if (loading) return <DeliveryOrdersSkeleton />;
  if (!orders || orders.length === 0) return <NothingHere text="No hay pedidos pendientes"/>;

  return (
    <div className="w-full px-3 py-2 animate-fade-in">
      <div className="flex flex-wrap justify-center gap-3">
        {Array.isArray(orders) && orders.map((record: any) => (
          <DeliveryCard key={record?.id} record={record} />
        ))}
      </div>
    </div>
  );
}

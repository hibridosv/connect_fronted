'use client'
import useReverb from '@/hooks/useReverb';
import useConfigStore from '@/stores/configStore';
import restaurantOrdersStore from '@/stores/restaurant/restaurantOrdersStore';
import { useEffect } from 'react';

export function useRestaurantOrdersLogic(currentPage: string) {
  const { orders, loading, loadOrders } = restaurantOrdersStore();
  const { activeConfig, tenant } = useConfigStore();

  const isScreenPush = activeConfig && activeConfig.includes('screen-push-active');
  const { random: pusherEvent } = useReverb(
    `${tenant?.id}-channel-screen`,
    'PusherScreenEvent',
    isScreenPush
  );

  useEffect(() => {
    loadOrders(
      `orders?included=employee,client,invoiceproducts.attributes,invoiceproducts.options.option,products.attributes,products.options.option,attributes,table,joinedTables&sort=-created_at&perPage=15${currentPage}`
    );
  }, [pusherEvent, currentPage, loadOrders]);

  const countByField = (field: string, value: number): number => {
    if (!orders?.data || orders.data.length === 0) return 0;
    return orders.data.reduce(
      (count: number, order: any) => (order[field] === value ? count + 1 : count),
      0
    );
  };

  return {
    orders,
    loading,
    pendingCount: countByField('status', 2),
    tableServiceCount: countByField('order_type', 2),
    deliveryCount: countByField('order_type', 3),
  };
}

'use client'
import useReverb from '@/hooks/useReverb';
import { screenSound } from '@/lib/config/config';
import useConfigStore from '@/stores/configStore';
import screenOrdersStore from '@/stores/restaurant/screenOrdersStore';
import manageRestaurantStore from '@/stores/restaurant/manageRestaurantStore';
import { useCallback, useEffect, useState } from 'react';

export function useScreenOrdersLogic() {
  const { orders, loading, loadOrders, processOrder } = screenOrdersStore();
  const { activeConfig, tenant } = useConfigStore();
  const { workStations, loadWorkStations } = manageRestaurantStore();

  const [activeStation, setActiveStation] = useState<number>(1);

  const isScreenPush = activeConfig && activeConfig.includes('screen-push-active');
  const { random: pusherEvent } = useReverb(
    `${tenant?.id}-channel-screen`,
    'PusherScreenEvent',
    isScreenPush
  );

  useEffect(() => {
    if (!workStations) {
      loadWorkStations('restaurant/workstations?filterWhere[status]==1');
    }
  }, [workStations, loadWorkStations]);

  const fetchOrders = useCallback(() => {
    loadOrders(
      `orders?included=employee,client,table,invoiceproducts.attributes,invoiceproducts.options.option,products.attributes,products.options.option,attributes&filterwherein[status]=1,3&filterWhere[active_station]==${activeStation}`
    );
  }, [loadOrders, activeStation]);

  useEffect(() => {
    fetchOrders();
  }, [pusherEvent, fetchOrders]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      screenSound();
    }
  }, [orders]);

  const processData = (values: { order: number; product?: number; status: number; url: string }) => {
    processOrder(values.url, values);
  };

  return {
    orders,
    loading,
    processData,
    activeStation,
    setActiveStation,
    workStations,
  };
}

export function filterProductsOrInvoiceProducts(data: any) {
  const items = data.products?.length > 0 ? data.products : data.invoiceproducts || [];
  return items.filter((item: any) =>
    item.attributes?.work_station_id !== null &&
    item.attributes?.show_station == 1
  );
}

export function groupProducts(products: any[]) {
  const counter: Record<string, { id: string; cod: string; product: string; quantity: number; options: any[] }> = {};
  const groupedProducts: { id: string; cod: string; product: string; quantity: number; options: any[] }[] = [];

  products.forEach(p => {
    const cod = p.cod;
    const options = p.options || [];

    if (options.length > 0) {
      groupedProducts.push({
        id: p.id,
        cod,
        product: p.product,
        quantity: p.quantity,
        options,
      });
    } else {
      if (!counter[cod]) {
        counter[cod] = { id: p.id, cod, product: p.product, quantity: 0, options: [] };
      }
      counter[cod].quantity += p.quantity;
    }
  });

  Object.values(counter).forEach(data => {
    groupedProducts.push(data);
  });

  return groupedProducts;
}

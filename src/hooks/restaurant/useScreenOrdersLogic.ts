'use client'
import useReverb from '@/hooks/useReverb';
import { screenSound } from '@/lib/config/config';
import useConfigStore from '@/stores/configStore';
import screenOrdersStore from '@/stores/restaurant/screenOrdersStore';
import manageRestaurantStore from '@/stores/restaurant/manageRestaurantStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect } from 'react';

const ACTIVE_STATION_KEY = 'restaurantScreenActiveStation';

export function useScreenOrdersLogic() {
  const { orders, loading, loadOrders, processOrder } = screenOrdersStore();
  const { activeConfig, tenant } = useConfigStore();
  const { workStations, loadWorkStations } = manageRestaurantStore();
  const { getElement, setElement } = useTempStorage();

  const activeStation = getElement(ACTIVE_STATION_KEY) ?? null;
  const setActiveStation = (stationId: number) => setElement(ACTIVE_STATION_KEY, stationId);

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

  useEffect(() => {
    if (activeStation == null && workStations && workStations.length > 0) {
      setElement(ACTIVE_STATION_KEY, workStations[0].id);
    }
  }, [activeStation, workStations, setElement]);

  useEffect(() => {
    loadOrders(
      `orders?included=employee,client,table,invoiceproducts.attributes,invoiceproducts.options.option,products.attributes,products.options.option,attributes&filterwherein[status]=1,3&filterWhere[active_station]==1`
    );
  }, [pusherEvent, loadOrders]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      screenSound();
    }
  }, [orders]);

  const visibleOrders = (orders ?? []).filter(
    (order: any) => activeStation != null && filterProductsOrInvoiceProducts(order, activeStation).length > 0
  );

  const processData = (values: { order: number; product?: number; status: number; url: string }) => {
    processOrder(values.url, values);
  };

  return {
    orders: visibleOrders,
    loading,
    processData,
    activeStation,
    setActiveStation,
    workStations,
  };
}

export function filterProductsOrInvoiceProducts(data: any, stationId: number) {
  const items = data.products?.length > 0 ? data.products : data.invoiceproducts || [];
  return items.filter((item: any) =>
    item.attributes?.work_station_id === stationId &&
    item.attributes?.show_station == 1
  );
}

export function getOrderStationIds(data: any): number[] {
  const items = data.products?.length > 0 ? data.products : data.invoiceproducts || [];
  const stationIds = items
    .filter((item: any) => item.attributes?.work_station_id != null && item.attributes?.show_station == 1)
    .map((item: any) => item.attributes.work_station_id);

  return Array.from(new Set(stationIds));
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

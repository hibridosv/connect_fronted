'use client'
import { groupInvoiceProductsByCodSpecial } from '@/components/orders/utils';
import useReverb from '@/hooks/useReverb';
import { getFirstElement } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import ordersProductsStore from '@/stores/orders/ordersProductsStore';
import ordersStore from '@/stores/orders/ordersStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect, useRef } from 'react';

/**
 * Carga la lógica para la gestión de productos en una orden.
 * Obtiene el tipo de busqueda en el formulario de busqueda de productos. con @typeOfSearch 0 = por código, 1 = por descripción.
 * @param initialLoad 
 */

export function useOrderProductsLogic(initialLoad: boolean = false) {
  const { activeConfig, invoiceTypes, user, tenant, configurations } = useConfigStore();
  const { getElement, setElement } = useTempStorage();
  const typeOfSearch = getElement('typeOfSearch'); // tipo de busqueda
  const { loadOrder, loadOrders, setOrders } = ordersProductsStore();
  const { order } = ordersStore();
  const invoiceSelected = getFirstElement(invoiceTypes, 'status', 1); // selecciona el tipo de factura predeterminada
  const { openModal } = useModalStore();
  const isRealTime = activeConfig && activeConfig.includes('realtime-orders');
  const orderLoaded = useRef(false);
  
  const { data: pusherEventData, random: pusherRandom } = useReverb(`${tenant?.id}-channel-orders`, 'PusherOrderEvent', isRealTime);
  console.log('isRealTime:', isRealTime);
  console.log('Datos del evento de Pusher:', pusherEventData);
  // para sistema de productos
  useEffect(() => {
        if (initialLoad && activeConfig) {
            if (typeOfSearch === undefined) {
               if (activeConfig.includes('sales-by-name')) {
                  setElement('typeOfSearch', true);
               } else {
                  setElement('typeOfSearch', false);
               }
            }
            
           setElement('typeOfPrice', 1); // tipo de precio
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoad, activeConfig, invoiceSelected, setElement, typeOfSearch])


  useEffect(() => {
    if (!initialLoad || !user || orderLoaded.current) return;

    const loadInitialData = async () => {
      orderLoaded.current = true;
      await loadOrder(`orders/find?filterWhere[status]==1&filterWhere[opened_by_id]==${user?.id}&included=products,invoiceproducts,delivery,client,invoiceAssigned,employee,referred`, false);
      const currentOrder = ordersStore.getState().order;
      if (!currentOrder) {
        loadOrders(`orders?included=employee,client,invoiceproducts&filterWhere[status]==2`, false);
      }
    };

    loadInitialData();
  }, [initialLoad, user, loadOrder, loadOrders]);


/** Cargar Ordenes al realizar un evento de Pusher solo para los usuarios que no envia en evento */
  useEffect(() => {
    if (!pusherEventData) return;
    if (user && user.id == pusherEventData?.userId) return;
    loadOrders(`orders?included=employee,client,invoiceproducts&filterWhere[status]==2`, false);
   }, [loadOrders, pusherEventData, pusherRandom, user]);


   // verificar si exite algun producto con venta especial sin terminar el preoceso
   useEffect(() => {
      if (initialLoad && order) {
         if (order && order?.invoiceproducts && groupInvoiceProductsByCodSpecial(order).length > 0) {
            openModal('specialSales')
         }
      }
  }, [initialLoad, order, openModal])

   
}
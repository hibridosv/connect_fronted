'use client'
import { groupInvoiceProductsByCodSpecial } from '@/components/orders/utils';
import useReverb from '@/hooks/useReverb';
import { getFirstElement, getLastElement } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import ordersRestaurantsStore from '@/stores/orders/ordersRestaurantsStore';
import ordersStore from '@/stores/orders/ordersStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect, useRef } from 'react';

/**
 * Carga la lógica para la gestión de productos en una orden.
 * Obtiene el tipo de busqueda en el formulario de busqueda de productos. con @typeOfSearch 0 = por código, 1 = por descripción.
 * @param initialLoad 
 */

export function useOrderRestaurantLogic(initialLoad: boolean = false) {
  const { activeConfig, invoiceTypes, user, tenant } = useConfigStore();
  const { getElement, setElement } = useTempStorage();
  const serviceType = getElement('serviceType'); // 1 aqui, 2 mesas, 3 delivery
  const deliveryType = getElement('deliveryType'); // aqui, llevar, delivery
  const clientActive = getElement('clientActive'); // Cliente activo para asignar producto ( numero )
  const selectedTable = getElement('selectedTable'); // mesa seleccionada
  const clientOrder = getElement('clientOrder'); // delivery o cliente en opcion 3

  const { loadOrder, loadOrders, setOrders, loadTables } = ordersRestaurantsStore();
  const { order } = ordersStore();
  const invoiceSelected = getFirstElement(invoiceTypes, 'status', 1); // selecciona el tipo de factura predeterminada
  const { openModal } = useModalStore();
  const isRealTime = activeConfig && activeConfig.includes('realtime-orders');
  const orderLoaded = useRef(false);
  
  const { data: pusherEventData, random: pusherRandom } = useReverb(`${tenant?.id}-channel-orders`, 'PusherOrderEvent', isRealTime);


  
  // Inicializa los elementos para el tipo de servicio
  useEffect(() => {
        if (initialLoad && activeConfig) {
            if (!serviceType) {
               setElement('serviceType', 1);
            }
            if (!deliveryType) {
               if (activeConfig?.includes("sales-quick-here")) {
                  setElement('deliveryType', 1); // comer aqui
               } else {
                  setElement('deliveryType', 2); // llevar
               }
            }
           if (!clientActive) {
              setElement('clientActive', 1);
           }
           setElement('typeOfPrice', 1); // tipo de precio
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoad, activeConfig, invoiceSelected, setElement, serviceType])


  useEffect(() => {
    if (!initialLoad || !user || orderLoaded.current) return;

    const loadInitialData = async () => {
      orderLoaded.current = true;
      await loadOrder(`orders/find?filterWhere[status]==1&filterWhere[opened_by_id]==${user?.id}&included=products,invoiceproducts,delivery,client,invoiceAssigned,employee,invoiceproducts.attributes.workstation,attributes,table,invoiceproducts.options.option`, false);
      const currentOrder = ordersStore.getState().order;
      if (!currentOrder && serviceType == 3) {
        loadOrders(`orders?included=employee,client,invoiceproducts&filterWhere[status]==2&filterWhere[order_type]==3`, false);
      }
    };

    loadInitialData();
  }, [initialLoad, user, loadOrder, loadOrders, serviceType]);


/** Cargar Ordenes al realizar un evento de Pusher solo para los usuarios que no envia en evento */
  useEffect(() => {
    if (!pusherEventData) return;
    if (user && user.id == pusherEventData?.userId) return;
    if (serviceType == 2) {
       loadTables(`tables?included=tables`, true);
    }
    if (serviceType == 3) {
      loadOrders(`orders?included=employee,client,invoiceproducts&filterWhere[status]==2&filterWhere[order_type]==3`, false);
    }
   }, [loadOrders, pusherEventData, pusherRandom, user, loadTables, serviceType]);


   // verificar si exite algun producto con venta especial sin terminar el preoceso
   useEffect(() => {
      if (initialLoad && order) {
         if (getElement('lastOrderId') != order.id) { // verifica si hay cambio de orden
            setElement('lastOrderId', order.id);

            setElement('clientActive', 1)
            setElement('payMethod', 1);
            setElement("deliveryType", order?.delivery_type ?? 2)
         }

         if (order && order?.invoiceproducts && groupInvoiceProductsByCodSpecial(order).length > 0) {
            openModal('specialSales')
         }

         if (order.order_type != serviceType) {
            setElement('serviceType', order.order_type);
         }


         if (serviceType == 2 && selectedTable != order?.attributes?.restaurant_table_id) {
            setElement('selectedTable', order?.attributes?.restaurant_table_id);
         }

         if ((!clientOrder && order?.client) || (clientOrder && order?.client?.id != clientOrder?.id)) {
            setElement('clientOrder', order?.client);
         }

         // verifica si hay opciones activas para el producto
            const LastProduct = getLastElement(order?.invoiceproducts)
            const lastOption = getLastElement(LastProduct?.options, "status", 0)
            if (lastOption) {
               openModal('productOptions');
            }

      }
  }, [initialLoad, order, openModal, serviceType, setElement, selectedTable, clientOrder, getElement])


   useEffect(() => {
    if (!order && serviceType == 2 && selectedTable === undefined) {
       loadTables(`tables?included=tables`, true); 
    }

    if (!order && serviceType == 3) {
       loadOrders(`orders?included=employee,client,invoiceproducts&filterWhere[status]==2&filterWhere[order_type]==3`, false);
    }

    if (!order) {
         if (serviceType == 1) { // si es venta rapida se asigna para llevar
            setElement('deliveryType', 2);
         } else if (serviceType == 2) { // si es servicio a mesas se asigna comer aqui
            setElement('deliveryType', 1);
         } else {
            setElement('deliveryType', 3); // delivery
         }
    }

   }, [order, serviceType, selectedTable, loadOrders, loadTables, setElement]);

}
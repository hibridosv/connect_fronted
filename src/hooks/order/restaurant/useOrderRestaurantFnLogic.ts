'use client'
import { UpdateServiceInterface } from '@/services/Interfaces';
import { postForPrint } from '@/services/OtherServices';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import ordersRestaurantsStore from '@/stores/orders/ordersRestaurantsStore';
import ordersStore from '@/stores/orders/ordersStore';
import useToastMessageStore from '@/stores/toastMessageStore';
import useTempStorage from '@/stores/useTempStorage';

export function useOrderRestaurantFnLogic() {
  const { saveOrder, payOrder, updateOrder, deleteOrder, addOrder, deleteProduct, loadOrder, saveAs, payOrderSplit } = ordersRestaurantsStore();
  const { order, error, lastResponse } = ordersStore();
  const { activeConfig, system } = useConfigStore();
  const { getElement, clearElement } = useTempStorage();
  const {modals} = useModalStore();
  const payMethod = getElement('payMethod') ?? 1;
  const typeOfPrice = getElement('typeOfPrice') ?? 1;
  const clientActive = getElement('clientActive') ?? 1;
  const selectedTable = getElement('selectedTable') ?? null;
  const clientOrder = getElement('clientOrder');
  const specialSales = modals.specialSales ?? false;
  const { setError } = useToastMessageStore();
  const deliveryType: number = getElement('deliveryType'); // aqui, llevar, delivery
  const serviceType: number = getElement('serviceType'); // aqui, mesas, delivery
  const { setMessage} = useToastMessageStore();
  const isPrintLocal = activeConfig && activeConfig.includes("print-local");

const addNew = async (producId: any, quantity = 1) => {
    if (!producId){
        setError({ message: "No hay una cantidad para facturar "});
        return
    }
    let values = {
      product_id: producId,
      request_type: 1, // 1: id, 2: cod
      delivery_type: deliveryType, // 1: Aqui, 2: Llevar, 3: delivery
      delivery_client: clientOrder ? clientOrder?.id : null, // id del cliente delivery
      order_type: serviceType, // 1. rapida, 2. Mesas, 3. Delivery
      price_type: typeOfPrice, // tipo de precio del producto
      clients_quantity: 1, // Numero de clientes
      client_active: clientActive, // Cliente activo para asignar producto (numero de cliente)
      quantity,
      restaurant_table_id: selectedTable,
      special: specialSales,
    };
    return await addOrder(`orders/restaurant`, values);
          
}

/** GUardar la orden y manda comandas a imprimir si asi se necesita, no sale de la orden*/
  const save = async (id: string, withOrder: boolean = false) => {
      await saveOrder(`orders/restaurant/${id}/save`, { with_order: withOrder });
      if (!error && withOrder) {
        setMessage({message: "Imprimiendo pre cuenta"})
        if (isPrintLocal) {
          let orderToPrint = {...order, is_pre_account: true};
          await postForPrint(system?.local_url_print ?? 'http://127.0.0.1/impresiones/', 'POST', orderToPrint);
        }
      }
  }

  // Guarda la orden y sale de la pantalla
  const saveAndOut = async (id: string) => {
    await saveAs(`orders/${id}/save`, {});
  }

  /** Actualizar un campo de la orden */
  const update = async (id: string, values: UpdateServiceInterface) => {
      return await updateOrder(`orders/${id}/update`, values);
  }


    /** Agrega nuevo cliente a la orden */
  const addClient = async (id: string) => {
      await updateOrder(`orders/restaurant/${id}/add-client`, {});
  }

  /** cambia el cliente al producto al dicidir orden */
  const changeClient = async (id: string) => {
      await updateOrder(`orders/product/${id}/client`, { client: clientActive });
  }


  
    /** Agrega nombre a la orden */
  const addName = async (id: string, values: any) => {
      return await updateOrder(`orders/restaurant/${id}/name-table`, values);
  }

  
  /** las opciones de un producto */
  const option = async (id: string, values: any) => {
      await updateOrder(`orders/restaurant/${id}/option`, values, false);
  }

  /** Eliminar la orden */
  const cancel = async (id: string) => {
      await deleteOrder(`orders/${id}`);
  }


    /** Eliminar producto de la orden */
  const del = async (id: string, cod: string) => {
      await deleteProduct(`orders/restaurant/${id}/${cod}`);
  }

  /** Seleccionar una orden con id */
  const select = async (id: string) => {
    await loadOrder(`orders/${id}/select`, true);
  }

/// pagar orden
const pay = async (data: any) => {
    let values = {
      cash: data.cash || 0,
      payment_type: payMethod, // efectivo, tarjeta, transferencia, cheque, credito
      invoice_type_id: order?.invoice_type_id,
      client_active: clientActive, // Cliente activo para asignar producto
      client_number: null
    };
    const response = await payOrder(`orders/restaurant/${order.id}/pay`, values);
      if (response && isPrintLocal) {
        let orderToPrint = getElement("paymentSuccess");
        await postForPrint(system?.local_url_print ?? 'http://127.0.0.1/impresiones/', 'POST', orderToPrint);
      }
    clearElement('invoiceTypeSelected');
}


/// pagar orden separada
const paySplit = async (data: any) => {
    let values = {
      cash: data.cash || 0,
      payment_type: payMethod, // efectivo, tarjeta, transferencia, cheque, credito
      invoice_type_id: order?.invoice_type_id,
      client_active: clientActive, // Cliente activo para asignar producto
      client_number: clientActive
    };
    const response = await payOrderSplit(`orders/restaurant/${order.id}/pay`, values);
    if (response && isPrintLocal) {
        let orderToPrint = getElement("paymentSuccess");
        await postForPrint(system?.local_url_print ?? 'http://127.0.0.1/impresiones/', 'POST', orderToPrint);
    }
  }

  return { addNew, save, saveAndOut, update, changeClient, addClient, addName, cancel, del, option, select, pay, paySplit }

}
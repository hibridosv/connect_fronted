'use client'
import { UpdateServiceInterface } from '@/services/Interfaces';
import { postForPrint } from '@/services/OtherServices';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import ordersProductsStore from '@/stores/orders/ordersProductsStore';
import ordersStore from '@/stores/orders/ordersStore';
import useToastMessageStore from '@/stores/toastMessageStore';
import useTempStorage from '@/stores/useTempStorage';

export function useOrderFnLogic() {
  const { saveOrder, loadOrder, payOrder, updateOrder, saveAs, deleteOrder, addOrder, deleteProduct } = ordersProductsStore();
  const {  order } = ordersStore();
  const { getElement, clearElement } = useTempStorage();
  const {modals} = useModalStore();
  const paymentType = getElement('paymentType') ?? 1;
  const typeOfPrice = getElement('typeOfPrice') ?? 1;
  const specialSales = modals.specialSales ?? false;
  const { setError } = useToastMessageStore();
  const { activeConfig, system } = useConfigStore();
  const isPrintLocal = activeConfig && activeConfig.includes("print-local");

/// agrega una orden o un producto
const addNew = async (data: any) => {
    if (!data.cod){
      setError({ message: "Error en el código"});
      return
    }
    let values = {
      product_id: data.cod,
      order_id: order ? order.id : null,
      request_type: 2, // 1: id, 2: cod
      delivery_type: 1, // delivery, recoger en tienda, ecommerce
      order_type: 1, // venta, consignacion, ecommerce
      price_type: typeOfPrice, // tipo de precio del producto
      addOrSubtract: data.addOrSubtract ? data.addOrSubtract : 1, // 1 sumar 2 restar
      special: specialSales, // determina si es venta especial, debe activarse cuando se activa el modal
    };
    const success = await addOrder(`orders`, values);
    if (success) {
      clearElement('contactSearch');
      clearElement('setUser');
    }
}

/** GUardar la orden en la que se trabaja */
  const save = async (id: string) => {
      await saveOrder(`orders/${id}/save`, {});
  }
   
  /** Seleccionar una orden con id */
  const select = async (id: string) => {
    await loadOrder(`orders/${id}/select`);
  }

  /** Cobrar o terminar orden */
  const pay = async (data: any) => {
        let values = {
          payment_type: paymentType,
          cash: data.cash,
          invoice_type_id: order?.invoice_type_id,
        };
      const response = await payOrder(`orders/${order?.id}/pay`, values);
      if (response && isPrintLocal) {
          let orderToPrint = getElement("paymentSuccess");
          await postForPrint(system?.local_url_print ?? 'http://127.0.0.1/impresiones/', 'POST', orderToPrint);
      }
  }

  /** Eliminar la orden */
  const cancel = async (id: string) => {
      await deleteOrder(`orders/${id}`);
  }

  /** Actualizar un campo de la orden */
  const update = async (id: string, values: UpdateServiceInterface) => {
      return await updateOrder(`orders/${id}/update`, values);
  }

 /* Guardar como cotizacion */ 
  const quote = async (id: string) => {
    await saveAs(`tools/quotes/${id}`, {});
  }

 /* Guardar como nota de remision */ 
  const remissionNote = async (id: string, type: number) => {
    return await saveAs(`remissions/${id}/${type}`, {});
  }


  /** Eliminar producto de la orden */
  const del = async (id: string) => {
      await deleteProduct(`orders/product/${id}`);
  }


    /** Actualizar un campo de un producto */
  const updateProduct = async (id: string, values: UpdateServiceInterface) => {
      return await updateOrder(`orders/product/${id}`, values);
  }

  const updatePrice = async (id: string, values: any) => {
      return await updateOrder(`orders/product/${id}/price`, values);
  }


  const discount = async (id: string, values: any, discountType: number) => {
      if (discountType == 1) {
        return await updateOrder(`orders/product/discount`, values);
      } else {
        return await updateOrder(`orders/${id}/discount`, values);
      }
  }

  const tips = async (id: string, values: any) => {
      return await updateOrder(`orders/restaurant/${id}/tips`, values);
  }


  return { addNew, save, select, pay, cancel, update, quote, remissionNote, del, updateProduct, updatePrice, discount, tips }

}
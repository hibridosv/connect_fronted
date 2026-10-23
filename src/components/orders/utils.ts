import { getTotalPercentage } from "@/lib/utils";

export const sumarTotalesWithoutDiscount = (datos: any): number => {
  let totalSuma = 0;
  let totalDiscount = 0;

  datos?.forEach((elemento: any) => {
    totalSuma += elemento.total ?? 0;
    totalDiscount += elemento.discount ?? 0;
  });

  return totalDiscount + totalSuma;
}

export const sumarOptionsTotal = (datos: any): number => {
  let totalSuma = 0;

  datos?.forEach((elemento: any) => {
    elemento?.options?.forEach((option: any) => {
      totalSuma += option?.option?.price ?? 0;
    });
  });

  return totalSuma;
}

export const sumarDiscount = (datos: any): number => {
  let totalSuma = 0;

  datos?.forEach((elemento: any) => {
    totalSuma += elemento.discount ?? 0;
  });

  return totalSuma;
}

export const commissionTotal = (records: any): number => {
  let commission = 0;

  records?.forEach((element: any) => {
    commission += getTotalPercentage(element?.subtotal, element?.commission);
  });

  return commission;
}

export const sumarTotales = (datos: any): number => {
  let totalSuma = 0;

  datos?.forEach((elemento: any) => {
    totalSuma += elemento.total ?? 0;
  });

  return totalSuma;
}

export const sumarSubtotal = (datos: any): number => {
  let totalSuma = 0;

  datos?.forEach((elemento: any) => {
    totalSuma += elemento.subtotal ?? 0;
  });

  return totalSuma;
}

export const sumarCantidad = (datos: any): number => {
  let totalSuma = 0;

  datos?.forEach((elemento: any) => {
    totalSuma += elemento.quantity ?? 0;
  });

  return totalSuma;
}

export const sumarSalesTotal = (records: any): number => {
  const total = sumarTotales(records?.invoiceproducts);
  const subtotal = sumarSubtotal(records?.invoiceproducts);

  if (records?.client?.taxpayer_type == 2 && subtotal >= 100) { // gran contribuyente
    const retention = subtotal * 0.01;
    return (total - retention)
  }

  if (records?.invoice_assigned?.type == 4) { // sujeto excluido
    const retention = sumarTotalRetentionSujetoExcluido(records);
    return (total - retention)
  }
  return total;
}

export const sumarTotalRetentionRenta = (datos: any): number => {
  let totalSuma = 0;

  datos?.invoiceproducts?.forEach((elemento: any) => {
    if (elemento.operation_type == 1 && elemento.product_type == 2) {
      totalSuma += elemento.subtotal ?? 0;
    }
  });

  return totalSuma * 0.10;
}

export const sumarTotalRetentionSujetoExcluido = (datos: any): number => {
  let totalSuma = 0;

  datos?.invoiceproducts?.forEach((elemento: any) => {
    if (datos?.invoice_assigned?.type == 4) { // sujeto excluido
      if (elemento.operation_type == 1 && elemento.product_type == 2) {
        totalSuma += elemento.total ?? 0;
      }
    } else {
      totalSuma += elemento.total ?? 0;
    }
  });

  return totalSuma * 0.10;
}

function groupInvoiceProducts(products: any[], filterFn: (product: any) => boolean) {
  const grouped = {} as any;

  products.forEach((product: any) => {
    const { id, product_id, cod, quantity, subtotal, total } = product;
    const groupKey = product_id ?? `${cod}-${id}`;

    if (filterFn(product)) {
      if (!grouped[groupKey]) {
        grouped[groupKey] = { ...product };
      } else {
        grouped[groupKey].quantity += quantity;
        grouped[groupKey].subtotal += subtotal;
        grouped[groupKey].total += total;
      }
    }
  });

  const result = Object.values(grouped);
  result.sort((a: any, b: any) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  return result;
}

export function groupInvoiceProductsByCodSpecial(order: any) {
  return groupInvoiceProducts(
    order.invoiceproducts,
    (product: any) => product.special == 1 && product.group_by == null
  );
}

export function groupInvoiceProductsByCodAll(order: any) {
  const groupedProducts = groupInvoiceProducts(
    order.invoiceproducts,
    (product: any) => product.special == 0
  );

  const specialProducts = order.invoiceproducts.filter(
    (product: any) => product.special == 1 && product.group_by == null
  );

  order.invoiceproductsGroup = [...groupedProducts, ...specialProducts].sort(
    (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return order;
}

export const SHIPPING_COD = 9999999998; // linea de envio de delivery en restaurante

export function orderHasShipping(order: any): boolean {
  return order?.invoiceproducts?.some((product: any) => product.cod == SHIPPING_COD) ?? false;
}

export function isProductPendientToSend(product: any) {
  if (!product) return false;
  const sendPrint = product?.attributes?.send_print;
  const isValidPrintStatus = [1, 2, 3, 6].includes(sendPrint ?? -1); // 6: ya impreso y con opciones cambiadas
  return product.attributes && product.attributes.work_station_id && isValidPrintStatus;
}

// La orden tiene productos mandados a cocina (comanda o pantalla), actuales o ya eliminados
export function orderHasSentProducts(order: any) {
  if (!order) return false;
  if ((order.deletedproducts?.length ?? 0) > 0) return true;
  return (order.invoiceproducts ?? []).some((product: any) => isProductPendientToSend(product));
}

export function countSendPrintZero(order: any) {
  if (!order?.invoiceproducts) return 0;
  return order.invoiceproducts.filter(
    (product: any) => product.attributes?.work_station_id && [0, 6].includes(product.attributes?.send_print) // 6: opciones cambiadas, vuelve a la comanda
  ).length;
}


/// cuanta cuantos productos se han enviado a imprimir
export function countSendPrint(invoice: any) {
  if (!invoice?.invoiceproducts) return;

  let count = 0;

  invoice.invoiceproducts.forEach((product: any) => {
      const sendPrint = product?.attributes?.send_print;
      const isValidPrintStatus = [1, 2, 3, 6].includes(sendPrint ?? -1); // 6: ya impreso y con opciones cambiadas
      if (product.attributes && product.attributes.work_station_id && isValidPrintStatus) {
          count++;
      }
  });

  return count;
}



// agrupa los productos de restaurante por numero de cliente
export function filterInvoiceProductsByClientNumber(invoice: any, clientNumber: number) {
  // Filtrar los productos cuyo cliente coincida con el número pasado como parámetro
  if (!invoice?.invoiceproducts) return;
  const filteredProducts = invoice.invoiceproducts.filter(
      (product: any) => product.attributes.client === clientNumber
  );

  return {
      ...invoice,
      invoiceproducts: filteredProducts
  };
}


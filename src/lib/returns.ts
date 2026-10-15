import { DateTime } from "luxon";
import { getDateFromStringOrDate } from "./date-formats";

/**
 * Evento de Retorno (DTE 18): solo para Factura (2), Factura de Sujeto Excluido (4) y Factura de Exportación (11)
 * emitidas electrónicamente, dentro de 3 meses desde la emisión. billing revisa el caso de 2 años de algunas
 * actividades económicas y el resto de reglas del Ministerio de Hacienda.
 */
export const RETURN_DOCUMENT_TYPES = [2, 4, 11];
export const RETURN_MONTHS = 3;

export function activeReturns(order: any): any[] {
  return (order?.returns ?? []).filter((item: any) => item.status === 1);
}

export function isReturnAvailable(order: any): boolean {
  if (!order || order.status !== 3) return false;
  if (order.invoice_assigned?.is_electronic !== 1) return false;
  if (!RETURN_DOCUMENT_TYPES.includes(Number(order.invoice_assigned?.type))) return false;
  if (!order.charged_at) return false;
  const chargedAt = DateTime.fromJSDate(getDateFromStringOrDate(order.charged_at));
  if (!chargedAt.isValid) return false;
  return DateTime.now() <= chargedAt.plus({ months: RETURN_MONTHS }).endOf("day");
}

/** cantidad ya retornada de cada ticket_product en los retornos activos */
export function returnedQuantities(order: any): Record<string, number> {
  const returned: Record<string, number> = {};
  activeReturns(order).forEach((item: any) => {
    (item.products_afected ?? []).forEach((line: any) => {
      returned[line.ticket_product_id] = (returned[line.ticket_product_id] ?? 0) + Number(line.quantity);
    });
  });
  return returned;
}

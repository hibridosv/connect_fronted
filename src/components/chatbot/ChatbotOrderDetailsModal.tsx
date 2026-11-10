'use client';
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { formatDate } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { useEffect, useState } from "react";
import { Alert } from "../Alert/Alert";
import { Loader } from "../Loader";
import { deliveryLabel, INVOICE_TYPE, mapsUrl, orderStatus, PAYMENT_METHOD } from "./utils";

export interface ChatbotOrderDetailsModalI {
  isShow: boolean;
  order: any | null;
  checks: any[] | null;
  isLoading: boolean;
  sending: boolean;
  restaurant: boolean;
  onClose: () => void;
  onCharge: (id: string) => void;
  onCancel: (id: string, reason: string) => void;
  onReady: (id: string) => void;
}

export function ChatbotOrderDetailsModal({ isShow, order, checks, isLoading, sending, restaurant, onClose, onCharge, onCancel, onReady }: ChatbotOrderDetailsModalI) {
  const { system } = useConfigStore();
  const [canceling, setCanceling] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!isShow) { setCanceling(false); setReason(''); }
  }, [isShow]);

  const pending = order?.status === 1;
  const preparing = restaurant && order?.status === 2;
  const status = orderStatus(order?.status, restaurant);

  return (
    <Modal show={isShow} onClose={onClose} size="xl4" headerTitle={order ? `Pedido de WhatsApp #${order.order_number}` : 'Pedido de WhatsApp'} removeTitle={true}>
      <Modal.Body>
        {isLoading || !order ? (
          <div className="flex justify-center my-10"><Loader size="35" /></div>
        ) : (
          <div className="mx-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-base">
              <div>
                <div><span className="font-bold uppercase">Cliente:</span> {order.client_name ?? 'Sin nombre'}</div>
                <div><span className="font-bold uppercase">Teléfono:</span> +{order.phone}</div>
                <div><span className="font-bold uppercase">Entrega:</span> {deliveryLabel(order.delivery_type, restaurant)}</div>
                {order.address && <div><span className="font-bold uppercase">Dirección:</span> {order.address}</div>}
                {order.reference && <div><span className="font-bold uppercase">Referencia:</span> {order.reference}</div>}
                {order.latitude !== null && order.longitude !== null && (
                  <a className="text-primary underline" href={mapsUrl(order.latitude, order.longitude)} target="_blank" rel="noreferrer">📍 Ver ubicación</a>
                )}
              </div>
              <div>
                <div><span className="font-bold uppercase">Recibido:</span> {formatDate(order.created_at)}</div>
                <div><span className="font-bold uppercase">Estado:</span> <span className={`px-2 rounded ${status.style}`}>{status.label}</span></div>
                {order.invoice_type && <div><span className="font-bold uppercase">Pide:</span> {INVOICE_TYPE[order.invoice_type]}</div>}
                {order.payment_method && (
                  <div><span className="font-bold uppercase">Pago:</span> {PAYMENT_METHOD[order.payment_method]}{order.cash_amount ? `, paga con ${numberToMoney(order.cash_amount, system)}` : ''}</div>
                )}
                {order.comment && <div><span className="font-bold uppercase">Notas:</span> {order.comment}</div>}
                {order.cancel_reason && <div className="text-danger"><span className="font-bold uppercase">Cancelado:</span> {order.cancel_reason}</div>}
              </div>
            </div>

            <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                  <tr>
                    <th className="px-4 py-2 border-r border-bg-subtle">Código</th>
                    <th className="px-4 py-2 border-r border-bg-subtle">Producto</th>
                    <th className="px-4 py-2 border-r border-bg-subtle">Cant</th>
                    <th className="px-4 py-2 border-r border-bg-subtle">Precio</th>
                    <th className="px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-subtle/50">
                  {order.products?.map((line: any) => (
                    <tr key={line.id} className="odd:bg-bg-subtle/40 divide-x divide-bg-subtle">
                      <td className="px-4 py-2 text-primary">{line.cod}</td>
                      <td className="px-4 py-2">
                        {line.product}
                        {line.options?.length > 0 && (
                          <div className="text-xs text-text-muted">
                            {line.options.map((option: any) => `${option.option}: ${option.name}${option.price > 0 ? ` (+${numberToMoney(option.price, system)})` : ''}`).join(' · ')}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">{line.quantity}</td>
                      <td className="px-4 py-2 text-center">{numberToMoney(line.unit_price, system)}</td>
                      <td className="px-4 py-2 text-center">{numberToMoney(line.total, system)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {order.shipping_amount > 0 && (
                    <tr>
                      <th colSpan={4} className="py-1 px-4 text-right font-normal">Envío:</th>
                      <th className="py-1 px-4 font-normal">{numberToMoney(order.shipping_amount, system)}</th>
                    </tr>
                  )}
                  <tr>
                    <th colSpan={4} className="py-2 px-4 text-right">Total:</th>
                    <th className="py-2 px-4">{numberToMoney(order.total, system)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>

            {pending && checks && !restaurant && (
              <Alert type={checks.length === 0 ? 'success' : 'danger'}
                text={checks.length === 0
                  ? 'Todos los productos tienen existencias disponibles.'
                  : `Sin existencias suficientes: ${checks.map((check: any) => `${check.product_name} (pide ${check.requested_quantity}, hay ${check.available_quantity})`).join(', ')}`} />
            )}

            {pending && canceling && (
              <div>
                <label className="input-label">{restaurant ? 'Motivo de la cancelación' : 'Motivo de la cancelación (se le envía al cliente)'}</label>
                <input className="input w-full" maxLength={255} value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-4">
          {pending && !canceling && (
            <>
              <Button onClick={() => setCanceling(true)} preset={Preset.danger} text="Cancelar pedido" disabled={sending} />
              <Button onClick={() => onCharge(order.id)} preset={sending ? Preset.saving : Preset.save} text={restaurant ? 'Aceptar y enviar a cocina' : 'Convertir en venta'} disabled={sending} />
            </>
          )}
          {pending && canceling && (
            <Button onClick={() => onCancel(order.id, reason)} preset={sending ? Preset.saving : Preset.danger} text="Confirmar cancelación" disabled={sending} />
          )}
          {preparing && (
            <Button onClick={() => onReady(order.id)} preset={sending ? Preset.saving : Preset.save} text={order.delivery_type === 2 ? 'En camino' : 'Listo para recoger'} disabled={sending} />
          )}
          <Button onClick={onClose} preset={Preset.close} disabled={false} />
        </div>
      </Modal.Footer>
    </Modal>
  );
}

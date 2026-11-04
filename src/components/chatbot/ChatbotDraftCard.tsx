'use client';
import { ChatbotDraft, ChatbotOrderSummary } from "@/interfaces/chatbot";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import Link from "next/link";
import { DELIVERY_TYPE, INVOICE_TYPE, ORDER_STATUS } from "./utils";

export function ChatbotDraftCard({ draft, orders }: { draft: ChatbotDraft | null; orders: ChatbotOrderSummary[] }) {
  const { system } = useConfigStore();
  if (!draft && !orders.length) return null;

  return (
    <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-3 text-sm space-y-3">
      {draft && (
        <div>
          <div className="font-semibold uppercase text-text-base mb-1">Pedido en preparación</div>
          {draft.items.length ? (
            <ul className="divide-y divide-bg-subtle">
              {draft.items.map((item) => (
                <li key={item.product_id} className={`flex justify-between py-1 ${item.can_order ? '' : 'text-danger'}`}>
                  <span>{item.quantity} × {item.name}</span>
                  <span>{numberToMoney(item.total, system)}</span>
                </li>
              ))}
            </ul>
          ) : <div className="text-text-muted">Sin productos</div>}
          <div className="flex justify-between font-semibold mt-1"><span>Total</span><span>{numberToMoney(draft.total, system)}</span></div>
          <div className="text-text-muted mt-1">
            {draft.customer_name && <div>Cliente: {draft.customer_name}</div>}
            {draft.delivery_type && <div>Entrega: {DELIVERY_TYPE[draft.delivery_type]}{draft.address ? ` — ${draft.address}` : ''}{draft.has_location ? ' 📍' : ''}</div>}
            {draft.invoice_type && <div>Documento: {INVOICE_TYPE[draft.invoice_type]}</div>}
            {draft.missing.length > 0 && <div className="text-warning">Falta: {draft.missing.join(', ')}</div>}
          </div>
        </div>
      )}
      {orders.length > 0 && (
        <div>
          <div className="font-semibold uppercase text-text-base mb-1">Pedidos</div>
          <ul className="space-y-1">
            {orders.map((order) => (
              <li key={order.id} className="flex justify-between items-center gap-2">
                <Link href="/chatbot/orders" className="text-primary underline">#{order.order_number}</Link>
                <span className="text-text-muted">{formatDateAsDMY(order.created_at)}</span>
                <span>{numberToMoney(order.total, system)}</span>
                <span className={`px-2 rounded text-xs ${ORDER_STATUS[order.status]?.style}`}>{ORDER_STATUS[order.status]?.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

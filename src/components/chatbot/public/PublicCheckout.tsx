'use client';
import { CartItem, CheckoutData } from "@/hooks/chatbot/usePublicOrderLogic";
import { numberToMoney } from "@/lib/utils";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";

export interface PublicCheckoutI {
  cart: CartItem[];
  itemsTotal: number;
  shippingAmount: number;
  customerName: string | null;
  money: any;
  sending: boolean;
  error: string;
  acceptingOrders: boolean;
  onBack: () => void;
  onChangeQuantity: (key: string, delta: number) => void;
  onConfirm: (data: CheckoutData) => void;
}

export function PublicCheckout(props: PublicCheckoutI) {
  const { cart, itemsTotal, shippingAmount, customerName, money, sending, error, acceptingOrders, onBack, onChangeQuantity, onConfirm } = props;
  const [form, setForm] = useState<CheckoutData>({
    customer_name: customerName ?? '', delivery_type: 3, address: '', reference: '', latitude: null, longitude: null,
    payment_method: 1, cash_amount: '', notes: '',
  });
  const [locating, setLocating] = useState(false);
  const [localError, setLocalError] = useState('');

  const home = form.delivery_type === 2;
  const total = itemsTotal + (home ? shippingAmount : 0);

  const shareLocation = () => {
    if (!navigator.geolocation) return setLocalError('Tu teléfono no permite compartir la ubicación');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => { setForm({ ...form, latitude: position.coords.latitude, longitude: position.coords.longitude }); setLocating(false); setLocalError(''); },
      () => { setLocating(false); setLocalError('No se pudo obtener tu ubicación; escribe la dirección'); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const submit = () => {
    if (!form.customer_name.trim()) return setLocalError('Escribe tu nombre');
    if (home && !form.address.trim() && form.latitude === null) return setLocalError('Escribe la dirección de entrega o comparte tu ubicación');
    if (form.payment_method === 1 && form.cash_amount && Number(form.cash_amount) < total) return setLocalError('El efectivo no alcanza para el total');
    setLocalError('');
    onConfirm(form);
  };

  return (
    <div className="max-w-xl mx-auto pb-32">
      <div className="flex items-center gap-2 p-4">
        <IoArrowBack size={24} className="clickeable" onClick={onBack} />
        <h2 className="text-lg font-semibold">Tu pedido</h2>
      </div>

      <div className="mx-4 bg-bg-content rounded-xl border border-bg-subtle divide-y divide-bg-subtle">
        {cart.map((item) => (
          <div key={item.key} className="p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium">{item.name}</div>
              {item.options.length > 0 && <div className="text-xs text-text-muted">{item.options.map((o) => o.name).join(' · ')}</div>}
              <div className="text-sm">{numberToMoney((item.price + item.options.reduce((s, o) => s + o.price, 0)) * item.quantity, money)}</div>
            </div>
            <div className="flex items-center border border-bg-subtle rounded-lg">
              <button className="px-3 py-1 text-lg" onClick={() => onChangeQuantity(item.key, -1)}>−</button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button className="px-3 py-1 text-lg" onClick={() => onChangeQuantity(item.key, 1)}>+</button>
            </div>
          </div>
        ))}
        {cart.length === 0 && <div className="p-4 text-center text-text-muted">Tu pedido está vacío</div>}
      </div>

      <div className="mx-4 mt-4 space-y-3">
        <div>
          <label className="input-label">Tu nombre</label>
          <input className="input w-full" maxLength={100} value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[{ value: 3, label: 'Para llevar' }, { value: 2, label: 'A domicilio' }].map((option) => (
            <button key={option.value} onClick={() => setForm({ ...form, delivery_type: option.value })}
              className={`py-2 rounded-lg border ${form.delivery_type === option.value ? 'border-primary bg-primary text-text-inverted' : 'border-bg-subtle bg-bg-content'}`}>
              {option.label}
            </button>
          ))}
        </div>

        {home && (
          <div className="space-y-2">
            <input className="input w-full" maxLength={255} placeholder="Dirección de entrega" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <input className="input w-full" maxLength={255} placeholder="Referencia (color de casa, portón...)" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
            <button className="text-primary underline text-sm" onClick={shareLocation} disabled={locating}>
              {locating ? 'Obteniendo ubicación...' : form.latitude !== null ? '📍 Ubicación agregada (tocar para actualizar)' : '📍 Usar mi ubicación actual'}
            </button>
            {shippingAmount > 0 && <div className="text-sm text-text-muted">Envío: {numberToMoney(shippingAmount, money)}</div>}
          </div>
        )}

        <div>
          <label className="input-label">¿Cómo vas a pagar?</label>
          <select className="input-select w-full" value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: Number(e.target.value) })}>
            <option value={1}>Efectivo</option>
            <option value={2}>Tarjeta</option>
            <option value={3}>Transferencia</option>
          </select>
          {form.payment_method === 1 && (
            <input className="input w-full mt-2" type="number" min={0} inputMode="decimal" placeholder="¿Con cuánto vas a pagar? (opcional)"
              value={form.cash_amount} onChange={(e) => setForm({ ...form, cash_amount: e.target.value })} />
          )}
        </div>

        <div>
          <label className="input-label">Indicaciones (opcional)</label>
          <input className="input w-full" maxLength={255} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>

        {(localError || error) && <div className="text-danger text-sm">{localError || error}</div>}
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-bg-content border-t border-bg-subtle p-4">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between font-semibold mb-2"><span>Total</span><span>{numberToMoney(total, money)}</span></div>
          {acceptingOrders ? (
            <button disabled={sending || cart.length === 0} onClick={submit} className="w-full py-3 rounded-lg bg-primary text-text-inverted font-semibold disabled:opacity-50">
              {sending ? 'Enviando...' : 'Confirmar pedido'}
            </button>
          ) : (
            <div className="text-center text-danger text-sm">El negocio no está recibiendo pedidos en este momento</div>
          )}
        </div>
      </div>
    </div>
  );
}

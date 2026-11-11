'use client';
import { Badge } from "@/components/Badge";
import { CartItem, CheckoutData } from "@/hooks/chatbot/usePublicOrderLogic";
import { numberToMoney } from "@/lib/utils";
import { useState } from "react";
import { IoArrowBack, IoTrashOutline } from "react-icons/io5";

export interface PublicCheckoutI {
  cart: CartItem[];
  itemsTotal: number;
  shippingAmount: number;
  customerName: string | null;
  customerAddress: string | null;
  customerReference: string | null;
  images: Record<string, string | null>; // foto de cada platillo del menu, por id (el carrito guardado puede no traerla)
  money: any;
  sending: boolean;
  error: string;
  acceptingOrders: boolean;
  onBack: () => void;
  onChangeQuantity: (key: string, delta: number) => void;
  onConfirm: (data: CheckoutData) => void;
}

export function PublicCheckout(props: PublicCheckoutI) {
  const { cart, itemsTotal, shippingAmount, customerName, customerAddress, customerReference, images, money, sending, error, acceptingOrders, onBack, onChangeQuantity, onConfirm } = props;
  // a domicilio por defecto, con la ultima direccion que dio el cliente
  const [form, setForm] = useState<CheckoutData>({
    customer_name: customerName ?? '', delivery_type: 2, address: customerAddress ?? '', reference: customerReference ?? '', latitude: null, longitude: null,
    payment_method: 1, cash_amount: '', notes: '',
  });
  const [locating, setLocating] = useState(false);
  const [localError, setLocalError] = useState('');

  const home = form.delivery_type === 2;
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
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

      <div className="mx-4 bg-bg-content rounded-2xl border border-bg-subtle shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-bg-subtle/60 border-b border-bg-subtle">
          <span className="text-sm font-semibold text-text-base">Platillos</span>
          <span className="text-xs text-text-muted">{count} {count === 1 ? 'platillo' : 'platillos'}</span>
        </div>
        <div className="divide-y divide-bg-subtle">
          {cart.map((item, index) => {
            const unit = item.price + item.options.reduce((sum, option) => sum + option.price, 0);
            const image = images[item.product_id] ?? item.image_url;
            return (
              <div key={item.key} className="p-3 flex gap-3 animate-slide-up" style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}>
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt={item.name} className="h-16 w-16 rounded-xl object-cover bg-bg-subtle shrink-0" />
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-bg-subtle flex items-center justify-center text-2xl shrink-0">🍽️</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <span className="font-semibold text-text-base leading-tight">{item.name}</span>
                    <span className="font-bold text-text-base whitespace-nowrap">{numberToMoney(unit * item.quantity, money)}</span>
                  </div>
                  {item.options.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.options.map((option) => (
                        <Badge key={option.variant_id}>
                          {option.name}{option.price > 0 ? ` +${numberToMoney(option.price, money)}` : ''}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-text-muted">{numberToMoney(unit, money)} c/u</span>
                    <div className="flex items-center gap-1 rounded-full bg-bg-subtle/70 p-0.5">
                      <button aria-label="Quitar uno" onClick={() => onChangeQuantity(item.key, -1)}
                        className={`h-7 w-7 rounded-full flex items-center justify-center bg-bg-content shadow-sm active:scale-90 transition-transform ${item.quantity === 1 ? 'text-danger' : 'text-text-base'}`}>
                        {item.quantity === 1 ? <IoTrashOutline size={14} /> : '−'}
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button aria-label="Agregar uno" onClick={() => onChangeQuantity(item.key, 1)}
                        className="h-7 w-7 rounded-full flex items-center justify-center bg-primary text-text-inverted shadow-sm active:scale-90 transition-transform">+</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {cart.length === 0 && (
            <div className="p-6 text-center text-text-muted">
              <div className="text-3xl mb-1">🛒</div>
              Tu pedido está vacío
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="px-4 py-3 bg-bg-subtle/30 border-t border-bg-subtle space-y-1 text-sm">
            <div className="flex justify-between text-text-muted"><span>Subtotal</span><span>{numberToMoney(itemsTotal, money)}</span></div>
            {home && shippingAmount > 0 && <div className="flex justify-between text-text-muted"><span>Envío</span><span>{numberToMoney(shippingAmount, money)}</span></div>}
            <div className="flex justify-between font-bold text-text-base text-base pt-1"><span>Total</span><span>{numberToMoney(total, money)}</span></div>
          </div>
        )}
      </div>

      <div className="mx-4 mt-4 space-y-3">
        <div>
          <label className="input-label">Tu nombre</label>
          <input className="input w-full" maxLength={100} value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[{ value: 2, label: 'A domicilio', icon: '🛵' }, { value: 3, label: 'Para llevar', icon: '🥡' }].map((option) => (
            <button key={option.value} onClick={() => setForm({ ...form, delivery_type: option.value })}
              className={`py-2.5 rounded-xl border font-medium transition-all duration-200 ${form.delivery_type === option.value ? 'border-primary bg-primary text-text-inverted shadow-md' : 'border-bg-subtle bg-bg-content text-text-base'}`}>
              {option.icon} {option.label}
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
          </div>
        )}

        <div>
          <label className="input-label">¿Cómo vas a pagar?</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ value: 1, label: 'Efectivo', icon: '💵' }, { value: 2, label: 'Tarjeta', icon: '💳' }, { value: 3, label: 'Transferencia', icon: '🏦' }].map((option) => (
              <button key={option.value} onClick={() => setForm({ ...form, payment_method: option.value })}
                className={`py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${form.payment_method === option.value ? 'border-primary bg-primary/10 text-primary' : 'border-bg-subtle bg-bg-content text-text-base'}`}>
                <div>{option.icon}</div>{option.label}
              </button>
            ))}
          </div>
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
            <button disabled={sending || cart.length === 0} onClick={submit} className="w-full py-3 rounded-xl bg-primary text-text-inverted font-semibold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50">
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

'use client';
import { PublicCheckout } from "@/components/chatbot/public/PublicCheckout";
import { PublicOptionsModal } from "@/components/chatbot/public/PublicOptionsModal";
import { ChosenOption, PublicDish, usePublicOrderLogic } from "@/hooks/chatbot/usePublicOrderLogic";
import { numberToMoney } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

function Countdown({ expiresAt }: { expiresAt: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const seconds = Math.max(0, Math.floor((expiresAt - now) / 1000));
  return <span className={seconds < 60 ? 'text-danger' : ''}>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span>;
}

/**
 * Pantalla publica (sin sesion) donde el cliente del restaurante arma su pedido con el enlace que le mando el bot.
 */
export default function Page({ params }: { params: { token: string } }) {
  const { status, error, data, cart, itemsTotal, sending, orderNumber, expiresAt, addToCart, changeQuantity, confirm } = usePublicOrderLogic(params.token);
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<PublicDish | null>(null);
  const [checkout, setCheckout] = useState(false);
  // aviso visual al agregar: el platillo se marca, el boton del pedido salta y sale un aviso con el nombre
  const [added, setAdded] = useState<{ id: string; name: string; at: number } | null>(null);
  const addedTimer = useRef<any>(null);
  useEffect(() => () => clearTimeout(addedTimer.current), []);

  const money = data?.business?.country ? { country: data.business.country } : null;
  const categories = useMemo(() => Array.from(new Set((data?.menu ?? []).map((dish) => dish.category))), [data]);
  const activeCategory = category ?? categories[0] ?? null;
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const add = (dish: PublicDish, options: ChosenOption[], quantity = 1) => {
    addToCart(dish, options, quantity);
    setAdded({ id: dish.id, name: quantity > 1 ? `${quantity} × ${dish.name}` : dish.name, at: Date.now() });
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(null), 1800);
    try { navigator.vibrate?.(30); } catch (e) {}
  };

  const choose = (dish: PublicDish) => {
    if (dish.options.length) setSelected(dish);
    else add(dish, []);
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen text-text-muted">Cargando menú...</div>;
  }

  if (status !== 'ready' && status !== 'done') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gap-3">
        <div className="text-5xl">⌛</div>
        <div className="text-lg font-semibold">{status === 'expired' ? 'Este enlace ya no está disponible' : 'Algo salió mal'}</div>
        <div className="text-text-muted">{error}</div>
        {status === 'expired' && <div className="text-sm text-text-muted">Tu pedido quedó guardado en este teléfono: al abrir el enlace nuevo lo vas a encontrar.</div>}
      </div>
    );
  }

  if (status === 'done') {
    const phone = data?.business.whatsapp_phone;
    // el navegador solo deja cerrar pestañas abiertas por un script: si no se cierra, se abre el chat del negocio
    const backToWhatsapp = () => {
      window.close();
      if (phone) {
        setTimeout(() => {
          window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(`Ya hice mi pedido #${orderNumber}`)}`;
        }, 300);
      }
    };
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gap-3">
        <div className="text-5xl">✅</div>
        <div className="text-xl font-semibold">Pedido #{orderNumber} recibido</div>
        <div className="text-text-muted">Te mandamos la confirmación por WhatsApp y te avisaremos cuando esté en preparación y cuando esté listo.</div>
        {phone ? (
          <button onClick={backToWhatsapp} className="mt-3 w-full max-w-xs flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-semibold shadow-lg active:scale-[0.98] transition-transform">
            <FaWhatsapp size={20} /> Volver a WhatsApp
          </button>
        ) : (
          <div className="mt-2 px-4 py-2 rounded-lg bg-bg-subtle text-sm font-medium">Ya puedes cerrar esta página.</div>
        )}
      </div>
    );
  }

  if (checkout) {
    return (
      <PublicCheckout cart={cart} itemsTotal={itemsTotal} shippingAmount={data!.shipping_amount} customerName={data!.customer_name}
        money={money} sending={sending} error={error} acceptingOrders={data!.accepting_orders}
        onBack={() => setCheckout(false)} onChangeQuantity={changeQuantity} onConfirm={confirm} />
    );
  }

  return (
    <div className="max-w-xl mx-auto pb-28">
      <div className="sticky top-0 z-10 bg-bg-content border-b border-bg-subtle">
        <div className="flex items-center gap-3 px-4 py-3">
          {data?.business.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.business.logo_url} alt={data.business.name ?? 'Logo'} className="h-10 w-10 rounded-full object-cover" />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{data?.business.name}</div>
            <div className="text-xs text-text-muted">Tu enlace vence en <Countdown expiresAt={expiresAt} /> sin actividad</div>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-2 custom-scrollbar">
          {categories.map((name) => (
            <button key={name} onClick={() => setCategory(name)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap border ${activeCategory === name ? 'bg-primary text-text-inverted border-primary' : 'bg-bg-content border-bg-subtle'}`}>
              {name}
            </button>
          ))}
        </div>
      </div>

      {!data?.accepting_orders && (
        <div className="mx-4 mt-3 p-3 rounded-lg bg-warning/10 text-warning text-sm">El negocio no está recibiendo pedidos en este momento. Puedes ver el menú.</div>
      )}

      <div className="p-4 grid grid-cols-1 gap-3">
        {(data?.menu ?? []).filter((dish) => dish.category === activeCategory).map((dish) => (
          <button key={dish.id} onClick={() => choose(dish)}
            className={`flex gap-3 text-left rounded-xl border p-3 shadow-sm transition-all duration-300 active:scale-[0.98] ${added?.id === dish.id ? 'border-primary bg-primary/10 ring-2 ring-primary/40' : 'bg-bg-content border-bg-subtle'}`}>
            {dish.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dish.image_url} alt={dish.name} className="h-20 w-20 rounded-lg object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{dish.name}</div>
              {dish.description && <div className="text-sm text-text-muted line-clamp-2">{dish.description}</div>}
              <div className="mt-1 font-medium">{numberToMoney(dish.price, money)}</div>
            </div>
            <span className={`self-center flex items-center justify-center h-9 w-9 rounded-full text-xl shrink-0 transition-all duration-300 ${added?.id === dish.id ? 'bg-primary text-text-inverted scale-110' : 'text-primary'}`}>
              {added?.id === dish.id ? '✓' : '+'}
            </span>
          </button>
        ))}
        {data?.menu.length === 0 && <div className="text-center text-text-muted">El menú no tiene platillos disponibles por ahora.</div>}
      </div>

      {count > 0 && (
        <div className="fixed bottom-0 inset-x-0 p-4">
          <div className={`max-w-xl mx-auto mb-2 flex justify-center transition-all duration-300 ${added ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <span className="px-4 py-2 rounded-full bg-success text-text-inverted text-sm font-medium shadow-lg truncate max-w-full">
              ✓ {added?.name ?? ''} agregado
            </span>
          </div>
          <button key={added?.at ?? 0} onClick={() => setCheckout(true)}
            className={`max-w-xl mx-auto w-full flex justify-between py-3 px-4 rounded-xl bg-primary text-text-inverted font-semibold shadow-lg transition-transform duration-300 ${added ? 'animate-bump' : ''}`}>
            <span>Ver pedido ({count})</span>
            <span>{numberToMoney(itemsTotal, money)}</span>
          </button>
        </div>
      )}

      <PublicOptionsModal dish={selected} money={money} onClose={() => setSelected(null)} onAdd={add} />
    </div>
  );
}

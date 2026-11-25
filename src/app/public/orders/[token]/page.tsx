'use client';
import { PublicOrderCartBar } from "@/components/public/orders/PublicOrderCartBar";
import { PublicOrderCheckout } from "@/components/public/orders/PublicOrderCheckout";
import { PublicOrderDishCard } from "@/components/public/orders/PublicOrderDishCard";
import { PublicOrderDone } from "@/components/public/orders/PublicOrderDone";
import { PublicOrderHeader } from "@/components/public/orders/PublicOrderHeader";
import { PublicOrderOptionsModal } from "@/components/public/orders/PublicOrderOptionsModal";
import { PublicOrderUnavailable } from "@/components/public/orders/PublicOrderUnavailable";
import { usePublicOrderLogic } from "@/hooks/public/orders/usePublicOrderLogic";
import { usePublicOrderMenuLogic } from "@/hooks/public/orders/usePublicOrderMenuLogic";
import { useParams } from "next/navigation";

/**
 * Pantalla publica (sin sesion) donde el cliente del restaurante arma su pedido con el enlace que le mando el bot.
 */
export default function Page() {
  const params = useParams();
  const token = params?.token as string;
  const { status, error, data, cart, itemsTotal, sending, orderNumber, expiresAt, addToCart, changeQuantity, confirm } = usePublicOrderLogic(token);
  const { categories, activeCategory, dishes, count, added, selected, checkout, setCategory, setSelected, setCheckout, inCart, add, choose } = usePublicOrderMenuLogic(data, cart, addToCart);
  const money = data?.business?.country ? { country: data.business.country } : null;

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen text-text-muted">Cargando menú...</div>;
  }

  if (status !== 'ready' && status !== 'done') {
    return <PublicOrderUnavailable expired={status === 'expired'} error={error} />;
  }

  if (status === 'done') {
    return <PublicOrderDone orderNumber={orderNumber} phone={data?.business.whatsapp_phone} />;
  }

  if (checkout) {
    return (
      <PublicOrderCheckout cart={cart} itemsTotal={itemsTotal} shippingAmount={data!.shipping_amount} customerName={data!.customer_name}
        customerAddress={data!.customer_address} customerReference={data!.customer_reference}
        images={Object.fromEntries((data?.menu ?? []).map((dish) => [dish.id, dish.image_url]))}
        money={money} sending={sending} error={error} acceptingOrders={data!.accepting_orders}
        onBack={() => setCheckout(false)} onChangeQuantity={changeQuantity} onConfirm={confirm} />
    );
  }

  return (
    <div className="max-w-xl mx-auto pb-28">
      <PublicOrderHeader business={data?.business} expiresAt={expiresAt} categories={categories} activeCategory={activeCategory} onChangeCategory={setCategory} />

      {!data?.accepting_orders && (
        <div className="mx-4 mt-3 p-3 rounded-lg bg-warning/10 text-warning text-sm">El negocio no está recibiendo pedidos en este momento. Puedes ver el menú.</div>
      )}

      <div key={activeCategory ?? ''} className="p-4">
        {activeCategory && (
          <div className="flex items-baseline justify-between mb-3 animate-fade-in">
            <h2 className="text-lg font-bold text-text-base">{activeCategory}</h2>
            <span className="text-xs text-text-muted">{dishes.length} {dishes.length === 1 ? 'platillo' : 'platillos'}</span>
          </div>
        )}
        <div className="grid grid-cols-1 gap-3">
          {dishes.map((dish, index) => (
            <PublicOrderDishCard key={dish.id} dish={dish} index={index} quantity={inCart(dish.id)} justAdded={added?.id === dish.id} money={money} onChoose={choose} />
          ))}
        </div>
        {data?.menu.length === 0 && <div className="text-center text-text-muted py-10">El menú no tiene platillos disponibles por ahora.</div>}
      </div>

      {count > 0 && <PublicOrderCartBar count={count} total={itemsTotal} added={added} money={money} onOpen={() => setCheckout(true)} />}

      <PublicOrderOptionsModal dish={selected} money={money} onClose={() => setSelected(null)} onAdd={add} />
    </div>
  );
}

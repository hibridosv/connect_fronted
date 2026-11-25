'use client';
import { PublicDish } from "@/hooks/public/orders/usePublicOrderLogic";
import { numberToMoney } from "@/lib/utils";

export interface PublicOrderDishCardI {
  dish: PublicDish;
  index: number;
  quantity: number; // unidades de este platillo en el carrito
  justAdded: boolean;
  money: any;
  onChoose: (dish: PublicDish) => void;
}

/** Tarjeta de un platillo del menu: foto, descripcion, precio y boton para agregar */
export function PublicOrderDishCard({ dish, index, quantity, justAdded, money, onChoose }: PublicOrderDishCardI) {
  return (
    <button onClick={() => onChoose(dish)} style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
      className={`group relative flex gap-3 text-left rounded-2xl border p-2.5 shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.98] animate-slide-up ${justAdded ? 'border-primary bg-primary/10 ring-2 ring-primary/40' : 'bg-bg-content border-bg-subtle'}`}>
      <div className="relative shrink-0">
        {dish.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dish.image_url} alt={dish.name} className="h-24 w-24 rounded-xl object-cover bg-bg-subtle" />
        ) : (
          <div className="h-24 w-24 rounded-xl bg-bg-subtle flex items-center justify-center text-3xl">🍽️</div>
        )}
        {quantity > 0 && (
          <span className="absolute -top-1.5 -left-1.5 min-w-[1.5rem] h-6 px-1.5 rounded-full bg-primary text-text-inverted text-xs font-bold flex items-center justify-center shadow-md">
            {quantity}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col py-0.5">
        <div className="font-semibold text-text-base leading-tight">{dish.name}</div>
        {dish.description && <div className="text-xs text-text-muted mt-1 line-clamp-2 leading-snug">{dish.description}</div>}
        <div className="mt-auto pt-2 flex items-center gap-2">
          <span className="font-bold text-primary">{numberToMoney(dish.price, money)}</span>
          {dish.options.length > 0 && (
            <span className="text-xxs px-2 py-0.5 rounded-full bg-bg-subtle text-text-muted">Personalizable</span>
          )}
        </div>
      </div>
      <span className={`self-end flex items-center justify-center h-9 w-9 rounded-full text-xl font-semibold shrink-0 shadow-sm transition-all duration-300 ${justAdded ? 'bg-success text-text-inverted scale-110' : 'bg-primary text-text-inverted group-hover:scale-105'}`}>
        {justAdded ? '✓' : '+'}
      </span>
    </button>
  );
}

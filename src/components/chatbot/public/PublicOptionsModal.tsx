'use client';
import { ChosenOption, PublicDish } from "@/hooks/chatbot/usePublicOrderLogic";
import { numberToMoney } from "@/lib/utils";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

export interface PublicOptionsModalI {
  dish: PublicDish | null;
  money: any;
  onClose: () => void;
  onAdd: (dish: PublicDish, options: ChosenOption[], quantity: number) => void;
}

/** Como en la pantalla de cobro: se elige una variante de cada grupo de opciones del platillo */
export function PublicOptionsModal({ dish, money, onClose, onAdd }: PublicOptionsModalI) {
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => { setChosen({}); setQuantity(1); }, [dish?.id]);

  if (!dish) return null;

  const complete = dish.options.every((group) => chosen[group.assigment_id]);
  const options: ChosenOption[] = dish.options.map((group) => {
    const variant = group.variants.find((v) => v.id === chosen[group.assigment_id]);
    return variant ? { assigment_id: group.assigment_id, variant_id: variant.id, option: group.name, name: variant.name, price: variant.price } : null;
  }).filter(Boolean) as ChosenOption[];
  const total = (dish.price + options.reduce((s, o) => s + o.price, 0)) * quantity;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-bg-content w-full sm:max-w-md max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-4 border-b border-bg-subtle">
          <div>
            <div className="font-semibold text-lg">{dish.name}</div>
            {dish.description && <div className="text-sm text-text-muted">{dish.description}</div>}
          </div>
          <IoClose size={24} className="clickeable shrink-0" onClick={onClose} />
        </div>
        <div className="overflow-y-auto p-4 space-y-4">
          {dish.options.map((group, index) => (
            <div key={group.assigment_id}>
              <div className="font-semibold mb-2">{group.name} {dish.options.filter((g) => g.name === group.name).length > 1 ? index + 1 : ''} <span className="text-xs text-danger">(elige una)</span></div>
              <div className="space-y-1">
                {group.variants.map((variant) => (
                  <label key={variant.id} className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border clickeable ${chosen[group.assigment_id] === variant.id ? 'border-primary bg-primary/5' : 'border-bg-subtle'}`}>
                    <span className="flex items-center gap-2">
                      <input type="radio" name={group.assigment_id} checked={chosen[group.assigment_id] === variant.id}
                        onChange={() => setChosen({ ...chosen, [group.assigment_id]: variant.id })} />
                      {variant.name}
                    </span>
                    {variant.price > 0 && <span className="text-sm text-text-muted">+{numberToMoney(variant.price, money)}</span>}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-bg-subtle flex items-center gap-3">
          <div className="flex items-center border border-bg-subtle rounded-lg">
            <button className="px-3 py-2 text-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <span className="w-8 text-center">{quantity}</span>
            <button className="px-3 py-2 text-lg" onClick={() => setQuantity(Math.min(50, quantity + 1))}>+</button>
          </div>
          <button disabled={!complete} onClick={() => { onAdd(dish, options, quantity); onClose(); }}
            className="flex-1 py-3 rounded-lg bg-primary text-text-inverted font-semibold disabled:opacity-50">
            {complete ? `Agregar ${numberToMoney(total, money)}` : 'Elige las opciones'}
          </button>
        </div>
      </div>
    </div>
  );
}

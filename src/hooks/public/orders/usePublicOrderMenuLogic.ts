'use client'
import { useEffect, useMemo, useRef, useState } from 'react';
import { CartItem, ChosenOption, PublicDish, PublicOrderData } from './usePublicOrderLogic';

/**
 * Estado de la pantalla publica de pedido: categoria activa, platillo que abre el modal de opciones y aviso
 * visual al agregar (el platillo se marca, el boton del pedido salta y sale un aviso con el nombre).
 */
export function usePublicOrderMenuLogic(
  data: PublicOrderData | null,
  cart: CartItem[],
  addToCart: (dish: PublicDish, options: ChosenOption[], quantity?: number) => void,
) {
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<PublicDish | null>(null);
  const [checkout, setCheckout] = useState(false);
  const [added, setAdded] = useState<{ id: string; name: string; at: number } | null>(null);
  const addedTimer = useRef<any>(null);
  useEffect(() => () => clearTimeout(addedTimer.current), []);

  const categories = useMemo(() => Array.from(new Set((data?.menu ?? []).map((dish) => dish.category))), [data]);
  // abre en la categoria principal del restaurante; si no tiene platillos en WhatsApp, en la primera
  const mainCategory = data?.main_category && categories.includes(data.main_category) ? data.main_category : categories[0] ?? null;
  const activeCategory = category ?? mainCategory;
  const dishes = (data?.menu ?? []).filter((dish) => dish.category === activeCategory);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const inCart = (id: string) => cart.filter((item) => item.product_id === id).reduce((sum, item) => sum + item.quantity, 0);

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

  return { categories, activeCategory, dishes, count, added, selected, checkout, setCategory, setSelected, setCheckout, inCart, add, choose };
}

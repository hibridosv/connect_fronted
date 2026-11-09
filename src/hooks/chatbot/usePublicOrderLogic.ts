'use client'
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface PublicVariant { id: string; name: string; price: number; image_url: string | null }
export interface PublicOptionGroup { assigment_id: string; option_id: string; name: string; variants: PublicVariant[] }
export interface PublicDish { id: string; name: string; description: string | null; category: string; price: number; image_url: string | null; options: PublicOptionGroup[] }
export interface ChosenOption { assigment_id: string; variant_id: string; option: string; name: string; price: number }
export interface CartItem { key: string; product_id: string; name: string; price: number; quantity: number; options: ChosenOption[]; image_url?: string | null }
export interface PublicOrderData {
  business: { name: string | null; logo_url: string | null; country: string | null; whatsapp_phone: string | null };
  accepting_orders: boolean;
  shipping_amount: number;
  customer_name: string | null;
  customer_address: string | null; // la del ultimo pedido a domicilio o la del cliente registrado
  customer_reference: string | null;
  seconds_left: number;
  menu: PublicDish[];
  main_category: string | null; // categoria principal del restaurante: la que abre la pantalla
}
export interface CheckoutData {
  customer_name: string;
  delivery_type: number; // 2 a domicilio, 3 para llevar
  address: string;
  reference: string;
  latitude: number | null;
  longitude: number | null;
  payment_method: number; // 1 efectivo, 2 tarjeta, 3 transferencia
  cash_amount: string;
  notes: string;
}

type Status = 'loading' | 'ready' | 'expired' | 'error' | 'done';

const message = (error: any, fallback: string) => error?.response?.data?.message || fallback;

/**
 * Pantalla publica de pedido del chatbot de restaurante. No usa la sesion de pulse: billing dice a que connect
 * pertenece el token y desde ahi se habla directo con connect. El carrito vive en localStorage (por negocio, no por
 * token) para recuperarlo si el enlace vence y el cliente pide otro.
 */
export function usePublicOrderLogic(token: string) {
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState('');
  const [data, setData] = useState<PublicOrderData | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sending, setSending] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const baseUrl = useRef<string>('');
  const cartKey = useRef<string>('');
  const touchTimer = useRef<any>(null);

  const api = useCallback(() => axios.create({ baseURL: `${baseUrl.current}/api/v2/public/orders`, headers: { Accept: 'application/json' } }), []);

  const handleError = useCallback((err: any, fallback: string) => {
    if (err?.response?.status === 410) {
      setStatus('expired');
      setError(message(err, 'El enlace venció. Escríbenos por WhatsApp para recibir uno nuevo'));
      return;
    }
    setError(message(err, fallback));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const route = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}order-links/${token}`);
        baseUrl.current = route.data.data.url;
        cartKey.current = `chatbot-cart:${baseUrl.current}`;
        try {
          const saved = localStorage.getItem(cartKey.current);
          if (saved) setCart(JSON.parse(saved));
        } catch (e) {}
        const response = await api().get(`/${token}`);
        setData(response.data.data);
        setExpiresAt(Date.now() + response.data.data.seconds_left * 1000);
        setStatus('ready');
      } catch (err: any) {
        if (err?.response?.status === 404 || err?.response?.status === 410) {
          setStatus('expired');
          setError(message(err, 'El enlace venció. Escríbenos por WhatsApp para recibir uno nuevo'));
        } else {
          setStatus('error');
          setError('No pudimos cargar el menú. Revisa tu conexión e intenta de nuevo');
        }
      }
    };
    load();
  }, [token, api]);

  // cada cambio del carrito renueva el enlace (una llamada ligera, sin mandar el carrito)
  const saveCart = (next: CartItem[]) => {
    setCart(next);
    try { localStorage.setItem(cartKey.current, JSON.stringify(next)); } catch (e) {}
    clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(async () => {
      try {
        const response = await api().put(`/${token}/touch`);
        setExpiresAt(Date.now() + response.data.data.seconds_left * 1000);
      } catch (err) {
        handleError(err, '');
      }
    }, 800);
  };

  const addToCart = (dish: PublicDish, options: ChosenOption[], quantity = 1) => {
    const key = `${dish.id}|${options.map((o) => o.variant_id).join(',')}`;
    const existing = cart.find((item) => item.key === key);
    saveCart(existing
      ? cart.map((item) => item.key === key ? { ...item, quantity: item.quantity + quantity } : item)
      : [...cart, { key, product_id: dish.id, name: dish.name, price: dish.price, quantity, options, image_url: dish.image_url }]);
  };

  const changeQuantity = (key: string, delta: number) => {
    saveCart(cart.map((item) => item.key === key ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  };

  // si un platillo dejo de estar en el menu (carrito recuperado de otro enlace) no se manda
  const validCart = cart.filter((item) => data?.menu.some((dish) => dish.id === item.product_id));
  const itemsTotal = validCart.reduce((sum, item) => sum + (item.price + item.options.reduce((s, o) => s + o.price, 0)) * item.quantity, 0);

  const confirm = async (checkout: CheckoutData) => {
    setSending(true);
    setError('');
    try {
      const response = await api().post(`/${token}/confirm`, {
        items: validCart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          options: item.options.map((o) => ({ assigment_id: o.assigment_id, variant_id: o.variant_id })),
        })),
        customer_name: checkout.customer_name,
        delivery_type: checkout.delivery_type,
        address: checkout.delivery_type === 2 ? checkout.address || null : null,
        reference: checkout.delivery_type === 2 ? checkout.reference || null : null,
        latitude: checkout.delivery_type === 2 ? checkout.latitude : null,
        longitude: checkout.delivery_type === 2 ? checkout.longitude : null,
        payment_method: checkout.payment_method,
        cash_amount: checkout.payment_method === 1 && checkout.cash_amount ? Number(checkout.cash_amount) : null,
        notes: checkout.notes || null,
      });
      setOrderNumber(response.data.data.order_number);
      setStatus('done');
      try { localStorage.removeItem(cartKey.current); } catch (e) {}
      setCart([]);
    } catch (err: any) {
      handleError(err, 'No se pudo enviar el pedido, intenta de nuevo');
    } finally {
      setSending(false);
    }
  };

  return { status, error, data, cart: validCart, itemsTotal, sending, orderNumber, expiresAt, addToCart, changeQuantity, confirm };
}

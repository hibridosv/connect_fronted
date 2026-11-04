const STATUS_STYLE: Record<number, string> = {
  0: 'bg-danger/10 text-danger',
  1: 'bg-warning/10 text-warning',
  2: 'bg-info/10 text-info',
  3: 'bg-info/10 text-info',
  4: 'bg-success/10 text-success',
};

const STATUS_LABEL: Record<number, string> = { 0: 'Cancelado', 1: 'Pendiente', 2: 'En venta', 3: 'Listo', 4: 'Cobrado' };
const RESTAURANT_STATUS_LABEL: Record<number, string> = { ...STATUS_LABEL, 2: 'En preparación', 3: 'Listo / en camino' };

export const orderStatus = (status: number, restaurant = false) => ({
  label: (restaurant ? RESTAURANT_STATUS_LABEL : STATUS_LABEL)[status] ?? '',
  style: STATUS_STYLE[status] ?? '',
});

// mismos valores en los dos bots: 2 a domicilio, 3 retira en tienda / para llevar
export const deliveryLabel = (type: number | null, restaurant = false): string => {
  if (type === 2) return 'A domicilio';
  if (type === 3) return restaurant ? 'Para llevar' : 'Retira en tienda';
  return '';
};

export const INVOICE_TYPE: Record<number, string> = {
  1: 'Ticket',
  2: 'Factura',
  3: 'Crédito fiscal',
};

export const PAYMENT_METHOD: Record<number, string> = {
  1: 'Efectivo',
  2: 'Tarjeta',
  3: 'Transferencia',
};

export const ORIGIN_LABEL: Record<number, string> = {
  1: 'Cliente',
  2: 'Bot',
  3: 'Agente',
  4: 'Aviso automático',
};

export const lastMessagePreview = (message: { type: number; body: string | null } | null): string => {
  if (!message) return '';
  if (message.body) return message.body;
  return ({ 2: '🎤 Nota de voz', 3: '📷 Imagen', 4: '📄 Documento', 5: '📍 Ubicación' } as Record<number, string>)[message.type] ?? '';
};

export const mapsUrl = (latitude: number, longitude: number) => `https://www.google.com/maps?q=${latitude},${longitude}`;

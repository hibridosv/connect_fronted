export const ORDER_STATUS: Record<number, { label: string; style: string }> = {
  0: { label: 'Cancelado', style: 'bg-danger/10 text-danger' },
  1: { label: 'Pendiente', style: 'bg-warning/10 text-warning' },
  2: { label: 'En venta', style: 'bg-info/10 text-info' },
  3: { label: 'Listo', style: 'bg-info/10 text-info' },
  4: { label: 'Cobrado', style: 'bg-success/10 text-success' },
};

export const DELIVERY_TYPE: Record<number, string> = {
  2: 'Domicilio',
  3: 'Retira en tienda',
};

export const INVOICE_TYPE: Record<number, string> = {
  1: 'Ticket',
  2: 'Factura',
  3: 'Crédito fiscal',
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

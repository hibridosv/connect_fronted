export interface ChatbotUser {
  id: string;
  name: string;
}

export interface ChatbotConversation {
  id: string;
  phone: string;
  name: string;
  contact_id: string | null;
  bot_enabled: boolean;
  taken_over: boolean;
  taken_over_by: ChatbotUser | null;
  handoff_expires_at: string | null;
  window_open: boolean;
  last_inbound_at: string | null;
  last_message_at: string | null;
  last_message: { origin: number; type: number; body: string | null; created_at: string } | null;
  unread_count: number;
}

export interface ChatbotMessage {
  id: string;
  origin: number; // 1 cliente, 2 bot, 3 agente, 4 aviso
  type: number; // 1 texto, 2 audio, 3 imagen, 4 documento, 5 ubicacion
  body: string | null;
  media_url: string | null;
  media_mime: string | null;
  media_filename: string | null;
  latitude: number | null;
  longitude: number | null;
  sender: ChatbotUser | null;
  created_at: string;
}

export interface ChatbotDraft {
  id: string;
  items: { product_id: string; name: string; quantity: number; unit_price: number; total: number; can_order: boolean }[];
  total: number;
  customer_name: string | null;
  delivery_type: number | null;
  address: string | null;
  has_location: boolean;
  invoice_type?: number | null;
  notes: string | null;
  missing: string[];
  // restaurante, pedido armado por chat
  shipping?: number;
  reference?: string | null;
  payment?: string | null; // efectivo, tarjeta o transferencia
  cash_amount?: number | null;
}

export interface ChatbotOrderSummary {
  id: string;
  order_number: number;
  status: number;
  total: number;
  delivery_type: number;
  created_at: string;
}

export interface ChatbotThread {
  conversation: ChatbotConversation;
  draft: ChatbotDraft | null;
  orders: ChatbotOrderSummary[];
  messages: ChatbotMessage[];
  next_cursor: string | null;
}

export interface ChatbotBusiness {
  name: string | null;
  address: string | null;
  phone: string | null;
}

export interface ChatbotSettings {
  enabled: boolean;
  is_restaurant: boolean;
  business: ChatbotBusiness; // de data_systems (Configuraciones > Principal), el bot los usa sin que se repitan
  schedule: string | null;
  delivery_info: string | null;
  payment_info: string | null;
  faq: string | null;
  business_info: string | null; // otros datos
  tone: number; // 1 cercano (tutea), 2 formal (usted)
  global_bot_enabled: boolean;
  accepting_orders: boolean;
  orders_to_kitchen: number; // 1 requiere aceptacion, 2 directo a cocina
  limit_reached: boolean;
  whatsapp_connected: boolean;
}

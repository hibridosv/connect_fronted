'use client';
import { Alert } from "@/components/Alert/Alert";
import { ChatbotOrderDetailsModal } from "@/components/chatbot/ChatbotOrderDetailsModal";
import { ChatbotOrdersTable } from "@/components/chatbot/ChatbotOrdersTable";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/Search";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useChatbotOrdersLogic } from "@/hooks/chatbot/useChatbotOrdersLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import useModalStore from "@/stores/modalStorage";
import { useState } from "react";

const STATUS_FILTERS = [
  { value: '1', label: 'Pendientes' },
  { value: '2', label: 'En venta', restaurantLabel: 'En preparación' },
  { value: '3', label: 'Listos', onlyRestaurant: true },
  { value: '4', label: 'Cobrados' },
  { value: '0', label: 'Cancelados' },
  { value: '', label: 'Todos' },
];

export default function Page() {
  const { currentPage, handlePageNumber } = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["client_name", "phone", "order_number"], 500);
  const [status, setStatus] = useState('1');
  const { modals } = useModalStore();
  const { orders, order, checks, loading, loadingOrder, sending, disabled, restaurant, showOrder, closeOrder, charge, cancel, ready } = useChatbotOrdersLogic(currentPage, searchTerm, status);

  if (disabled) {
    return (
      <div className="p-4">
        <ViewTitle text="PEDIDOS DE WHATSAPP" />
        <Alert type="info" text="El chatbot de WhatsApp para clientes no está activo. Actívalo en Configuraciones > Principal (Activar el chatbot de WhatsApp para clientes)." />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="PEDIDOS DE WHATSAPP" />
        <div className="p-4">
          <ChatbotOrdersTable records={orders?.data ?? []} isLoading={loading} onShow={showOrder} />
          <Pagination records={orders} handlePageNumber={handlePageNumber} />
        </div>
      </div>
      <div className="md:col-span-3">
        <ViewTitle text="FILTROS" />
        <div className="mt-2 p-2 space-y-3">
          <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar por cliente, teléfono o número" animating={loading} />
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.filter((filter) => restaurant || !filter.onlyRestaurant).map((filter) => (
              <button key={filter.value}
                className={`px-3 py-1 rounded-full text-sm border border-bg-subtle ${status === filter.value ? 'bg-primary text-text-inverted' : 'bg-bg-content text-text-base'}`}
                onClick={() => setStatus(filter.value)}>
                {restaurant && filter.restaurantLabel ? filter.restaurantLabel : filter.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-text-muted">
            {restaurant
              ? 'Los pedidos llegan de la pantalla de pedido que el bot le manda al cliente. Al aceptarlo se crea la orden de delivery y se mandan las comandas a cocina; se cobra como cualquier orden de delivery.'
              : 'Los pedidos llegan del chatbot de WhatsApp. Al convertir uno en venta se abre como orden en ventas, igual que una cotización; el cobro y el documento siguen el flujo normal.'}
          </p>
        </div>
      </div>
      <ChatbotOrderDetailsModal
        isShow={!!modals.chatbotOrder}
        order={order}
        checks={checks}
        isLoading={loadingOrder}
        sending={sending}
        restaurant={restaurant}
        onClose={closeOrder}
        onCharge={charge}
        onCancel={cancel}
        onReady={ready}
      />
      <ToasterMessage />
    </div>
  );
}

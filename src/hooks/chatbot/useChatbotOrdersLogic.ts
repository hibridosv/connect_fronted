'use client'
import useReverb from '@/hooks/useReverb';
import chatbotOrdersStore from '@/stores/chatbot/chatbotOrdersStore';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import { isRestaurant } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

export function useChatbotOrdersLogic(currentPage: string, searchTerm: string, status: string) {
  const { tenant } = useConfigStore();
  const { orders, order, checks, loading, loadingOrder, sending, disabled, loadOrders, loadOrder, chargeOrder, cancelOrder, readyOrder, clearOrder } = chatbotOrdersStore();
  const restaurant = isRestaurant(tenant?.system);
  const { openModal, closeModal } = useModalStore();
  const router = useRouter();
  const lastQuery = useRef<string | null>(null);

  const { random } = useReverb(`${tenant?.id}-channel-chatbot`, 'ChatbotEvent', !!tenant?.id);

  const refresh = useCallback((page: string) => {
    const statusFilter = status !== '' ? `&filterWhere[status]==${status}` : '';
    loadOrders(`chatbot/orders?sort=-created_at&perPage=15${page}${statusFilter}${searchTerm}`);
  }, [loadOrders, status, searchTerm]);

  useEffect(() => {
    const query = `${status}|${searchTerm}`;
    // busqueda o filtro nuevo: vuelve a la pagina 1
    const page = query !== lastQuery.current ? '&page=1' : currentPage;
    lastQuery.current = query;
    refresh(page);
  }, [refresh, currentPage, status, searchTerm]);

  useEffect(() => {
    if (random) refresh(currentPage);
  }, [random]); // eslint-disable-line react-hooks/exhaustive-deps

  const showOrder = (id: string) => {
    loadOrder(id);
    openModal('chatbotOrder');
  };

  const closeOrder = () => {
    closeModal('chatbotOrder');
    clearOrder();
  };

  // productos: se abre como orden en ventas; restaurante: queda en las ordenes de delivery y va a cocina
  const charge = async (id: string) => {
    if (await chargeOrder(id)) {
      closeOrder();
      if (restaurant) refresh(currentPage);
      else router.push('/orders');
    }
  };

  const ready = async (id: string) => {
    if (await readyOrder(id)) {
      closeOrder();
      refresh(currentPage);
    }
  };

  const cancel = async (id: string, reason: string) => {
    if (await cancelOrder(id, reason)) {
      closeOrder();
      refresh(currentPage);
    }
  };

  return { orders, order, checks, loading, loadingOrder, sending, disabled, restaurant, showOrder, closeOrder, charge, cancel, ready };
}

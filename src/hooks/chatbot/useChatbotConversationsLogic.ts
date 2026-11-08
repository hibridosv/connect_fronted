'use client'
import useReverb from '@/hooks/useReverb';
import chatbotConversationsStore from '@/stores/chatbot/chatbotConversationsStore';
import useConfigStore from '@/stores/configStore';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export function useChatbotConversationsLogic() {
  const { tenant } = useConfigStore();
  const { conversations, thread, loading, loadingThread, sending, disabled, loadConversations, loadThread, loadOlder, setHandoff, reply, clearThread } = chatbotConversationsStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [onlyTakenOver, setOnlyTakenOver] = useState(false);
  const [debouncedSearch] = useDebounce(search, 400);

  const { data: event, random } = useReverb(`${tenant?.id}-channel-chatbot`, 'ChatbotEvent', !!tenant?.id);

  const listUrl = `chatbot/conversations?perPage=50${debouncedSearch.length >= 3 ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}${onlyTakenOver ? '&taken_over=1' : ''}`;

  const refreshList = useCallback(() => loadConversations(listUrl), [loadConversations, listUrl]);

  useEffect(() => { refreshList(); }, [refreshList]);

  useEffect(() => {
    clearThread();
    if (selectedId) loadThread(selectedId);
  }, [selectedId, loadThread, clearThread]);

  // el evento no trae datos: se vuelve a pedir la lista y, si es del hilo abierto, el hilo.
  // La lista no muestra pedidos: un evento de pedido solo recarga el hilo que tiene ese pedido
  useEffect(() => {
    if (!random) return;
    if (event?.kind !== 'order') refreshList();
    if (!selectedId) return;
    const threadOrder = event?.kind === 'order' && thread?.orders?.some((order) => order.id === event?.id);
    if (event?.id === selectedId || event?.kind === 'settings' || threadOrder) loadThread(selectedId, true);
  }, [random]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleHandoff = async (take: boolean) => {
    if (!selectedId) return;
    if (await setHandoff(selectedId, take)) {
      loadThread(selectedId, true);
      refreshList();
    }
  };

  const sendReply = async (body: string, file: File | null) => {
    if (!selectedId) return false;
    const data = new FormData();
    if (body.trim()) data.append('body', body.trim());
    if (file) data.append('file', file);
    const ok = await reply(selectedId, data);
    if (ok) loadThread(selectedId, true);
    return ok;
  };

  return {
    conversations, thread, loading, loadingThread, sending, disabled,
    selectedId, setSelectedId, search, setSearch, onlyTakenOver, setOnlyTakenOver,
    toggleHandoff, sendReply, loadOlder,
  };
}

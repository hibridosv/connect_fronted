'use client'
import useReverb from '@/hooks/useReverb';
import chatbotProfileStore from '@/stores/chatbot/chatbotProfileStore';
import useConfigStore from '@/stores/configStore';
import { useEffect } from 'react';

/** Perfil del negocio con IA: se vuelve a pedir cuando connect avisa que la IA termino (evento settings) */
export function useChatbotProfileLogic() {
  const { tenant } = useConfigStore();
  const store = chatbotProfileStore();
  const { loadProfile } = store;
  const { data: event, random } = useReverb(`${tenant?.id}-channel-chatbot`, 'ChatbotEvent', !!tenant?.id);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  useEffect(() => {
    if (random && event?.kind === 'settings') loadProfile();
  }, [random]); // eslint-disable-line react-hooks/exhaustive-deps

  return store;
}

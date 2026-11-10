import { ChatbotThread } from '@/interfaces/chatbot';
import { createService, deleteService, getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface ChatbotConversationsStoreI {
  conversations: any | null;
  thread: ChatbotThread | null;
  loading: boolean;
  loadingThread: boolean;
  sending: boolean;
  disabled: boolean;
  loadConversations: (url: string) => Promise<void>;
  loadThread: (id: string, silent?: boolean) => Promise<void>;
  loadOlder: () => Promise<void>;
  setHandoff: (id: string, take: boolean) => Promise<boolean>;
  reply: (id: string, data: FormData) => Promise<boolean>;
  clearThread: () => void;
}

const chatbotConversationsStore = create<ChatbotConversationsStoreI>((set, get) => ({
  conversations: null,
  thread: null,
  loading: false,
  loadingThread: false,
  sending: false,
  disabled: false,

  loadConversations: async (url: string) => {
    set({ loading: true });
    try {
      const response = await getServices(url);
      set({ conversations: response.data.data, disabled: false });
    } catch (error: any) {
      // 403 = chatbot apagado o sin permiso (sin conversaciones llega 200 con type empty)
      if (error?.response?.status === 403) set({ disabled: true });
      set({ conversations: null });
    } finally {
      set({ loading: false });
    }
  },

  loadThread: async (id: string, silent = false) => {
    if (!silent) set({ loadingThread: true });
    try {
      const response = await getServices(`chatbot/conversations/${id}/messages?limit=30`);
      set({ thread: response.data.data });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ loadingThread: false });
    }
  },

  loadOlder: async () => {
    const thread = get().thread;
    if (!thread?.next_cursor) return;
    try {
      const response = await getServices(`chatbot/conversations/${thread.conversation.id}/messages?limit=30&before=${thread.next_cursor}`);
      const older = response.data.data;
      set({ thread: { ...thread, messages: [...older.messages, ...thread.messages], next_cursor: older.next_cursor } });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    }
  },

  setHandoff: async (id: string, take: boolean) => {
    set({ sending: true });
    try {
      const url = `chatbot/conversations/${id}/handoff`;
      const response = take ? await updateService(url, {}) : await deleteService(url);
      useToastMessageStore.getState().setMessage(response);
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ sending: false });
    }
  },

  reply: async (id: string, data: FormData) => {
    set({ sending: true });
    try {
      await createService(`chatbot/conversations/${id}/reply`, data);
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ sending: false });
    }
  },

  clearThread: () => set({ thread: null }),
}));

export default chatbotConversationsStore;

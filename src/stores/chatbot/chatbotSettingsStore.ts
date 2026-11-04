import { ChatbotSettings } from '@/interfaces/chatbot';
import { getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

interface ChatbotSettingsStoreI {
  settings: ChatbotSettings | null;
  loading: boolean;
  saving: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (data: Partial<ChatbotSettings>) => Promise<boolean>;
}

const chatbotSettingsStore = create<ChatbotSettingsStoreI>((set) => ({
  settings: null,
  loading: false,
  saving: false,

  loadSettings: async () => {
    set({ loading: true });
    try {
      const response = await getServices('chatbot/settings');
      set({ settings: response.data.data });
    } catch (error) {
      set({ settings: null });
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (data: Partial<ChatbotSettings>) => {
    set({ saving: true });
    try {
      const response = await updateService('chatbot/settings', data);
      set({ settings: response.data.data });
      useToastMessageStore.getState().setMessage(response);
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ saving: false });
    }
  },
}));

export default chatbotSettingsStore;

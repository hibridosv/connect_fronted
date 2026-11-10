import { createService, getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

export interface ChatbotProfileVersion {
  id: string;
  kind?: number; // 1 generado, 2 ajuste, 3 editado a mano
  instruction?: string | null;
  text: string | null;
  status: string; // pending, draft, published, archived, error
  error?: string | null;
  created_at?: string;
  published_at?: string | null;
  publisher?: { id: string; name: string } | null;
}

export interface ChatbotProfileState {
  questionnaire: Record<string, string | null>;
  tone: number;
  published: ChatbotProfileVersion | null;
  draft: ChatbotProfileVersion | null;
  history: ChatbotProfileVersion[];
  generations_left: number;
}

interface ChatbotProfileStoreI {
  profile: ChatbotProfileState | null;
  loading: boolean;
  saving: boolean;
  loadProfile: () => Promise<void>;
  saveQuestionnaire: (data: Record<string, any>) => Promise<boolean>;
  generate: (instruction?: string) => Promise<boolean>;
  saveDraft: (id: string, text: string) => Promise<boolean>;
  publish: (id: string) => Promise<boolean>;
}

const chatbotProfileStore = create<ChatbotProfileStoreI>((set) => {
  // todas las acciones devuelven el estado completo del perfil
  const run = async (request: () => Promise<any>) => {
    set({ saving: true });
    try {
      const response = await request();
      set({ profile: response.data.data });
      useToastMessageStore.getState().setMessage(response);
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ saving: false });
    }
  };

  return {
    profile: null,
    loading: false,
    saving: false,

    loadProfile: async () => {
      set({ loading: true });
      try {
        const response = await getServices('chatbot/profile');
        set({ profile: response.data.data });
      } catch (error) {
        set({ profile: null });
      } finally {
        set({ loading: false });
      }
    },

    saveQuestionnaire: (data) => run(() => updateService('chatbot/profile/questionnaire', data)),
    generate: (instruction) => run(() => createService('chatbot/profile/generate', instruction ? { instruction } : {})),
    saveDraft: (id, text) => run(() => updateService(`chatbot/profile/${id}`, { text })),
    publish: (id) => run(() => updateService(`chatbot/profile/${id}/publish`, {})),
  };
});

export default chatbotProfileStore;

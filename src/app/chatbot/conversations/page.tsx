'use client';
import { Alert } from "@/components/Alert/Alert";
import { ChatbotConversationsList } from "@/components/chatbot/ChatbotConversationsList";
import { ChatbotThread } from "@/components/chatbot/ChatbotThread";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useChatbotConversationsLogic } from "@/hooks/chatbot/useChatbotConversationsLogic";
import { ChatbotConversation } from "@/interfaces/chatbot";

export default function Page() {
  const {
    conversations, thread, loading, loadingThread, sending, disabled,
    selectedId, setSelectedId, search, setSearch, onlyTakenOver, setOnlyTakenOver,
    toggleHandoff, sendReply, loadOlder,
  } = useChatbotConversationsLogic();

  const records: ChatbotConversation[] = conversations?.data ?? [];
  // sin control tomado pero con el bot callado: lo apago el switch global o el tope del mes
  const globalOff = !!thread && !thread.conversation.bot_enabled && !thread.conversation.taken_over;

  if (disabled) {
    return (
      <div className="p-4">
        <ViewTitle text="CONVERSACIONES DE WHATSAPP" />
        <Alert type="info" text="El chatbot de WhatsApp para clientes no está activo. Actívalo en Configuraciones > Principal (Activar el chatbot de WhatsApp para clientes)." />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10">
      <div className={`md:col-span-3 md:border-r md:border-primary ${selectedId ? 'hidden md:block' : ''}`}>
        <ViewTitle text="CONVERSACIONES" />
        <div className="px-3 pb-2 space-y-2">
          <input className="input w-full" placeholder="Buscar por nombre o teléfono" value={search} onChange={(e) => setSearch(e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input type="checkbox" checked={onlyTakenOver} onChange={(e) => setOnlyTakenOver(e.target.checked)} />
            Solo las que atiende un asesor
          </label>
        </div>
        <div className="h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar">
          <ChatbotConversationsList records={records} isLoading={loading} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>
      <div className={`md:col-span-7 ${selectedId ? '' : 'hidden md:block'}`}>
        <ChatbotThread
          thread={thread}
          isLoading={loadingThread}
          sending={sending}
          globalOff={globalOff}
          onBack={() => setSelectedId(null)}
          onHandoff={toggleHandoff}
          onReply={sendReply}
          onLoadOlder={loadOlder}
        />
      </div>
      <ToasterMessage />
    </div>
  );
}

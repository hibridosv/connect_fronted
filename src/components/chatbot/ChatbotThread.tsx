'use client';
import { Spinner } from "@/components/Spinner";
import { ChatbotThread as ChatbotThreadI } from "@/interfaces/chatbot";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { useEffect, useRef, useState } from "react";
import { IoArrowBack, IoAttach, IoClose, IoSend } from "react-icons/io5";
import { ChatbotDraftCard } from "./ChatbotDraftCard";
import { ChatbotMessageBubble } from "./ChatbotMessageBubble";

export interface ChatbotThreadProps {
  thread: ChatbotThreadI | null;
  isLoading: boolean;
  sending: boolean;
  globalOff: boolean;
  onBack: () => void;
  onHandoff: (take: boolean) => void;
  onReply: (body: string, file: File | null) => Promise<boolean>;
  onLoadOlder: () => void;
}

export function ChatbotThread({ thread, isLoading, sending, globalOff, onBack, onHandoff, onReply, onLoadOlder }: ChatbotThreadProps) {
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastMessageId = thread?.messages[thread.messages.length - 1]?.id;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [lastMessageId]);

  if (isLoading) return <div className="flex justify-center mt-10"><Spinner size={35} /></div>;
  if (!thread) return <div className="text-center text-text-muted mt-10">Selecciona una conversación</div>;

  const { conversation } = thread;
  const canReply = !conversation.bot_enabled && conversation.window_open;
  const blockedText = conversation.bot_enabled
    ? 'Toma el control para responder: el bot deja de contestar en este número por 12 horas'
    : !conversation.window_open ? 'Pasaron más de 24 horas desde el último mensaje del cliente: WhatsApp no permite escribirle hasta que vuelva a escribir' : '';

  const submit = async () => {
    if (sending || (!body.trim() && !file)) return;
    if (await onReply(body, file)) {
      setBody('');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-bg-subtle bg-bg-content">
        <div className="flex items-center gap-2 min-w-0">
          <IoArrowBack size={22} className="md:hidden clickeable shrink-0" onClick={onBack} />
          <div className="min-w-0">
            <div className="font-semibold truncate">{conversation.name}</div>
            <div className="text-xs text-text-muted">+{conversation.phone}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {conversation.taken_over ? (
            <>
              <span className="hidden sm:inline text-text-muted text-xs text-right">
                Atiende {conversation.taken_over_by?.name ?? 'un asesor'}
                {conversation.handoff_expires_at && <> hasta {formatDateAsDMY(conversation.handoff_expires_at)} {formatHourAsHM(conversation.handoff_expires_at)}</>}
              </span>
              <button className="button-cyan" disabled={sending} onClick={() => onHandoff(false)}>Devolver al bot</button>
            </>
          ) : (
            <button className="button-lime" disabled={sending} onClick={() => onHandoff(true)}>Tomar el control</button>
          )}
        </div>
      </div>

      {globalOff && (
        <div className="px-3 py-1 text-xs bg-warning/10 text-warning text-center">El bot está apagado para todo el negocio o se llegó al tope del mes: todas las conversaciones se responden a mano</div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-bg-base px-3 py-3 space-y-2">
        <ChatbotDraftCard draft={thread.draft} orders={thread.orders} />
        {thread.next_cursor && (
          <div className="text-center"><button className="text-primary text-sm underline" onClick={onLoadOlder}>Ver mensajes anteriores</button></div>
        )}
        {thread.messages.map((message) => <ChatbotMessageBubble key={message.id} message={message} />)}
        <div ref={endRef} />
      </div>

      <div className="border-t border-bg-subtle bg-bg-content p-2">
        {canReply ? (
          <>
            {file && (
              <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                <span className="truncate">📎 {file.name}</span>
                <IoClose className="clickeable" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }} />
              </div>
            )}
            <div className="flex items-end gap-2">
              <IoAttach size={24} className="clickeable text-text-muted shrink-0 mb-2" title="Adjuntar imagen o PDF" onClick={() => fileRef.current?.click()} />
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
                rows={2}
                maxLength={1500}
                placeholder="Escribe un mensaje"
                className="input flex-1 resize-none"
              />
              {sending ? <Spinner size={24} /> : <IoSend size={24} className="clickeable text-primary shrink-0 mb-2" onClick={submit} />}
            </div>
          </>
        ) : (
          <div className="text-sm text-text-muted text-center py-2">{blockedText}</div>
        )}
      </div>
    </div>
  );
}

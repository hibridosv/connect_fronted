'use client';
import { ChatbotMessage } from "@/interfaces/chatbot";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { mapsUrl, ORIGIN_LABEL } from "./utils";

export function ChatbotMessageBubble({ message }: { message: ChatbotMessage }) {
  const inbound = message.origin === 1;
  const notice = message.origin === 4;
  const author = message.origin === 3 ? message.sender?.name ?? ORIGIN_LABEL[3] : ORIGIN_LABEL[message.origin];

  const bubbleStyle = inbound
    ? 'bg-bg-content border border-bg-subtle text-text-base'
    : notice
      ? 'bg-warning/10 border border-warning/30 text-text-base'
      : message.origin === 3 ? 'bg-primary text-text-inverted' : 'bg-secondary/80 text-text-inverted';

  return (
    <div className={`flex ${inbound ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] md:max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${bubbleStyle}`}>
        {!inbound && <div className="text-[11px] font-semibold opacity-80 mb-0.5">{author}</div>}

        {message.type === 2 && message.media_url && (
          <audio controls src={message.media_url} className="max-w-full mb-1" />
        )}
        {message.type === 3 && message.media_url && (
          <a href={message.media_url} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={message.media_url} alt={message.media_filename ?? 'Imagen'} className="rounded max-h-64 mb-1" />
          </a>
        )}
        {message.type === 4 && message.media_url && (
          <a href={message.media_url} target="_blank" rel="noreferrer" className="underline block mb-1">📄 {message.media_filename ?? 'Documento'}</a>
        )}
        {message.type === 5 && message.latitude !== null && message.longitude !== null && (
          <a href={mapsUrl(message.latitude, message.longitude)} target="_blank" rel="noreferrer" className="underline block mb-1">📍 Ver ubicación en el mapa</a>
        )}

        {message.body && (
          <div className="whitespace-pre-wrap break-words text-sm">
            {message.type === 2 && <span className="italic opacity-80">Transcripción: </span>}
            {message.body}
          </div>
        )}
        <div className="text-[10px] opacity-70 text-right mt-1">{formatDateAsDMY(message.created_at)} {formatHourAsHM(message.created_at)}</div>
      </div>
    </div>
  );
}

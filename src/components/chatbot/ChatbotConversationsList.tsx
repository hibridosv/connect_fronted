'use client';
import { ChatbotConversation } from "@/interfaces/chatbot";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { DateTime } from "luxon";
import { NothingHere } from "../NothingHere";
import SkeletonTable from "../skeleton/skeleton-table";
import { lastMessagePreview } from "./utils";

export interface ChatbotConversationsListI {
  records: ChatbotConversation[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const initials = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase() || '#';

const shortDate = (date: string | null) => {
  if (!date) return '';
  return DateTime.fromISO(date).hasSame(DateTime.now(), 'day') ? formatHourAsHM(date) : formatDateAsDMY(date);
};

export function ChatbotConversationsList({ records, isLoading, selectedId, onSelect }: ChatbotConversationsListI) {
  if (isLoading && !records.length) return <SkeletonTable rows={6} columns={1} />;
  if (!records.length) return <NothingHere text="Aún no hay conversaciones" />;

  return (
    <ul className="divide-y divide-bg-subtle">
      {records.map((record) => (
        <li key={record.id}
          onClick={() => onSelect(record.id)}
          className={`flex gap-3 px-3 py-2.5 clickeable-table transition-colors duration-150 hover:bg-bg-subtle ${selectedId === record.id ? 'bg-bg-subtle' : ''}`}>
          <div className="w-10 h-10 shrink-0 rounded-full bg-primary text-text-inverted flex items-center justify-center text-sm font-semibold">
            {initials(record.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between gap-2">
              <span className="font-semibold text-text-base truncate">{record.name}</span>
              <span className="text-xs text-text-muted whitespace-nowrap">{shortDate(record.last_message_at)}</span>
            </div>
            <div className="flex justify-between gap-2 items-center">
              <span className="text-sm text-text-muted truncate">{lastMessagePreview(record.last_message)}</span>
              {record.unread_count > 0 && (
                <span className="shrink-0 min-w-[1.25rem] h-5 px-1.5 rounded-full bg-primary text-text-inverted text-xs flex items-center justify-center">{record.unread_count}</span>
              )}
            </div>
            <div className="mt-0.5">
              {record.taken_over
                ? <span className="status-warning text-xs">Atiende {record.taken_over_by?.name ?? 'un asesor'}</span>
                : <span className={`text-xs ${record.bot_enabled ? 'text-success' : 'text-text-muted'}`}>{record.bot_enabled ? 'Bot activo' : 'Bot en pausa'}</span>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

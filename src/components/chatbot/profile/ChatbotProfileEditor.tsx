'use client';
import { Badge } from "@/components/Badge";
import { Spinner } from "@/components/Spinner";
import { Alert } from '@/components/Alert/Alert';
import { Button, Preset } from '@/components/button/button';
import { formatDateAsDMY, formatHourAsHM } from '@/lib/date-formats';
import { ChatbotProfileState } from '@/stores/chatbot/chatbotProfileStore';
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaHistory, FaMagic, FaPen } from 'react-icons/fa';

export interface ChatbotProfileEditorI {
  profile: ChatbotProfileState;
  saving: boolean;
  onGenerate: (instruction?: string) => Promise<boolean>;
  onSaveDraft: (id: string, text: string) => Promise<boolean>;
  onPublish: (id: string) => Promise<boolean>;
}

const when = (date?: string | null) => (date ? `${formatDateAsDMY(date)} ${formatHourAsHM(date)}` : '');

/**
 * Borrador del perfil redactado con IA: se revisa, se edita a mano o se pide un ajuste, y se publica.
 * Solo el publicado llega al bot; las versiones anteriores se pueden volver a publicar.
 */
export function ChatbotProfileEditor({ profile, saving, onGenerate, onSaveDraft, onPublish }: ChatbotProfileEditorI) {
  const { draft, published, history, generations_left } = profile;
  const [text, setText] = useState('');
  const [instruction, setInstruction] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => { setText(draft?.status === 'draft' ? draft.text ?? '' : ''); }, [draft?.id, draft?.status, draft?.text]);

  const pending = draft?.status === 'pending';
  const editable = draft?.status === 'draft';
  const changed = editable && text !== (draft?.text ?? '');
  const noGenerations = generations_left <= 0;
  const archived = history.filter((version) => version.status === 'archived');

  const adjust = async () => {
    if (await onGenerate(instruction.trim())) setInstruction('');
  };

  const adjustInput = (placeholder: string, blocked: boolean) => (
    <div className="flex flex-wrap gap-2 items-center">
      <input className="input flex-1 min-w-[12rem]" maxLength={500} placeholder={placeholder}
        value={instruction} onChange={(e) => setInstruction(e.target.value)} disabled={saving || noGenerations} />
      <Button preset={Preset.info} text="Ajustar con IA" disabled={saving || !instruction.trim() || noGenerations || blocked} onClick={adjust} />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button preset={Preset.primary} text={published || editable ? 'Volver a generar desde el cuestionario' : 'Generar perfil con IA'}
          disabled={saving || pending || noGenerations} onClick={() => onGenerate()} />
        <Badge variant={noGenerations ? 'danger' : 'muted'}>
          {noGenerations ? 'Ya no quedan generaciones hoy' : `Te quedan ${generations_left} generaciones hoy`}
        </Badge>
      </div>

      {pending && (
        <div className="animate-fade-in rounded-lg border border-bg-subtle border-l-4 border-l-info bg-bg-content p-4">
          <div className="flex items-center gap-3 mb-3">
            <Spinner size={22} color="info" className="shrink-0" />
            <div>
              <div className="text-sm font-semibold text-text-base">La IA está redactando el perfil</div>
              <div className="text-xs text-text-muted">Tarda unos segundos; aparece aquí solo cuando termine.</div>
            </div>
          </div>
          <div className="space-y-2 animate-pulse">
            {['w-full', 'w-11/12', 'w-4/5', 'w-full', 'w-2/3'].map((width, index) => (
              <div key={index} className={`h-3 bg-bg-subtle rounded-md ${width}`} />
            ))}
          </div>
        </div>
      )}
      {draft?.status === 'error' && <Alert type="danger" className="animate-fade-in" text={draft.error ?? 'La IA no pudo redactar el perfil, intenta de nuevo'} />}

      {editable && (
        <div className="animate-slide-up rounded-lg border border-bg-subtle border-l-4 border-l-warning bg-bg-content overflow-hidden">
          <div className="flex flex-wrap justify-between items-center gap-2 px-3 py-2 bg-warning/10">
            <span className="flex items-center gap-2 text-sm font-semibold text-text-base"><FaPen className="text-warning" size={12} /> Borrador: todavía no lo usa el bot</span>
            {draft?.instruction && <span className="text-xs text-text-muted italic">Ajuste: “{draft.instruction}”</span>}
          </div>
          <div className="p-3 space-y-2">
            <textarea className="input w-full text-sm leading-relaxed" rows={14} maxLength={6000} value={text} onChange={(e) => setText(e.target.value)} />
            <div className="text-xs text-text-muted text-right">{text.length}/6000</div>
            {adjustInput('Pedir un ajuste a la IA, p. ej. "hazlo más corto" o "agrega que los domingos no hay envíos"', changed)}
            {changed && <div className="text-xs text-warning">Guarda tus cambios antes de pedir un ajuste: la IA parte del borrador guardado.</div>}
            <div className="flex justify-end gap-2 pt-1">
              <Button preset={saving ? Preset.saving : Preset.save} text={saving ? undefined : 'Guardar cambios'} disabled={saving || !changed || !text.trim()} onClick={() => onSaveDraft(draft!.id, text)} />
              <Button preset={Preset.success} text="Publicar" disabled={saving || changed} onClick={() => onPublish(draft!.id)} />
            </div>
          </div>
        </div>
      )}

      <div className={`rounded-lg border border-bg-subtle bg-bg-content overflow-hidden ${published ? 'border-l-4 border-l-success' : ''}`}>
        <div className="flex flex-wrap justify-between items-center gap-2 px-3 py-2 bg-bg-subtle/60">
          <span className="flex items-center gap-2 text-sm font-semibold text-text-base">
            <FaCheckCircle className={published ? 'text-success' : 'text-text-muted'} size={13} /> Perfil que usa el bot
          </span>
          {published?.published_at && (
            <span className="text-xs text-text-muted">Publicado el {when(published.published_at)}{published.publisher ? ` por ${published.publisher.name}` : ''}</span>
          )}
        </div>
        <div className="p-3 space-y-3">
          {published ? (
            <>
              <p className="whitespace-pre-wrap text-sm text-text-base leading-relaxed">{published.text}</p>
              {!editable && !pending && adjustInput('Pedir un ajuste a la IA sobre el perfil publicado', false)}
            </>
          ) : (
            <div className="flex items-center gap-3 text-sm text-text-muted py-2">
              <FaMagic className="text-info/60 shrink-0" size={18} />
              Todavía no hay un perfil publicado: el bot usa las respuestas del cuestionario tal como están.
            </div>
          )}
        </div>
      </div>

      {archived.length > 0 && (
        <div>
          <button className="flex items-center gap-2 text-sm text-primary hover:underline" onClick={() => setShowHistory(!showHistory)}>
            <FaHistory size={12} /> {showHistory ? 'Ocultar versiones anteriores' : `Ver versiones anteriores (${archived.length})`}
          </button>
          {showHistory && (
            <ul className="mt-2 space-y-2">
              {archived.map((version, index) => (
                <li key={version.id} style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-slide-up rounded-lg border border-bg-subtle bg-bg-content p-3 transition-all duration-200 hover:shadow-md hover:border-primary/40">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                    <span className="text-xs text-text-muted">Publicada el {when(version.published_at)}</span>
                    <Button preset={Preset.secondary} text="Volver a publicar" disabled={saving} onClick={() => onPublish(version.id)} />
                  </div>
                  <p className="whitespace-pre-wrap text-xs text-text-muted line-clamp-6">{version.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

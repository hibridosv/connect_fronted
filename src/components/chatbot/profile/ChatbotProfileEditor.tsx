'use client';
import { Alert } from '@/components/Alert/Alert';
import { Button, Preset } from '@/components/button/button';
import { Loader } from '@/components/Loader';
import { formatDateAsDMY, formatHourAsHM } from '@/lib/date-formats';
import { ChatbotProfileState } from '@/stores/chatbot/chatbotProfileStore';
import { useEffect, useState } from 'react';

export interface ChatbotProfileEditorI {
  profile: ChatbotProfileState;
  saving: boolean;
  onGenerate: (instruction?: string) => Promise<boolean>;
  onSaveDraft: (id: string, text: string) => Promise<boolean>;
  onPublish: (id: string) => Promise<boolean>;
}

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

  const adjust = async () => {
    if (await onGenerate(instruction.trim())) setInstruction('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button preset={pending ? Preset.loading : Preset.primary} text={published || editable ? 'Volver a generar desde el cuestionario' : 'Generar perfil con IA'}
          disabled={saving || pending || noGenerations} onClick={() => onGenerate()} />
        <span className="text-xs text-text-muted">Te quedan {generations_left} generaciones hoy</span>
      </div>

      {pending && (
        <div className="flex items-center gap-3 text-sm text-text-muted"><Loader size="24" /> La IA está redactando el perfil, tarda unos segundos…</div>
      )}
      {draft?.status === 'error' && <Alert type="danger" text={draft.error ?? 'La IA no pudo redactar el perfil, intenta de nuevo'} />}

      {editable && (
        <div className="bg-bg-content rounded-lg border border-warning/40 p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Borrador (todavía no lo usa el bot)</span>
            {draft?.instruction && <span className="text-xs text-text-muted">Ajuste: “{draft.instruction}”</span>}
          </div>
          <textarea className="input w-full font-mono text-sm" rows={14} maxLength={6000} value={text} onChange={(e) => setText(e.target.value)} />
          <div className="text-xs text-text-muted text-right">{text.length}/6000</div>
          <div className="flex flex-wrap gap-2 items-center">
            <input className="input flex-1 min-w-[12rem]" maxLength={500} placeholder='Pedir un ajuste a la IA, p. ej. "hazlo más corto" o "agrega que los domingos no hay envíos"'
              value={instruction} onChange={(e) => setInstruction(e.target.value)} disabled={saving || noGenerations} />
            <Button preset={Preset.info} text="Ajustar con IA" disabled={saving || !instruction.trim() || noGenerations || changed} onClick={adjust} />
          </div>
          {changed && <div className="text-xs text-warning">Guarda tus cambios antes de pedir un ajuste: la IA parte del borrador guardado.</div>}
          <div className="flex justify-end gap-2">
            <Button preset={Preset.save} text="Guardar cambios" disabled={saving || !changed || !text.trim()} onClick={() => onSaveDraft(draft!.id, text)} />
            <Button preset={Preset.success} text="Publicar" disabled={saving || changed} onClick={() => onPublish(draft!.id)} />
          </div>
        </div>
      )}

      <div className="bg-bg-content rounded-lg border border-bg-subtle p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Perfil que usa el bot</span>
          {published?.published_at && (
            <span className="text-xs text-text-muted">Publicado el {formatDateAsDMY(published.published_at)} {formatHourAsHM(published.published_at)}{published.publisher ? ` por ${published.publisher.name}` : ''}</span>
          )}
        </div>
        {published ? (
          <>
            <pre className="whitespace-pre-wrap text-sm font-sans">{published.text}</pre>
            {!editable && !pending && (
              <div className="flex flex-wrap gap-2 items-center">
                <input className="input flex-1 min-w-[12rem]" maxLength={500} placeholder="Pedir un ajuste a la IA sobre el perfil publicado"
                  value={instruction} onChange={(e) => setInstruction(e.target.value)} disabled={saving || noGenerations} />
                <Button preset={Preset.info} text="Ajustar con IA" disabled={saving || !instruction.trim() || noGenerations} onClick={adjust} />
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-text-muted">Todavía no hay un perfil publicado: el bot usa las respuestas del cuestionario tal como están.</div>
        )}
      </div>

      {history.filter((version) => version.status === 'archived').length > 0 && (
        <div>
          <button className="text-sm text-primary underline" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? 'Ocultar versiones anteriores' : 'Ver versiones anteriores'}
          </button>
          {showHistory && (
            <ul className="mt-2 space-y-2">
              {history.filter((version) => version.status === 'archived').map((version) => (
                <li key={version.id} className="bg-bg-content rounded-lg border border-bg-subtle p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-text-muted">Publicada el {version.published_at ? `${formatDateAsDMY(version.published_at)} ${formatHourAsHM(version.published_at)}` : ''}</span>
                    <Button preset={Preset.secondary} text="Volver a publicar" disabled={saving} onClick={() => onPublish(version.id)} />
                  </div>
                  <pre className="whitespace-pre-wrap text-xs font-sans line-clamp-6">{version.text}</pre>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

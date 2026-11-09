'use client';

export interface ChatbotSettingSwitchI {
  title: string;
  description: string;
  checked: boolean;
  updating: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

/** Interruptor con el mismo estilo de Configuraciones > General: estado en texto y spinner mientras guarda */
export function ChatbotSettingSwitch({ title, description, checked, updating, disabled = false, onChange }: ChatbotSettingSwitchI) {
  const locked = updating || disabled;
  return (
    <div className={`flex items-center justify-between gap-4 transition-opacity ${updating ? 'opacity-60' : ''}`}>
      <div className="min-w-0">
        <div className="text-sm font-medium text-text-base">{title}</div>
        <div className="text-xs text-text-muted mt-0.5 leading-snug">{description}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {updating ? (
          <span className="text-xs text-primary font-medium animate-pulse">Actualizando...</span>
        ) : (
          <span className={`text-xs font-medium transition-colors ${checked ? 'text-success' : 'text-text-muted'}`}>
            {checked ? 'Activo' : 'Inactivo'}
          </span>
        )}
        <button type="button" disabled={locked} onClick={() => onChange(!checked)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${locked ? 'cursor-not-allowed' : 'cursor-pointer'} ${checked ? 'bg-success' : 'bg-gray-300'}`}>
          {updating && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
            </span>
          )}
          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? 'translate-x-4' : 'translate-x-1'} ${updating ? 'opacity-0' : ''}`} />
        </button>
      </div>
    </div>
  );
}

'use client';
import qrReaderStore from '@/stores/annexes/qrReaderStore';
import { LuClock, LuFileJson, LuTrash2, LuX } from 'react-icons/lu';

const DTE_TYPES: Record<string, string> = {
  '01': 'Factura',
  '03': 'CCF',
  '05': 'Nota de Crédito',
  '06': 'Nota de Débito',
  '11': 'Fact. Exportación',
  '14': 'Sujeto Excluido',
};

function formatDateTime(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' ' + date.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export function QrHistoryList() {
  const { history, currentFileName, selectFromHistory, removeFromHistory, clearHistory } = qrReaderStore();

  if (history.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <LuClock size={12} />
          Últimos archivos leídos
        </p>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1 text-[10px] font-semibold text-text-muted hover:text-danger transition-colors clickeable"
          title="Limpiar historial"
        >
          <LuTrash2 size={11} />
          Limpiar todo
        </button>
      </div>
      <ul className="space-y-1.5">
        {history.map((entry) => {
          const dteType = DTE_TYPES[entry.data?.identificacion?.tipoDte] ?? `Tipo ${entry.data?.identificacion?.tipoDte ?? '?'}`;
          const isActive = entry.fileName === currentFileName;
          return (
            <li
              key={entry.id}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs group transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary/8 border-primary/30'
                  : 'bg-bg-content border-bg-subtle hover:border-primary/20 hover:bg-primary/5'
              }`}
              onClick={() => selectFromHistory(entry.id)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <LuFileJson size={14} className={`shrink-0 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                <div className="min-w-0">
                  <p className={`truncate font-medium leading-tight ${isActive ? 'text-primary' : 'text-text-base'}`}>
                    {entry.fileName}
                  </p>
                  <p className="text-text-muted text-[10px] mt-0.5 leading-tight">
                    {dteType} · {formatDateTime(entry.readAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFromHistory(entry.id); }}
                className="shrink-0 ml-2 text-text-muted hover:text-danger transition-colors clickeable opacity-0 group-hover:opacity-100"
                title="Eliminar del historial"
              >
                <LuX size={13} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

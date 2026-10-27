'use client';

import { DashboardWidget, DashboardWidgetData } from '@/interfaces/dashboard';
import { formatDateAsDMY, formatHourAsHM } from '@/lib/date-formats';
import useDashBoardStore from '@/stores/dashboardStore';
import { DateTime } from 'luxon';
import { FiAlertCircle, FiCheckCircle, FiCpu, FiLoader, FiRefreshCw } from 'react-icons/fi';
import { WidgetCard } from './WidgetCard';

interface WidgetAiProps {
  widget: DashboardWidget;
  data?: DashboardWidgetData;
  loading: boolean;
  currency: string;
}

const generatedText = (generatedAt: string, periodFrom: string): string => {
  const generated = DateTime.fromISO(generatedAt);
  const day = generated.hasSame(DateTime.now(), 'day') ? 'hoy' : formatDateAsDMY(generatedAt);
  return `Generado ${day} a las ${formatHourAsHM(generatedAt)} · analiza el ${formatDateAsDMY(`${periodFrom}T00:00:00`)}`;
};

export function WidgetAi({ widget }: WidgetAiProps) {
  const { ai, aiLoading, aiRequesting, requestAi } = useDashBoardStore();
  const report = ai?.report ?? null;
  const last = ai?.last ?? null;
  const manual = ai?.manual ?? null;
  const pending = last?.status === 'pending';
  const canRequest = !!manual && manual.remaining > 0 && !pending && !aiRequesting;

  const status = last?.status === 'pending'
    ? <span className="flex items-center gap-1 text-[11px] font-bold text-info"><FiLoader className="animate-spin" /> Generando análisis</span>
    : last?.status === 'error'
      ? <span className="flex items-center gap-1 text-[11px] font-bold text-warning" title="Se muestra el último análisis que salió bien"><FiAlertCircle /> El último intento falló</span>
      : report && <span className="flex items-center gap-1 text-[11px] font-bold text-success"><FiCheckCircle /> Al día</span>;

  return (
    <WidgetCard widget={widget} loading={ai === null && aiLoading} badge={status}>
      {!report ? (
        <p className="text-xs text-text-muted font-medium">
          Todavía no hay un análisis. Se genera todos los días a las 6:15 con las ventas del día anterior, o pídelo ahora con el botón.
        </p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-1/2 flex gap-3">
            <div className="shrink-0 p-2 h-fit rounded-lg bg-accent/10">
              <FiCpu className="text-accent" size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-text-base leading-relaxed whitespace-pre-line">{report.summary}</p>
              <p className="text-[11px] text-text-muted mt-2">{generatedText(report.generated_at, report.period_from)}</p>
            </div>
          </div>
          {(report.highlights ?? []).length > 0 && (
            <ul className="lg:w-1/2 space-y-1.5">
              {(report.highlights ?? []).map((highlight, index) => (
                <li key={index} className="flex gap-2 text-xs text-text-base">
                  <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {manual && (
        <div className="mt-3 pt-3 border-t border-bg-subtle flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-text-muted">
            {manual.remaining > 0
              ? `Puedes pedir ${manual.remaining} análisis más hoy con las ventas de hasta ahora`
              : 'Ya usaste los análisis de hoy. Mañana a las 6:15 llega uno nuevo'}
          </span>
          <button
            type="button"
            onClick={requestAi}
            disabled={!canRequest}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-text-inverted hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw className={pending || aiRequesting ? 'animate-spin' : ''} />
            {pending ? 'Generando…' : 'Actualizar análisis'}
          </button>
        </div>
      )}
    </WidgetCard>
  );
}

'use client';

import { formatDashboardValue } from '@/hooks/dashboard/useDashboardWidgetsLogic';
import { DashboardWidget, DashboardWidgetData } from '@/interfaces/dashboard';
import { FiArrowDownRight, FiArrowUpRight } from 'react-icons/fi';
import { WidgetCard } from './WidgetCard';

interface WidgetForecastProps {
  widget: DashboardWidget;
  data?: DashboardWidgetData;
  loading: boolean;
  currency: string;
}

export function WidgetForecast({ widget, data, loading, currency }: WidgetForecastProps) {
  const extra = data?.extra ?? {};
  const progress = extra.days_in_month ? Math.round((extra.days_elapsed / extra.days_in_month) * 100) : 0;
  const money = (value: any) => formatDashboardValue(value, 'money', currency);

  const trend = (percent: number | null | undefined, text: string) => percent === null || percent === undefined
    ? <span className="text-text-muted">Sin datos del mes pasado</span>
    : (
      <span className={`flex items-center gap-0.5 ${percent >= 0 ? 'text-success' : 'text-danger'}`}>
        {percent >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
        {Math.abs(percent).toFixed(1)}% {text}
      </span>
    );

  return (
    <WidgetCard widget={widget} loading={loading || !data} error={data?.error}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Vendido en el mes</p>
          <p className="text-xl font-extrabold text-text-base tabular-nums mt-1">{money(data?.value)}</p>
          <div className="text-[11px] font-semibold mt-1">{trend(data?.percent, 'vs los mismos días del mes pasado')}</div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Cierre estimado</p>
          <p className="text-xl font-extrabold text-text-base tabular-nums mt-1">{money(extra.projected)}</p>
          <div className="text-[11px] font-semibold mt-1">{trend(extra.projected_percent, `vs ${money(extra.last_month)} del mes pasado`)}</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-[11px] text-text-muted font-medium mb-1">
          <span>Día {extra.days_elapsed ?? 0} de {extra.days_in_month ?? 0}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-bg-subtle rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </WidgetCard>
  );
}

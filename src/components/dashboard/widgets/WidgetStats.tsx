'use client';

import { formatDashboardValue } from '@/hooks/dashboard/useDashboardWidgetsLogic';
import { DashboardWidget, DashboardWidgetData } from '@/interfaces/dashboard';
import { WidgetCard } from './WidgetCard';

interface WidgetStatsProps {
  widget: DashboardWidget;
  data?: DashboardWidgetData;
  loading: boolean;
  currency: string;
}

const tones: { [key: string]: string } = {
  Pendientes: 'text-warning',
  Rechazados: 'text-danger',
};

export function WidgetStats({ widget, data, loading, currency }: WidgetStatsProps) {
  const items = data?.items ?? [];

  return (
    <WidgetCard widget={widget} loading={loading || !data} error={data?.error} empty={items.length === 0}>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between bg-bg-subtle/40 rounded-lg px-3 py-2">
            <span className="text-xs font-semibold text-text-muted">{item.label}</span>
            <span className={`text-lg font-extrabold tabular-nums ${item.value ? tones[item.label] ?? 'text-text-base' : 'text-text-base'}`}>
              {formatDashboardValue(item.value, widget.format, currency)}
            </span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

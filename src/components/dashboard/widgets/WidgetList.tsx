'use client';

import { formatDashboardValue } from '@/hooks/dashboard/useDashboardWidgetsLogic';
import { DashboardWidget, DashboardWidgetData } from '@/interfaces/dashboard';
import { WidgetCard } from './WidgetCard';

interface WidgetListProps {
  widget: DashboardWidget;
  data?: DashboardWidgetData;
  loading: boolean;
  currency: string;
}

const summaryText = (widget: DashboardWidget, data: DashboardWidgetData, currency: string): string | null => {
  if (widget.key === 'dead_stock' && data.summary) {
    return `${data.summary.products} productos · ${formatDashboardValue(data.summary.value, 'money', currency)} detenidos`;
  }
  if (widget.key === 'expiring' && data.summary) return `Próximos ${data.summary.days} días`;
  return null;
};

export function WidgetList({ widget, data, loading, currency }: WidgetListProps) {
  const items = data?.items ?? [];
  const columns = widget.columns ?? [];
  const summary = data && !data.error ? summaryText(widget, data, currency) : null;

  return (
    <WidgetCard
      widget={widget}
      loading={loading || !data}
      error={data?.error}
      empty={items.length === 0}
      badge={summary && <span className="shrink-0 text-[11px] font-bold text-text-muted bg-bg-subtle/60 px-2 py-1 rounded-full">{summary}</span>}
    >
      <div className="max-h-72 overflow-y-auto custom-scrollbar">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-bg-content">
            <tr className="text-text-muted border-b border-bg-subtle">
              <th className="text-left font-semibold py-1.5 pr-2">#</th>
              <th className="text-left font-semibold py-1.5 pr-2">Nombre</th>
              {columns.map((column) => (
                <th key={column.key} className="text-right font-semibold py-1.5 pl-2 whitespace-nowrap">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle">
            {items.map((item, index) => (
              <tr key={`${item.label}-${index}`} className="hover:bg-bg-subtle/40">
                <td className="py-1.5 pr-2 text-text-muted tabular-nums">{index + 1}</td>
                <td className="py-1.5 pr-2 text-text-base font-medium truncate max-w-[12rem]" title={item.label}>{item.label}</td>
                {columns.map((column) => (
                  <td key={column.key} className="py-1.5 pl-2 text-right tabular-nums text-text-base whitespace-nowrap">
                    {formatDashboardValue(item[column.key], column.format, currency)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
}

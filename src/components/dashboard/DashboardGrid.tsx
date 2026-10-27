'use client';

import { DashboardWidget, DashboardWidgetData } from '@/interfaces/dashboard';
import { WidgetAi } from './widgets/WidgetAi';
import { WidgetDonut } from './widgets/WidgetDonut';
import { WidgetForecast } from './widgets/WidgetForecast';
import { WidgetInsights } from './widgets/WidgetInsights';
import { WidgetKpi } from './widgets/WidgetKpi';
import { WidgetList } from './widgets/WidgetList';
import { WidgetSeries } from './widgets/WidgetSeries';
import { WidgetStats } from './widgets/WidgetStats';

interface DashboardGridProps {
  widgets: DashboardWidget[];
  data: { [key: string]: DashboardWidgetData };
  loadingKeys: string[];
  currency: string;
}

// en celular: indicadores de a dos y el resto a todo el ancho; en escritorio la grilla es de 4 columnas
const spanClass = (widget: DashboardWidget): string => {
  if (widget.type === 'kpi') return 'col-span-1';
  if (widget.size >= 4) return 'col-span-2 lg:col-span-4';
  if (widget.size === 3) return 'col-span-2 lg:col-span-3';
  if (widget.size === 2) return 'col-span-2 lg:col-span-2';
  return 'col-span-2 lg:col-span-1';
};

const components = {
  kpi: WidgetKpi,
  series: WidgetSeries,
  donut: WidgetDonut,
  list: WidgetList,
  forecast: WidgetForecast,
  stats: WidgetStats,
  insights: WidgetInsights,
  ai: WidgetAi,
};

export function DashboardGrid({ widgets, data, loadingKeys, currency }: DashboardGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {widgets.map((widget) => {
        const Component = components[widget.type];
        if (!Component) return null;
        return (
          <div key={widget.key} className={spanClass(widget)}>
            <Component widget={widget} data={data[widget.key]} loading={loadingKeys.includes(widget.key) && !data[widget.key]} currency={currency} />
          </div>
        );
      })}
    </div>
  );
}

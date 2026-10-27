'use client';

import { formatDashboardValue } from '@/hooks/dashboard/useDashboardWidgetsLogic';
import { DashboardWidget, DashboardWidgetData } from '@/interfaces/dashboard';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { WidgetCard } from './WidgetCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler, Tooltip, Legend);

interface WidgetSeriesProps {
  widget: DashboardWidget;
  data?: DashboardWidgetData;
  loading: boolean;
  currency: string;
}

export function WidgetSeries({ widget, data, loading, currency }: WidgetSeriesProps) {
  const current = data?.current ?? [];
  const previous = Array.isArray(data?.previous) ? data?.previous as number[] : null;
  const empty = current.every((value) => !value) && (!previous || previous.every((value) => !value));
  const asLine = widget.key === 'sales_by_hour';
  // en media fila (ventas por dia) el grafico es bajo y arriba van los totales del periodo
  const compact = widget.size <= 2;
  const total = current.reduce((sum, value) => sum + (Number(value) || 0), 0);
  const previousTotal = previous ? previous.reduce((sum, value) => sum + (Number(value) || 0), 0) : null;
  const percent = previousTotal ? ((total - previousTotal) / previousTotal) * 100 : null;

  const chartData = {
    labels: data?.labels ?? [],
    datasets: [
      {
        label: 'Período actual',
        data: current,
        backgroundColor: asLine ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.65)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: compact ? 4 : 8,
        maxBarThickness: compact ? 14 : undefined,
        fill: asLine,
        tension: 0.35,
        pointRadius: 2,
      },
      ...(previous ? [{
        label: 'Período anterior',
        data: previous,
        backgroundColor: asLine ? 'rgba(148, 163, 184, 0.08)' : 'rgba(203, 213, 225, 0.7)',
        borderColor: 'rgba(148, 163, 184, 1)',
        borderWidth: asLine ? 2 : 1,
        borderRadius: compact ? 4 : 8,
        maxBarThickness: compact ? 14 : undefined,
        borderDash: asLine ? [4, 4] : undefined,
        fill: false,
        tension: 0.35,
        pointRadius: 0,
      }] : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 700, easing: 'easeOutQuart' as const },
    plugins: {
      legend: { display: !!previous && !compact, position: 'top' as const, labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } } },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)', padding: 12, cornerRadius: 8,
        callbacks: { label: (context: any) => `${context.dataset.label}: ${formatDashboardValue(context.parsed.y, widget.format, currency)}` },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: compact ? 10 : 11 }, maxTicksLimit: compact ? 8 : undefined, maxRotation: 0 } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: compact ? 10 : 11 }, maxTicksLimit: compact ? 4 : undefined }, border: { display: false } },
    },
  };

  return (
    <WidgetCard widget={widget} loading={loading || !data} error={data?.error} empty={empty}>
      {compact && (
        <div className="flex items-end justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="text-xl font-black text-text-base leading-none">{formatDashboardValue(total, widget.format, currency)}</p>
            {previousTotal !== null && <p className="text-[11px] text-text-muted font-medium mt-1">Período anterior: {formatDashboardValue(previousTotal, widget.format, currency)}</p>}
          </div>
          {percent !== null && (
            <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full ${percent >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
              {percent >= 0 ? '+' : ''}{percent.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className={compact ? 'h-36' : 'h-64'}>
        {asLine ? <Line data={chartData as any} options={options} /> : <Bar data={chartData as any} options={options} />}
      </div>
    </WidgetCard>
  );
}

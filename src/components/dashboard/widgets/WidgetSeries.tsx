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

  const chartData = {
    labels: data?.labels ?? [],
    datasets: [
      {
        label: 'Período actual',
        data: current,
        backgroundColor: asLine ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.65)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8,
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
        borderRadius: 8,
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
      legend: { display: !!previous, position: 'top' as const, labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } } },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)', padding: 12, cornerRadius: 8,
        callbacks: { label: (context: any) => `${context.dataset.label}: ${formatDashboardValue(context.parsed.y, widget.format, currency)}` },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } }, border: { display: false } },
    },
  };

  return (
    <WidgetCard widget={widget} loading={loading || !data} error={data?.error} empty={empty}>
      <div className="h-64">
        {asLine ? <Line data={chartData as any} options={options} /> : <Bar data={chartData as any} options={options} />}
      </div>
    </WidgetCard>
  );
}

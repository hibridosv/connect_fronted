'use client';

import { formatDashboardValue } from '@/hooks/dashboard/useDashboardWidgetsLogic';
import { DashboardWidget, DashboardWidgetData } from '@/interfaces/dashboard';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { WidgetCard } from './WidgetCard';

ChartJS.register(ArcElement, Tooltip, Legend);

const colors = [
  'rgba(16, 185, 129, 0.75)',
  'rgba(59, 130, 246, 0.75)',
  'rgba(245, 158, 11, 0.75)',
  'rgba(239, 68, 68, 0.70)',
  'rgba(139, 92, 246, 0.75)',
  'rgba(236, 72, 153, 0.70)',
  'rgba(107, 114, 128, 0.65)',
];

interface WidgetDonutProps {
  widget: DashboardWidget;
  data?: DashboardWidgetData;
  loading: boolean;
  currency: string;
}

export function WidgetDonut({ widget, data, loading, currency }: WidgetDonutProps) {
  const items = data?.items ?? [];
  const total = items.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

  const chartData = {
    labels: items.map((item) => item.label),
    datasets: [{
      data: items.map((item) => Number(item.value) || 0),
      backgroundColor: items.map((_, i) => colors[i % colors.length]),
      borderWidth: 0,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    animation: { animateRotate: true, duration: 800, easing: 'easeOutQuart' as const },
    plugins: {
      legend: { position: 'bottom' as const, labels: { usePointStyle: true, pointStyle: 'circle', padding: 12, font: { size: 11 } } },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)', padding: 12, cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const percent = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${formatDashboardValue(context.parsed, widget.format, currency)} (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <WidgetCard widget={widget} loading={loading || !data} error={data?.error} empty={items.length === 0}>
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>
    </WidgetCard>
  );
}

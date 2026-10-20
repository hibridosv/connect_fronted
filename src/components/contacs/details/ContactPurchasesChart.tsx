'use client';

import { ContactSummaryMonth } from '@/interfaces/contact';
import { numberToMoney } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { DateTime } from 'luxon';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export interface ContactPurchasesChartProps {
  months: ContactSummaryMonth[] | undefined;
  loading: boolean;
  hasPeriod: boolean;
}

export function ContactPurchasesChart({ months, loading, hasPeriod }: ContactPurchasesChartProps) {
  const { system } = useConfigStore();
  const hasData = !!months && months.some((m) => m.total_sum > 0);

  const data = {
    labels: (months ?? []).map((m) => DateTime.fromFormat(m.month, 'yyyy-LL').setLocale('es').toFormat('LLL yy')),
    datasets: [
      {
        label: 'Monto comprado',
        data: (months ?? []).map((m) => m.total_sum),
        backgroundColor: 'rgba(99, 102, 241, 0.65)',
        hoverBackgroundColor: 'rgba(99, 102, 241, 0.85)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900, easing: 'easeOutQuart' as const },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)', padding: 12, cornerRadius: 8,
        callbacks: {
          label: (ctx: any) => {
            const month = months?.[ctx.dataIndex];
            return ` ${numberToMoney(ctx.parsed.y, system)} · ${month?.orders_count ?? 0} compra(s)`;
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } }, border: { display: false }, beginAtZero: true },
    },
  };

  return (
    <div className="relative bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-5 overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary/60 via-accent/40 to-transparent" />
      <div className="mb-4">
        <h3 className="text-sm font-bold text-text-base">Compras por mes</h3>
        <p className="text-[11px] text-text-muted mt-0.5 font-medium">{hasPeriod ? 'Meses del período seleccionado' : 'Últimos 12 meses'}</p>
      </div>
      <div className="h-64">
        {loading && <div className="bg-bg-subtle rounded-lg animate-pulse h-full w-full" />}
        {!loading && hasData && <Bar data={data} options={options} />}
        {!loading && !hasData && (
          <div className="h-full flex items-center justify-center text-sm text-text-muted">Sin compras en este período</div>
        )}
      </div>
    </div>
  );
}

'use client';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  } from 'chart.js';
import { useDashboardHourlyLogic } from '@/hooks/dashboard/useDashboardHourlyLogic';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1000, easing: 'easeOutQuart' as const },
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.92)', padding: 12, cornerRadius: 8, titleFont: { size: 13 }, bodyFont: { size: 12 } },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } }, border: { display: false } },
  },
  interaction: { intersect: false, mode: 'index' as const },
};

export function DashboardHourlySalesChart() {
    const { hourlySalesData, loading, hasData } = useDashboardHourlyLogic()

    return (
        <div className="relative bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-5 overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '60ms' }}>
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500/60 via-primary/30 to-transparent" />
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-base">Movimientos del Día</h3>
              <p className="text-[11px] text-text-muted mt-0.5 font-medium">Ventas por hora — Hoy</p>
            </div>
            <div className="flex items-center gap-2 text-text-muted text-[11px] font-semibold bg-bg-subtle/60 px-2.5 py-1.5 rounded-full">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              En tiempo real
            </div>
          </div>
          <div className="h-56">
            {loading && <div className="bg-bg-subtle rounded-lg animate-pulse h-full w-full" />}
            {!loading && hasData && hourlySalesData && <Line data={hourlySalesData} options={lineOptions} />}
          </div>
        </div>
    )
}

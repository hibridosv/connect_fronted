'use client';

import { useDashboardChartsLogic } from '@/hooks/dashboard/useDashboardChartsLogic';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FiTrendingUp } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 900, easing: 'easeOutQuart' as const },
  plugins: {
    legend: { position: 'top' as const, labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } } },
    tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.92)', padding: 12, cornerRadius: 8, titleFont: { size: 13 }, bodyFont: { size: 12 } },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } }, border: { display: false } },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
  animation: { animateRotate: true, duration: 1000, easing: 'easeOutQuart' as const },
  plugins: {
    legend: { position: 'bottom' as const, labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } } },
    tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.92)', padding: 12, cornerRadius: 8 },
  },
};

export function DashboardCharts() {
    const { weeklySalesData, paymentMethodsData, loading, hasWeekData, hasPayData } = useDashboardChartsLogic()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <div className="lg:col-span-2 relative bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-5 overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary/60 via-accent/40 to-transparent" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-text-base">Ventas de la Semana</h3>
                <p className="text-[11px] text-text-muted mt-0.5 font-medium">Comparativa con semana anterior</p>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                <FiTrendingUp className="w-3 h-3" />
                +15.3%
              </div>
            </div>
            <div className="h-64">
              {loading && <div className="bg-bg-subtle rounded-lg animate-pulse h-full w-full" />}
              {!loading && hasWeekData && weeklySalesData && <Bar data={weeklySalesData} options={barOptions} />}
            </div>
          </div>

          <div className="relative bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-5 overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-accent/60 via-primary/30 to-transparent" />
            <h3 className="text-sm font-bold text-text-base mb-0.5">Métodos de Pago</h3>
            <p className="text-[11px] text-text-muted mb-4 font-medium">Distribución del día</p>
            <div className="h-64 flex items-center justify-center">
              {loading && <div className="bg-bg-subtle rounded-lg animate-pulse h-full w-full" />}
              {!loading && hasPayData && paymentMethodsData && <Doughnut data={paymentMethodsData} options={doughnutOptions} />}
            </div>
          </div>

        </div>
    )
}

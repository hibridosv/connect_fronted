'use client';

import { formatDashboardValue } from '@/hooks/dashboard/useDashboardWidgetsLogic';
import { DashboardWidget, DashboardWidgetData } from '@/interfaces/dashboard';
import { FiArrowDownRight, FiArrowUpRight, FiBox, FiCreditCard, FiDollarSign, FiPercent, FiShoppingCart, FiTarget, FiXCircle } from 'react-icons/fi';
import { HiOutlineBanknotes, HiOutlineTableCells } from 'react-icons/hi2';

const icons: { [key: string]: React.ElementType } = {
  sales_total: FiDollarSign,
  orders_count: FiShoppingCart,
  average_ticket: FiCreditCard,
  profit: FiTarget,
  margin: FiPercent,
  discounts: FiPercent,
  sold_units: FiBox,
  cancellations: FiXCircle,
  expenses: HiOutlineBanknotes,
  inventory_value: FiBox,
  open_tables: HiOutlineTableCells,
  receivables: HiOutlineBanknotes,
  overdue_installments: HiOutlineBanknotes,
  payables: HiOutlineBanknotes,
};

// en estos indicadores subir es malo
const lowerIsBetter = ['discounts', 'cancellations', 'expenses'];

interface WidgetKpiProps {
  widget: DashboardWidget;
  data?: DashboardWidgetData;
  loading: boolean;
  currency: string;
}

export function WidgetKpi({ widget, data, loading, currency }: WidgetKpiProps) {
  const Icon = icons[widget.key] ?? FiDollarSign;
  const hasPercent = data?.percent !== null && data?.percent !== undefined;
  const good = lowerIsBetter.includes(widget.key) ? !data?.upward : !!data?.upward;

  return (
    <div className="relative h-full bg-bg-content rounded-xl shadow-sm border border-bg-subtle px-3.5 py-3 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group animate-slide-up" title={widget.description}>
      <div className="flex items-center gap-3">
        <div className="shrink-0 p-2 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform duration-300">
          <Icon className="text-primary" style={{ width: '18px', height: '18px' }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1 truncate">{widget.title}</p>
          {loading || !data ? (
            <div className="h-5 bg-bg-subtle rounded w-4/5 animate-pulse" />
          ) : data.error ? (
            <p className="text-xs text-danger font-medium">Sin datos</p>
          ) : (
            <p className="text-lg sm:text-xl font-extrabold text-text-base tracking-tight leading-none tabular-nums truncate">
              {formatDashboardValue(data.value, widget.format, currency)}
            </p>
          )}
        </div>
      </div>
      {!loading && data && !data.error && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold min-h-[1rem]">
          {hasPercent && (
            <span className={`flex items-center gap-0.5 ${good ? 'text-success' : 'text-danger'}`}>
              {data.upward ? <FiArrowUpRight /> : <FiArrowDownRight />}
              {Math.abs(data.percent as number).toFixed(1)}%
            </span>
          )}
          {widget.range && !hasPercent && <span className="text-text-muted">Sin período anterior para comparar</span>}
          {widget.range && hasPercent && (
            <span className="text-text-muted truncate">vs {formatDashboardValue(data.previous, widget.format, currency)}</span>
          )}
          {widget.key === 'expenses' && data.extra?.percent_of_sales !== null && data.extra?.percent_of_sales !== undefined && (
            <span className="text-text-muted truncate">· {data.extra.percent_of_sales}% de las ventas</span>
          )}
          {widget.key === 'open_tables' && <span className="text-text-muted">de {data.extra?.total ?? 0} mesas</span>}
          {!widget.range && widget.key !== 'open_tables' && <span className="text-text-muted">Al momento</span>}
        </div>
      )}
    </div>
  );
}

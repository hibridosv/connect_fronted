'use client';

import { ContactSummary } from '@/interfaces/contact';
import { formatDateAsDMY } from '@/lib/date-formats';
import { numberToMoney } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import { FiCalendar, FiClock, FiDollarSign, FiPackage, FiRepeat, FiShoppingBag, FiStar, FiTag } from 'react-icons/fi';

export interface ContactKpiCardsProps {
  summary: ContactSummary | null;
  loading: boolean;
}

const lastPurchaseText = (days: number | null) => {
  if (days === null) return 'Sin compras';
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  return `Hace ${days} días`;
};

export function ContactKpiCards({ summary, loading }: ContactKpiCardsProps) {
  const { system } = useConfigStore();

  if (loading && !summary) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle px-3.5 py-3 flex items-center gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-lg bg-bg-subtle shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 bg-bg-subtle rounded w-3/5" />
              <div className="h-4 bg-bg-subtle rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const { kpis, top_products } = summary;
  const favorite = top_products[0];

  const cards = [
    { title: 'Total comprado', value: numberToMoney(kpis.total_sum, system), icon: FiDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Compras', value: kpis.orders_count.toLocaleString(), icon: FiShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Ticket promedio', value: numberToMoney(kpis.average_ticket, system), icon: FiTag, color: 'text-sky-600', bg: 'bg-sky-50' },
    { title: 'Unidades', value: kpis.units_sum.toLocaleString(), icon: FiPackage, color: 'text-amber-600', bg: 'bg-amber-50' },
    {
      title: 'Última compra',
      value: lastPurchaseText(kpis.days_since_last),
      hint: kpis.last_purchase_at ? formatDateAsDMY(kpis.last_purchase_at) : undefined,
      icon: FiClock,
      color: kpis.days_since_last !== null && kpis.days_since_last > 60 ? 'text-danger' : 'text-violet-600',
      bg: kpis.days_since_last !== null && kpis.days_since_last > 60 ? 'bg-red-50' : 'bg-violet-50',
    },
    {
      title: 'Frecuencia',
      value: kpis.frequency_days !== null ? `Cada ${kpis.frequency_days} días` : '--',
      icon: FiRepeat, color: 'text-teal-600', bg: 'bg-teal-50',
    },
    {
      title: 'Cliente desde',
      value: kpis.first_purchase_at ? formatDateAsDMY(kpis.first_purchase_at) : '--',
      hint: 'Primera compra',
      icon: FiCalendar, color: 'text-pink-600', bg: 'bg-pink-50',
    },
    {
      title: 'Producto favorito',
      value: favorite?.product ?? '--',
      hint: favorite ? `${favorite.quantity_sum.toLocaleString()} unidades` : undefined,
      icon: FiStar, color: 'text-orange-600', bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="relative bg-bg-content rounded-xl shadow-sm border border-bg-subtle px-3.5 py-3 flex items-center gap-3 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-slide-up cursor-default"
          style={{ animationDelay: `${index * 55}ms` }}
          title={card.value}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bg-subtle/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

          <div className={`shrink-0 p-2 rounded-lg ${card.bg} group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300`}>
            <card.icon className={card.color} style={{ width: '18px', height: '18px' }} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">{card.title}</p>
            <p className="text-base sm:text-lg font-extrabold text-text-base tracking-tight leading-tight tabular-nums truncate">{card.value}</p>
            {card.hint && <p className="text-[10px] text-text-muted truncate mt-0.5">{card.hint}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

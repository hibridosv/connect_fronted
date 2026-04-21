'use client';

import { useDashboardKpiCardsLogic } from '@/hooks/dashboard/useDashboardKpiCardsLogic';

export function DashboardKpiCards() {
  const { formattedCards, loading, hasData } = useDashboardKpiCardsLogic()

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle px-3.5 py-3 flex items-center gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-lg bg-bg-subtle shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 bg-bg-subtle rounded w-3/5" />
              <div className="h-4 bg-bg-subtle rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!hasData) return null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
      {formattedCards.map((card: any, index: number) => (
        <div
          key={card.title}
          className="relative bg-bg-content rounded-xl shadow-sm border border-bg-subtle px-3.5 py-3 flex items-center gap-3 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-slide-up cursor-default"
          style={{ animationDelay: `${index * 55}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bg-subtle/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

          <div className={`shrink-0 p-2 rounded-lg ${card.bg} group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300`}>
            <card.icon className={`w-4.5 h-4.5 ${card.color}`} style={{ width: '18px', height: '18px' }} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">{card.title}</p>
            <p className="text-lg sm:text-xl font-extrabold text-text-base tracking-tight leading-none tabular-nums truncate">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

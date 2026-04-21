'use client';

import { useDashboardDetailCardsLogic } from '@/hooks/dashboard/useDashboardDetailCardsLogic';

export function DashboardDetailCards() {
    const { detailCards, loading, hasData } = useDashboardDetailCardsLogic()

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle px-3 py-2.5 flex items-center gap-2.5 animate-pulse">
                        <div className="w-7 h-7 rounded-lg bg-bg-subtle shrink-0" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-3.5 bg-bg-subtle rounded w-4/5" />
                            <div className="h-2.5 bg-bg-subtle rounded w-3/5" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!hasData) return null

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {detailCards.map((card: any, index: number) => (
            <div
              key={card.label}
              className="relative bg-bg-content rounded-xl shadow-sm border border-bg-subtle px-3 py-2.5 flex items-center gap-2.5 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group animate-slide-up cursor-default"
              style={{ animationDelay: `${index * 35}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bg-subtle/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none" />

              <div className={`shrink-0 w-7 h-7 rounded-lg ${card.bg} flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-200`}>
                <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-text-base leading-none tabular-nums">{card.value}</p>
                <p className="text-[9px] font-semibold text-text-muted mt-0.5 uppercase tracking-wide truncate">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
    )
}

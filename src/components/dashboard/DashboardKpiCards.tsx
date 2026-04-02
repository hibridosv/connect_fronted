'use client';

import { useDashboardKpiCardsLogic } from '@/hooks/dashboard/useDashboardKpiCardsLogic';

export function DashboardKpiCards() {
  const { formattedCards, loading, hasData } = useDashboardKpiCardsLogic()

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-3.5 sm:p-5 h-[120px] animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-bg-subtle"></div>
            </div>
            <div className="mt-4">
              <div className="h-4 bg-bg-subtle rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-bg-subtle rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!hasData) return null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {formattedCards.map((card: any) => (
        <div key={card.title}
          className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-3.5 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="flex justify-start items-center">
            <div className={`p-2.5 rounded-xl ${card.bg} transition-transform duration-300 hover:scale-110`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-text-muted font-semibold ml-2 text-xl">{card.title}</p>
          </div>
          <div className="mt-2">
            <p className="text-xl sm:text-2xl font-bold text-text-base mt-0.5">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

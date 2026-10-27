'use client';

import { DashboardInsight, DashboardWidget, DashboardWidgetData } from '@/interfaces/dashboard';
import useDashBoardStore from '@/stores/dashboardStore';
import Link from 'next/link';
import { FiAlertOctagon, FiAlertTriangle, FiCheck, FiChevronRight, FiInfo, FiX } from 'react-icons/fi';
import { WidgetCard } from './WidgetCard';

interface WidgetInsightsProps {
  widget: DashboardWidget;
  data?: DashboardWidgetData;
  loading: boolean;
  currency: string;
}

const severityStyles = {
  danger: { icon: FiAlertOctagon, box: 'border-danger/30 bg-danger/5', text: 'text-danger' },
  warning: { icon: FiAlertTriangle, box: 'border-warning/30 bg-warning/5', text: 'text-warning' },
  info: { icon: FiInfo, box: 'border-info/30 bg-info/5', text: 'text-info' },
};

function InsightItem({ insight, onUpdate }: { insight: DashboardInsight; onUpdate: (id: string, status: 'dismissed' | 'done') => void }) {
  const style = severityStyles[insight.severity] ?? severityStyles.info;
  const Icon = style.icon;

  return (
    <li className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${style.box}`}>
      <Icon className={`shrink-0 mt-0.5 ${style.text}`} size={16} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-text-base">{insight.title}</p>
        <p className="text-xs text-text-muted mt-0.5">{insight.body}</p>
        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] font-semibold">
          {insight.action && (
            <Link href={insight.action} className="flex items-center gap-0.5 text-primary hover:underline">
              Revisar <FiChevronRight />
            </Link>
          )}
          <button type="button" onClick={() => onUpdate(insight.id, 'done')} className="flex items-center gap-0.5 text-success hover:underline">
            <FiCheck /> Hecho
          </button>
        </div>
      </div>
      <button type="button" onClick={() => onUpdate(insight.id, 'dismissed')} title="Descartar" className="shrink-0 p-1 rounded hover:bg-bg-subtle text-text-muted">
        <FiX size={14} />
      </button>
    </li>
  );
}

export function WidgetInsights({ widget }: WidgetInsightsProps) {
  const { insights, insightsLoading, updateInsight } = useDashBoardStore();
  const list = insights ?? [];
  const urgent = list.filter((insight) => insight.severity === 'danger').length;

  return (
    <WidgetCard
      widget={widget}
      loading={insights === null && insightsLoading}
      badge={list.length > 0 && (
        <span className={`shrink-0 text-[11px] font-bold px-2 py-1 rounded-full ${urgent > 0 ? 'bg-danger/10 text-danger' : 'bg-bg-subtle/60 text-text-muted'}`}>
          {urgent > 0 ? `${urgent} urgentes de ${list.length}` : list.length}
        </span>
      )}
    >
      {list.length === 0 ? (
        <p className="text-xs text-text-muted font-medium">Todo en orden: no hay nada que revisar por ahora.</p>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-96 overflow-y-auto custom-scrollbar">
          {list.map((insight) => <InsightItem key={insight.id} insight={insight} onUpdate={updateInsight} />)}
        </ul>
      )}
    </WidgetCard>
  );
}

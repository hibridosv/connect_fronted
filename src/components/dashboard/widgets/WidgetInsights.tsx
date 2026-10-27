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
  danger: { icon: FiAlertOctagon, label: 'Urgente', bar: 'bg-danger', iconBox: 'bg-danger/10 text-danger', chip: 'bg-danger/10 text-danger' },
  warning: { icon: FiAlertTriangle, label: 'Atención', bar: 'bg-warning', iconBox: 'bg-warning/10 text-warning', chip: 'bg-warning/10 text-warning' },
  info: { icon: FiInfo, label: 'Sugerencia', bar: 'bg-info', iconBox: 'bg-info/10 text-info', chip: 'bg-info/10 text-info' },
};

// lo urgente primero
const severityOrder = { danger: 0, warning: 1, info: 2 };

function InsightItem({ insight, onUpdate }: { insight: DashboardInsight; onUpdate: (id: string, status: 'dismissed' | 'done') => void }) {
  const style = severityStyles[insight.severity] ?? severityStyles.info;
  const Icon = style.icon;

  return (
    <li className="group relative flex items-start gap-3 rounded-xl border border-bg-subtle bg-bg-content pl-4 pr-2 py-3 hover:shadow-md transition-shadow duration-200">
      <span className={`absolute left-0 inset-y-0 w-1 rounded-l-xl ${style.bar}`} />
      <span className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${style.iconBox}`}>
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${style.chip}`}>{style.label}</span>
          {insight.source === 'ai' && <span className="text-[9px] font-bold uppercase tracking-wider bg-accent/15 text-accent px-1.5 py-0.5 rounded">IA</span>}
        </div>
        <p className="text-sm font-semibold text-text-base leading-snug mt-1">{insight.title}</p>
        <p className="text-xs text-text-muted leading-relaxed mt-0.5">{insight.body}</p>
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {insight.action && (
            <Link href={insight.action} className="flex items-center gap-0.5 text-[11px] font-semibold px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              Revisar <FiChevronRight />
            </Link>
          )}
          <button type="button" onClick={() => onUpdate(insight.id, 'done')} className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors">
            <FiCheck /> Hecho
          </button>
        </div>
      </div>
      <button type="button" onClick={() => onUpdate(insight.id, 'dismissed')} title="Descartar" className="shrink-0 p-1 rounded text-text-muted opacity-60 group-hover:opacity-100 hover:bg-bg-subtle transition-opacity">
        <FiX size={14} />
      </button>
    </li>
  );
}

export function WidgetInsights({ widget }: WidgetInsightsProps) {
  const { insights, insightsLoading, updateInsight } = useDashBoardStore();
  const list = [...(insights ?? [])].sort((a, b) => (severityOrder[a.severity] ?? 2) - (severityOrder[b.severity] ?? 2));
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
        <div className="flex items-center gap-3 rounded-xl bg-success/5 border border-success/20 px-3 py-3">
          <span className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center bg-success/10 text-success"><FiCheck size={16} /></span>
          <p className="text-xs text-text-muted font-medium">Todo en orden: no hay nada que revisar por ahora.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 max-h-[28rem] overflow-y-auto custom-scrollbar pr-1">
          {list.map((insight) => <InsightItem key={insight.id} insight={insight} onUpdate={updateInsight} />)}
        </ul>
      )}
    </WidgetCard>
  );
}

'use client';

import { buildRange, rangePresets } from '@/hooks/dashboard/useDashboardWidgetsLogic';
import { DashboardPeriod, DashboardRangeValues } from '@/interfaces/dashboard';
import { formatDateAsDMY } from '@/lib/date-formats';
import { useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

interface DashboardRangeSelectorProps {
  range: DashboardRangeValues;
  period: DashboardPeriod | null;
  loading: boolean;
  onChange: (range: DashboardRangeValues) => void;
  onRefresh: () => void;
}

const asDate = (date: string) => formatDateAsDMY(`${date}T00:00:00`);

export function DashboardRangeSelector({ range, period, loading, onChange, onRefresh }: DashboardRangeSelectorProps) {
  const [initialDate, setInitialDate] = useState(range.preset === 'custom' ? range.initialDate : '');
  const [finalDate, setFinalDate] = useState(range.preset === 'custom' ? range.finalDate : '');
  const [showCustom, setShowCustom] = useState(range.preset === 'custom');

  const selectPreset = (preset: string) => {
    if (preset === 'custom') {
      setShowCustom(true);
      return;
    }
    setShowCustom(false);
    onChange(buildRange(preset));
  };

  const applyCustom = () => {
    if (!initialDate) return;
    onChange(buildRange('custom', initialDate, finalDate && finalDate >= initialDate ? finalDate : initialDate));
  };

  return (
    <div className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle px-3 py-2.5 flex flex-col lg:flex-row lg:items-center gap-2.5">
      <div className="flex flex-wrap gap-1.5">
        {rangePresets.map((preset) => {
          const active = showCustom ? preset.key === 'custom' : range.preset === preset.key;
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => selectPreset(preset.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${active ? 'bg-primary text-text-inverted border-primary' : 'bg-bg-base text-text-muted border-bg-subtle hover:bg-bg-subtle'}`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {showCustom && (
        <div className="flex flex-wrap items-center gap-1.5">
          <input type="date" className="input !py-1 !text-xs w-auto" value={initialDate} onChange={(e) => setInitialDate(e.target.value)} />
          <span className="text-xs text-text-muted">a</span>
          <input type="date" className="input !py-1 !text-xs w-auto" value={finalDate} min={initialDate} onChange={(e) => setFinalDate(e.target.value)} />
          <button type="button" onClick={applyCustom} disabled={!initialDate} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-text-inverted disabled:opacity-50">
            Aplicar
          </button>
        </div>
      )}

      <div className="lg:ml-auto flex items-center gap-2 text-[11px] text-text-muted font-medium">
        {period && (
          <span>
            {period.from === period.to ? asDate(period.from) : `${asDate(period.from)} – ${asDate(period.to)}`}
            {' · comparado con '}
            {period.previous_from === period.previous_to ? asDate(period.previous_from) : `${asDate(period.previous_from)} – ${asDate(period.previous_to)}`}
          </span>
        )}
        <button type="button" onClick={onRefresh} title="Actualizar" className="p-1.5 rounded-lg hover:bg-bg-subtle text-text-muted">
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  );
}

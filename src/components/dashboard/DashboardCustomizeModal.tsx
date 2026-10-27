'use client';

import { Button, Preset } from '@/components/button/button';
import { Switch } from '@/components/button/Switch';
import Modal from '@/components/modal/Modal';
import { DashboardArrangement, DashboardWidget } from '@/interfaces/dashboard';
import useDashBoardStore from '@/stores/dashboardStore';
import { useEffect, useState } from 'react';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';

interface DashboardCustomizeModalProps {
  isShow: boolean;
  onClose: () => void;
}

const typeNames: { [key: string]: string } = {
  kpi: 'Indicador',
  series: 'Gráfica',
  donut: 'Distribución',
  list: 'Lista',
  forecast: 'Proyección',
  stats: 'Resumen',
};

export function DashboardCustomizeModal({ isShow, onClose }: DashboardCustomizeModalProps) {
  const { widgets, arrangement, customized, saving, saveLayout, resetLayout } = useDashBoardStore();
  const [draft, setDraft] = useState<DashboardArrangement[]>([]);

  useEffect(() => {
    if (isShow) setDraft(arrangement);
  }, [isShow, arrangement]);

  const widgetOf = (key: string): DashboardWidget | undefined => widgets.find((widget) => widget.key === key);

  const move = (index: number, step: number) => {
    const target = index + step;
    if (target < 0 || target >= draft.length) return;
    const next = [...draft];
    [next[index], next[target]] = [next[target], next[index]];
    setDraft(next);
  };

  const toggle = (index: number, visible: boolean) => {
    setDraft(draft.map((item, i) => (i === index ? { ...item, visible } : item)));
  };

  const save = async () => {
    if (await saveLayout(draft)) onClose();
  };

  const reset = async () => {
    if (await resetLayout()) onClose();
  };

  const visibleCount = draft.filter((item) => item.visible).length;

  return (
    <Modal show={isShow} onClose={onClose} headerTitle="Personalizar dashboard" size="lg">
      <Modal.Body>
        <p className="text-xs text-text-muted mb-3">
          Elige qué ver y en qué orden. Los cambios son solo para tu usuario. {visibleCount} de {draft.length} visibles.
        </p>
        <ul className="divide-y divide-bg-subtle max-h-[60vh] overflow-y-auto custom-scrollbar">
          {draft.map((item, index) => {
            const widget = widgetOf(item.key);
            if (!widget) return null;
            return (
              <li key={item.key} className={`flex items-center gap-3 py-2 ${item.visible ? '' : 'opacity-60'}`}>
                <div className="flex flex-col">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="p-0.5 rounded hover:bg-bg-subtle disabled:opacity-30" title="Subir">
                    <FiArrowUp size={14} />
                  </button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === draft.length - 1} className="p-0.5 rounded hover:bg-bg-subtle disabled:opacity-30" title="Bajar">
                    <FiArrowDown size={14} />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-base truncate">{widget.title}</p>
                  <p className="text-[11px] text-text-muted truncate">{typeNames[widget.type] ?? widget.type} · {widget.description}</p>
                </div>
                <Switch checked={item.visible} onChange={(visible) => toggle(index, visible)} label="" sizing="sm" name={`visible-${item.key}`} />
              </li>
            );
          })}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-wrap justify-between gap-2 w-full">
          <div>
            {customized && <Button text="Restablecer" preset={Preset.cancel} onClick={reset} disabled={saving} />}
          </div>
          <div className="flex gap-2">
            <Button preset={Preset.close} onClick={onClose} />
            <Button preset={saving ? Preset.saving : Preset.save} onClick={save} disabled={saving} />
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

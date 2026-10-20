'use client';

import { ContactSummaryReturns } from '@/interfaces/contact';
import { numberToMoney } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import { FiCornerUpLeft } from 'react-icons/fi';

export interface ContactReturnsCardProps {
  returns: ContactSummaryReturns | undefined;
  totalPurchased: number;
}

export function ContactReturnsCard({ returns, totalPurchased }: ContactReturnsCardProps) {
  const { system } = useConfigStore();
  if (!returns) return null;

  const returned = returns.credit_notes_total + returns.returns_total;
  const rate = totalPurchased > 0 ? (returned / totalPurchased) * 100 : 0;

  const rows = [
    { label: 'Notas de crédito', count: returns.credit_notes_count, total: returns.credit_notes_total },
    { label: 'Eventos de retorno', count: returns.returns_count, total: returns.returns_total },
    { label: 'Ventas anuladas', count: returns.canceled_count, total: returns.canceled_total },
  ];

  return (
    <div className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <FiCornerUpLeft className="text-primary" size={16} />
        <h3 className="text-sm font-bold text-text-base">Devoluciones</h3>
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Monto devuelto</p>
          <p className={`text-lg font-extrabold tabular-nums ${returned > 0 ? 'text-danger' : 'text-text-base'}`}>{numberToMoney(returned, system)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Tasa</p>
          <p className="text-sm font-semibold text-text-base tabular-nums">{rate.toFixed(1)}%</p>
        </div>
      </div>

      <ul className="divide-y divide-bg-subtle text-sm">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between py-2">
            <span className="text-text-muted">{row.label} <span className="text-xs">({row.count})</span></span>
            <span className="font-semibold tabular-nums text-text-base">{numberToMoney(row.total, system)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import { ContactSummaryCredit } from '@/interfaces/contact';
import { formatDateAsDMY } from '@/lib/date-formats';
import { numberToMoney } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import Link from 'next/link';
import { FiAlertTriangle, FiCreditCard } from 'react-icons/fi';

export interface ContactCreditCardProps {
  credit: ContactSummaryCredit | undefined;
}

export function ContactCreditCard({ credit }: ContactCreditCardProps) {
  const { system } = useConfigStore();
  if (!credit) return null;

  const used = credit.credit_limit ? Math.min(100, (credit.balance / credit.credit_limit) * 100) : 0;
  const barColor = used >= 90 ? 'bg-danger' : used >= 70 ? 'bg-warning' : 'bg-success';

  return (
    <div className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiCreditCard className="text-primary" size={16} />
          <h3 className="text-sm font-bold text-text-base">Crédito</h3>
        </div>
        {credit.is_credit_block == 1 && (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-50 text-danger border border-red-100">Bloqueado</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Saldo pendiente</p>
          <p className="text-lg font-extrabold text-text-base tabular-nums">{numberToMoney(credit.balance, system)}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Vencido</p>
          <p className={`text-lg font-extrabold tabular-nums ${credit.overdue > 0 ? 'text-danger' : 'text-text-base'}`}>{numberToMoney(credit.overdue, system)}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Límite</p>
          <p className="text-sm font-semibold text-text-base tabular-nums">{credit.credit_limit !== null ? numberToMoney(credit.credit_limit, system) : 'Sin límite'}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Disponible</p>
          <p className={`text-sm font-semibold tabular-nums ${credit.available !== null && credit.available < 0 ? 'text-danger' : 'text-text-base'}`}>
            {credit.available !== null ? numberToMoney(credit.available, system) : '--'}
          </p>
        </div>
      </div>

      {credit.credit_limit !== null && credit.credit_limit > 0 && (
        <div className="mt-3">
          <div className="h-2 rounded-full bg-bg-subtle overflow-hidden">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${used}%` }} />
          </div>
          <p className="text-[11px] text-text-muted mt-1">{used.toFixed(0)}% del límite utilizado</p>
        </div>
      )}

      {credit.overdue > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-danger bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          <FiAlertTriangle className="shrink-0" />
          <span>El cliente tiene saldo vencido</span>
        </div>
      )}

      <div className="mt-4 border-t border-bg-subtle pt-3">
        <p className="text-xs font-semibold text-text-muted mb-2">
          {credit.active_count} crédito(s) activo(s) · {credit.total_count} en total
        </p>
        {credit.active.length > 0 && (
          <ul className="space-y-1.5 max-h-48 overflow-y-auto">
            {credit.active.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-xs bg-bg-subtle/40 rounded px-2 py-1.5">
                <div>
                  <span className="font-semibold text-text-base">#{item.invoice ?? '--'}</span>
                  <span className="text-text-muted ml-2">
                    {item.modality == 2 ? `${item.installments_count ?? ''} cuotas` : item.expiration ? `Vence ${formatDateAsDMY(item.expiration)}` : 'Libre'}
                  </span>
                </div>
                <span className="font-semibold tabular-nums text-text-base">{numberToMoney(item.balance, system)}</span>
              </li>
            ))}
          </ul>
        )}
        {credit.total_count > 0 && (
          <Link href="/accounts/receivable" className="block text-center text-xs text-primary hover:underline mt-3">Ir a cuentas por cobrar</Link>
        )}
      </div>
    </div>
  );
}

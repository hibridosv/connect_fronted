'use client'
import accountReceivableStore from '@/stores/accounts/accountReceivableStore';
import { useEffect } from 'react';

/** Advierte si una venta a credito deja al cliente sobre su limite (no bloquea el cobro) */
export function useClientCreditLimitLogic(clientId: string | null | undefined, total: number, enabled: boolean) {
  const { clientSummary, loadClientSummary } = accountReceivableStore();

  useEffect(() => {
    if (enabled && clientId) loadClientSummary(`accounts/receivable/client/${clientId}/summary`);
  }, [enabled, clientId, loadClientSummary]);

  const summary = clientSummary?.client_id === clientId ? clientSummary : null;
  const exceedsLimit = !!summary && summary.credit_limit !== null && summary.balance + total > summary.credit_limit;

  return { summary, exceedsLimit };
}

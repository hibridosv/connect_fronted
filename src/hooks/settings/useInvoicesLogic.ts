'use client'
import useReverb from '@/hooks/useReverb';
import { getLastElement, getTotalOfItemWithStatus } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import invoicesStore from '@/stores/settings/invoicesStore';
import { useEffect, useMemo } from 'react';

export function useInvoicesLogic() {
  const { invoices, payLink, loading, sendingLink, loadInvoices, loadPayLink } = invoicesStore();
  const { system, tenant } = useConfigStore();

  const { random: pusherEvent } = useReverb(`${tenant?.id}-channel-pay`,'PusherPayInvoiceEvent',true);

  useEffect(() => {
    if (tenant?.id) {
      loadInvoices(
        `settings/invoices?filterWhere[tenant_id]==${tenant.id}&included=items.payment,tenant&sort=-created_at&perPage=10`
      );
    }
  }, [tenant, pusherEvent, loadInvoices]);

  const total = useMemo(() => {
    return getTotalOfItemWithStatus(invoices?.data, 'total', 'status', 1);
  }, [invoices]);

  const lastInvoice = useMemo(() => {
    return getLastElement(invoices?.data);
  }, [invoices]);

  useEffect(() => {
    if (lastInvoice?.id && total > 0) {
      loadPayLink(lastInvoice.id);
    }
  }, [lastInvoice, total, loadPayLink]);

  return {
    invoices,
    payLink,
    loading,
    sendingLink,
    total,
    lastInvoice,
    system,
    tenant,
  };
}

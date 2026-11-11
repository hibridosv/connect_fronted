'use client';
import { Alert } from "@/components/Alert/Alert";
import { permissionExists } from "@/lib/utils";
import { getServices } from "@/services/services";
import useConfigStore from "@/stores/configStore";
import ordersStore from "@/stores/orders/ordersStore";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Advertencias antes de cobrar (GET orders/{id}/dte-check, docs/pending/plan-diagnostico-dte.md de connect, fase 3):
 * lo que Hacienda suele rechazar. Solo avisan: no deshabilitan el cobro. Si la consulta falla, no se muestra nada.
 */

// ya los revisa SalesMessages (cliente del CCF o del sujeto excluido y requiredFieldsCCF): no se repiten
const COVERED_BY_SALES_MESSAGES = ['ccf_sin_cliente', 'sujeto_excluido_sin_cliente', 'receptor_sin_nrc', 'receptor_sin_nit', 'receptor_actividad'];

interface DteWarning {
  code: string;
  severity: 'high' | 'low';
  message: string;
  target: 'contact' | 'none';
}

export function DteWarnings() {
  const { order } = ordersStore();
  const { permission } = useConfigStore();
  const [warnings, setWarnings] = useState<DteWarning[]>([]);
  const isElectronic = order?.invoice_assigned?.is_electronic == 1;
  const client = order?.client;

  useEffect(() => {
    setWarnings([]);
    if (!order?.id || !isElectronic) return;
    let cancelled = false;
    getServices(`orders/${order.id}/dte-check`)
      .then((response: any) => { if (!cancelled) setWarnings(response?.data?.data?.warnings ?? []); })
      .catch(() => {}); // es solo ayuda: el cobro sigue igual
    return () => { cancelled = true; };
  }, [order?.id, order?.invoice_type_id, order?.client_id, isElectronic, client?.document, client?.id_number, client?.register, client?.roar]);

  const visible = warnings.filter((w) => !COVERED_BY_SALES_MESSAGES.includes(w.code));
  if (visible.length === 0) return null;
  const canEditContact = !!order?.client_id && permissionExists(permission, 'directory');

  return (
    <div className="space-y-1 my-1">
      {visible.map((w) => (
        <div key={w.code}>
          <Alert type={w.severity === 'high' ? 'danger' : 'warning'} title="Revisa antes de cobrar" text={w.message} isDismissible={false} />
          {w.target === 'contact' && canEditContact && (
            <Link href={`/contacts/${order?.client_id}`} className="text-xs text-primary underline ml-1">Editar contacto</Link>
          )}
        </div>
      ))}
    </div>
  );
}

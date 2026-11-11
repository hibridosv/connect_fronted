'use client';
import { permissionExists } from "@/lib/utils";
import { getServices } from "@/services/services";
import useConfigStore from "@/stores/configStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiTool } from "react-icons/fi";
import { Button, Preset } from "../button/button";

/**
 * Diagnostico de un DTE rechazado (docs/pending/plan-diagnostico-dte.md de connect): causa, que hacer y un
 * enlace al registro a corregir. El diagnostico lo guarda billing (documents.diagnosis); connect agrega el
 * registro a corregir (target_id) en GET electronic/documents/{id}/diagnosis.
 */

export interface DteDiagnosisItem {
  code: string;
  cause?: string;
  action?: string;
  target?: 'contact' | 'product' | 'business' | 'none';
  target_id?: string | null;
  line?: number | null;
  resend?: 'after_fix' | 'as_is' | 'no';
}

/** diagnosticos con causa conocida (sin los "unknown") */
export function knownDiagnosis(diagnosis: any): DteDiagnosisItem[] {
  const list = typeof diagnosis === 'string' ? safeParse(diagnosis) : diagnosis;
  return Array.isArray(list) ? list.filter((item: any) => item?.code && item.code !== 'unknown') : [];
}

function safeParse(value: string) {
  try { return JSON.parse(value); } catch { return null; }
}

// pantalla para corregir cada tipo de registro y el permiso del menu que la abre
// el contacto se edita en contacts/[id]/edit, que con ?dte= muestra la causa y el boton para volver a reenviar
const TARGETS: Record<string, { label: string; permission: string; href: (id?: string | null, documentId?: string) => string | null }> = {
  contact: { label: 'Editar contacto', permission: 'directory', href: (id, documentId) => id ? `/contacts/${id}/edit${documentId ? `?dte=${documentId}` : ''}` : '/contacts/search' },
  product: { label: 'Editar producto', permission: 'inventory-edit', href: (id) => id ? `/products/${id}/edit` : null },
  business: { label: 'Datos del negocio', permission: 'config', href: () => '/settings/general' },
};

interface DteDiagnosisListProps {
  document: any;
  onResend?: (codigoGeneracion: string) => void;
}

export function DteDiagnosisList({ document, onResend }: DteDiagnosisListProps) {
  const { permission } = useConfigStore();
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    setDetail(null);
    if (!document?.id || document?.status != 3 || knownDiagnosis(document?.diagnosis).length === 0) return;
    getServices(`electronic/documents/${document.id}/diagnosis`)
      .then((response: any) => setDetail(response?.data?.data ?? null))
      .catch(() => {}); // sin target_id solo se pierden los enlaces directos
  }, [document?.id, document?.status, document?.diagnosis]);

  const items = knownDiagnosis(detail?.diagnosis ?? document?.diagnosis);
  if (items.length === 0) return null;
  const canResend = !!onResend && items.every((item) => item.resend !== 'no');

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const target = item.target ? TARGETS[item.target] : undefined;
        const href = target && permissionExists(permission, target.permission) ? target.href(item.target_id, document?.id) : null;
        return (
          <div key={item.code} className="flex items-start gap-3 p-3 bg-warning/10 rounded-md">
            <FiTool className="text-warning flex-shrink-0 mt-1" size={18} />
            <div className="text-sm space-y-1">
              <p className="font-semibold text-text-base">{item.cause}</p>
              <p className="text-text-muted">{item.action}</p>
              {href && (
                <Link href={href} className="inline-block text-primary underline font-medium">{target?.label}</Link>
              )}
            </div>
          </div>
        );
      })}
      {canResend && (
        <div className="flex justify-end">
          <Button preset={Preset.primary} text="Reenviar documento" onClick={() => onResend?.(document?.codigo_generacion)} />
        </div>
      )}
    </div>
  );
}

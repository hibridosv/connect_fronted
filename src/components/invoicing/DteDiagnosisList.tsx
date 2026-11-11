'use client';
import { permissionExists } from "@/lib/utils";
import { getServices } from "@/services/services";
import useConfigStore from "@/stores/configStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiTool } from "react-icons/fi";

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

// campos del formulario de contacto (ContactAddSV) que corresponden a cada diagnostico, con la indicacion que se
// muestra debajo del campo marcado en contacts/[id]/edit?dte=
const CONTACT_FIELDS: Record<string, { fields: string[]; hint: string }> = {
  receptor_nit_formato: { fields: ['document'], hint: 'Debe tener 14 dígitos, o 9 si es un DUI homologado.' },
  receptor_nit_no_existe: { fields: ['document'], hint: 'Hacienda no tiene registrado este NIT.' },
  receptor_nrc_no_corresponde: { fields: ['register', 'document'], hint: 'El NRC no corresponde a este NIT.' },
  receptor_documento: { fields: ['id_number', 'document'], hint: 'El documento no es válido o está vacío.' },
  sujeto_excluido_documento: { fields: ['id_number', 'document'], hint: 'El DUI o NIT del sujeto excluido no es válido.' },
  receptor_actividad: { fields: ['activity_code', 'roar'], hint: 'La actividad económica no es válida o está incompleta.' },
  receptor_direccion: { fields: ['departament_doc', 'town_doc', 'address_doc'], hint: 'Revisa el departamento, el municipio y la dirección.' },
};

/** { campo: indicacion } de los campos del contacto que hay que corregir segun el diagnostico */
export function contactFieldHints(items: DteDiagnosisItem[]): Record<string, string> {
  const hints: Record<string, string> = {};
  items.forEach((item) => {
    const entry = CONTACT_FIELDS[item.code];
    entry?.fields.forEach((field) => { hints[field] ??= entry.hint; });
  });
  return hints;
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
}

export function DteDiagnosisList({ document }: DteDiagnosisListProps) {
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
    </div>
  );
}

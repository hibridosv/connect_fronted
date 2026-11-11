'use client';
import { Spinner } from "@/components/Spinner";

import { Button, Preset } from "@/components/button/button";
import { ContactAddGT } from "@/components/contacs/ContactAddGT";
import { ContactAddHN } from "@/components/contacs/ContactAddHN";
import { ContactAddSV } from "@/components/contacs/ContactAddSV";
import { ContactDefaultForm } from "@/components/contacs/ContactDefaultForm";
import { contactFieldHints, DteDiagnosisItem, knownDiagnosis } from "@/components/invoicing/DteDiagnosisList";
import { tipoDTE } from "@/components/invoicing/utils";
import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { ViewTitle } from "@/components/ViewTitle";
import { useContactDetailsLogic } from "@/hooks/contacts/useContactDetailsLogic";
import { formatDateAsDMY } from "@/lib/date-formats";
import { getServices } from "@/services/services";
import useConfigStore from "@/stores/configStore";
import useContactStore from "@/stores/ContactStore";
import useModalStore from "@/stores/modalStorage";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FiAlertTriangle, FiCheckCircle, FiFileText } from "react-icons/fi";

/**
 * Editar un contacto en su propia pagina (el mismo formulario del modal de Contactos).
 * Desde Documentos rechazados se llega con ?dte={id del documento}: al lado del formulario se muestra el documento
 * y lo que hay que corregir del contacto (con los campos marcados en el formulario) y, al guardar, el boton para volver a reenviarlo
 * (docs/pending/plan-diagnostico-dte.md de connect).
 */

interface DocumentDiagnosis {
  tipo_dte: string | null;
  numero_control: string | null;
  created_at: string | null;
  observaciones: string[];
  descripcion_msg: string | null;
  diagnosis: DteDiagnosisItem[];
}

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const dteId = searchParams.get('dte');
  const router = useRouter();
  const { system } = useConfigStore();
  const { saving, error } = useContactStore();
  const { closeModal } = useModalStore();
  const { summary, loading, notFound } = useContactDetailsLogic(id);
  const [document, setDocument] = useState<DocumentDiagnosis | null>(null);
  const [saved, setSaved] = useState(false);
  const wasSaving = useRef(false);
  // solo lo que se corrige en el contacto, y los campos del formulario que hay que marcar
  const causes = useMemo(() => knownDiagnosis(document?.diagnosis).filter((item) => item.target === 'contact'), [document]);
  const fieldHints = useMemo(() => (causes.length ? contactFieldHints(causes) : undefined), [causes]);

  // documento rechazado que trajo al usuario aqui
  useEffect(() => {
    if (!dteId) return;
    getServices(`electronic/documents/${dteId}/diagnosis`)
      .then((response: any) => setDocument(response?.data?.data ?? null))
      .catch(() => setDocument(null));
  }, [dteId]);

  // al terminar de guardar: el store abre el detalle del contacto (flujo del modal); aqui se queda en la pagina
  useEffect(() => {
    if (wasSaving.current && !saving && !error) {
      setSaved(true);
      closeModal('contactDetails');
    }
    wasSaving.current = saving;
  }, [saving, error, closeModal]);

  if (notFound) {
    return (
      <div className="p-4">
        <NothingHere text="No se encontró el contacto" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-4">
        <SkeletonTable rows={8} columns={4} />
      </div>
    );
  }

  const contact = summary.contact;
  const backHref = dteId ? '/invoicing/rejected' : `/contacts/${id}`;
  const showPanel = !!dteId;

  return (
    <div className="pb-4 md:pb-10">
      <div className="flex items-center gap-2 px-2 sm:px-4">
        <Link href={backHref} className="text-text-muted hover:text-primary p-2" title={dteId ? 'Volver a documentos rechazados' : 'Volver al contacto'}>
          <FaArrowLeft size={16} />
        </Link>
        <ViewTitle text={`Editar: ${contact.name}`} />
        {loading && <Spinner size={16} color="muted" className="shrink-0" />}
      </div>

      <div className={`grid grid-cols-1 gap-4 px-2 sm:px-4 mt-2 ${showPanel ? 'md:grid-cols-10' : ''}`}>
        <div className={`${showPanel ? 'md:col-span-6' : ''} min-w-0`}>
          <div className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-2">
            {contact.is_default == 1 ?
              <ContactDefaultForm isShow={true} record={contact} /> : <>
              {system?.country == 1 && <ContactAddSV isShow={true} record={contact} highlight={fieldHints} />}
              {system?.country == 2 && <ContactAddHN isShow={true} record={contact} />}
              {system?.country == 3 && <ContactAddGT isShow={true} record={contact} />}
            </>}
          </div>
        </div>

        {showPanel && (
          <div className="md:col-span-4 min-w-0">
            <div className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle overflow-hidden md:sticky md:top-4">
              {/* documento */}
              <div className="flex items-start gap-3 p-4 border-b border-bg-subtle bg-danger/5">
                <div className="w-9 h-9 rounded-lg bg-danger/10 text-danger flex items-center justify-center shrink-0">
                  <FiFileText size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-danger">Documento rechazado</p>
                  {document ? (
                    <>
                      <p className="text-sm font-semibold text-text-base truncate">
                        {tipoDTE(document.tipo_dte ?? '')} {document.numero_control ?? ''}
                      </p>
                      {document.created_at && <p className="text-xs text-text-muted">Emitido el {formatDateAsDMY(document.created_at)}</p>}
                    </>
                  ) : (
                    <p className="text-sm text-text-muted">Cargando el documento...</p>
                  )}
                </div>
              </div>

              {/* que corregir */}
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-bold text-text-base uppercase tracking-wider">Qué corregir</h3>
                {document && causes.length === 0 && (
                  <p className="text-sm text-text-muted">El rechazo no indica un dato del contacto. Revisa el mensaje de Hacienda.</p>
                )}
                <ol className="space-y-3">
                  {causes.map((item, index) => (
                    <li key={item.code} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-warning/15 text-warning text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div className="text-sm space-y-0.5">
                        <p className="font-semibold text-text-base flex items-start gap-1.5">
                          <FiAlertTriangle className="text-warning shrink-0 mt-0.5" size={14} />
                          {item.cause}
                        </p>
                        <p className="text-text-muted">{item.action}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                {document && (document.observaciones?.length > 0 || document.descripcion_msg) && (
                  <details className="pt-1">
                    <summary className="text-xs text-text-muted cursor-pointer">Ver mensaje de Hacienda</summary>
                    <ul className="mt-2 space-y-1 text-xs text-text-muted bg-bg-subtle/60 rounded-lg p-2">
                      {(document.observaciones?.length ? document.observaciones : [document.descripcion_msg]).map((message, i) => (
                        <li key={i} className="break-words">{message}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>

              {/* despues de guardar */}
              <div className={`p-4 border-t border-bg-subtle ${saved ? 'bg-success/10' : 'bg-bg-subtle/30'}`}>
                {saved ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-text-base flex items-center gap-2">
                      <FiCheckCircle className="text-success shrink-0" size={16} />
                      Contacto guardado. Ya puedes reenviar el documento.
                    </p>
                    <Button preset={Preset.primary} text="Volver a documentos rechazados" isFull onClick={() => router.push(backHref)} />
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">Corrige los datos en el formulario y guarda. Después vuelve a Documentos rechazados para reenviarlo.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

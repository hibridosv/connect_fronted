'use client';

import { Alert } from "@/components/Alert/Alert";
import { Button, Preset } from "@/components/button/button";
import { ContactAddGT } from "@/components/contacs/ContactAddGT";
import { ContactAddHN } from "@/components/contacs/ContactAddHN";
import { ContactAddSV } from "@/components/contacs/ContactAddSV";
import { ContactDefaultForm } from "@/components/contacs/ContactDefaultForm";
import { ContactCreditCard } from "@/components/contacs/details/ContactCreditCard";
import { ContactKpiCards } from "@/components/contacs/details/ContactKpiCards";
import { ContactTopProducts } from "@/components/contacs/details/ContactTopProducts";
import { knownDiagnosis } from "@/components/invoicing/DteDiagnosisList";
import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useContactDetailsLogic } from "@/hooks/contacts/useContactDetailsLogic";
import { getServices } from "@/services/services";
import useConfigStore from "@/stores/configStore";
import useContactStore from "@/stores/ContactStore";
import useModalStore from "@/stores/modalStorage";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";

/**
 * Editar un contacto en su propia pagina (el mismo formulario del modal de Contactos), con indicadores de compra,
 * productos mas comprados y credito al lado. Desde Documentos rechazados se llega con ?dte={id del documento}:
 * se muestra la causa del rechazo y, al guardar, el boton para volver y reenviar el documento
 * (docs/pending/plan-diagnostico-dte.md de connect).
 */
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
  const [causes, setCauses] = useState<{ code: string; cause?: string; action?: string }[]>([]);
  const [saved, setSaved] = useState(false);
  const wasSaving = useRef(false);

  // causa del rechazo que trajo al usuario aqui (solo las que se corrigen en el contacto)
  useEffect(() => {
    if (!dteId) return;
    getServices(`electronic/documents/${dteId}/diagnosis`)
      .then((response: any) => setCauses(knownDiagnosis(response?.data?.data?.diagnosis).filter((item) => item.target === 'contact')))
      .catch(() => setCauses([]));
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
        <ToasterMessage />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-4">
        <SkeletonTable rows={8} columns={4} />
        <ToasterMessage />
      </div>
    );
  }

  const contact = summary.contact;
  const backHref = dteId ? '/invoicing/rejected' : `/contacts/${id}`;

  return (
    <div className="pb-4 md:pb-10">
      <div className="flex items-center gap-2 px-2 sm:px-4">
        <Link href={backHref} className="text-text-muted hover:text-primary p-2" title={dteId ? 'Volver a documentos rechazados' : 'Volver al contacto'}>
          <FaArrowLeft size={16} />
        </Link>
        <ViewTitle text={`Editar: ${contact.name}`} />
        {loading && <LuLoader className="animate-spin text-text-muted shrink-0" size={16} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-4 px-2 sm:px-4 mt-2">
        <div className="md:col-span-6 space-y-4 min-w-0">
          {causes.map((item) => (
            <Alert key={item.code} type="warning" title={item.cause} text={item.action ?? ''} isDismissible={false} />
          ))}

          {saved && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-sm">
              <span className="font-medium text-text-base">
                {dteId ? 'Contacto guardado. Ya puedes reenviar el documento.' : 'Contacto guardado.'}
              </span>
              <Button preset={Preset.primary} text={dteId ? 'Volver a documentos rechazados' : 'Ver contacto'} onClick={() => router.push(backHref)} />
            </div>
          )}

          <div className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-2">
            {contact.is_default == 1 ?
              <ContactDefaultForm isShow={true} record={contact} /> : <>
              {system?.country == 1 && <ContactAddSV isShow={true} record={contact} />}
              {system?.country == 2 && <ContactAddHN isShow={true} record={contact} />}
              {system?.country == 3 && <ContactAddGT isShow={true} record={contact} />}
            </>}
          </div>
        </div>

        <div className="md:col-span-4 space-y-4 min-w-0">
          <ContactKpiCards summary={summary} loading={loading} compact />
          <ContactCreditCard credit={summary.credit} />
          <ContactTopProducts products={summary.top_products} loading={loading} />
        </div>
      </div>

      <ToasterMessage />
    </div>
  );
}

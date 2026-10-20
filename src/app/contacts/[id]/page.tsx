'use client';

import { Button, Preset } from "@/components/button/button";
import { DateRange } from "@/components/button/DateRange";
import { ContactCreditCard } from "@/components/contacs/details/ContactCreditCard";
import { ContactKpiCards } from "@/components/contacs/details/ContactKpiCards";
import { ContactProfileCard } from "@/components/contacs/details/ContactProfileCard";
import { ContactPurchasesChart } from "@/components/contacs/details/ContactPurchasesChart";
import { ContactReturnsCard } from "@/components/contacs/details/ContactReturnsCard";
import { ContactSalesTable } from "@/components/contacs/details/ContactSalesTable";
import { ContactTopProducts } from "@/components/contacs/details/ContactTopProducts";
import { ViewContactModal } from "@/components/contacs/ViewContactModal";
import { InvoiceDetailsModal } from "@/components/invoicing/InvoiceDetailsModal";
import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useContactDetailsLogic } from "@/hooks/contacts/useContactDetailsLogic";
import { formatDateAsDMY } from "@/lib/date-formats";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  const { summary, sales, period, loading, loadingSales, notFound, changePeriod, clearPeriod, handlePageNumber } = useContactDetailsLogic(id);
  const { modals, openModal, closeModal } = useModalStore();
  const { getElement } = useTempStorage();
  const documentSelected = getElement('documentSelected') ?? {};
  const hasPeriod = !!period.option;

  const periodText = !hasPeriod
    ? 'Todo el historial'
    : period.option == '1'
      ? formatDateAsDMY(period.initialDate)
      : `${formatDateAsDMY(period.initialDate)} al ${formatDateAsDMY(period.finalDate)}`;

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

  return (
    <div className="pb-4 md:pb-10">
      <div className="flex items-center gap-2 px-2 sm:px-4">
        <Link href="/contacts/search" className="text-text-muted hover:text-primary p-2">
          <FaArrowLeft size={16} />
        </Link>
        <ViewTitle text={contact.name} />
        {(loading || loadingSales) && <LuLoader className="animate-spin text-text-muted shrink-0" size={16} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-4 px-2 sm:px-4 mt-2">
        <div className="md:col-span-7 space-y-4 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <span className="font-semibold uppercase tracking-wider">Período:</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{periodText}</span>
          </div>

          <ContactKpiCards summary={summary} loading={loading} />

          <ContactPurchasesChart months={summary.by_month} loading={loading} hasPeriod={hasPeriod} />

          <ContactTopProducts products={summary.top_products} loading={loading} />

          <ContactSalesTable sales={sales} loading={loadingSales} handlePageNumber={handlePageNumber} />
        </div>

        <div className="md:col-span-3 space-y-4 min-w-0">
          <ContactProfileCard contact={contact} onShowDetails={() => openModal('contactDetails')} />

          <div className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-4">
            <h3 className="text-sm font-bold text-text-base uppercase tracking-wider mb-3">Período</h3>
            <DateRange onSubmit={changePeriod} loading={loading} />
            {hasPeriod && (
              <div className="flex justify-center mt-2">
                <Button text="Ver todo el historial" preset={Preset.secondary} onClick={clearPeriod} />
              </div>
            )}
          </div>

          <ContactCreditCard credit={summary.credit} />

          <ContactReturnsCard returns={summary.returns} totalPurchased={summary.kpis.total_sum} />
        </div>
      </div>

      <ViewContactModal isShow={!!modals.contactDetails} onClose={() => closeModal('contactDetails')} record={contact} />
      <InvoiceDetailsModal isShow={!!modals.documentDetail} onClose={() => closeModal('documentDetail')} documentId={documentSelected?.id} />
      <ToasterMessage />
    </div>
  );
}

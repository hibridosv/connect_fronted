'use client';

import { ViewTitle } from "@/components/ViewTitle";
import { Button, Preset } from "@/components/button/button";
import { MaintenanceQuickStatusModal } from "@/components/maintenance/MaintenanceQuickStatusModal";
import { MaintenanceStatusBadge } from "@/components/maintenance/MaintenanceStatusBadge";
import { AssociateInvoiceModal } from "@/components/maintenance/details/AssociateInvoiceModal";
import { MaintenanceEditForm } from "@/components/maintenance/details/MaintenanceEditForm";
import { MaintenanceImagesSection } from "@/components/maintenance/details/MaintenanceImagesSection";
import { MaintenanceStatusHistoryTimeline } from "@/components/maintenance/details/MaintenanceStatusHistoryTimeline";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { ToasterMessage } from "@/components/toaster-message";
import { useMaintenanceDetailsLogic } from "@/hooks/maintenance/useMaintenanceDetailsLogic";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import useModalStore from "@/stores/modalStorage";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  const { maintenance, loading, saving, updateMaintenance, reload } = useMaintenanceDetailsLogic(id);
  const { modals, openModal, closeModal } = useModalStore();

  const handleSave = async (data: any) => {
    const success = await updateMaintenance(id, data);
    if (success) reload();
    return success;
  };

  const handleAssociateInvoice = async (ticketOrderId: string) => {
    const success = await updateMaintenance(id, { ticket_order_id: ticketOrderId });
    if (success) reload();
    return success;
  };

  if (!maintenance) {
    return (
      <div className="p-4">
        <SkeletonTable rows={8} columns={3} />
      </div>
    );
  }

  return (
    <div className="pb-4 md:pb-10">
      <div className="flex items-center gap-2 px-2 sm:px-4">
        <Link href="/maintenance" className="text-text-muted hover:text-primary p-2">
          <FaArrowLeft size={16} />
        </Link>
        <ViewTitle text={maintenance.asset_label || maintenance.type?.name || 'Orden de mantenimiento'} />
        {loading && <LuLoader className="animate-spin text-text-muted shrink-0" size={16} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-4 px-2 sm:px-4 mt-2">
        <div className="md:col-span-7 space-y-4">

          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <MaintenanceStatusBadge status={maintenance.status} />
                <span className="text-xs text-text-muted">
                  Recibido {formatDateAsDMY(maintenance.received_at)} · {formatHourAsHM(maintenance.received_at)}
                </span>
              </div>
              <Button text="Cambiar estado" preset={Preset.info} onClick={() => openModal('maintenanceStatus')} />
            </div>
            {maintenance.delivered_at && (
              <p className="text-xs text-text-muted mt-2">
                Entregado {formatDateAsDMY(maintenance.delivered_at)} · {formatHourAsHM(maintenance.delivered_at)}
              </p>
            )}
          </div>

          <MaintenanceEditForm maintenance={maintenance} onSave={handleSave} saving={saving} />

          <MaintenanceImagesSection maintenanceId={maintenance.id} />
        </div>

        <div className="md:col-span-3 space-y-4">
          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4">
            <h3 className="text-sm font-bold text-text-base uppercase tracking-wider mb-3">Información</h3>
            <div className="space-y-2 text-sm">
              <InfoRow label="Cliente" value={maintenance.contact?.name ?? '--'} />
              <InfoRow label="Tipo" value={maintenance.type?.name ?? '--'} />
              <InfoRow label="Técnico" value={maintenance.employee?.name ?? 'Sin asignar'} />
            </div>
          </div>

          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4">
            <h3 className="text-sm font-bold text-text-base uppercase tracking-wider mb-3">Factura</h3>
            {maintenance.order ? (
              <div className="text-sm">
                <p className="font-semibold text-text-base">#{maintenance.order.invoice}</p>
                <Link href={`/invoicing/search/${maintenance.order.id}`} className="text-xs text-primary hover:underline">Ver documento</Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-text-muted mb-2">Sin factura asociada.</p>
                <div className="flex justify-center">
                  <Button text="Asociar factura" preset={Preset.secondary} onClick={() => openModal('maintenanceAssociateInvoice')} />
                </div>
              </>
            )}
          </div>

          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4">
            <h3 className="text-sm font-bold text-text-base uppercase tracking-wider mb-3">Historial de Estados</h3>
            <MaintenanceStatusHistoryTimeline history={maintenance.statusHistory} />
          </div>
        </div>
      </div>

      <MaintenanceQuickStatusModal
        isShow={!!modals.maintenanceStatus}
        onClose={() => closeModal('maintenanceStatus')}
        maintenanceId={maintenance.id}
        currentStatus={maintenance.status}
        onUpdated={reload}
      />

      <AssociateInvoiceModal
        isShow={!!modals.maintenanceAssociateInvoice}
        onClose={() => closeModal('maintenanceAssociateInvoice')}
        contactId={maintenance.contact_id}
        onAssociate={handleAssociateInvoice}
        saving={saving}
      />

      <ToasterMessage />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-text-muted">{label}</span>
      <span className="font-medium text-text-base text-right">{value}</span>
    </div>
  );
}

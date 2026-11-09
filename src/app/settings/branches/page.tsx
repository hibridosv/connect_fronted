'use client';

import { ViewTitle } from '@/components/ViewTitle';
import { ChangeTenantModal } from '@/components/settings/ChangeTenantModal';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { useBranchesLogic } from '@/hooks/settings/useBranchesLogic';
import useModalStore from '@/stores/modalStorage';
import useTempStorage from '@/stores/useTempStorage';
import { useSession } from 'next-auth/react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { LuLoaderCircle } from 'react-icons/lu';

export default function Page() {
  const { data: session } = useSession();
  const { modals, closeModal } = useModalStore();
  const { getElement } = useTempStorage();
  const {
    remoteUrls, tenants, loading, sending, system, user,
    canAddTransfer, handleSelectTenant, handleLinkTenant,
    getAddress, getCountryName,
  } = useBranchesLogic();

  const currentUrl = session?.url;

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 pb-10">
      <div className="col-span-2">
        <ViewTitle text="CAMBIAR SISTEMA" />
        <div className="mr-3 sm:mt-3 px-2">
          {loading ? (
            <SkeletonTable rows={3} columns={1} />
          ) : (
            <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden">
              {remoteUrls?.data?.map((record: any, index: number) => {
                const isCurrent = record.url === currentUrl;
                return (
                  <div
                    key={index}
                    onClick={isCurrent ? undefined : () => handleSelectTenant(record)}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-bg-subtle last:border-b-0 transition-colors duration-150 ${
                      isCurrent
                        ? 'bg-danger/10 text-danger cursor-default'
                        : 'hover:bg-bg-subtle cursor-pointer clickeable text-text-base'
                    }`}
                  >
                    <AiOutlineArrowRight size={16} />
                    <span className="text-lg font-semibold uppercase">{record.tenant}</span>
                  </div>
                );
              })}
            </div>
          )}

          {canAddTransfer && (
            <>
              <ViewTitle text="VINCULAR SISTEMA" />
              <span className="ml-4 text-xs text-text-muted text-center font-thin">
                * Opción disponible solo para usuario root
              </span>
              <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden mt-2">
                {sending ? (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <LuLoaderCircle className="animate-spin text-primary" size={20} />
                    <span className="text-text-muted text-sm">Agregando Dirección</span>
                  </div>
                ) : (
                  tenants?.data?.map((record: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => handleLinkTenant(record.id)}
                      className="flex items-center gap-3 px-4 py-3 border-b border-bg-subtle last:border-b-0 hover:bg-bg-subtle cursor-pointer clickeable text-text-base transition-colors duration-150"
                    >
                      <AiOutlineArrowRight size={16} />
                      <span className="text-lg font-semibold uppercase">{record.description}</span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="col-span-4">
        <ViewTitle text="INFORMACION" />
        <div className="mr-3 sm:mt-3 px-2">
          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden">
            <InfoRow label="Nombre" value={system?.name} highlight />
            <InfoRow label="Responsable" value={system?.owner} />
            <InfoRow label="Documento" value={system?.document} />
            <InfoRow label="Telefono" value={system?.phone} />
            <InfoRow label="Email" value={system?.email} />
            <InfoRow label="Dirección" value={getAddress()} />
            <InfoRow label="Pais" value={getCountryName()} />
            <InfoRow label="Identificador" value={`3165-${system?.tenant_id}`} />
          </div>
        </div>
      </div>

      <ChangeTenantModal isShow={!!modals.changeTenant} onClose={() => closeModal('changeTenant')} tenantSelect={getElement('changeTenant')} />

    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
  return (
    <div className={`flex font-semibold w-full px-3 py-2 border-b border-bg-subtle last:border-b-0 text-text-base ${highlight ? 'bg-bg-subtle/60' : ''}`}>
      <div className="w-1/4 border-r-2 border-bg-subtle uppercase text-sm">{label}</div>
      <div className="w-3/4 ml-4">{value}</div>
    </div>
  );
}

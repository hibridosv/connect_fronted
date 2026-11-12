'use client';
import { Badge } from '@/components/Badge';
import { ViewTitle } from '@/components/ViewTitle';
import { BranchesFilterInput } from '@/components/settings/BranchesFilterInput';
import { ChangeTenantModal } from '@/components/settings/ChangeTenantModal';
import { LinkTenantModal } from '@/components/settings/LinkTenantModal';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { useBranchesLogic } from '@/hooks/settings/useBranchesLogic';
import { formatDate } from '@/lib/date-formats';
import useModalStore from '@/stores/modalStorage';
import useTempStorage from '@/stores/useTempStorage';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { LuArrowRight, LuBuilding2, LuCheck, LuLink, LuPlus } from 'react-icons/lu';

// A partir de esta cantidad se muestra el buscador de "Cambiar sistema"
const SWITCH_SEARCH_FROM = 6;

export default function Page() {
  const { data: session } = useSession();
  const { modals, closeModal } = useModalStore();
  const { getElement } = useTempStorage();
  const {
    switchSystems, filteredSwitchSystems, switchSearch, setSwitchSearch,
    linkedSystems, availableTenants, filteredTenants, linkSearch, setLinkSearch,
    loading, loadingTenants, loadingLinked, sending, system,
    canAddTransfer, handleSelectTenant, handleAskLinkTenant, handleLinkTenant,
    getAddress, getCountryName,
  } = useBranchesLogic();

  const currentUrl = session?.url;

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-4 md:border-r md:border-primary">
        <ViewTitle text="INFORMACION" />
        <div className="mx-2 sm:mx-4">
          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-bg-subtle/60 border-b border-bg-subtle">
              <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-primary/10 text-primary">
                <LuBuilding2 size={20} />
              </div>
              <div className="min-w-0">
                <div className="font-bold uppercase text-text-base truncate">{system?.name}</div>
                <div className="text-xs text-text-muted">Identificador 3165-{system?.tenant_id}</div>
              </div>
            </div>
            <InfoRow label="Responsable" value={system?.owner} />
            <InfoRow label="Documento" value={system?.document} />
            <InfoRow label="Telefono" value={system?.phone} />
            <InfoRow label="Email" value={system?.email} />
            <InfoRow label="Dirección" value={getAddress()} />
            <InfoRow label="Pais" value={getCountryName()} />
          </div>
        </div>

        <SectionTitle text="CAMBIAR SISTEMA" count={switchSystems.length} />
        <div className="mx-2 sm:mx-4">
          {loading ? (
            <SkeletonTable rows={3} columns={1} />
          ) : (
            <>
              {switchSystems.length >= SWITCH_SEARCH_FROM && (
                <div className="mb-2">
                  <BranchesFilterInput value={switchSearch} onChange={setSwitchSearch} placeholder="Buscar sistema..." />
                </div>
              )}
              <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden max-h-96 overflow-y-auto">
                {filteredSwitchSystems.length === 0 && (
                  <EmptyRow text={switchSearch ? 'Ningún sistema coincide con la búsqueda' : 'No tienes otros sistemas disponibles'} />
                )}
                {filteredSwitchSystems.map((record: any, index: number) => {
                  const isCurrent = record.url === currentUrl;
                  return (
                    <div
                      key={index}
                      onClick={isCurrent ? undefined : () => handleSelectTenant(record)}
                      className={`group flex items-center gap-3 px-4 py-3 border-b border-bg-subtle last:border-b-0 transition-colors duration-150 ${
                        isCurrent
                          ? 'bg-primary/5 cursor-default'
                          : 'hover:bg-bg-subtle cursor-pointer clickeable-table'
                      }`}
                    >
                      <span className={`w-2 h-2 shrink-0 rounded-full ${isCurrent ? 'bg-success' : 'bg-bg-subtle'}`} />
                      <span className={`flex-1 min-w-0 truncate font-semibold uppercase ${isCurrent ? 'text-primary' : 'text-text-base'}`}>
                        {record.tenant}
                      </span>
                      {isCurrent ? (
                        <Badge variant="success" size="sm">Actual</Badge>
                      ) : (
                        <LuArrowRight size={16} className="shrink-0 text-text-muted group-hover:text-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="md:col-span-6">
        <SectionTitle text="SISTEMAS VINCULADOS" count={linkedSystems.length} first />
        <div className="mx-2 sm:mx-4">
          {loadingLinked && linkedSystems.length === 0 ? (
            <SkeletonTable rows={2} columns={1} />
          ) : linkedSystems.length === 0 ? (
            <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
              <EmptyRow text="Este sistema todavía no está vinculado con ningún otro" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {linkedSystems.map((record: any) => (
                <div key={record.id} className="flex items-center gap-3 px-3 py-2.5 bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
                  <div className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-success/10 text-success">
                    <LuLink size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold uppercase text-text-base truncate">{record.to?.description ?? 'Sin nombre'}</div>
                    <div className="text-xs text-text-muted">Vinculado el {formatDate(record.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-text-muted">
            Los sistemas vinculados pueden enviarse y solicitarse transferencias de productos.
          </p>
        </div>

        {canAddTransfer && (
          <>
            <SectionTitle text="VINCULAR SISTEMA" count={availableTenants.length} />
            <div className="mx-2 sm:mx-4">
              <BranchesFilterInput value={linkSearch} onChange={setLinkSearch} placeholder="Buscar sistema por nombre..." />
              <div className="flex items-center justify-between mt-2 mb-1 text-xs text-text-muted">
                <span>* Opción disponible solo para usuario root</span>
                {linkSearch && <span>{filteredTenants.length} de {availableTenants.length}</span>}
              </div>
              {loadingTenants && availableTenants.length === 0 ? (
                <SkeletonTable rows={4} columns={1} />
              ) : (
                <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden max-h-[26rem] overflow-y-auto">
                  {filteredTenants.length === 0 && (
                    <EmptyRow
                      icon={!linkSearch && <LuCheck size={18} />}
                      text={linkSearch ? `Ningún sistema coincide con "${linkSearch}"` : 'No quedan sistemas por vincular'}
                    />
                  )}
                  {filteredTenants.map((record: any) => (
                    <div
                      key={record.id}
                      onClick={() => handleAskLinkTenant(record)}
                      className="group flex items-center gap-3 px-4 py-2.5 border-b border-bg-subtle last:border-b-0 hover:bg-bg-subtle cursor-pointer clickeable-table transition-colors duration-150"
                    >
                      <span className="flex-1 min-w-0 truncate font-semibold uppercase text-text-base">{record.description}</span>
                      <span className="inline-flex items-center gap-1 shrink-0 text-xs font-semibold text-primary opacity-70 group-hover:opacity-100">
                        <LuPlus size={14} /> Vincular
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ChangeTenantModal isShow={!!modals.changeTenant} onClose={() => closeModal('changeTenant')} tenantSelect={getElement('changeTenant')} />
      <LinkTenantModal
        isShow={!!modals.linkTenant}
        onClose={() => closeModal('linkTenant')}
        onConfirm={handleLinkTenant}
        tenantSelect={getElement('linkTenant')}
        currentName={system?.name}
        sending={sending}
      />
    </div>
  );
}

function SectionTitle({ text, count, first }: { text: string; count: number; first?: boolean }) {
  return (
    <div className={`flex items-center ${first ? '' : 'mt-4'}`}>
      <div className="min-w-0"><ViewTitle text={text} /></div>
      <Badge variant="muted" className="shrink-0 mr-4">{count}</Badge>
    </div>
  );
}

function EmptyRow({ text, icon }: { text: string; icon?: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-text-muted text-center">
      {icon}
      {text}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex w-full px-4 py-2 border-b border-bg-subtle last:border-b-0 text-text-base">
      <div className="w-1/3 sm:w-1/4 shrink-0 uppercase text-xs font-semibold text-text-muted pt-0.5">{label}</div>
      <div className="flex-1 min-w-0 ml-3 font-semibold break-words">{value}</div>
    </div>
  );
}

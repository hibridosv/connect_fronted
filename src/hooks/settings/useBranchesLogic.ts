'use client'
import { getCountryProperty, getDepartmentNameById, getMunicipioNameById, permissionExists } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import branchesStore from '@/stores/settings/branchesStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect, useMemo, useState } from 'react';
import { useDepartaments } from '../locations/useDepartaments';

// Compara sin mayúsculas ni tildes
const normalize = (text: any) =>
  String(text ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

export function useBranchesLogic() {
  const {
    remoteUrls, tenants, linkedSystems, loading, loadingTenants, loadingLinked, sending,
    loadRemoteUrls, loadTenants, loadLinked, linkTenant,
  } = branchesStore();
  const { system, user, permission } = useConfigStore();
  const { openModal, closeModal } = useModalStore();
  const { setElement } = useTempStorage();
  const { departaments } = useDepartaments();
  const canAddTransfer = permissionExists(permission, 'config-transfers-add-transfer');
  const [linkSearch, setLinkSearch] = useState('');
  const [switchSearch, setSwitchSearch] = useState('');
  const email = user?.email;

  useEffect(() => {
    if (email) {
      loadRemoteUrls(email);
      loadLinked();
    }
  }, [email, loadRemoteUrls, loadLinked]);

  // La lista completa de tenants solo sirve para vincular
  useEffect(() => {
    if (email && canAddTransfer) loadTenants();
  }, [email, canAddTransfer, loadTenants]);

  const linkedIds = useMemo(
    () => new Set((linkedSystems ?? []).map((record: any) => record.to_tenant_id)),
    [linkedSystems],
  );

  // Tenants que todavía no están vinculados con el actual
  const availableTenants = useMemo(
    () => (tenants?.data ?? [])
      .filter((record: any) => !linkedIds.has(record.id))
      .sort((a: any, b: any) => normalize(a.description).localeCompare(normalize(b.description))),
    [tenants, linkedIds],
  );

  const filteredTenants = useMemo(() => {
    const term = normalize(linkSearch);
    if (!term) return availableTenants;
    return availableTenants.filter((record: any) => normalize(record.description).includes(term));
  }, [availableTenants, linkSearch]);

  const switchSystems = useMemo(() => remoteUrls?.data ?? [], [remoteUrls]);

  const filteredSwitchSystems = useMemo(() => {
    const term = normalize(switchSearch);
    if (!term) return switchSystems;
    return switchSystems.filter((record: any) => normalize(record.tenant).includes(term));
  }, [switchSystems, switchSearch]);

  const handleSelectTenant = (tenant: any) => {
    setElement('changeTenant', tenant);
    openModal('changeTenant');
  };

  // Pide confirmación: el vínculo no se puede deshacer desde esta pantalla
  const handleAskLinkTenant = (tenant: any) => {
    setElement('linkTenant', tenant);
    openModal('linkTenant');
  };

  const handleLinkTenant = async (tenantId: number) => {
    const linked = await linkTenant(tenantId);
    if (linked) {
      closeModal('linkTenant');
      await loadLinked();
    }
  };

  const getAddress = () => {
    const parts = [];
    if (system?.location) parts.push(system.location);
    if (system?.departament && departaments) parts.push(getDepartmentNameById(system.departament, departaments));
    if (system?.town && departaments) parts.push(getMunicipioNameById(`${system.departament}${system.town}`, departaments));
    return parts.filter(Boolean).join(', ');
  };

  const getCountryName = () => {
    return system?.country ? getCountryProperty(parseInt(system.country)).name : '';
  };

  return {
    switchSystems,
    filteredSwitchSystems,
    switchSearch,
    setSwitchSearch,
    linkedSystems,
    availableTenants,
    filteredTenants,
    linkSearch,
    setLinkSearch,
    loading,
    loadingTenants,
    loadingLinked,
    sending,
    system,
    user,
    canAddTransfer,
    handleSelectTenant,
    handleAskLinkTenant,
    handleLinkTenant,
    getAddress,
    getCountryName,
  };
}

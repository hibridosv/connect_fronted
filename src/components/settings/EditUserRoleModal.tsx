'use client';
import Modal from '@/components/modal/Modal';
import { Button, Preset } from '@/components/button/button';
import useUserStore from '@/stores/UserStore';
import { getServices } from '@/services/services';
import { useEffect, useState } from 'react';
import useConfigStore from '@/stores/configStore';
import { canViewRole } from '@/app/settings/utils';
import SkeletonTable from '@/components/skeleton/skeleton-table';

interface EditUserRoleModalProps {
  isShow: boolean;
  onClose: () => void;
  user: any;
  onSubmit: (userId: string, roleName: string) => Promise<boolean>;
}

export function EditUserRoleModal({ isShow, onClose, user, onSubmit }: EditUserRoleModalProps) {
  const { saving } = useUserStore();
  const { role: currentRole } = useConfigStore();
  const [roles, setRoles] = useState<any[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    if (isShow) {
      setLoadingRoles(true);
      getServices('roles/user')
        .then((res) => setRoles(res.data?.data ?? []))
        .catch(() => setRoles([]))
        .finally(() => setLoadingRoles(false));
    }
  }, [isShow]);

  const handleSelectRole = (roleName: string) => {
    if (saving) return;
    onSubmit(user.id, roleName);
  };

  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle={user?.name ?? 'Cambiar rol'}>
      <Modal.Body>
        {loadingRoles ? (
          <SkeletonTable rows={4} columns={1} />
        ) : (
          <ul className="divide-y divide-bg-subtle">
            {roles.map((role: any) => {
              if (!canViewRole(currentRole ?? '', role.name)) return null;
              return (
                <li
                  key={role.id}
                  onClick={() => handleSelectRole(role.name)}
                  className="flex justify-between items-center px-3 py-3 hover:bg-bg-subtle text-text-base clickeable-table transition-colors"
                >
                  <span>{role.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </li>
              );
            })}
          </ul>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={saving} />
      </Modal.Footer>
    </Modal>
  );
}

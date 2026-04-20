import { permissionExists } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function usePermissionGuard(permissionKey: string, redirectTo = '/orders') {
  const { permission } = useConfigStore();
  const router = useRouter();

  useEffect(() => {
    if (permission && !permissionExists(permission, permissionKey)) {
      router.replace(redirectTo);
    }
  }, [router, permission, permissionKey, redirectTo]);

  return permission !== null && !permissionExists(permission, permissionKey);
}

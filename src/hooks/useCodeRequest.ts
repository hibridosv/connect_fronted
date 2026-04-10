import { formatDateFor10MinWindow } from '@/lib/date-formats';
import { permissionExists } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import useTempStorage from '@/stores/useTempStorage';
import CryptoJS from 'crypto-js';
import { useMemo, useState } from 'react';

const unlockTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function useCodeRequest(permission: string) {
  const { permission: permissionsActive } = useConfigStore();
  const { getElement, setElement, clearElement } = useTempStorage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(false);

  const isUnlocked: boolean = getElement(`unlocked:${permission}`) === true;

  const isRequired = useMemo(() => {
    if (isUnlocked) return false;
    return !!permissionsActive && !permissionExists(permissionsActive, permission);
  }, [permissionsActive, permission, isUnlocked]);

  const verifyCode = (code: string): boolean => {
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    const dateStrCurrent = formatDateFor10MinWindow(now);
    const hashCurrent = CryptoJS.MD5(dateStrCurrent).toString().substring(0, 4).toUpperCase();

    const dateStrPrevious = formatDateFor10MinWindow(tenMinutesAgo);
    const hashPrevious = CryptoJS.MD5(dateStrPrevious).toString().substring(0, 4).toUpperCase();

    const upperCaseCode = code.toUpperCase();
    const isValid = upperCaseCode === hashCurrent || upperCaseCode === hashPrevious;

    if (isValid) {
      setElement(`unlocked:${permission}`, true);
      const existingTimer = unlockTimers.get(permission);
      if (existingTimer) clearTimeout(existingTimer);
      const timer = setTimeout(() => {
        clearElement(`unlocked:${permission}`);
        unlockTimers.delete(permission);
      }, 10 * 60 * 1000);
      unlockTimers.set(permission, timer);
    }
    setError(!isValid);
    return isValid;
  };

  return {
    isRequired,
    isModalOpen,
    setIsModalOpen,
    verifyCode,
    error,
    setError,
  };
}

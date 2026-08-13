'use client';
import { getServices } from '@/services/services';
import useConfigStore from '@/stores/configStore';
import useUserStore from '@/stores/UserStore';
import { useCallback, useEffect, useState } from 'react';

export function useChatbotLogic() {
  const { user } = useConfigStore();
  const { updateUserPhone, saving } = useUserStore();
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loadingPhone, setLoadingPhone] = useState(false);

  const loadPhone = useCallback(() => {
    if (!user?.id) return;
    setLoadingPhone(true);
    getServices(`users/${user.id}/phone_number`)
      .then((res) => setPhoneNumber(res.data?.data?.phone_number ?? null))
      .catch(() => setPhoneNumber(null))
      .finally(() => setLoadingPhone(false));
  }, [user?.id]);

  useEffect(() => {
    loadPhone();
  }, [loadPhone]);

  const onSavePhone = async (phoneNumberToSave: string) => {
    if (!user?.id) return false;
    const success = await updateUserPhone(`users/${user.id}/phone_number`, { phone_number: phoneNumberToSave });
    if (success) loadPhone();
    return success;
  };

  return { phoneNumber, loadingPhone, onSavePhone, saving };
}

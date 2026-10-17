'use client'
import creditSettingsStore from '@/stores/settings/creditSettingsStore';
import { useEffect } from 'react';

export function useCreditSettingsLogic() {
  const { settings, loading, saving, loadSettings, updateSettings } = creditSettingsStore();

  useEffect(() => {
    loadSettings('settings/credits');
  }, [loadSettings]);

  const onSave = async (data: any) => {
    return await updateSettings('settings/credits', data);
  };

  return { settings, loading, saving, onSave };
}

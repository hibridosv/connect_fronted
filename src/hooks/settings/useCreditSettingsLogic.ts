'use client'
import creditSettingsStore from '@/stores/settings/creditSettingsStore';
import { useEffect } from 'react';

export function useCreditSettingsLogic() {
  const { settings, loading, saving, templates, loadSettings, updateSettings, loadTemplates, createTemplate, deleteTemplate } = creditSettingsStore();

  useEffect(() => {
    loadSettings('settings/credits');
    loadTemplates('settings/credits/templates');
  }, [loadSettings, loadTemplates]);

  const onSave = async (data: any) => {
    return await updateSettings('settings/credits', data);
  };

  const onAddTemplate = async (data: any) => {
    const success = await createTemplate('settings/credits/templates', data);
    if (success) loadTemplates('settings/credits/templates');
    return success;
  };

  const onDeleteTemplate = async (id: string) => {
    const success = await deleteTemplate(`settings/credits/templates/${id}`);
    if (success) loadTemplates('settings/credits/templates');
  };

  return { settings, loading, saving, templates, onSave, onAddTemplate, onDeleteTemplate };
}

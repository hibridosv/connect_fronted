'use client'
import { frequencySettings } from '@/components/accounts/utils';
import accountReceivableStore from '@/stores/accounts/accountReceivableStore';
import creditSettingsStore from '@/stores/settings/creditSettingsStore';
import { useEffect, useMemo } from 'react';

export interface CreditRestructureValues {
  frequency?: string;
  installments_count?: number | string;
  first_due_date?: string;
}

export function useCreditRestructureLogic(creditId: string | undefined, values: CreditRestructureValues, isOpen: boolean) {
  const { settings, loadSettings } = creditSettingsStore();
  const { restructurePreview, restructureError, previewing, previewRestructure, clearRestructurePreview } = accountReceivableStore();
  const { frequency, installments_count, first_due_date } = values;

  useEffect(() => {
    if (isOpen) loadSettings('settings/credits');
  }, [isOpen, loadSettings]);

  const enabled = !!(settings?.installments_available && settings?.installments_enabled);

  const frequencies = useMemo(
    () => (enabled && settings ? [1, 2, 3, 4].filter((option) => settings[frequencySettings[option]]) : []),
    [enabled, settings]
  );

  useEffect(() => {
    if (!isOpen || !enabled || !creditId || !frequency || !installments_count) {
      clearRestructurePreview();
      return;
    }
    // espera a que el usuario termine de escribir antes de recalcular el plan
    const timer = setTimeout(() => {
      previewRestructure(`accounts/receivable/${creditId}/restructure`, {
        frequency,
        installments_count,
        first_due_date: first_due_date || null,
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [isOpen, enabled, creditId, frequency, installments_count, first_due_date, previewRestructure, clearRestructurePreview]);

  return { settings, enabled, frequencies, preview: restructurePreview, previewError: restructureError, previewing };
}

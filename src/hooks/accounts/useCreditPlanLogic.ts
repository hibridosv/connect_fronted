'use client'
import { frequencySettings } from '@/components/accounts/utils';
import creditSettingsStore from '@/stores/settings/creditSettingsStore';
import { useEffect, useMemo } from 'react';

export interface CreditPlanValues {
  modality?: string;
  frequency?: string;
  installments_count?: number | string;
  first_due_date?: string;
  down_payment?: number | string;
}

export function useCreditPlanLogic(values: CreditPlanValues, total: number) {
  const { settings, plan, planError, simulating, templates, loadSettings, simulatePlan, clearPlan, loadTemplates } = creditSettingsStore();
  const { modality, frequency, installments_count, first_due_date, down_payment } = values;

  useEffect(() => {
    loadSettings('settings/credits');
    loadTemplates('settings/credits/templates');
  }, [loadSettings, loadTemplates]);

  const enabled = !!(settings?.installments_available && settings?.installments_enabled);

  const frequencies = useMemo(
    () => (enabled && settings ? [1, 2, 3, 4].filter((option) => settings[frequencySettings[option]]) : []),
    [enabled, settings]
  );

  const availableTemplates = useMemo(
    () => templates.filter((template) => frequencies.includes(template.frequency) && settings && template.installments_count <= settings.max_installments),
    [templates, frequencies, settings]
  );

  useEffect(() => {
    if (!enabled || modality !== '2' || !frequency || !installments_count) {
      clearPlan();
      return;
    }
    // espera a que el usuario termine de escribir antes de recalcular el plan
    const timer = setTimeout(() => {
      simulatePlan('accounts/receivable/simulate', {
        amount: total,
        down_payment: down_payment || 0,
        frequency,
        installments_count,
        first_due_date: first_due_date || null,
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [enabled, modality, frequency, installments_count, first_due_date, down_payment, total, simulatePlan, clearPlan]);

  return { settings, enabled, frequencies, plan, planError, simulating, templates: availableTemplates };
}

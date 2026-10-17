'use client'
import creditSettingsStore from '@/stores/settings/creditSettingsStore';
import { useEffect, useMemo } from 'react';

export interface CreditPlanValues {
  modality?: string;
  frequency?: string;
  installments_count?: number | string;
  first_due_date?: string;
  down_payment?: number | string;
}

const frequencySettings: Record<number, 'allow_daily' | 'allow_weekly' | 'allow_biweekly' | 'allow_monthly'> = {
  1: 'allow_daily',
  2: 'allow_weekly',
  3: 'allow_biweekly',
  4: 'allow_monthly',
};

export function useCreditPlanLogic(values: CreditPlanValues, total: number) {
  const { settings, plan, planError, simulating, loadSettings, simulatePlan, clearPlan } = creditSettingsStore();
  const { modality, frequency, installments_count, first_due_date, down_payment } = values;

  useEffect(() => {
    loadSettings('settings/credits');
  }, [loadSettings]);

  const enabled = !!(settings?.installments_available && settings?.installments_enabled);

  const frequencies = useMemo(
    () => (enabled && settings ? [1, 2, 3, 4].filter((option) => settings[frequencySettings[option]]) : []),
    [enabled, settings]
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

  return { settings, enabled, frequencies, plan, planError, simulating };
}

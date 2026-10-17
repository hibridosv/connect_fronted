'use client';

import { CreditInstallment } from "@/interfaces/credits";
import { Button, Preset } from "@/components/button/button";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { installmentStatus } from "./utils";

export interface AccountsReceivableInstallmentsTableI {
  records: CreditInstallment[];
  canWaiveLateFee?: boolean;
  onWaiveLateFee?: (installmentId: string) => void;
  sending?: boolean;
}

export function AccountsReceivableInstallmentsTable({ records, canWaiveLateFee = false, onWaiveLateFee, sending = false }: AccountsReceivableInstallmentsTableI) {
  const { system } = useConfigStore();

  if (!records || records.length === 0) return null;

  return (
    <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
          <tr>
            <th className="px-4 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">#</th>
            <th className="px-4 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Vence</th>
            <th className="px-4 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Capital</th>
            <th className="px-4 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Interés</th>
            <th className="px-4 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Mora</th>
            <th className="px-4 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cuota</th>
            <th className="px-4 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Saldo</th>
            <th className="px-4 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Estado</th>
            { canWaiveLateFee && <th className="px-4 py-2 font-bold tracking-wider whitespace-nowrap">OP</th> }
          </tr>
        </thead>
        <tbody className="divide-y divide-bg-subtle/50">
          {records.map((installment) => (
            <tr key={installment.id} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
              <td className="px-3 py-2 text-center whitespace-nowrap">{installment.number}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{formatDateAsDMY(installment.due_date)}</td>
              <td className="px-3 py-2 text-right whitespace-nowrap">{numberToMoney(installment.principal, system)}</td>
              <td className="px-3 py-2 text-right whitespace-nowrap">{numberToMoney(installment.interest, system)}</td>
              <td className="px-3 py-2 text-right whitespace-nowrap" title={Number(installment.late_fee_waived) > 0 ? `Mora condonada: ${numberToMoney(installment.late_fee_waived, system)}` : undefined}>
                {numberToMoney(installment.late_fee, system)}
                { Number(installment.late_fee_waived) > 0 && <span className="ml-1 text-xs text-text-muted">(condonada)</span> }
              </td>
              <td className="px-3 py-2 text-right whitespace-nowrap">{numberToMoney(installment.amount, system)}</td>
              <td className="px-3 py-2 text-right whitespace-nowrap font-semibold">{numberToMoney(installment.balance, system)}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap">{installmentStatus(installment)}</td>
              { canWaiveLateFee && <td className="px-3 py-2 text-center whitespace-nowrap">
                { Number(installment.late_fee) - Number(installment.paid_late_fee) > 0 &&
                  <Button preset={Preset.warning} text="Condonar mora" disabled={sending} onClick={() => onWaiveLateFee?.(installment.id)} /> }
              </td> }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

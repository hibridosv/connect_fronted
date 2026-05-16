'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import purchasesStore from "@/stores/reports/purchasesStore";
import useTempStorage from "@/stores/useTempStorage";
import { useState } from "react";
import { Button, Preset } from "../button/button";

export interface ReportPurchasesTableI {
  records: any;
  isLoading?: boolean;
}

export function ReportPurchasesTable(props: ReportPurchasesTableI) {
  const { records, isLoading } = props;
  const { system } = useConfigStore();
  const { setElement } = useTempStorage();
  const { openModal } = useModalStore();
  const { deleteInvoice, loadInvoices } = purchasesStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (isLoading) return <SkeletonTable rows={5} columns={7} />;

  if (!records || records.length === 0) {
    return <NothingHere text="No hay documentos en este mes" width="180" height="180" />;
  }

  const parsed = records.map((record: any) => ({
    record,
    json: JSON.parse(record.documento_json),
  }));

  const totalSubtotal = parsed.reduce((acc: number, { json }: any) => acc + (json?.resumen?.subTotal ?? 0), 0);
  const totalOperacion = parsed.reduce((acc: number, { json }: any) => acc + (json?.resumen?.montoTotalOperacion ?? 0), 0);
  const totalRetenciones = parsed.reduce((acc: number, { json }: any) => acc + (json?.resumen?.reteRenta ?? 0), 0);

  const handleDelete = async (record: any) => {
    setDeletingId(record.id);
    const ok = await deleteInvoice(`purchases/${record.id}/invoices`);
    if (ok) loadInvoices(`purchases/${record.purchase_id}/invoices`);
    setDeletingId(null);
  };

  const listItems = parsed.map(({ record, json }: any, index: number) => {
    const needReview = record?.duplicate_of_id;
    const isDeleting = deletingId === record.id;
    return (
      <tr
        key={index}
        className={`group transition-colors duration-150 divide-x divide-bg-subtle text-text-base ${
          isDeleting
            ? 'opacity-50'
            : needReview
            ? '!bg-red-200 hover:bg-red-400'
            : 'odd:bg-bg-subtle/40 hover:bg-bg-subtle'
        }`}
      >
        <td className="px-3 py-2 whitespace-nowrap text-xs">
          {formatDateAsDMY(json?.identificacion?.fecEmi)}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-xs font-mono">
          {json?.emisor?.nit ?? 'N/A'}
        </td>
        <td
          className="px-3 py-2 text-left whitespace-nowrap clickeable"
          onClick={() => {
            if (needReview) {
              setElement('purchaseReviewRecord', record);
              openModal('purchasesDuplicateReviewModal');
            } else {
              setElement('purchaseSelected', json);
              openModal('purchasesDetailsModal');
            }
          }}
        >
          <div className="flex items-center gap-2">
            <span className="hover:underline font-medium uppercase">
              {json?.emisor?.nombreComercial ?? 'N/A'}
            </span>
            {needReview && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-red-600 text-white font-semibold leading-none">
                Revisar
              </span>
            )}
          </div>
        </td>
        <td className="px-3 py-2 text-right whitespace-nowrap tabular-nums">
          {numberToMoney(json?.resumen?.subTotal ?? 0, system)}
        </td>
        <td className="px-3 py-2 text-right whitespace-nowrap tabular-nums font-semibold">
          {numberToMoney(json?.resumen?.montoTotalOperacion ?? 0, system)}
        </td>
        <td className={`px-3 py-2 text-right whitespace-nowrap tabular-nums ${(json?.resumen?.reteRenta ?? 0) > 0 ? 'text-warning font-medium' : 'text-text-muted'}`}>
          {numberToMoney(json?.resumen?.reteRenta ?? 0, system)}
        </td>
        <td className="px-2 py-2 text-center">
          <Button preset={Preset.smallClose}  onClick={() => handleDelete(record)} disabled={!!deletingId} />
        </td>
      </tr>
    );
  });

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">NIT</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Proveedor</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap text-right">CF</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap text-right">Total</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap text-right">Retenciones</th>
              <th scope="col" className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
          <tfoot className="border-t-2 border-bg-subtle bg-bg-subtle/60 text-xs font-bold text-text-base uppercase">
            <tr className="divide-x divide-bg-subtle">
              <td colSpan={3} className="px-6 py-2 tracking-wider">
                {parsed.length} documento{parsed.length !== 1 ? 's' : ''}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">{numberToMoney(totalSubtotal, system)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{numberToMoney(totalOperacion, system)}</td>
              <td className={`px-3 py-2 text-right tabular-nums ${totalRetenciones > 0 ? 'text-warning' : ''}`}>
                {numberToMoney(totalRetenciones, system)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

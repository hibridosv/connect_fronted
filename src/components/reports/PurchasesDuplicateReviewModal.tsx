'use client';
import { Badge } from "@/components/Badge";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import purchasesStore from "@/stores/reports/purchasesStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect, useState } from "react";

type DiffEntry = {
  path: string;
  current: any;
  original: any;
  isDiff: boolean;
};

function flattenDiff(current: any, original: any, path = ''): DiffEntry[] {
  const entries: DiffEntry[] = [];
  const allKeys = new Set([
    ...Object.keys(current ?? {}),
    ...Object.keys(original ?? {}),
  ]);
  for (const key of allKeys as any) {
    const fieldPath = path ? `${path}.${key}` : key;
    const currentValue = current?.[key];
    const originalValue = original?.[key];
    const currentIsObject = typeof currentValue === 'object' && currentValue !== null && !Array.isArray(currentValue);
    const originalIsObject = typeof originalValue === 'object' && originalValue !== null && !Array.isArray(originalValue);
    const bothAreArrays = Array.isArray(currentValue) && Array.isArray(originalValue);

    if (currentIsObject && originalIsObject) {
      entries.push(...flattenDiff(currentValue, originalValue, fieldPath));
    } else if (bothAreArrays) {
      const maxLength = Math.max(currentValue.length, originalValue.length);
      for (let index = 0; index < maxLength; index++) {
        const currentItem = currentValue[index];
        const originalItem = originalValue[index];
        const itemPath = `${fieldPath}[${index}]`;
        const currentItemIsObject = typeof currentItem === 'object' && currentItem !== null && !Array.isArray(currentItem);
        const originalItemIsObject = typeof originalItem === 'object' && originalItem !== null && !Array.isArray(originalItem);
        if (currentItemIsObject && originalItemIsObject) {
          entries.push(...flattenDiff(currentItem, originalItem, itemPath));
        } else {
          entries.push({
            path: itemPath,
            current: currentItem,
            original: originalItem,
            isDiff: JSON.stringify(currentItem) !== JSON.stringify(originalItem),
          });
        }
      }
    } else {
      entries.push({
        path: fieldPath,
        current: currentValue,
        original: originalValue,
        isDiff: JSON.stringify(currentValue) !== JSON.stringify(originalValue),
      });
    }
  }
  return entries;
}

function displayValue(val: any): string {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

interface Props {
  isShow: boolean;
  onClose: () => void;
}

export function PurchasesDuplicateReviewModal({ isShow, onClose }: Props) {
  const { elements } = useTempStorage();
  const record = elements['purchaseReviewRecord'] ?? null;
  const { duplicateInvoice, loadingDuplicate, loadDuplicateInvoice } = purchasesStore();
  const [onlyDiffs, setOnlyDiffs] = useState(true);

  useEffect(() => {
    if (!isShow || !record?.duplicate_of_id) return;
    setOnlyDiffs(true);
    loadDuplicateInvoice(record.duplicate_of_id);
  }, [isShow, record?.duplicate_of_id, loadDuplicateInvoice]);

  const currentJson = record?.documento_json ? JSON.parse(record.documento_json) : null;
  const originalJson = duplicateInvoice?.documento_json ? JSON.parse(duplicateInvoice.documento_json) : null;

  const differentBook = record && duplicateInvoice && record.purchase_id !== duplicateInvoice.purchase_id;

  const entries = currentJson && originalJson ? flattenDiff(currentJson, originalJson) : [];
  const diffs = entries.filter(e => e.isDiff);
  const displayed = onlyDiffs ? diffs : entries;

  return (
    <Modal show={isShow} onClose={onClose} headerTitle="Revisión de documento duplicado" size="xl4">
      <Modal.Body>
        {loadingDuplicate ? (
          <SkeletonTable rows={6} columns={3} />
        ) : !originalJson && !loadingDuplicate ? (
          <p className="text-sm text-text-muted text-center py-6">No se pudo cargar el documento original.</p>
        ) : originalJson ? (
          <div className="space-y-4">

            {differentBook && (
              <div className="flex gap-3 px-4 py-3 rounded-lg bg-danger/10 border border-danger/20">
                <div className="shrink-0 w-1 rounded-full bg-danger" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-danger uppercase tracking-wider">Documento en libro diferente</p>
                  <p className="text-xs text-text-base">
                    El documento original pertenece a un libro distinto al actual. Se recomienda <span className="font-semibold">eliminar este documento</span> y conservar únicamente el original.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Este documento</p>
                <p className="text-sm font-semibold text-text-base truncate">{currentJson?.emisor?.nombre ?? '—'}</p>
                <p className="text-xs font-mono text-text-muted">{currentJson?.emisor?.nit ?? '—'}</p>
                <p className="text-xs text-text-muted mt-1">{currentJson?.identificacion?.fecEmi ?? '—'}</p>
              </div>
              <div className="px-4 py-3 rounded-lg bg-bg-subtle border border-bg-subtle">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Documento original</p>
                <p className="text-sm font-semibold text-text-base truncate">{originalJson?.emisor?.nombre ?? '—'}</p>
                <p className="text-xs font-mono text-text-muted">{originalJson?.emisor?.nit ?? '—'}</p>
                <p className="text-xs text-text-muted mt-1">{originalJson?.identificacion?.fecEmi ?? '—'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant={diffs.length > 0 ? 'danger' : 'success'}>
                {diffs.length} diferencia{diffs.length !== 1 ? 's' : ''} encontrada{diffs.length !== 1 ? 's' : ''}
              </Badge>
              <button
                onClick={() => setOnlyDiffs(v => !v)}
                className="text-xs text-primary hover:underline clickeable"
              >
                {onlyDiffs ? 'Ver todos los campos' : 'Solo diferencias'}
              </button>
            </div>

            <div className="relative overflow-x-auto rounded-lg border border-bg-subtle max-h-[50vh] overflow-y-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle sticky top-0">
                  <tr>
                    <th className="px-4 py-2.5 font-bold tracking-wider border-r border-bg-subtle">Campo</th>
                    <th className="px-4 py-2.5 font-bold tracking-wider border-r border-bg-subtle">Este documento</th>
                    <th className="px-4 py-2.5 font-bold tracking-wider">Original</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-subtle/50">
                  {displayed.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-xs text-text-muted">
                        {onlyDiffs ? 'Los documentos son idénticos.' : 'Sin campos.'}
                      </td>
                    </tr>
                  ) : displayed.map((entry, i) => (
                    <tr key={i} className={`divide-x divide-bg-subtle ${entry.isDiff ? 'bg-danger/10' : 'odd:bg-bg-subtle/40'}`}>
                      <td className="px-4 py-2 font-mono text-xs text-text-muted whitespace-nowrap">{entry.path}</td>
                      <td className={`px-4 py-2 text-xs break-all ${entry.isDiff ? 'text-danger font-semibold' : 'text-text-base'}`}>
                        {displayValue(entry.current)}
                      </td>
                      <td className={`px-4 py-2 text-xs break-all ${entry.isDiff ? 'text-text-muted' : 'text-text-base'}`}>
                        {displayValue(entry.original)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
      </Modal.Footer>
    </Modal>
  );
}

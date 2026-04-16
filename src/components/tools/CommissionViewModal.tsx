'use client';

import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import { useCommissionsLogic } from '@/hooks/tools/useCommissionsLogic';
import { formatDateAsDMY, formatHourAsHM } from '@/lib/date-formats';
import { formatDuiWithAll, getTotalPercentage, numberToMoney } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import commissionsStore from '@/stores/tools/commissionsStore';
import { FaDownload } from 'react-icons/fa';
import { LuLoaderCircle } from 'react-icons/lu';
import { ButtonDownloadGet } from '../button/button-download-get';
import { commissionStatusMap } from './utils';

interface CommissionViewModalProps {
  isShow: boolean;
  onClose: () => void;
  record: any;
}

export function CommissionViewModal({ isShow, onClose, record }: CommissionViewModalProps) {
  const { system } = useConfigStore();
  const { payCommission, saving, loadCommissions } = commissionsStore();
  const { handelDeleteCommission, url } = useCommissionsLogic();

  if (!record) return null;

  const products = record.linked;
  const status = commissionStatusMap[record?.status] || { label: '—', className: '' };
  const retention = record.commissions * 0.10;
  const netPay = record.commissions - retention;

  const groupedProducts = products?.reduce((acc: any, item: any) => {
    const { ticket_order_id, quantity, commission, total, subtotal, order } = item.product;
    if (!acc[ticket_order_id]) {
      acc[ticket_order_id] = {
        quantity: 0, subtotal: 0, total: 0,
        commission: 0, commissionTotal: 0, items: 0,
        order: null, charged_at: null,
      };
    }
    acc[ticket_order_id].quantity += quantity;
    acc[ticket_order_id].subtotal += subtotal;
    acc[ticket_order_id].total += total;
    acc[ticket_order_id].commission += commission * quantity;
    acc[ticket_order_id].commissionTotal += getTotalPercentage(subtotal, commission);
    acc[ticket_order_id].items += quantity;
    acc[ticket_order_id].order = order.invoice;
    acc[ticket_order_id].charged_at = order.charged_at;
    return acc;
  }, {}) ?? {};

  const handlePay = async () => {
    const success = await payCommission(record.id);
    if (success){
      await loadCommissions(url);
      onClose();
    } 
  };

  return (
    <Modal show={isShow} onClose={onClose} size="xl2" headerTitle="DETALLE DE COMISIÓN">
      <Modal.Body>
        {saving ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <LuLoaderCircle className="animate-spin text-primary" size={48} />
            <span className="text-sm text-text-muted">Procesando...</span>
          </div>
        ) : (
          <div className="space-y-3">

            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5">
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted leading-none mb-0.5">Cliente referido</p>
                <p className="text-base font-bold text-text-base leading-tight">{record?.referred?.name}</p>
                <p className="text-xs text-text-muted">{formatDuiWithAll(record?.referred?.document || record?.referred?.id_number)}</p>
              </div>
              <span className={`${status.className} text-xs`}>{status.label}</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="bg-bg-content border border-bg-subtle rounded-lg px-3 py-2 text-center shadow-sm">
                <p className="text-xs text-text-muted leading-none mb-0.5">Facturas</p>
                <p className="text-xl font-bold text-text-base">{record.invoices}</p>
              </div>
              <div className="bg-bg-content border border-bg-subtle rounded-lg px-3 py-2 text-center shadow-sm">
                <p className="text-xs text-text-muted leading-none mb-0.5">Productos</p>
                <p className="text-xl font-bold text-text-base">{record.products}</p>
              </div>
              <div className="bg-bg-content border border-bg-subtle rounded-lg px-3 py-2 text-center shadow-sm">
                <p className="text-xs text-text-muted leading-none mb-0.5">Ventas</p>
                <p className="text-sm font-bold text-text-base">{numberToMoney(record.total, system)}</p>
              </div>
              <div className="bg-success/10 border border-success/30 rounded-lg px-3 py-2 text-center shadow-sm">
                <p className="text-xs text-success/70 leading-none mb-0.5">A Pagar</p>
                <p className="text-sm font-bold text-success">{numberToMoney(netPay, system)}</p>
              </div>
            </div>

            {Object.keys(groupedProducts).length > 0 && (
              <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha</th>
                      <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Factura</th>
                      <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap text-center">Comisión %</th>
                      <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap text-right">Comisión $</th>
                      <th scope="col" className="px-3 py-2 font-bold tracking-wider whitespace-nowrap text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bg-subtle/50">
                    {Object.keys(groupedProducts).map((key, index) => {
                      const item = groupedProducts[key];
                      return (
                        <tr key={index} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
                          <td className="px-3 py-1.5 whitespace-nowrap">{formatDateAsDMY(item.charged_at)}</td>
                          <td className="px-3 py-1.5 font-medium">{item.order}</td>
                          <td className="px-3 py-1.5 text-center">{(item.commission / item.items).toFixed(2)}%</td>
                          <td className="px-3 py-1.5 text-right">{numberToMoney(item.commissionTotal, system)}</td>
                          <td className="px-3 py-1.5 text-right font-semibold">{numberToMoney(item.total, system)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {products ? (
              <div className="bg-bg-content border border-bg-subtle rounded-lg overflow-hidden shadow-sm">
                <div className="flex justify-between items-center px-4 py-2 border-b border-bg-subtle">
                  <span className="text-sm text-text-muted">Comisión bruta</span>
                  <span className="font-semibold text-text-base">{numberToMoney(record.commissions, system)}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2 border-b border-bg-subtle">
                  <span className="text-sm text-text-muted">Retención (10%)</span>
                  <span className="font-semibold text-danger">− {numberToMoney(retention, system)}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2.5 bg-success/10">
                  <span className="text-sm font-bold uppercase tracking-wider text-success">Total a Pagar</span>
                  <span className="text-lg font-bold text-success">{numberToMoney(netPay, system)}</span>
                </div>
              </div>
            ) : (
              <p className="text-center text-text-muted py-2">No se encuentran registros</p>
            )}

            {record.status === 0 && (
              <div className="flex items-center gap-3 px-4 py-2.5 bg-danger/10 border border-danger/30 rounded-lg">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-danger">Eliminado por: </span>
                  <span className="text-sm font-semibold text-danger">{record?.employee_deleted?.name}</span>
                  <span className="text-xs text-text-muted ml-2">{formatDateAsDMY(record?.deleted_at)} {formatHourAsHM(record?.deleted_at)}</span>
                </div>
              </div>
            )}

          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {record.status === 3 && (
          <ButtonDownloadGet href={`id=${record.id}&route=download.pdf.commission`}>
            <FaDownload size={18} className="text-primary" />
          </ButtonDownloadGet>
        )}
        {record.status === 2 && (
          <Button onClick={() => handelDeleteCommission(record.id)} preset={Preset.cancel} disabled={saving} text="ELIMINAR" />
        )}
        <Button onClick={onClose} preset={Preset.close} disabled={saving} />
        {record.status === 2 && (
          <Button onClick={handlePay} preset={saving ? Preset.saving : Preset.save} disabled={saving} text="PAGAR" />
        )}
      </Modal.Footer>
    </Modal>
  );
}

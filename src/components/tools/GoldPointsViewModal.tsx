'use client';

import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import { formatDate, formatDateAsDMY, formatHourAsHM } from '@/lib/date-formats';
import { formatDuiWithAll, numberToMoney } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import goldPointsStore from '@/stores/tools/goldPointsStore';
import { useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';
import { LuLoaderCircle } from 'react-icons/lu';
import { ButtonDownloadGet } from '../button/button-download-get';
import { commissionTypeMap } from './utils';

interface GoldPointsViewModalProps {
  isShow: boolean;
  onClose: () => void;
  record: any;
  onAction: () => void;
}

export function GoldPointsViewModal({ isShow, onClose, record, onAction }: GoldPointsViewModalProps) {
  const { system } = useConfigStore();
  const { commissionDetail, loadCommissionDetail, payCommission, deleteGoldCommission, saving } = goldPointsStore();

  useEffect(() => {
    if (record?.id && isShow) {
      loadCommissionDetail(record.id);
    }
  }, [record?.id, isShow, loadCommissionDetail]);

  if (!record) return null;

  const handlePay = async () => {
    const success = await payCommission(record.id);
    if (success) {
      onAction();
      onClose();
    }
  };

  const handleDelete = async () => {
    const success = await deleteGoldCommission(record.id);
    if (success) {
      onAction();
      onClose();
    }
  };

  const goldBase = record.commissions ? (record.commissions * 0.90) * 0.10 : 0;
  const retentions = goldBase * 0.10;
  const totalToPay = goldBase - retentions;

  return (
    <Modal show={isShow} onClose={onClose} size="xl6" headerTitle="RESUMEN DE COMISIONES PAGADAS">
      <Modal.Body>
        {saving ? (
          <div className="flex justify-center py-10">
            <LuLoaderCircle className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <div>
            <div className="flex justify-between font-semibold text-lg m-4 text-text-base">
              <div>{record?.referred?.name}</div>
              <div>{formatDuiWithAll(record?.referred?.document || record?.referred?.id_number)}</div>
            </div>

            <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha Inicio</th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha Fin</th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Tipo</th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Comisiones</th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider whitespace-nowrap">Ver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-subtle/50">
                  {commissionDetail?.data?.map((item: any) => {
                    const type = commissionTypeMap[item?.type] || { label: '—', className: '' };
                    const commissionValue = item?.commissions
                      ? item.type === 1 ? item.commissions : item.commissions * 0.10
                      : 0;

                    return (
                      <tr key={item.id} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
                        <td className="px-3 py-2 whitespace-nowrap truncate">{formatDate(item?.initial_date)} {formatHourAsHM(item?.initial_date)}</td>
                        <td className="px-3 py-2 whitespace-nowrap truncate">{formatDate(item?.final_date)} {formatHourAsHM(item?.updated_at)}</td>
                        <td className="px-3 py-2"><span className={type.className}>{type.label}</span></td>
                        <td className="px-3 py-2 text-right">{numberToMoney(item?.total ?? 0, system)}</td>
                        <td className="px-3 py-2 text-right font-bold">{numberToMoney(commissionValue, system)}</td>
                        <td className="px-3 py-2 text-center">
                          <ButtonDownloadGet href={`id=${item.id}&route=download.pdf.commission`}>
                            <FaDownload size={12} className="text-primary" />
                          </ButtonDownloadGet>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {commissionDetail?.data ? (
              <div className="mt-4 mx-4 bg-bg-content rounded-lg border border-bg-subtle overflow-hidden">
                <div className="py-2 pl-4 border-b border-bg-subtle text-text-base">Ordenes afectadas: <span className="font-semibold">{record.quantity_commissions}</span></div>
                <div className="py-2 pl-4 border-b border-bg-subtle text-text-base">Total de Comisiones: <span className="font-semibold">{numberToMoney(record.commissions, system)}</span></div>
                <div className="py-2 pl-4 border-b border-bg-subtle text-text-base">Total de Puntos de Oro: <span className="font-semibold">{numberToMoney(goldBase, system)}</span></div>
                <div className="py-2 pl-4 border-b border-bg-subtle text-text-base">Total de Retenciones: <span className="font-semibold">{numberToMoney(retentions, system)}</span></div>
                <div className="py-2 pl-4 bg-success/10 text-success font-semibold">Total a Pagar: <span>{numberToMoney(totalToPay, system)}</span></div>
              </div>
            ) : (
              <div className="mt-4 text-center text-text-muted">No se encuentran registros</div>
            )}

            {record.status === 0 && (
              <div className="mt-4 mx-4 p-3 bg-danger/10 rounded-lg">
                <span className="font-semibold text-danger uppercase">ELIMINADO POR: </span>
                <span className="font-semibold text-danger uppercase">{record?.employee_deleted?.name} </span>
                <span className="font-bold text-text-base">{formatDateAsDMY(record?.deleted_at)} {formatHourAsHM(record?.deleted_at)}</span>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {record.status === 3 && (
          <ButtonDownloadGet href={`id=${record.id}&route=download.pdf.commission.gold`}>
            <FaDownload size={20} className="text-primary" />
          </ButtonDownloadGet>
        )}
        {record.status === 2 && (
          <Button onClick={handleDelete} preset={Preset.cancel} disabled={saving} text="ELIMINAR REPORTE" />
        )}
        <Button onClick={onClose} preset={Preset.close} disabled={saving} />
        {record.status === 2 && (
          <Button onClick={handlePay} preset={saving ? Preset.saving : Preset.save} disabled={saving} text="PAGAR REPORTE" />
        )}
      </Modal.Footer>
    </Modal>
  );
}

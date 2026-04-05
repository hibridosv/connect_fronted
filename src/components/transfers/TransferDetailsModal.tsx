'use client';
import { Button, Preset } from '@/components/button/button';
import { ButtonDownload } from '@/components/button/button-download';
import Modal from '@/components/modal/Modal';
import { formatDateAsDMY, formatHourAsHM } from '@/lib/date-formats';
import { FaDownload } from 'react-icons/fa';
import { statusOfProductTransfer, statusOfTransfer } from './utils';

export interface TransferDetailsModalProps {
  onClose: () => void;
  isShow: boolean;
  transfer?: any;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 py-1 border-b border-bg-subtle last:border-0">
      <span className="text-xs text-text-muted uppercase tracking-wide w-28 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-text-base">{value}</span>
    </div>
  );
}

export function TransferDetailsModal({ onClose, isShow, transfer }: TransferDetailsModalProps) {
  if (!isShow || !transfer) return null;

  const sentCount = transfer.products?.filter((p: any) => p.requested_exists === 1).length ?? 0;
  const acceptedCount = transfer.products?.filter((p: any) => p.requested_exists === 1 && p.status === 2).length ?? 0;

  const listItems = transfer.products?.map((product: any) => (
    <tr
      key={product.id}
      title={product.requested_exists === 0 ? 'No existe en el inventario de origen' : ''}
      className={`transition-colors duration-150 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${product.requested_exists === 0 ? 'bg-warning/10' : 'odd:bg-bg-subtle/40'}`}
    >
      <td className="px-3 py-1.5 whitespace-nowrap font-medium">{product.cod}</td>
      <td className="px-3 py-1.5">{product.description}</td>
      {transfer.requested_at && (
        <td className="px-3 py-1.5 text-center whitespace-nowrap">{product.requested}</td>
      )}
      <td className="px-3 py-1.5 text-center whitespace-nowrap">{product.quantity}</td>
      <td className="px-3 py-1.5 text-center whitespace-nowrap">
        {product.requested_exists === 0
          ? <span className="status-danger uppercase">No Enviado</span>
          : statusOfProductTransfer(product.status)
        }
      </td>
    </tr>
  ));

  return (
    <Modal show={isShow} onClose={onClose} size="xl3" headerTitle="Detalles de la transferencia" closeOnOverlayClick={false}>
      <Modal.Body>
        <div className="p-4 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-content rounded-lg border border-bg-subtle p-3">
              <p className="text-xs text-text-muted uppercase tracking-wide mb-2 font-medium">Información general</p>
              <InfoRow label="Estado" value={statusOfTransfer(transfer.status)} />
              <InfoRow label="Enviado" value={`${formatDateAsDMY(transfer.created_at)} ${formatHourAsHM(transfer.created_at)}`} />
              <InfoRow label="Origen" value={transfer.from?.description} />
              <InfoRow label="Destino" value={transfer.to?.description} />
              <InfoRow label="Envía" value={transfer.send} />
            </div>

            <div className="bg-bg-content rounded-lg border border-bg-subtle p-3">
              <p className="text-xs text-text-muted uppercase tracking-wide mb-2 font-medium">Trazabilidad</p>
              {transfer.request_at ? (
                <>
                  {transfer.request_by && <InfoRow label="Solicitado por" value={transfer.request_by} />}
                  <InfoRow label="Fecha solicitud" value={`${formatDateAsDMY(transfer.request_at)} ${formatHourAsHM(transfer.request_at)}`} />
                </>
              ) : (
                <p className="text-xs text-text-muted italic py-1">Sin solicitud registrada</p>
              )}
              {transfer.received_at && (
                <>
                  {transfer.receive && <InfoRow label="Recibido por" value={transfer.receive} />}
                  <InfoRow label="Fecha recepción" value={`${formatDateAsDMY(transfer.received_at)} ${formatHourAsHM(transfer.received_at)}`} />
                </>
              )}
              {transfer.canceled_at && (
                <>
                  {transfer.canceled_by && <InfoRow label="Cancelado por" value={transfer.canceled_by} />}
                  <InfoRow label="Fecha cancelación" value={`${formatDateAsDMY(transfer.canceled_at)} ${formatHourAsHM(transfer.canceled_at)}`} />
                </>
              )}
            </div>
          </div>

          <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                <tr>
                  <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Código</th>
                  <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">Descripción</th>
                  {transfer.requested_at && (
                    <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap text-center">Solicitado</th>
                  )}
                  <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap text-center">Cantidad</th>
                  <th className="px-3 py-2 font-bold tracking-wider whitespace-nowrap text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-subtle/50">
                {listItems}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-text-muted">{transfer.id}</p>
            <div className="flex items-center gap-6">
              {transfer.requested_at && (
                <div className="text-center">
                  <p className="text-xs text-text-muted uppercase tracking-wide">Solicitados</p>
                  <p className="text-lg font-bold text-text-base">{transfer.products?.length ?? 0}</p>
                </div>
              )}
              <div className="text-center">
                <p className="text-xs text-text-muted uppercase tracking-wide">Enviados</p>
                <p className="text-lg font-bold text-text-base">{sentCount}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-muted uppercase tracking-wide">Aceptados</p>
                <p className="text-lg font-bold text-success">{acceptedCount}</p>
              </div>
            </div>
          </div>

        </div>
      </Modal.Body>
      <Modal.Footer>
        <ButtonDownload href={`download/pdf/transfer/${transfer.id}`}>
          <FaDownload size={20} />
        </ButtonDownload>
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
      </Modal.Footer>
    </Modal>
  );
}

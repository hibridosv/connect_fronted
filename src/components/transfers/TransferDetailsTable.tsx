'use client';

import { DeleteModal } from '@/components/DeleteModal';
import { NothingHere } from '@/components/NothingHere';
import { Button, Preset } from '@/components/button/button';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import useToastMessageStore from '@/stores/toastMessageStore';
import { useState } from 'react';
import { AiOutlineFundView } from 'react-icons/ai';
import { FaDownload } from 'react-icons/fa';
import { MdCheck, MdOutlineDownloading } from 'react-icons/md';
import { ButtonDownloadGet } from '../button/button-download-get';

const statusOfProductTransfer = (status: number) => {
  switch (status) {
    case 1: return <span className="status-info uppercase">Activo</span>;
    case 2: return <span className="status-success uppercase">Aceptado</span>;
    case 3: return <span className="status-danger uppercase">Rechazado</span>;
    default: return <span>Activo</span>;
  }
};

interface TransferDetailsTableProps {
  transfer: any;
  onBack: () => void;
  onRejectProduct: (id: string) => void;
  onCreateRegister: (id: string) => void;
  onAcceptAll: (id: string) => void;
  onRejectAll: (id: string) => void;
  sending?: boolean;
  loadingDetail?: boolean;
  hasUnregisteredProducts?: boolean;
}

export function TransferDetailsTable({
  transfer,
  onBack,
  onRejectProduct,
  onCreateRegister,
  onAcceptAll,
  onRejectAll,
  sending,
  loadingDetail,
  hasUnregisteredProducts,
}: TransferDetailsTableProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRejectTransferModal, setShowRejectTransferModal] = useState(false);
  const [selectProduct, setSelectProduct] = useState<any>(null);

  if (loadingDetail) return <SkeletonTable rows={8} columns={6} />;

  if (!transfer?.products || transfer.products.length === 0) return <NothingHere text="No se encontraron productos" />;

  const handleRejectClick = (product: any) => {
    setSelectProduct(product);
    setShowDeleteModal(true);
  };

  const handleConfirmReject = () => {
    if (selectProduct) {
      onRejectProduct(selectProduct.id);
      setShowDeleteModal(false);
      setSelectProduct(null);
    }
  };

  const handleConfirmRejectAll = () => {
    onRejectAll(transfer.id);
    setShowRejectTransferModal(false);
  };

  const listItems = transfer.products.map((record: any) => (
    <tr
      key={record.id}
      className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${record.requested_exists === 0 ? 'bg-danger/10' : ''}`}
    >
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary">{record?.cod}</td>
      <td className="px-3 py-2 whitespace-nowrap">{record?.description}</td>
      <td className="px-3 py-2 text-center">{record?.quantity}</td>
      <td className="px-3 py-2">{statusOfProductTransfer(record?.status)}</td>
      <td
        className={`px-3 py-2 font-semibold ${
          loadingDetail ? 'text-warning' : record?.cod_receive ? 'text-success' : 'text-danger'
        }`}
        title={record?.cod_receive ? 'Registro correcto' : 'Debe agregar un registro que coincida con el codigo del producto entrante'}
      >
        {loadingDetail ? 'ESPERE ...' : record?.cod_receive ? 'CON REGISTRO' : 'SIN REGISTRO'}
      </td>

      {transfer.status === 2 && (
        <td className="px-3 py-2">
          <span className="flex items-center gap-2" title={record.requested_exists === 0 ? 'El Producto no fue enviado por que no existe en el inventario de quien envia' : ''}>
            {record?.cod_receive ? (
              <MdCheck size={20} className="text-success" />
            ) : sending ? (
              <MdOutlineDownloading size={20} className="text-primary animate-spin" />
            ) : (
              <AiOutlineFundView
                size={20}
                title="Agregar registro nuevo de este producto"
                className="text-danger clickeable"
                onClick={record.status === 1 ? () => onCreateRegister(record.id) : undefined}
              />
            )}
            <Button
              preset={record.status !== 1 ? Preset.smallCloseDisable : Preset.smallClose}
              disabled={record.status !== 1}
              noText
              onClick={
                record.requested_exists === 0
                  ? () => useToastMessageStore.getState().setError({ response: { data: { message: 'Este producto no existe en el inventario de quien envia' } } })
                  : () => handleRejectClick(record)
              }
            />
          </span>
        </td>
      )}
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Código</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Descripción</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cantidad</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Estado</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Registro</th>
              {transfer.status === 2 && <th scope="col" className="px-6 py-3 font-bold tracking-wider whitespace-nowrap">OP</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
        </table>

        <div className="flex justify-end p-4 gap-3">
          <Button onClick={onBack} disabled={sending} text="Regresar" preset={Preset.add} />
          {transfer.status === 2 ? (
            <>
              <Button text="Rechazar" onClick={() => setShowRejectTransferModal(true)} disabled={sending} preset={Preset.cancel} />
              <Button
                text="Aceptar todo"
                onClick={() => onAcceptAll(transfer.id)}
                preset={sending ? Preset.saving : Preset.save}
                disabled={hasUnregisteredProducts}
              />
            </>
          ) : (
            <ButtonDownloadGet href={`id=${transfer.id}&route=download.pdf.transfer`}>
              <FaDownload size={22} />
            </ButtonDownloadGet>
          )}
        </div>
      </div>

      <DeleteModal
        isShow={showDeleteModal}
        text="¿Está seguro de rechazar este producto?"
        header="Rechazar Producto"
        onDelete={handleConfirmReject}
        onClose={() => setShowDeleteModal(false)}
        isSending={sending}
      />

      <DeleteModal
        isShow={showRejectTransferModal}
        text="¿Está seguro de rechazar toda la transferencia?"
        header="Rechazar Transferencia"
        onDelete={handleConfirmRejectAll}
        onClose={() => setShowRejectTransferModal(false)}
        isSending={sending}
      />
    </div>
  );
}

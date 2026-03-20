'use client';

import { useState } from 'react';
import { numberToMoney } from '@/lib/utils';
import { IoIosAlert, IoIosCloseCircle } from 'react-icons/io';
import { DeleteModal } from '@/components/DeleteModal';
import { NothingHere } from '@/components/NothingHere';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { ChangeQuantityModal } from './ChangeQuantityModal';
import useConfigStore from '@/stores/configStore';

interface TransferProductsTableProps {
  products: any[];
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  sending?: boolean;
  loading?: boolean;
  deleteActive?: boolean;
}

export function TransferProductsTable({ products, onDelete, onUpdateQuantity, sending, loading, deleteActive }: TransferProductsTableProps) {
  const [recordSelect, setRecordSelect] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const { system } = useConfigStore();

  if (loading) return <SkeletonTable rows={8} columns={6} />;

  if (!products || products.length === 0) return <NothingHere text="No se encontraron productos" />;

  const handleDeleteClick = (record: any) => {
    setRecordSelect(record);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (recordSelect) {
      onDelete(recordSelect.id);
      setShowDeleteModal(false);
      setRecordSelect(null);
    }
  };

  const handleQuantityClick = (record: any) => {
    if (record.requested_exists !== 1) return;
    setRecordSelect(record);
    setShowQuantityModal(true);
  };

  const handleQuantitySubmit = (quantity: number) => {
    if (!recordSelect) return;
    onUpdateQuantity(recordSelect.id, quantity);
    setRecordSelect(null);
  };

  let total = 0;
  let totalQuantity = 0;

  const listItems = products.map((record: any) => {
    const unitCost = record?.product_json ? JSON.parse(record.product_json)?.unit_cost : 0;
    const subtotal = unitCost * (record?.quantity || 0);
    total += subtotal;
    totalQuantity += Number(record?.quantity) || 0;

    return (
      <tr
        key={record.id}
        className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${record.requested_exists === 0 ? 'bg-danger/10' : ''}`}
        title={record.requested_exists === 0 ? 'El producto no existe en el inventario' : ''}
      >
        <td className="px-3 py-2 whitespace-nowrap font-medium text-primary">{record?.cod}</td>
        <td className="px-3 py-2 whitespace-nowrap">{record?.description}</td>
        <td className="px-3 py-2 whitespace-nowrap text-right">{numberToMoney(unitCost, system)}</td>
        <td
          className={`px-3 py-2 text-center ${record.requested_exists === 1 ? 'clickeable text-primary font-semibold' : ''}`}
          onClick={() => handleQuantityClick(record)}
        >
          {record?.quantity}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-right font-bold">{numberToMoney(subtotal, system)}</td>
        <td className="px-3 py-2 text-center">
          {record.requested_exists === 1 || deleteActive ? (
            <IoIosCloseCircle
              size={22}
              title="Eliminar Producto"
              className="text-danger clickeable"
              onClick={() => handleDeleteClick(record)}
            />
          ) : (
            <IoIosAlert size={22} className="text-warning" />
          )}
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
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Código</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Descripción</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Precio Costo</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cantidad</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider whitespace-nowrap">OP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
          <tfoot className="border-t-2 border-bg-subtle bg-bg-subtle/60 text-xs font-bold text-text-base uppercase">
            <tr className="divide-x divide-bg-subtle">
              <td colSpan={3} className="px-6 py-3 tracking-wider">
                <span>{products.length} producto{products.length !== 1 ? 's' : ''}</span>
              </td>
              <td className="px-3 py-3 text-center tabular-nums">{totalQuantity}</td>
              <td className="px-3 py-3 text-right">
                <span className="text-[10px] font-semibold text-text-muted normal-case tracking-normal block leading-none mb-0.5">Valor total</span>
                <span className="text-sm font-extrabold text-primary tabular-nums">{numberToMoney(total, system)}</span>
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <DeleteModal
        isShow={showDeleteModal}
        text={`¿Está seguro de eliminar el producto ${recordSelect?.description}?`}
        onDelete={handleConfirmDelete}
        onClose={() => setShowDeleteModal(false)}
        isSending={sending}
      />

      <ChangeQuantityModal
        isShow={showQuantityModal}
        onClose={() => setShowQuantityModal(false)}
        onSubmit={handleQuantitySubmit}
        sending={sending}
      />
    </div>
  );
}

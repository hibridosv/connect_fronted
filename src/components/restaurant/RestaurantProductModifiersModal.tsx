'use client';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import manageRestaurantStore from '@/stores/restaurant/manageRestaurantStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

interface Props {
  isShow: boolean;
  onClose: () => void;
}

export function RestaurantProductModifiersModal({ isShow, onClose }: Props) {
  const { options, loadingOptions, addModifier, removeModifier } = manageRestaurantStore();
  const { getElement } = useTempStorage();
  const [assigned, setAssigned] = useState<any[]>([]);
  const [toggling, setToggling] = useState(false);

  const selectedProduct = getElement('menuProduct');

  useEffect(() => {
    if (isShow && selectedProduct) {
      setAssigned(selectedProduct.assigments ?? []);
    }
  }, [isShow, selectedProduct]);

  const handleAdd = async (optionId: string) => {
    if (!selectedProduct || toggling) return;
    setToggling(true);
    await addModifier(optionId, selectedProduct.id);
    setToggling(false);
  };

  const handleRemove = async (assigmentId: string) => {
    if (toggling) return;
    setToggling(true);
    await removeModifier(assigmentId);
    setToggling(false);
  };

  const availableItems = options?.map((opt: any) => (
    <li key={opt.id} className="flex justify-between items-center px-4 py-2.5 hover:bg-bg-subtle text-text-base text-sm transition-colors">
      <span>{opt.name}</span>
      {toggling
        ? <AiOutlineLoading size={18} className="animate-spin text-text-muted" />
        : <FaPlus size={16} className="text-success clickeable" onClick={() => handleAdd(opt.id)} />
      }
    </li>
  ));

  const assignedItems = assigned.map((assigment: any) => {
    return (
    <li key={assigment.id} className="flex justify-between items-center px-4 py-2.5 hover:bg-danger/5 text-text-base text-sm transition-colors">
      <span>{assigment.option?.name}</span>
      {toggling
        ? <AiOutlineLoading size={18} className="animate-spin text-text-muted" />
        : <MdDelete size={18} className="text-danger clickeable" onClick={() => handleRemove(assigment.id)} />
      }
    </li>
  )
  });

  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle="Modificadores del Producto">
      <Modal.Body>
        {loadingOptions ? (
          <SkeletonTable rows={5} columns={1} />
        ) : (
          <div className="space-y-3">
            <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-hidden">
              <div className="px-4 py-2 bg-bg-subtle/60 border-b border-bg-subtle">
                <span className="text-xs font-bold uppercase tracking-wider text-success">Disponibles</span>
              </div>
              <ul className="divide-y divide-bg-subtle max-h-48 overflow-y-auto">
                {availableItems?.length ? availableItems : (
                  <li className="px-4 py-3 text-sm text-text-muted text-center">No hay modificadores disponibles</li>
                )}
              </ul>
            </div>
            <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-hidden">
              <div className="px-4 py-2 bg-bg-subtle/60 border-b border-bg-subtle">
                <span className="text-xs font-bold uppercase tracking-wider text-danger">Asignados</span>
              </div>
              <ul className="divide-y divide-bg-subtle max-h-48 overflow-y-auto">
                {assignedItems.length ? assignedItems : (
                  <li className="px-4 py-3 text-sm text-text-muted text-center">Sin modificadores asignados</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}

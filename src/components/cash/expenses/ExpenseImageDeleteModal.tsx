'use client';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import cashExpensesStore from '@/stores/cash/cashExpensesStore';
import useModalStore from '@/stores/modalStorage';
import useTempStorage from '@/stores/useTempStorage';

interface ExpenseImageDeleteModalProps {
  isShow: boolean;
  onClose: () => void;
}

export function ExpenseImageDeleteModal({ isShow, onClose }: ExpenseImageDeleteModalProps) {
  const { expenses, deletingImage, deleteExpenseImage } = cashExpensesStore();
  const { closeModal } = useModalStore();
  const { getElement, clearElement } = useTempStorage();

  const expenseId = getElement('expenseImageId');
  const expensesList = Array.isArray(expenses) ? expenses : expenses?.data;
  const expense = expensesList?.find((record: any) => record.id === expenseId);

  const handleDelete = async () => {
    if (!expenseId) return;
    const success = await deleteExpenseImage(expenseId);
    if (success) {
      onClose();
      closeModal('expenseImage');
      clearElement('expenseImageId');
    }
  };

  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle="Eliminar imagen" closeOnOverlayClick={false}>
      <Modal.Body>
        <div className="p-4 space-y-2">
          <p className="text-text-muted text-sm">
            ¿Está seguro que desea eliminar la imagen del gasto{' '}
            <span className="font-semibold text-text-base">{expense?.name}</span>?
          </p>
          <p className="text-xs text-danger">Esta acción no se puede deshacer.</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={deletingImage} />
        <Button
          onClick={handleDelete}
          preset={deletingImage ? Preset.saving : Preset.save}
          disabled={deletingImage}
          text="Eliminar"
        />
      </Modal.Footer>
    </Modal>
  );
}

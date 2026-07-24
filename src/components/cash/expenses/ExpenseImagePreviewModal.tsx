'use client';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import cashExpensesStore from '@/stores/cash/cashExpensesStore';
import useConfigStore from '@/stores/configStore';
import useTempStorage from '@/stores/useTempStorage';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface ExpenseImagePreviewModalProps {
  isShow: boolean;
  onClose: () => void;
}

export function ExpenseImagePreviewModal({ isShow, onClose }: ExpenseImagePreviewModalProps) {
  const { expenses } = cashExpensesStore();
  const { tenant } = useConfigStore();
  const { data: session } = useSession();
  const { getElement } = useTempStorage();

  const expenseId = getElement('expenseImageId');
  const expensesList = Array.isArray(expenses) ? expenses : expenses?.data;
  const expense = expensesList?.find((record: any) => record.id === expenseId);

  const imageLoader = ({ src }: { src: string }) =>
    `${session?.url}/storage/public/${tenant?.id}/expenses/${src}`;

  if (!isShow || !expense?.image) return null;

  return (
    <Modal show={isShow} onClose={onClose} size="xl2" headerTitle={expense.name ?? 'Vista previa'} closeOnOverlayClick>
      <Modal.Body>
        <div className="flex items-center justify-center p-4 bg-white">
          <Image
            loader={imageLoader}
            src={expense.image}
            alt={expense.name ?? 'Imagen del gasto'}
            width={600}
            height={600}
            className="object-contain max-h-[70vh] w-auto"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
      </Modal.Footer>
    </Modal>
  );
}

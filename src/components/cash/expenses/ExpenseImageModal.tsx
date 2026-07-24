'use client';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import cashExpensesStore from '@/stores/cash/cashExpensesStore';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import useTempStorage from '@/stores/useTempStorage';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdAddPhotoAlternate, MdClose, MdDeleteOutline, MdZoomIn } from 'react-icons/md';

interface ExpenseImageModalProps {
  isShow: boolean;
  onClose: () => void;
}

export function ExpenseImageModal({ isShow, onClose }: ExpenseImageModalProps) {
  const { expenses, uploadingImage, uploadExpenseImage } = cashExpensesStore();
  const { tenant } = useConfigStore();
  const { data: session } = useSession();
  const { openModal } = useModalStore();
  const { getElement, clearElement } = useTempStorage();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const expenseId = getElement('expenseImageId');
  const expense = expenses?.find((record: any) => record.id === expenseId);

  const { ref: registerRef, ...registerRest } = register('image', { required: true });

  const imageLoader = ({ src }: { src: string }) =>
    `${session?.url}/storage/public/${tenant?.id}/expenses/${src}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  const handleClearFile = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleClose = () => {
    reset();
    setPreview(null);
    clearElement('expenseImageId');
    onClose();
  };

  const onSubmit = async (data: any) => {
    const file = data.image?.[0];
    if (!file || !expenseId) return;
    const formData = new FormData();
    formData.append('image', file);
    const success = await uploadExpenseImage(expenseId, formData);
    if (success) {
      reset();
      setPreview(null);
    }
  };

  if (!isShow || !expense) return null;

  return (
    <Modal show={isShow} onClose={handleClose} size="sm" headerTitle="Imagen del gasto" closeOnOverlayClick={false} hideCloseButton={true}>
      <Modal.Body>
        <div className="p-4 space-y-4">
          {expense.image ? (
            <div className="flex justify-center">
              <div
                className="relative group rounded-lg overflow-hidden border border-bg-subtle shadow-sm"
                style={{ width: 160, height: 160 }}
              >
                <Image
                  loader={imageLoader}
                  src={expense.image}
                  alt={expense.name ?? 'Imagen del gasto'}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => openModal('expenseImagePreview')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm"
                  >
                    <MdZoomIn size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => openModal('expenseImageDelete')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full bg-danger text-white hover:bg-danger/90"
                  >
                    <MdDeleteOutline size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden
                  ${errors.image ? 'border-danger bg-danger/5' : 'border-bg-subtle hover:border-primary/50 bg-bg-subtle/30 hover:bg-primary/5'}`}
                style={{ minHeight: 160 }}
                onClick={() => !preview && inputRef.current?.click()}
              >
                {preview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Vista previa" className="w-full h-full object-contain max-h-40" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleClearFile(); }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <MdClose size={14} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-6 px-4 text-center pointer-events-none">
                    <MdAddPhotoAlternate size={36} className={errors.image ? 'text-danger' : 'text-text-muted opacity-40'} />
                    <p className={`text-sm font-medium ${errors.image ? 'text-danger' : 'text-text-muted'}`}>
                      Haz click para seleccionar una imagen
                    </p>
                    <p className="text-xs text-text-muted opacity-60">JPG, PNG, WEBP</p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...registerRest}
                  ref={(el) => { registerRef(el); inputRef.current = el; }}
                  onChange={(e) => { registerRest.onChange(e); handleFileChange(e); }}
                />
              </div>
              {errors.image && (
                <p className="text-xs text-danger mt-2">Selecciona una imagen.</p>
              )}
              <div className="flex justify-center mt-4">
                <Button type="submit" preset={uploadingImage ? Preset.saving : Preset.save} disabled={uploadingImage} />
              </div>
            </form>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} preset={Preset.close} disabled={uploadingImage || !!preview} />
      </Modal.Footer>
    </Modal>
  );
}

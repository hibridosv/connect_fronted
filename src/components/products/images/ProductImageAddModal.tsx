'use client';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import productImagesStore from '@/stores/products/productImagesStore';
import { useForm } from 'react-hook-form';

interface ProductImageAddModalProps {
  isShow: boolean;
  onClose: () => void;
  productId: string;
}

export function ProductImageAddModal({ isShow, onClose, productId }: ProductImageAddModalProps) {
  const { uploadImage, saving } = productImagesStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    const file = data.image?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', data.description ?? '');
    formData.append('product_id', productId);
    const success = await uploadImage(formData, productId);
    if (success) {
      reset();
      onClose();
    }
  };

  if (!isShow) return null;

  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle="Agregar imagen" closeOnOverlayClick={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <div className="p-4 space-y-4">
            <div>
              <label className="input-label">Imagen</label>
              <input
                type="file"
                accept="image/*"
                {...register('image', { required: true })}
                className="input"
              />
              {errors.image && (
                <p className="text-xs text-danger mt-1">Selecciona una imagen.</p>
              )}
            </div>
            <div>
              <label className="input-label">Descripción</label>
              <textarea {...register('description')} rows={2} className="input w-full" />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose} preset={Preset.close} disabled={saving} />
          <Button type="submit" preset={saving ? Preset.saving : Preset.save} disabled={saving} />
        </Modal.Footer>
      </form>
    </Modal>
  );
}

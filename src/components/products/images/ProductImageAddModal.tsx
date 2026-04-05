'use client';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import productImagesStore from '@/stores/products/productImagesStore';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdAddPhotoAlternate, MdClose } from 'react-icons/md';

interface ProductImageAddModalProps {
  isShow: boolean;
  onClose: () => void;
  productId: string;
}

export function ProductImageAddModal({ isShow, onClose, productId }: ProductImageAddModalProps) {
  const { uploadImage, saving } = productImagesStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref: registerRef, ...registerRest } = register('image', { required: true });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  const handleClearFile = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

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
      setPreview(null);
      onClose();
    }
  };

  if (!isShow) return null;

  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle="Agregar imagen" closeOnOverlayClick={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <div className="p-4 space-y-4">

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
              <p className="text-xs text-danger -mt-2">Selecciona una imagen.</p>
            )}

            <div>
              <label className="input-label">Descripción <span className="text-text-muted font-normal normal-case">(opcional)</span></label>
              <textarea {...register('description')} rows={2} className="input w-full resize-none" placeholder="Ej: Vista frontal del producto" />
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

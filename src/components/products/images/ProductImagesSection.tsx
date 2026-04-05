'use client';
import { DeleteModal } from '@/components/DeleteModal';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import productImagesStore from '@/stores/products/productImagesStore';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LuLoader } from 'react-icons/lu';
import { MdAddPhotoAlternate, MdDeleteOutline, MdZoomIn } from 'react-icons/md';

interface ProductImagesSectionProps {
  productId: string;
}

export function ProductImagesSection({ productId }: ProductImagesSectionProps) {
  const { images, loading, deleting, loadImages, deleteImage } = productImagesStore();
  const { openModal } = useModalStore();
  const { tenant } = useConfigStore();
  const { data: session } = useSession();
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [imageToPreview, setImageToPreview] = useState<any | null>(null);

  useEffect(() => {
    loadImages(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const imageLoader = ({ src }: { src: string }) =>
    `${session?.url}/storage/public/${tenant?.id}/products/${src}`;

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;
    await deleteImage(imageToDelete, productId);
    setImageToDelete(null);
  };

  return (
    <div className="w-full px-4 mt-4">
      <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4">

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-text-base uppercase tracking-wider">
            Imágenes
            <span className="ml-2 text-xs font-normal text-text-muted normal-case">({images.length}/3)</span>
          </h3>
          <button
            type="button"
            disabled={images.length >= 3}
            onClick={() => openModal('productImageAdd')}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-text-inverted hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <MdAddPhotoAlternate size={16} />
            Agregar
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-6 gap-2 text-text-muted">
            <LuLoader className="animate-spin" size={18} />
            <span className="text-sm">Cargando imágenes...</span>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-text-muted border border-dashed border-bg-subtle rounded-lg">
            <MdAddPhotoAlternate size={28} className="opacity-40" />
            <p className="text-sm">Sin imágenes registradas</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {images.map((image: any) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden border border-bg-subtle shadow-sm"
                style={{ width: 112, height: 112 }}
              >
                <Image
                  loader={imageLoader}
                  src={image.image}
                  alt={image.description ?? 'Imagen del producto'}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImageToPreview(image)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm"
                  >
                    <MdZoomIn size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageToDelete(image.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full bg-danger text-white hover:bg-danger/90"
                  >
                    <MdDeleteOutline size={18} />
                  </button>
                </div>
                {image.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-0.5">
                    <p className="text-white text-[10px] truncate">{image.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      <DeleteModal
        isShow={!!imageToDelete}
        header="Eliminar imagen"
        text="¿Estás seguro de eliminar esta imagen? Esta acción no se puede deshacer."
        onDelete={handleDeleteConfirm}
        onClose={() => setImageToDelete(null)}
        isSending={deleting}
      />

      {imageToPreview && (
        <Modal
          show={!!imageToPreview}
          onClose={() => setImageToPreview(null)}
          size="xl2"
          headerTitle={imageToPreview.description || 'Vista previa'}
          closeOnOverlayClick
        >
          <Modal.Body>
            <div className="flex items-center justify-center p-4 bg-white">
              <Image
                loader={imageLoader}
                src={imageToPreview.image}
                alt={imageToPreview.description ?? 'Imagen del producto'}
                width={600}
                height={600}
                className="object-contain max-h-[70vh] w-auto"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setImageToPreview(null)} preset={Preset.close} disabled={false} />
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

'use client';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import useConfigStore from '@/stores/configStore';
import productImagesStore from '@/stores/products/productImagesStore';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LuLoader } from 'react-icons/lu';
import { MdImage, MdZoomIn } from 'react-icons/md';

interface ProductImagesViewerProps {
  productId: string;
}

export function ProductImagesViewer({ productId }: ProductImagesViewerProps) {
  const { images, loading, loadImages, clearImages } = productImagesStore();
  const { tenant } = useConfigStore();
  const { data: session } = useSession();
  const [imageToPreview, setImageToPreview] = useState<any | null>(null);

  useEffect(() => {
    return () => { clearImages(); };
  }, []);

  const imageLoader = ({ src }: { src: string }) =>
    `${session?.url}/storage/public/${tenant?.id}/products/${src}`;

  if (images.length === 0) {
    return (
      <div className="pt-2 border-t border-bg-subtle">
        <button
          type="button"
          onClick={() => loadImages(productId)}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-primary transition-colors disabled:cursor-not-allowed"
        >
          {loading
            ? <LuLoader size={14} className="animate-spin text-primary" />
            : <MdImage size={16} />
          }
          {loading ? 'Cargando imágenes...' : 'Ver imágenes'}
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2 border-t border-bg-subtle space-y-2">
      <h4 className="text-sm font-semibold text-text-base flex items-center gap-2">
        <MdImage size={16} className="text-primary" />
        Imágenes
      </h4>

      <div className="flex flex-wrap gap-3">
          {images.map((image: any) => (
            <div
              key={image.id}
              className="relative group rounded-lg overflow-hidden border border-bg-subtle shadow-sm cursor-pointer"
              style={{ width: 80, height: 80 }}
              onClick={() => setImageToPreview(image)}
            >
              <Image
                loader={imageLoader}
                src={image.image}
                alt={image.description ?? 'Imagen del producto'}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                <MdZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              {image.description && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                  <p className="text-white text-[9px] truncate">{image.description}</p>
                </div>
              )}
            </div>
          ))}
      </div>

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

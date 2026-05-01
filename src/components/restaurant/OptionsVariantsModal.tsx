"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { ShowImagesModal } from "@/components/restaurant/ShowImagesModal";
import { URL } from '@/constants';
import manageRestaurantStore from "@/stores/restaurant/manageRestaurantStore";
import useTempStorage from "@/stores/useTempStorage";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { DeleteButton } from "../button/DeleteButton";


export interface OptionsVariantsModalI {
  onClose: () => void;
  isShow: boolean;
}

const imageLoader = ({ src, width, quality }: any) => `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`;

export function OptionsVariantsModal(props: OptionsVariantsModalI) {
  const { onClose, isShow } = props;
  const { sending, deleting, deleteOption, addVariant } = manageRestaurantStore();
  const { getElement, clearElement } = useTempStorage();
  const optionSelected = getElement("optionSelected");

  const [variantName, setVariantName] = useState('');
  const [variantPrice, setVariantPrice] = useState('0');
  const [variantImage, setVariantImage] = useState('default.png');
  const [showImagePicker, setShowImagePicker] = useState(false);

  const canDelete = optionSelected?.variants?.length > 2;

  const handleAddVariant = async () => {
    const trimmed = variantName.trim();
    if (!trimmed) return;
    const success = await addVariant(optionSelected.id, {
      name: trimmed,
      image: variantImage,
      price: parseFloat(variantPrice) || 0,
    });
    if (success) {
      setVariantName('');
      setVariantPrice('0');
      setVariantImage('default.png');
    }
  };

  const listVariants = optionSelected?.variants?.map((variant: any) => (
    <li key={variant.id} className="flex justify-between items-center px-4 py-2.5 hover:bg-bg-subtle text-text-base text-sm transition-colors">
      <div className="flex items-center gap-2">
        <Image loader={imageLoader} src={variant?.image || "default.png"} alt="Icono de la variante" width={32} height={32} className="rounded mr-2" />
        <span>{variant?.name}</span>
      </div>
      <span className="flex justify-center">
        {deleting || sending
          ? <AiOutlineLoading size={18} className="animate-spin text-text-muted" />
          : <DeleteButton id={variant.id} urlFull={`restaurant/options/${variant.id}/variants`} disabled={deleting || sending || !canDelete} text="¿Estas seguro de eliminar esta variante?" onDeleteConfirm={deleteOption} onDelete={() => { onClose(); clearElement('optionSelected'); }} />
        }
      </span>
    </li>
  ));

  return (
    <>
      <Modal show={isShow} onClose={onClose} size="sm" headerTitle={optionSelected?.name ?? "Variantes"} closeOnOverlayClick={true}>
        <Modal.Body>
          <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-hidden mb-4">
            <ul className="divide-y divide-bg-subtle">
              {listVariants}
            </ul>
          </div>

          <div className="px-1 space-y-3">
            <div>
              <label className="input-label">Nombre de la variante</label>
              <input
                type="text"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                disabled={sending}
                className="input w-full"
              />
            </div>
            <div>
              <label className="input-label">Precio</label>
              <input
                type="number"
                step="any"
                value={variantPrice}
                onChange={(e) => setVariantPrice(e.target.value)}
                disabled={sending}
                className="input w-full"
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <label className="input-label">Imagen</label>
              <button type="button" onClick={() => setShowImagePicker(true)} disabled={sending} className="clickeable rounded-md ring-2 ring-transparent hover:ring-primary/40 transition-all duration-200">
                <Image loader={imageLoader} src={variantImage} alt="Imagen de la variante" width={56} height={56} className="rounded-md drop-shadow-sm" />
              </button>
            </div>
            <div className="flex justify-center pt-1">
              <Button preset={Preset.add} onClick={handleAddVariant} disabled={sending || !variantName.trim()} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose} preset={Preset.close} disabled={sending} />
        </Modal.Footer>
      </Modal>

      <ShowImagesModal
        isShow={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        nameImage="newVariantImage"
        onSelect={(img) => { setVariantImage(img); setShowImagePicker(false); }}
      />
    </>
  );
}

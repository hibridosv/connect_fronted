'use client';

import { NothingHere } from "@/components/NothingHere";
import { Button, Preset } from "@/components/button/button";
import { ShowImagesModal } from "@/components/restaurant/ShowImagesModal";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { URL } from '@/constants';
import { Category } from "@/interfaces/category";
import manageRestaurantStore from "@/stores/restaurant/manageRestaurantStore";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { DeleteButton } from "../button/DeleteButton";



export function ManageCategories() {
  const { categories, loadingCategories, sending, deleteCategory, deleting, updateCategory } = manageRestaurantStore();
  const [imageModalCategoryId, setImageModalCategoryId] = useState<string | null>(null);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  if (loadingCategories) return <SkeletonTable rows={4} columns={2} />;
  if (!categories || categories.length === 0) return <NothingHere height="150" width="150" text="No hay categorías disponibles" />;

  const buildPayload = (record: Category, overrides: Partial<Category>) => ({
    name: record.name,
    pronoun: record.name,
    img: record.img,
    category_type: Number(record.category_type),
    dependable: record.dependable,
    principal: record.principal,
    is_restaurant: record.is_restaurant,
    ...overrides,
  });

  const handleStartEditName = (record: Category) => {
    setEditingNameId(record.id);
    setEditedName(record.name);
  };

  const handleAcceptName = (record: Category) => {
    const trimmed = editedName.trim();
    if (!trimmed) return;
    updateCategory(record.id, buildPayload(record, { name: trimmed, pronoun: trimmed }));
    setEditingNameId(null);
    setEditedName('');
  };

  const handleImageSelect = (selectedImage: string) => {
    if (!imageModalCategoryId) return;
    const record = categories.find((c: Category) => c.id === imageModalCategoryId);
    if (!record) return;
    updateCategory(imageModalCategoryId, buildPayload(record, { img: selectedImage }));
    setImageModalCategoryId(null);
  };

  const imageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) =>
    `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`;

  const listItems = categories.map((record: Category) => {
    const isPrincipal = record.principal == 1;
    const isEditingName = editingNameId === record.id;

    if (isEditingName) {
      return (
        <div
          key={record.id}
          className="rounded-xl border border-primary/30 bg-primary/5 shadow-sm overflow-hidden transition-all duration-200"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-b border-primary/20">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-xs font-bold text-primary uppercase tracking-wider">Editando categoría</p>
          </div>

          <div className="flex items-center gap-4 px-4 py-4">
            <div className="shrink-0">
              <Image
                loader={imageLoader}
                src={record?.img || "default.png"}
                alt="Icono de categoría"
                width={44}
                height={44}
                className="rounded-xl ring-2 ring-primary/40 shadow-sm"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <label className="input-label">Nombre de la categoría</label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAcceptName(record);
                  if (e.key === 'Escape') { setEditingNameId(null); setEditedName(''); }
                }}
                disabled={sending}
                autoFocus
                className="input w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-4 py-3 bg-primary/5 border-t border-primary/20">
            {sending ? (
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <AiOutlineLoading size={16} className="animate-spin" />
                <span>Guardando...</span>
              </div>
            ) : (
              <>
                <Button preset={Preset.cancel} onClick={() => { setEditingNameId(null); setEditedName(''); }} disabled={sending} />
                <Button preset={Preset.save} onClick={() => handleAcceptName(record)} disabled={sending || !editedName.trim()} />
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <li key={record.id} className="flex justify-between items-center px-4 py-2.5 hover:bg-bg-subtle text-text-base text-sm transition-colors">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isPrincipal ? (
            <span className="shrink-0">
              <Image
                loader={({ src, width, quality }) => `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`}
                src={record?.img || "default.png"}
                alt="Icono de categoría"
                width={28}
                height={28}
                className="rounded-full"
              />
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setImageModalCategoryId(record.id)}
              disabled={sending || deleting}
              className="shrink-0 rounded-full ring-2 ring-transparent hover:ring-primary/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image
                loader={({ src, width, quality }) => `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`}
                src={record?.img || "default.png"}
                alt="Icono de categoría"
                width={28}
                height={28}
                className="rounded-full"
              />
            </button>
          )}
          <span className="truncate">{record.name}</span>
        </div>

        <span className="flex items-center gap-1 ml-2 shrink-0">
          {deleting || sending ? (
            <AiOutlineLoading size={18} className="animate-spin text-text-muted" />
          ) : (
            <>
              <span className="flex gap-1">
                <Button preset={Preset.smallEdit} onClick={() => handleStartEditName(record)} disabled={isPrincipal || deleting} />
                <DeleteButton id={record.id} url="categories" disabled={deleting || isPrincipal || sending} text="¿Estas seguro de eliminar esta categoría?" onDeleteConfirm={deleteCategory} />
              </span>
            </>
          )}
        </span>
      </li>
    );
  });

  const activeCategory = categories.find((c: Category) => c.id === imageModalCategoryId);

  return (
    <div className="mx-4">
      <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-hidden">
        <div className="px-4 py-2 bg-bg-subtle/60 border-b border-bg-subtle">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Categorias Agregadas</span>
        </div>
        <ul className="divide-y divide-bg-subtle">
          {listItems}
        </ul>
      </div>

      {imageModalCategoryId && activeCategory && (
        <ShowImagesModal
          isShow={true}
          onClose={() => setImageModalCategoryId(null)}
          nameImage={`categoryImg_${imageModalCategoryId}`}
          onSelect={handleImageSelect}
        />
      )}
    </div>
  );
}

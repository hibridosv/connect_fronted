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

  const listItems = categories.map((record: Category) => {
    const isPrincipal = record.principal == 1;
    const isEditingName = editingNameId === record.id;

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

          {isEditingName ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              disabled={sending}
              autoFocus
              className="input py-1 text-sm w-full"
            />
          ) : (
            <span className="truncate">{record.name}</span>
          )}
        </div>

        <span className="flex items-center gap-1 ml-2 shrink-0">
          {deleting || sending ? (
            <AiOutlineLoading size={18} className="animate-spin text-text-muted" />
          ) : (
            <>
              {isEditingName
                ? <Button preset={Preset.accept} onClick={() => handleAcceptName(record)} disabled={sending || !editedName.trim()} />
                : <Button preset={Preset.smallEdit} onClick={() => handleStartEditName(record)} disabled={isPrincipal || deleting} />
              }
              <DeleteButton id={record.id} url="categories" disabled={deleting || isPrincipal || sending} text="¿Estas seguro de eliminar esta categoría?" onDeleteConfirm={deleteCategory} />
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

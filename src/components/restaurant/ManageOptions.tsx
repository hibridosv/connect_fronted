'use client';

import { NothingHere } from "@/components/NothingHere";
import { Button, Preset } from "@/components/button/button";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import useModalStore from "@/stores/modalStorage";
import manageRestaurantStore from "@/stores/restaurant/manageRestaurantStore";
import useTempStorage from "@/stores/useTempStorage";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { DeleteButton } from "../button/DeleteButton";



export function ManageOptions() {
  const { options, loadingOptions, sending, deleting, deleteOption, updateOption } = manageRestaurantStore();
  const { setElement } = useTempStorage();
  const { openModal } = useModalStore();
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  if (loadingOptions) return <SkeletonTable rows={4} columns={2} />;

  if (!options || options.length === 0) {
    return <NothingHere height="150" width="150" text="No hay modificadores disponibles" />;
  }

  const handleStartEditName = (record: any) => {
    setEditingNameId(record.id);
    setEditedName(record.name);
  };

  const handleAcceptName = (record: any) => {
    const trimmed = editedName.trim();
    if (!trimmed) return;
    updateOption(record.id, { name: trimmed });
    setEditingNameId(null);
    setEditedName('');
  };

  const listItems = options.map((record: any) => {
    const isEditingName = editingNameId === record.id;

    if (isEditingName) {
      return (
        <li key={record.id} className="px-3 py-2">
          <div className="rounded-xl border border-primary/30 bg-primary/5 shadow-sm overflow-hidden transition-all duration-200">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-b border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Editando modificador</p>
            </div>

            <div className="px-4 py-4 space-y-1">
              <label className="input-label">Nombre del modificador</label>
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
        </li>
      );
    }

    return (
      <li key={record.id} className="flex justify-between items-center px-4 py-2.5 hover:bg-bg-subtle text-text-base text-sm transition-colors">
        <div className="flex-1 min-w-0 mr-2" onClick={() => { openModal("optionSelected"); setElement("optionSelected", record); }}>
          <span className="clickeable truncate block">{record?.name}</span>
        </div>
        <span className="flex items-center gap-1 shrink-0">
          {deleting || sending ? (
            <AiOutlineLoading size={18} className="animate-spin text-text-muted" />
          ) : (
            <>
              <Button preset={Preset.smallEdit} onClick={() => handleStartEditName(record)} disabled={deleting} />
              <DeleteButton id={record.id} url="restaurant/options" disabled={deleting || sending} text="¿Estas seguro de eliminar esta opción?" onDeleteConfirm={deleteOption} />
            </>
          )}
        </span>
      </li>
    );
  });

  return (
    <div className="mx-4">
      <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-hidden">
        <div className="px-4 py-2 bg-bg-subtle/60 border-b border-bg-subtle">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Modificadores Agregados</span>
        </div>
        <ul className="divide-y divide-bg-subtle">
          {listItems}
        </ul>
      </div>
    </div>
  );
}

'use client'

import useTempStorage from "@/stores/useTempStorage";
import { useRef } from "react";
import { Button, Preset } from "../button/button";

type ProductLotSearchProps = {
  onLotSearch: (lot: string) => void;
  loading?: boolean;
  showLot?: boolean;
};

export function ProductLotSearch({ onLotSearch, loading = false, showLot = true }: ProductLotSearchProps) {
  const { getElement, clearElement } = useTempStorage();
  const elementSelected = getElement('productSearched');
  const lotInputRef = useRef<HTMLInputElement>(null);

  if (!elementSelected) return null;

  const handleSubmit = () => {
    const lot = lotInputRef.current?.value ?? '';
    onLotSearch(lot);
    if (lotInputRef.current) lotInputRef.current.value = '';
  };

  return (
    <div className="mt-2 border border-bg-subtle rounded-lg bg-bg-content p-3">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold uppercase text-text-base">{elementSelected?.description}</span>
        <Button preset={Preset.smallClose} onClick={() => clearElement('productSearched')} />
      </div>
      {showLot && (
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Buscar por lote"
          ref={lotInputRef}
          className="input"
        />
        <Button
          onClick={handleSubmit}
          text="Buscar"
          preset={loading ? Preset.saving : Preset.save}
          disabled={loading}
        />
      </div> )}
    </div>
  );
}

'use client';
import { CatalogEntry } from "@/hooks/locations/useExportCatalogs";
import { useEffect, useMemo, useRef, useState } from "react";

export interface CatalogSearchSelectProps {
  id: string;
  placeholder: string;
  entries: CatalogEntry[];
  value?: string | null;
  onChange: (entry: CatalogEntry | null) => void;
}

const MAX_RESULTS = 50;

// sin acentos ni mayusculas para buscar "frica" y encontrar "áfrica"
const DIACRITICS = new RegExp(`[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`, "g"); // marcas de acento tras normalize("NFD")
const normalize = (text: string) => text.normalize("NFD").replace(DIACRITICS, "").toLowerCase();

// Select con busqueda por codigo o nombre, para catalogos del MH tipo {code, name} (CAT-027, CAT-028)
export function CatalogSearchSelect(props: CatalogSearchSelectProps) {
  const { id, placeholder, entries, value, onChange } = props;
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => entries.find((e) => e.code === value) ?? null, [entries, value]);

  const results = useMemo(() => {
    const term = normalize(search.trim());
    if (!term) return entries.slice(0, MAX_RESULTS);
    return entries
      .filter((e) => e.code.toLowerCase().startsWith(term) || normalize(e.name).includes(term))
      .slice(0, MAX_RESULTS);
  }, [entries, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (entry: CatalogEntry | null) => {
    onChange(entry);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        id={id}
        className="input pr-10"
        autoComplete="off"
        placeholder={placeholder}
        value={isOpen ? search : selected ? `${selected.code} - ${selected.name}` : ""}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
        onKeyDown={(e) => {
          if (e.key === "Escape") { setIsOpen(false); setSearch(""); }
          if (e.key === "Enter") { e.preventDefault(); if (results.length) handleSelect(results[0]); }
        }}
      />
      {selected && !isOpen && (
        <button type="button" title="Quitar selección" onClick={() => handleSelect(null)}
          className="absolute inset-y-0 right-0 px-3 text-text-muted hover:text-text-base">
          ✕
        </button>
      )}
      {isOpen && (
        <ul className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto bg-bg-content border-2 border-bg-subtle rounded-md shadow-sm">
          {results.length === 0 && (
            <li className="px-4 py-2 text-sm text-text-muted">No se encontraron resultados</li>
          )}
          {results.map((entry) => (
            <li key={entry.code}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(entry); }}
              className={`px-4 py-2 cursor-pointer hover:bg-bg-subtle ${entry.code === value ? "bg-bg-subtle" : ""}`}>
              <div className="text-sm text-text-base"><span className="font-bold">{entry.code}</span> - {entry.name}</div>
            </li>
          ))}
          {results.length === MAX_RESULTS && (
            <li className="px-4 py-2 text-xs text-text-muted">Escriba para ver más resultados</li>
          )}
        </ul>
      )}
    </div>
  );
}

'use client';
import { EconomicActivity } from "@/hooks/locations/useEconomicActivities";
import { useEffect, useMemo, useRef, useState } from "react";

export interface EconomicActivitySelectProps {
  activities: EconomicActivity[];
  value?: string | null;
  onChange: (activity: EconomicActivity | null) => void;
}

const MAX_RESULTS = 50;

// sin acentos ni mayusculas para buscar "basicos" y encontrar "básicos"
const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Select con busqueda por codigo o descripcion para el CAT-019 (~800 actividades)
export function EconomicActivitySelect(props: EconomicActivitySelectProps) {
  const { activities, value, onChange } = props;
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => activities.find((a) => a.code === value) ?? null, [activities, value]);

  const results = useMemo(() => {
    const term = normalize(search.trim());
    if (!term) return activities.slice(0, MAX_RESULTS);
    return activities
      .filter((a) => a.code.startsWith(term) || normalize(a.activity).includes(term) || normalize(a.section).includes(term))
      .slice(0, MAX_RESULTS);
  }, [activities, search]);

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

  const handleSelect = (activity: EconomicActivity | null) => {
    onChange(activity);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        id="activity_code_search"
        className="input pr-10"
        autoComplete="off"
        placeholder="Buscar por código o actividad"
        value={isOpen ? search : selected ? `${selected.code} - ${selected.activity}` : ""}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
        onKeyDown={(e) => {
          if (e.key === "Escape") { setIsOpen(false); setSearch(""); }
          if (e.key === "Enter") { e.preventDefault(); if (results.length) handleSelect(results[0]); }
        }}
      />
      {selected && !isOpen && (
        <button type="button" title="Quitar actividad" onClick={() => handleSelect(null)}
          className="absolute inset-y-0 right-0 px-3 text-text-muted hover:text-text-base">
          ✕
        </button>
      )}
      {isOpen && (
        <ul className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto bg-bg-content border-2 border-bg-subtle rounded-md shadow-sm">
          {results.length === 0 && (
            <li className="px-4 py-2 text-sm text-text-muted">No se encontraron actividades</li>
          )}
          {results.map((activity) => (
            <li key={activity.code}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(activity); }}
              className={`px-4 py-2 cursor-pointer hover:bg-bg-subtle ${activity.code === value ? "bg-bg-subtle" : ""}`}>
              <div className="text-sm text-text-base"><span className="font-bold">{activity.code}</span> - {activity.activity}</div>
              <div className="text-xs text-text-muted truncate">{activity.section}</div>
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

'use client';
import { LuSearch, LuX } from 'react-icons/lu';

interface BranchesFilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Filtro local de las listas de sucursales (no consulta al servidor)
export function BranchesFilterInput({ value, onChange, placeholder = 'Buscar...' }: BranchesFilterInputProps) {
  return (
    <div className="relative">
      <LuSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/60 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="block w-full py-2 pl-9 pr-9 text-sm text-text-base border border-bg-subtle rounded-lg bg-bg-content focus:ring-primary focus:border-primary"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          title="Limpiar búsqueda"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-text-muted/60 hover:text-text-base hover:bg-bg-subtle"
        >
          <LuX size={14} />
        </button>
      )}
    </div>
  );
}

'use client';
import { MaintenanceType } from "@/interfaces/maintenance";
import { MdCheckCircle } from "react-icons/md";

export interface MaintenanceTypeSelectCardsProps {
  types: MaintenanceType[] | null;
  selectedId: string;
  onSelect: (type: MaintenanceType) => void;
}

export function MaintenanceTypeSelectCards({ types, selectedId, onSelect }: MaintenanceTypeSelectCardsProps) {
  if (!types || types.length === 0) {
    return (
      <p className="text-sm text-text-muted italic">
        No hay tipos de mantenimiento registrados. Crea uno primero en &quot;Tipos de Mantenimiento&quot;.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {types.map((type) => {
        const selected = selectedId === type.id;
        return (
          <button
            type="button"
            key={type.id}
            onClick={() => onSelect(type)}
            className={`relative text-left p-3 rounded-lg border transition-colors duration-150 ${
              selected ? 'border-primary bg-primary/5' : 'border-bg-subtle bg-bg-content hover:bg-bg-subtle/40'
            }`}
          >
            {selected && <MdCheckCircle className="absolute top-2 right-2 text-primary" size={18} />}
            <p className="text-sm font-semibold text-text-base pr-6">{type.name}</p>
            {type.description && <p className="text-xs text-text-muted mt-1 line-clamp-2">{type.description}</p>}
            <p className="text-xs text-text-muted mt-1">{type.fields_schema?.length ?? 0} campo(s)</p>
          </button>
        );
      })}
    </div>
  );
}

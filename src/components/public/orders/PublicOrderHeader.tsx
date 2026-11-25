'use client';
import { PublicOrderData } from "@/hooks/public/orders/usePublicOrderLogic";
import { PublicOrderCountdown } from "./PublicOrderCountdown";

export interface PublicOrderHeaderI {
  business: PublicOrderData['business'] | undefined;
  expiresAt: number;
  categories: string[];
  activeCategory: string | null;
  onChangeCategory: (name: string) => void;
}

/** Encabezado fijo: negocio, tiempo del enlace y categorias del menu */
export function PublicOrderHeader({ business, expiresAt, categories, activeCategory, onChangeCategory }: PublicOrderHeaderI) {
  return (
    <div className="sticky top-0 z-10 bg-bg-content border-b border-bg-subtle">
      <div className="flex items-center gap-3 px-4 py-3">
        {business?.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={business.logo_url} alt={business.name ?? 'Logo'} className="h-10 w-10 rounded-full object-cover" />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{business?.name}</div>
          <div className="text-xs text-text-muted">Tu enlace vence en <PublicOrderCountdown expiresAt={expiresAt} /> sin actividad</div>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 custom-scrollbar snap-x">
        {categories.map((name) => (
          <button key={name} onClick={() => onChangeCategory(name)}
            className={`snap-start px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200 ${activeCategory === name ? 'bg-primary text-text-inverted border-primary shadow-md' : 'bg-bg-content border-bg-subtle text-text-muted hover:border-primary/40'}`}>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

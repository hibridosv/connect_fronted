'use client';
import { numberToMoney } from "@/lib/utils";

export interface PublicOrderCartBarI {
  count: number;
  total: number;
  added: { name: string; at: number } | null;
  money: any;
  onOpen: () => void;
}

/** Barra fija inferior: aviso del platillo agregado y boton para ver el pedido */
export function PublicOrderCartBar({ count, total, added, money, onOpen }: PublicOrderCartBarI) {
  return (
    <div className="fixed bottom-0 inset-x-0 p-4">
      <div className={`max-w-xl mx-auto mb-2 flex justify-center transition-all duration-300 ${added ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <span className="px-4 py-2 rounded-full bg-success text-text-inverted text-sm font-medium shadow-lg truncate max-w-full">
          ✓ {added?.name ?? ''} agregado
        </span>
      </div>
      <button key={added?.at ?? 0} onClick={onOpen}
        className={`max-w-xl mx-auto w-full flex justify-between py-3 px-4 rounded-xl bg-primary text-text-inverted font-semibold shadow-lg transition-transform duration-300 ${added ? 'animate-bump' : ''}`}>
        <span>Ver pedido ({count})</span>
        <span>{numberToMoney(total, money)}</span>
      </button>
    </div>
  );
}

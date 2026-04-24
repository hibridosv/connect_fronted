'use client';
import { LuBookOpen, LuLock, LuDownload } from "react-icons/lu";
import { useSession } from 'next-auth/react';
import { ButtonDownloadGet } from "../button/button-download-get";

interface Purchase {
  id: string;
  nit: string;
  month: string;
  year: string;
  name: string;
  status: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  purchases: Purchase[] | null;
  invoicesCount?: number;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  disabled?: boolean;
}

export function PurchasesBooksList({ purchases, invoicesCount = 0, selectedId, onSelect, disabled = false }: Props) {

  if (!purchases || purchases.length === 0) {
    return (
      <p className="text-xs text-text-muted italic">No hay libros disponibles.</p>
    );
  }

  const effectiveSelectedId = selectedId ?? purchases[0]?.id;

  return (
    <div className={`space-y-2 ${disabled ? 'pointer-events-none opacity-60' : ''}`}>
      {purchases.map((book) => {
        const isClosed = book.status === 3;
        const isSelected = book.id === effectiveSelectedId;

        const isActive = book.status === 1;
        const downloadButtonClass = isClosed
          ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium active:scale-95 transition-all duration-150 bg-bg-subtle text-text-muted hover:bg-bg-subtle/80"
          : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium active:scale-95 transition-all duration-150 bg-primary/10 text-primary hover:bg-primary/20";

        const downloadButtons = (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <ButtonDownloadGet autoclass={false} href={`id=${book.id}&option=1&route=download.excel.purchaseBook`}>
              <button className={downloadButtonClass}>
                <LuDownload size={13} />Descargar libro
              </button>
            </ButtonDownloadGet>
            <ButtonDownloadGet autoclass={false} href={`id=${book.id}&option=3&route=download.excel.purchaseBook`}>
              <button className={downloadButtonClass}>
                <LuDownload size={13} />Descargar anexo
              </button>
            </ButtonDownloadGet>
          </div>
        );

        if (!isClosed) {
          return (
            <div
              key={book.id}
              onClick={() => !disabled && onSelect?.(book.id)}
              className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-primary/10 shadow-md scale-[1.02] border-2 border-primary'
                  : 'bg-bg-content border-2 border-primary/30 hover:border-primary/60 hover:scale-[1.01]'
              }`}
            >
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${isSelected ? 'bg-primary/20' : 'bg-primary/10'}`}>
                    <LuBookOpen size={18} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text-base truncate">{book.name}</p>
                    <p className="text-xs text-primary font-medium">{isActive ? 'Libro activo' : 'Cerrándose'}</p>
                    {isSelected && (
                      <p className="text-xs text-text-muted pt-1">
                        {invoicesCount} documento{invoicesCount !== 1 ? 's' : ''} registrado{invoicesCount !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold bg-primary/15 text-primary">
                  {isActive ? 'Activo' : 'En cierre'}
                </span>
              </div>
              <div className={`border-t px-4 py-2 flex items-center justify-end transition-colors duration-200 ${isSelected ? 'border-primary/20 bg-primary/10' : 'border-primary/20 bg-primary/5'}`}>
                {downloadButtons}
              </div>
            </div>
          );
        }

        return (
          <div
            key={book.id}
            className={`bg-bg-content rounded-lg overflow-hidden transition-all duration-200 ${
              isSelected
                ? 'border-2 border-text-muted/50 shadow-md scale-[1.01]'
                : 'border border-bg-subtle'
            }`}
          >
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-bg-subtle flex items-center justify-center shrink-0">
                  <LuLock size={15} className="text-text-muted" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-muted truncate">{book.name}</p>
                  <p className="text-xs text-text-muted">Período cerrado</p>
                </div>
              </div>
              <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-bg-subtle text-text-muted font-medium">
                Cerrado
              </span>
            </div>
            <div className="border-t border-bg-subtle px-4 py-2 bg-bg-subtle/50 flex items-center justify-end">
              {downloadButtons}
            </div>
          </div>
        );
      })}
    </div>
  );
}

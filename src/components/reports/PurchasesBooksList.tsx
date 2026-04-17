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
  const { data: session } = useSession();
  const remoteUrl = session?.url;
  if (!purchases || purchases.length === 0) {
    return (
      <p className="text-xs text-text-muted italic">No hay libros disponibles.</p>
    );
  }

  const effectiveSelectedId = selectedId ?? purchases[0]?.id;

  return (
    <div className={`space-y-2 ${disabled ? 'pointer-events-none opacity-60' : ''}`}>
      {purchases.map((book) => {
        const isOpen = book.status === 1;
        const isSelected = book.id === effectiveSelectedId;

        if (isOpen) {
          return (
            <div
              key={book.id}
              onClick={() => !disabled && onSelect?.(book.id)}
              className={`bg-bg-content rounded-lg overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-2 border-primary' : 'border-2 border-primary/30 hover:border-primary/60'
                }`}
            >
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <LuBookOpen size={18} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text-base truncate">{book.name}</p>
                    <p className="text-xs text-primary font-medium">Libro activo</p>
                    <p className="text-xs text-text-muted pt-2">
                      {invoicesCount} documento{invoicesCount !== 1 ? 's' : ''} registrado{invoicesCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  Activo
                </span>
              </div>
              {isSelected && (
                <div className="border-t border-primary/20 px-4 py-2 bg-primary/5 flex items-center justify-end">
                  <div className="flex gap-2">
                    <ButtonDownloadGet autoclass={false} href={`id=${book.id}&option=1&route=download.excel.purchaseBook`}>
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium active:scale-95 transition-all duration-150 bg-primary/5 text-primary hover:bg-primary/15">
                      <LuDownload size={13} />Descargar libro</button>
                    </ButtonDownloadGet>
                    <ButtonDownloadGet autoclass={false} href={`id=${book.id}&option=3&route=download.excel.purchaseBook`}>
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium active:scale-95 transition-all duration-150 bg-primary/5 text-primary hover:bg-primary/15">
                      <LuDownload size={13} />Descargar anexo</button>
                    </ButtonDownloadGet>
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <div
            key={book.id}
            onClick={() => !disabled && onSelect?.(book.id)}
            className={`bg-bg-content rounded-lg overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-2 border-bg-subtle ring-1 ring-text-muted/30' : 'border border-bg-subtle hover:border-text-muted/40'
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
            {isSelected && (
              <div className="border-t border-bg-subtle px-4 py-2 bg-bg-subtle/50">
                <p className="text-xs text-text-muted">
                  {invoicesCount} documento{invoicesCount !== 1 ? 's' : ''} registrado{invoicesCount !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

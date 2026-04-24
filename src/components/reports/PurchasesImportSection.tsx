'use client';
import { PurchasesImportResultModal } from "@/components/reports/PurchasesImportResultModal";
import { postFormData } from "@/services/OtherServices";
import purchasesStore from "@/stores/reports/purchasesStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import { useRef, useState } from "react";
import { LuFileJson, LuInfo, LuUpload, LuX, LuArrowDown } from "react-icons/lu";

interface Props {
  bookName?: string;
  bookId?: string;
  onUploadingChange: (v: boolean) => void;
  hasBooks: boolean;
  isEmpty?: boolean;
}

export function PurchasesImportSection({ bookName, bookId, onUploadingChange, hasBooks, isEmpty = false }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ processed: number; errors: { file: string; message: string }[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setError } = useToastMessageStore();
  const { loadInvoices } = purchasesStore();

  const handleDrop = (e: React.DragEvent) => {
    if (isUploading) return;
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.json'));
    setFiles(prev => [...prev, ...dropped]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).filter(f => f.name.endsWith('.json'));
    setFiles(prev => [...prev, ...selected]);
    e.target.value = '';
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleUpload = async () => {
    if (!bookId || files.length === 0 || isUploading) return;

    setIsUploading(true);
    onUploadingChange(true);

    try {
      const formData = new FormData();
      formData.append('purchase_id', bookId);
      files.forEach(file => formData.append('files[]', file));

      const response = await postFormData(`purchases/${bookId}/invoices`, formData);

      if (response?.data) {
        setResult(response.data);
        setFiles([]);
        loadInvoices(`purchases/${bookId}/invoices`);
      } else {
        setError({ message: response?.message ?? 'Error al importar los archivos' });
      }
    } catch (error) {
      setError({ message: 'Error al importar los archivos' });
    } finally {
      setIsUploading(false);
      onUploadingChange(false);
    }
  };

  if (!hasBooks) {
    return (
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
          Importar facturas
        </p>
        <div className="rounded-lg border border-bg-subtle bg-bg-content p-5 flex flex-col items-center gap-3 text-center">
          <div className="w-11 h-11 rounded-full bg-info/10 flex items-center justify-center">
            <LuInfo size={20} className="text-info" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-text-base">Aún no hay ningún libro de compras</p>
            <p className="text-xs text-text-muted leading-relaxed">
              Esta sección recibirá automáticamente los JSON DTE de compras y los procesará para generar los archivos Excel y CSV listos para revisión. También podrás subir los archivos manualmente cuando lo necesites.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const showCallToAction = isEmpty && !isUploading && files.length === 0 && !isDragging;

  return (
    <div className={`transition-all duration-500 ${showCallToAction ? 'rounded-xl ring-2 ring-primary/50 ring-offset-2 ring-offset-bg-base shadow-xl shadow-primary/20' : ''}`}>
      <PurchasesImportResultModal show={!!result} onClose={() => setResult(null)} result={result} />

      {showCallToAction && (
        <div className="flex flex-col items-center gap-0.5 pt-2 pb-0.5">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">¡Comience aquí!</p>
          <LuArrowDown size={14} className="text-primary animate-bounce" />
          <LuArrowDown size={14} className="text-primary/50 animate-bounce [animation-delay:150ms] -mt-2" />
        </div>
      )}

      <div className={showCallToAction ? 'px-3 pb-2' : ''}>
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 mt-2">
          Importar facturas — {bookName ?? '—'}
        </p>

        <div
          onDragOver={(e) => { if (!isUploading) { e.preventDefault(); setIsDragging(true); } }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => { if (!isUploading) fileInputRef.current?.click(); }}
          className={`rounded-lg border-2 border-dashed transition-all p-4 flex flex-col items-center gap-1.5 text-center ${
            isUploading
              ? 'border-bg-subtle opacity-50 cursor-not-allowed'
              : isDragging
                ? 'border-primary bg-primary/8 scale-[1.01] cursor-pointer'
                : showCallToAction
                  ? 'border-primary bg-primary/8 cursor-pointer hover:bg-primary/12'
                  : 'border-bg-subtle hover:border-primary/40 hover:bg-primary/5 cursor-pointer'
          }`}
        >
          <div className="relative">
            {showCallToAction && (
              <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
            )}
            <div className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              isDragging ? 'bg-primary/20' : showCallToAction ? 'bg-primary/20' : 'bg-bg-subtle'
            }`}>
              <LuUpload size={20} className={isDragging || showCallToAction ? 'text-primary' : 'text-text-muted'} />
            </div>
          </div>
          <div>
            <p className={`text-sm font-semibold ${showCallToAction ? 'text-primary' : 'text-text-base'}`}>
              {isDragging ? 'Suelte los archivos aquí' : 'Arrastre los archivos aquí'}
            </p>
            <p className="text-xs text-text-muted mt-0.5">o haga clic para seleccionar</p>
          </div>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium transition-colors ${showCallToAction ? 'bg-primary/15 text-primary animate-pulse' : 'bg-bg-subtle text-text-muted'}`}>
            Solo archivos .json
          </span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".json"
            className="hidden"
            onChange={handleFileInput}
            disabled={isUploading}
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className={`mt-3 space-y-2 ${showCallToAction ? 'px-3 pb-3' : ''}`}>
          <p className="text-xs text-text-muted">
            {files.length} archivo{files.length !== 1 ? 's' : ''} seleccionado{files.length !== 1 ? 's' : ''}
          </p>
          <ul className="max-h-44 overflow-y-auto custom-scrollbar space-y-1.5">
            {files.map((file, i) => (
              <li key={i} className="flex items-center justify-between px-3 py-2 bg-bg-content rounded-lg border border-bg-subtle text-xs group">
                <div className="flex items-center gap-2 min-w-0">
                  <LuFileJson size={14} className="shrink-0 text-primary/60" />
                  <span className="truncate text-text-base">{file.name}</span>
                </div>
                {!isUploading && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="shrink-0 ml-2 text-text-muted hover:text-danger transition-colors clickeable opacity-0 group-hover:opacity-100"
                  >
                    <LuX size={13} />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {isUploading ? (
            <div className="space-y-1.5">
              <p className="text-xs text-text-muted">
                Subiendo {files.length} archivo{files.length !== 1 ? 's' : ''}...
              </p>
              <div className="w-full h-2 bg-bg-subtle rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-[shimmer_1.5s_infinite]" style={{ width: '40%' }} />
              </div>
            </div>
          ) : (
            <button
              onClick={handleUpload}
              disabled={!bookId}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-primary text-text-inverted text-xs font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all clickeable disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Importar {files.length} archivo{files.length !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

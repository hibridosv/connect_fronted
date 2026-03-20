'use client';
import qrReaderStore from '@/stores/annexes/qrReaderStore';
import useToastMessageStore from '@/stores/toastMessageStore';
import { useRef, useState } from 'react';
import { LuFileJson, LuUpload } from 'react-icons/lu';

const REQUIRED_FIELDS = ['identificacion', 'emisor', 'receptor', 'cuerpoDocumento', 'resumen'];

const DATA_TOKENS = [
  'tipoDte', 'nit', 'codigoGeneracion', 'numeroControl',
  'emisor', 'receptor', 'resumen', 'pagos', 'fecEmi',
  '{"dte":', '"version":', 'selloMH', 'totalPagar',
];

function validateDteJson(data: any): string | null {
  if (!data || typeof data !== 'object' || Array.isArray(data))
    return 'El archivo no contiene un objeto JSON válido';
  for (const field of REQUIRED_FIELDS) {
    if (!(field in data)) return `Falta el campo requerido: "${field}"`;
  }
  if (!data.identificacion?.tipoDte) return 'Falta "identificacion.tipoDte"';
  if (!Array.isArray(data.cuerpoDocumento)) return 'El campo "cuerpoDocumento" debe ser un arreglo';
  return null;
}

function TransmissionAnimation() {
  return (
    <div className="relative h-36 w-full overflow-hidden rounded-md flex items-center justify-center">

      <div
        className="absolute inset-x-0 h-px pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to right, transparent, rgb(var(--color-primary) / 0.9), transparent)',
          boxShadow: '0 0 8px 2px rgb(var(--color-primary) / 0.35)',
          animation: 'qr-scan-down 1.6s ease-in-out infinite',
        }}
      />

      <div className="relative flex items-center justify-center">
        {[0, 350, 700].map((delay) => (
          <div
            key={delay}
            className="absolute w-10 h-10 rounded-full border border-primary/50"
            style={{ animation: `qr-signal-pulse 2.1s ease-out infinite`, animationDelay: `${delay}ms` }}
          />
        ))}

        <div
          className="relative z-10 w-10 h-10 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        >
          <LuFileJson size={18} className="text-primary" />
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {DATA_TOKENS.map((token, i) => (
          <span
            key={i}
            className="absolute text-[9px] font-mono text-primary/40 whitespace-nowrap"
            style={{
              left: `${8 + (i * 13) % 76}%`,
              bottom: `${10 + (i * 17) % 50}%`,
              animation: `qr-data-float ${1.8 + (i % 4) * 0.5}s ease-in-out infinite`,
              animationDelay: `${(i * 280) % 1800}ms`,
            }}
          >
            {token}
          </span>
        ))}
      </div>

      <p className="absolute bottom-2 left-0 right-0 text-center text-xs font-semibold text-primary/70 tracking-wider">
        Leyendo archivo…
      </p>
    </div>
  );
}

export function QrImportSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setInvoice } = qrReaderStore();
  const { setError } = useToastMessageStore();

  const processFile = (file: File) => {
    if (!file.name.endsWith('.json')) {
      setError({ message: 'Solo se aceptan archivos .json' });
      return;
    }
    setIsReading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const validationError = validateDteJson(parsed);
        if (validationError) {
          setError({ message: validationError });
        } else {
          setInvoice(file.name, parsed);
        }
      } catch {
        setError({ message: 'El archivo no es un JSON válido' });
      } finally {
        setIsReading(false);
      }
    };
    reader.onerror = () => {
      setError({ message: 'Error al leer el archivo' });
      setIsReading(false);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isReading) return;
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
        Importar factura electrónica
      </p>

      {isReading ? (
        <div className="rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 transition-all">
          <TransmissionAnimation />
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-lg border-2 border-dashed transition-all p-6 flex flex-col items-center gap-2 text-center cursor-pointer ${
            isDragging
              ? 'border-primary bg-primary/8 scale-[1.01]'
              : 'border-bg-subtle hover:border-primary/40 hover:bg-primary/5'
          }`}
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
            isDragging ? 'bg-primary/20' : 'bg-bg-subtle'
          }`}>
            <LuUpload size={20} className={isDragging ? 'text-primary' : 'text-text-muted'} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-base">
              {isDragging ? 'Suelte el archivo aquí' : 'Arrastre el archivo aquí'}
            </p>
            <p className="text-xs text-text-muted mt-0.5">o haga clic para seleccionar</p>
          </div>
          <span className="text-xs text-text-muted bg-bg-subtle px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
            <LuFileJson size={12} />
            Solo archivos .json
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      )}
    </div>
  );
}

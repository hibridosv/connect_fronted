'use client';
import { ViewTitle } from "@/components/ViewTitle";
import { useDownloadsLogic } from "@/hooks/reports/useDownloadsLogic";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { LuChevronDown, LuDownload, LuFileJson, LuLoader } from "react-icons/lu";
import { TbPdf } from "react-icons/tb";

const STEPS = [
  { key: 'generate',   label: 'Generar JSON',       description: 'Inicie la generación del archivo ZIP con los documentos electrónicos del período', Icon: LuFileJson  },
  { key: 'processing', label: 'Procesando',          description: 'El servidor está generando los documentos. Actualice el estado para verificar si terminó',   Icon: FaSpinner   },
  { key: 'ready',      label: 'Listo para descargar', description: 'El archivo ZIP está disponible. Puede descargarlo o generar los PDFs correspondientes',     Icon: LuDownload  },
];

const MONTHS_OPTIONS = Array.from({ length: 6 }, (_, i) => ({
  label: DateTime.now().minus({ months: i + 1 }).setLocale('es').toFormat('MMMM yyyy'),
  value: i + 1,
}));

export default function Page() {
  const { history: downloads, handleGet, loading, handleGenerateDocuments } = useDownloadsLogic('downloads');
  const loadingDownload = loading.downloads ?? false;
  const creating = loading.creating ?? false;
  const API_URL = process.env.NEXT_PUBLIC_URL_API;
  const [pdfDropdownOpen, setPdfDropdownOpen] = useState(false);
  const [jsonDropdownOpen, setJsonDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const jsonTriggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [jsonDropdownPos, setJsonDropdownPos] = useState({ top: 0, left: 0 });

  const handleOpenDropdown = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left });
    }
    setPdfDropdownOpen(v => !v);
  };

  const handleOpenJsonDropdown = () => {
    if (jsonTriggerRef.current) {
      const rect = jsonTriggerRef.current.getBoundingClientRect();
      setJsonDropdownPos({ top: rect.bottom + 4, left: rect.left });
    }
    setJsonDropdownOpen(v => !v);
  };
  const showGeneratePdf = downloads?.length === 1 && downloads[0]?.status == 1;

  const currentStep = !downloads || downloads.length === 0
    ? 'generate'
    : downloads[0]?.status == 1
      ? 'ready'
      : 'processing';

  const stepIndex = STEPS.findIndex(s => s.key === currentStep);

  return (
    <div className="pb-4 md:pb-10">
      <ViewTitle text="Descarga de JSON y PDF" />
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="md:col-span-2 space-y-4">
          <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-hidden">

            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-0">
                {STEPS.map((step, i) => {
                  const isCompleted = i < stepIndex;
                  const isCurrent = i === stepIndex && !loadingDownload;
                  const StepIcon = step.Icon;
                  return (
                    <div key={step.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isCompleted
                            ? 'bg-success border-success text-text-inverted'
                            : isCurrent
                              ? 'bg-primary border-primary text-text-inverted'
                              : 'bg-bg-subtle border-bg-subtle text-text-muted'
                        }`}>
                          {isCompleted
                            ? <span className="text-xs font-bold">✓</span>
                            : <StepIcon size={14} className={isCurrent && step.key === 'processing' ? 'animate-spin' : ''} />
                          }
                        </div>
                        <span className={`text-xs mt-1 text-center leading-tight font-medium ${
                          isCompleted ? 'text-success' : isCurrent ? 'text-primary' : 'text-text-muted'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`h-0.5 flex-1 mx-1 mb-5 transition-colors ${isCompleted ? 'bg-success' : 'bg-bg-subtle'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
              {!loadingDownload && (
                <p className="text-xs text-text-muted text-center mt-2 leading-snug">
                  {STEPS[stepIndex]?.description}
                </p>
              )}
            </div>

            <div className="border-t border-bg-subtle">
              {loadingDownload ? (
                <div className="p-4 space-y-3 animate-pulse">
                  <div className="h-4 w-2/3 bg-bg-subtle rounded" />
                  <div className="h-3 w-full bg-bg-subtle rounded" />
                  <div className="h-3 w-5/6 bg-bg-subtle rounded" />
                  <div className="h-8 w-32 bg-bg-subtle rounded mt-2" />
                </div>
              ) : downloads && downloads.length > 0 ? (
                <>
                  <ul className="divide-y divide-bg-subtle">
                    {downloads.map((download: any) =>
                      download.status == 1 ? (
                        <li key={download.id}>
                          <a
                            href={`${API_URL}zip/download/${download.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-bg-subtle/60 transition-colors clickeable group"
                          >
                            <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                              <LuFileJson size={18} className="text-primary/70" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-text-base leading-snug truncate">
                                {download.comments}
                              </p>
                              {download.filename && (
                                <p className="text-xs text-text-muted mt-0.5 truncate font-mono">
                                  {download.filename}
                                </p>
                              )}
                            </div>
                            <LuDownload size={16} className="shrink-0 text-text-muted group-hover:text-primary transition-colors" />
                          </a>
                        </li>
                      ) : (
                        <li key={download.id}>
                          <button
                            onClick={creating ? undefined : () => handleGet('downloads')}
                            className="w-full flex justify-between items-center px-4 py-3 hover:bg-warning/5 text-warning text-sm transition-colors clickeable"
                          >
                            <span>Se está procesando el archivo (click para actualizar)</span>
                            <FaSpinner className="animate-spin" size={18} />
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                  {showGeneratePdf && (
                    <div className="px-4 py-4 border-t border-bg-subtle bg-bg-subtle/30 flex items-start gap-3">
                      <TbPdf size={26} className="shrink-0 text-danger/70 mt-0.5" />
                      <div className="space-y-2 flex-1">
                        <p className="text-sm font-semibold text-text-base">Generar Documentos PDF</p>
                        <p className="text-xs text-text-muted">
                          Genere los documentos en formato PDF si no se han generado previamente. Puede tardar unos minutos.
                        </p>
                        <div ref={dropdownRef} className="inline-block">
                          <button
                            ref={triggerRef}
                            type="button"
                            disabled={creating}
                            onClick={handleOpenDropdown}
                            className="button-green flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {creating ? "Generando..." : "Generar PDF"}
                            <LuChevronDown size={14} className={`transition-transform duration-200 ${pdfDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {pdfDropdownOpen && !creating && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setPdfDropdownOpen(false)} />
                              <ul
                                style={{ top: dropdownPos.top, left: dropdownPos.left }}
                                className="fixed z-50 min-w-[160px] bg-bg-content border border-bg-subtle rounded-lg shadow-lg overflow-hidden animate-slide-up"
                              >
                                {MONTHS_OPTIONS.map(({ label, value }) => (
                                  <li key={value}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setPdfDropdownOpen(false);
                                        handleGenerateDocuments('pdf', value);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-text-base hover:bg-bg-subtle capitalize transition-colors"
                                    >
                                      {label}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="px-4 py-5 flex items-start gap-3">
                  <LuFileJson size={26} className="shrink-0 text-primary/50 mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-semibold text-text-base">Sin documentos disponibles</p>
                    <p className="text-xs text-text-muted">
                      No hay documentos disponibles. Genere los documentos en formato JSON; esto puede tardar unos minutos dependiendo de la cantidad a procesar.
                    </p>
                    <div className="inline-block">
                      <button
                        ref={jsonTriggerRef}
                        type="button"
                        disabled={creating}
                        onClick={handleOpenJsonDropdown}
                        className="button-green flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {creating ? "Generando..." : "Generar JSON"}
                        <LuChevronDown size={14} className={`transition-transform duration-200 ${jsonDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {jsonDropdownOpen && !creating && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setJsonDropdownOpen(false)} />
                          <ul
                            style={{ top: jsonDropdownPos.top, left: jsonDropdownPos.left }}
                            className="fixed z-50 min-w-[160px] bg-bg-content border border-bg-subtle rounded-lg shadow-lg overflow-hidden animate-slide-up"
                          >
                            {MONTHS_OPTIONS.map(({ label, value }) => (
                              <li key={value}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setJsonDropdownOpen(false);
                                    handleGenerateDocuments('json', value);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-text-base hover:bg-bg-subtle capitalize transition-colors"
                                >
                                  {label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {downloads && downloads.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={() => handleGet('downloads')}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors clickeable"
              >
                <LuLoader size={13} />
                Actualizar estado
              </button>
            </div>
          )}
        </div>

        <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-hidden self-start">
          <div className="px-4 py-3 bg-bg-subtle/60 border-b border-bg-subtle">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Información</span>
          </div>
          <div className="p-4 space-y-4 text-xs text-text-muted">
            <div className="flex items-start gap-2">
              <LuFileJson size={16} className="shrink-0 text-primary/50 mt-0.5" />
              <div>
                <p className="font-semibold text-text-base mb-0.5">Archivo JSON</p>
                <p>Contiene los documentos electrónicos en formato requerido por el Ministerio de Hacienda. Se genera una sola vez por período.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <TbPdf size={16} className="shrink-0 text-danger/60 mt-0.5" />
              <div>
                <p className="font-semibold text-text-base mb-0.5">Archivo PDF</p>
                <p>Representación visual de los documentos electrónicos. Puede generarse después del JSON una vez que esté listo.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <LuDownload size={16} className="shrink-0 text-accent/70 mt-0.5" />
              <div>
                <p className="font-semibold text-text-base mb-0.5">Descarga</p>
                <p>Los archivos se entregan en formato ZIP. La generación puede tardar varios minutos dependiendo del volumen de documentos.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

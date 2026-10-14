import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import { useSearchDocumentLogic } from "@/hooks/invoicing/useSearchDocumentLogic";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import useConfigStore from "@/stores/configStore";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { RiArrowGoBackLine, RiCheckboxCircleFill, RiCloseLine, RiEdit2Line, RiErrorWarningLine, RiFileTextLine, RiInformationLine, RiLoader4Line, RiQuestionLine } from "react-icons/ri";
import { SearchInput } from "../Search";
import Modal from "../modal/Modal";

export interface InvalidateDocumentData {
  tipo_anulacion: number;
  motivo_anulacion: string;
  codigo_generacion_reemplazo: string | null;
}

export interface InvalidateDocumentModalI {
  isShow: boolean;
  onClose: () => void;
  record: any;
  isCreditNote?: boolean;
  isSending?: boolean;
  onConfirm: (data: InvalidateDocumentData) => void;
}

const MOTIVOS_DEFECTO: Record<number, string> = {
  1: "Error en la información del documento",
  2: "Devolucion de producto",
  3: "Otro",
};

// documento no electronico: no hay Evento de Invalidacion, pero connect exige tipo y motivo al anular
export const SIN_INVALIDACION_MH: InvalidateDocumentData = {
  tipo_anulacion: 2,
  motivo_anulacion: MOTIVOS_DEFECTO[2],
  codigo_generacion_reemplazo: null,
};

const MOTIVO_MAX = 200;

// CAT-024: tipo de anulacion del Evento de Invalidacion
const TIPOS_ANULACION: { value: number; label: string; description: string; icon: IconType }[] = [
  { value: 2, label: "Rescindir la operación", description: "La venta no se concretó, por ejemplo por devolución de producto.", icon: RiArrowGoBackLine },
  { value: 1, label: "Error en el documento", description: "Los datos del documento son incorrectos y ya se emitió uno que lo corrige.", icon: RiEdit2Line },
  { value: 3, label: "Otro motivo", description: "Cualquier otra causa; requiere el documento que lo reemplaza.", icon: RiQuestionLine },
];

export function InvalidateDocumentModal(props: InvalidateDocumentModalI) {
  const { isShow, onClose, record, isCreditNote = false, isSending = false, onConfirm } = props;
  const { system } = useConfigStore();
  const [tipoAnulacion, setTipoAnulacion] = useState(2);
  const [motivo, setMotivo] = useState(MOTIVOS_DEFECTO[2]);
  const [reemplazo, setReemplazo] = useState<any | null>(null);
  const { searchTerm, handleSearchTerm } = useSearchTerm(["invoice"], 400, 1);
  const { responseData, loading: searching } = useSearchDocumentLogic("&page=1", searchTerm);

  useEffect(() => {
    if (isShow) {
      setTipoAnulacion(2);
      setMotivo(MOTIVOS_DEFECTO[2]);
      setReemplazo(null);
    }
  }, [isShow, record?.id]);

  const requiereReemplazo = !isCreditNote && (tipoAnulacion === 1 || tipoAnulacion === 3);
  const resultados = (responseData?.data?.data ?? []).filter((r: any) => r.id !== record?.id && r.status === 3);
  const puedeConfirmar = motivo.trim().length > 0 && (!requiereReemplazo || !!reemplazo);

  const handleTipoChange = (tipo: number) => {
    setTipoAnulacion(tipo);
    setMotivo(MOTIVOS_DEFECTO[tipo]);
    setReemplazo(null);
  };

  const handleConfirm = () => {
    onConfirm({
      tipo_anulacion: tipoAnulacion,
      motivo_anulacion: motivo.trim(),
      codigo_generacion_reemplazo: requiereReemplazo ? reemplazo?.id ?? null : null,
    });
  };

  if (!isShow || !record) return null;

  // la Nota de Credito trae emited_at; el documento, charged_at, cliente y tipo de documento
  const fecha = record.charged_at ?? record.emited_at;
  const tituloDocumento = isCreditNote ? "Nota de Crédito" : record.invoice_assigned?.name ?? "Documento";

  return (
    <Modal show={isShow} onClose={onClose} size="xl2" headerTitle={isCreditNote ? "Anular Nota de Crédito" : "Anular documento"}>
      <Modal.Body>
        <div className="px-1 pb-2 space-y-5">

          {/* documento que se anula */}
          <div className="rounded-xl border border-danger/20 bg-danger/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 rounded-full bg-danger/10 p-2 text-danger">
                <RiErrorWarningLine size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div className="font-semibold text-text-base">
                    {tituloDocumento} N° {record.invoice ?? "--"}
                  </div>
                  {record.total !== undefined && (
                    <div className="text-lg font-bold text-text-base">{numberToMoney(record.total ?? 0, system)}</div>
                  )}
                </div>
                <div className="mt-0.5 text-sm text-text-muted">
                  {record.client?.name && <span>{record.client.name} · </span>}
                  {fecha && <span>{formatDateAsDMY(fecha)} {formatHourAsHM(fecha)}</span>}
                </div>
                <p className="mt-2 text-sm text-danger">
                  Se enviará un Evento de Invalidación al Ministerio de Hacienda. Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
          </div>

          {/* tipo de anulacion */}
          <div>
            <div className="mb-2 text-sm font-semibold text-text-base">Tipo de anulación</div>
            <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Tipo de anulación">
              {TIPOS_ANULACION.map((opcion) => {
                const activo = tipoAnulacion === opcion.value;
                const Icono = opcion.icon;
                return (
                  <button
                    key={opcion.value}
                    type="button"
                    role="radio"
                    aria-checked={activo}
                    onClick={() => handleTipoChange(opcion.value)}
                    className={`relative flex h-full flex-col items-start gap-1.5 rounded-xl border-2 p-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      activo ? "border-primary bg-primary/5" : "border-bg-subtle bg-bg-content hover:border-primary/40 hover:bg-bg-subtle/40"
                    }`}
                  >
                    {activo && <RiCheckboxCircleFill className="absolute right-2.5 top-2.5 text-primary" size={18} />}
                    <Icono size={20} className={activo ? "text-primary" : "text-text-muted"} />
                    <span className={`text-sm font-semibold ${activo ? "text-primary" : "text-text-base"}`}>{opcion.label}</span>
                    <span className="text-xs leading-snug text-text-muted">{opcion.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* motivo */}
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label className="text-sm font-semibold text-text-base" htmlFor="motivoAnulacion">Motivo</label>
              <span className="text-xs text-text-muted">{motivo.length}/{MOTIVO_MAX}</span>
            </div>
            <textarea
              id="motivoAnulacion"
              className="input w-full resize-none"
              rows={2}
              maxLength={MOTIVO_MAX}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Describa brevemente por qué se anula el documento"
            />
            {motivo.trim().length === 0 && <p className="mt-1 text-xs text-danger">El motivo es obligatorio.</p>}
          </div>

          {/* documento de reemplazo (tipos 1 y 3) */}
          {requiereReemplazo && (
            <div className="space-y-3 rounded-xl border border-bg-subtle p-4">
              <div>
                <div className="text-sm font-semibold text-text-base">Documento de reemplazo</div>
                <div className="mt-1 flex gap-2 text-xs leading-snug text-text-muted">
                  <RiInformationLine size={16} className="mt-px flex-shrink-0 text-info" />
                  <span>
                    Hacienda exige que ya exista otro documento, ya facturado y sellado, que corrija este error. Busque y seleccione ese
                    documento; no es el documento que está anulando.
                  </span>
                </div>
              </div>

              {reemplazo ? (
                <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/5 p-3">
                  <RiCheckboxCircleFill size={22} className="flex-shrink-0 text-success" />
                  <div className="min-w-0 flex-1 text-sm">
                    <div className="font-semibold text-text-base">{reemplazo.invoice_assigned?.name ?? "--"} N° {reemplazo.invoice ?? "--"}</div>
                    <div className="truncate text-text-muted">
                      {reemplazo.client?.name ?? "N/A"} · {formatDateAsDMY(reemplazo.charged_at)} {formatHourAsHM(reemplazo.charged_at)} · {numberToMoney(reemplazo.total ?? 0, system)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReemplazo(null)}
                    title="Cambiar documento de reemplazo"
                    className="flex-shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-subtle hover:text-text-base"
                  >
                    <RiCloseLine size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar documento de reemplazo por número" animating={searching} />
                  <div className="max-h-56 overflow-y-auto rounded-lg border border-bg-subtle">
                    {resultados.length === 0 && (
                      <div className="flex items-center gap-2 p-4 text-sm text-text-muted">
                        <RiFileTextLine size={18} className="flex-shrink-0" />
                        {searching ? "Buscando..." : "Escriba el número del documento de reemplazo"}
                      </div>
                    )}
                    {resultados.map((item: any, index: number) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setReemplazo(item)}
                        className={`flex w-full items-center gap-3 p-3 text-left text-sm transition-colors hover:bg-primary/5 ${index > 0 ? "border-t border-bg-subtle" : ""}`}
                      >
                        <RiFileTextLine size={18} className="flex-shrink-0 text-text-muted" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-text-base">{item.invoice_assigned?.name ?? "--"} N° {item.invoice ?? "--"}</div>
                          <div className="truncate text-text-muted">
                            {item.client?.name ?? "N/A"} · {formatDateAsDMY(item.charged_at)} {formatHourAsHM(item.charged_at)}
                          </div>
                        </div>
                        <div className="flex-shrink-0 font-semibold text-text-base">{numberToMoney(item.total ?? 0, system)}</div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </Modal.Body>
      <Modal.Footer>
        {/* mismos estilos que DeleteModal: cancelar neutro, anular en rojo */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSending}
          className="inline-flex justify-center rounded-md border border-bg-subtle bg-bg-content px-4 py-2 text-sm font-medium text-text-muted shadow-sm hover:bg-bg-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          No, Cancelar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isSending || !puedeConfirmar}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-danger/90 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSending && <RiLoader4Line size={16} className="animate-spin" />}
          {isSending ? "Anulando..." : "Sí, Anular"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

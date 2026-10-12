import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import { useSearchDocumentLogic } from "@/hooks/invoicing/useSearchDocumentLogic";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import useConfigStore from "@/stores/configStore";
import { useEffect, useState } from "react";
import { Alert } from "../Alert/Alert";
import { SearchInput } from "../Search";
import { Button, Preset } from "../button/button";
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

  return (
    <Modal show={isShow} onClose={onClose} size="xl2" headerTitle={isCreditNote ? "Anular Nota de Crédito" : "Anular documento"}>
      <Modal.Body>
        <div className="p-4 space-y-4">

          <div>
            <label className="input-label">Tipo de anulación</label>
            <div className="flex flex-wrap gap-4 mt-1">
              {[
                { value: 2, label: "Rescindir de la operación (ej. devolución de producto)" },
                { value: 1, label: "Error en el documento" },
                { value: 3, label: "Otro" },
              ].map((opcion) => (
                <div key={opcion.value} className="inline-block min-h-[1.5rem] pl-[1.5rem]">
                  <input
                    className="input-radio"
                    type="radio"
                    id={`tipoAnulacion-${opcion.value}`}
                    checked={tipoAnulacion === opcion.value}
                    onChange={() => handleTipoChange(opcion.value)}
                  />
                  <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor={`tipoAnulacion-${opcion.value}`}>
                    {opcion.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="input-label" htmlFor="motivoAnulacion">Motivo</label>
            <textarea
              id="motivoAnulacion"
              className="input w-full"
              rows={2}
              maxLength={200}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>

          {requiereReemplazo && (
            <div className="space-y-3">
              <Alert
                type="info"
                isDismissible={false}
                text="Hacienda exige que ya exista otro documento, ya facturado y sellado, que corrija este error. Busca y selecciona ese documento como reemplazo antes de continuar; no es el documento que estás anulando."
              />

              {reemplazo ? (
                <div className="flex items-center justify-between bg-bg-subtle/60 border border-bg-subtle rounded-lg p-3">
                  <div className="text-sm">
                    <div className="font-medium">{reemplazo.invoice_assigned?.name ?? "--"} N° {reemplazo.invoice ?? "--"}</div>
                    <div className="text-text-muted">
                      {reemplazo.client?.name ?? "N/A"} — {formatDateAsDMY(reemplazo.charged_at)} {formatHourAsHM(reemplazo.charged_at)} — {numberToMoney(reemplazo.total ?? 0, system)}
                    </div>
                  </div>
                  <Button preset={Preset.smallClose} onClick={() => setReemplazo(null)} />
                </div>
              ) : (
                <>
                  <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar documento de reemplazo por número" animating={searching} />
                  <div className="max-h-56 overflow-y-auto divide-y divide-bg-subtle border border-bg-subtle rounded-lg">
                    {resultados.length === 0 && (
                      <div className="p-3 text-sm text-text-muted">
                        {searching ? "Buscando..." : "Escribe el número del documento de reemplazo"}
                      </div>
                    )}
                    {resultados.map((item: any) => (
                      <div
                        key={item.id}
                        onClick={() => setReemplazo(item)}
                        className="p-3 text-sm hover:bg-bg-subtle clickeable"
                      >
                        <div className="font-medium">{item.invoice_assigned?.name ?? "--"} N° {item.invoice ?? "--"}</div>
                        <div className="text-text-muted">
                          {item.client?.name ?? "N/A"} — {formatDateAsDMY(item.charged_at)} {formatHourAsHM(item.charged_at)} — {numberToMoney(item.total ?? 0, system)}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} text="Cancelar" disabled={isSending} />
        <Button
          onClick={handleConfirm}
          preset={isSending ? Preset.saving : Preset.danger}
          text="Sí, Anular"
          disabled={isSending || !puedeConfirmar}
        />
      </Modal.Footer>
    </Modal>
  );
}

import { useMemo } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { Alert } from "../Alert/Alert";
import { Button, Preset } from "../button/button";
import Modal from "../modal/Modal";
import { DteDiagnosisList, knownDiagnosis } from "./DteDiagnosisList";

export interface DocumentErrorsModalProps {
  onClose: () => void;
  isShow: boolean;
  document: any | null;
  onResend?: (codigoGeneracion: string) => void; // boton "Reenviar" del pie
}

// Helper para decodificar caracteres unicode, ej: \u00f3 -> ó
function decodeUnicode(str: string): string {
  if (!str) return '';
  return str.replace(/\\u([\dA-Fa-f]{4})/g, (match, grp) => {
    return String.fromCharCode(parseInt(grp, 16));
  });
}

// Hook para parsear y unificar errores de ambas fuentes
const useDocumentErrors = (document: any) => {
  return useMemo(() => {
    if (!document) return [];

    const allErrors = new Set<string>();

    // 1. Parsear `descripcion_msg`
    if (typeof document.descripcion_msg === 'string' && document.descripcion_msg.trim() !== '') {
      allErrors.add(document.descripcion_msg.trim());
    }

    // 2. Parsear `observaciones`
    if (typeof document.observaciones === 'string' && document.observaciones.trim() !== '[]' && document.observaciones.trim() !== '') {
      try {
        const parsedObservaciones = JSON.parse(document.observaciones);
        if (Array.isArray(parsedObservaciones)) {
          parsedObservaciones.forEach(obs => {
            if (typeof obs === 'string' && obs.trim() !== '') {
              allErrors.add(obs.trim());
            }
          });
        }
      } catch (e) {
        console.error("Error parsing 'observaciones' JSON string:", e);
        // Si el parseo falla, tratarlo como un string simple si no es un array vacío
        if (document.observaciones.trim() !== '[]') {
            allErrors.add(document.observaciones);
        }
      }
    }
    
    return Array.from(allErrors).map(decodeUnicode);
  }, [document]);
};

const ErrorItem = ({ error }: { error: string }) => (
  <div className="flex items-start gap-3 p-3 bg-danger/10 rounded-md">
    <FiAlertTriangle className="text-danger flex-shrink-0 mt-1" size={18} />
    <p className="text-danger font-medium text-sm">{error}</p>
  </div>
);

export function DocumentErrorsModal(props: DocumentErrorsModalProps) {
  const { onClose, isShow, document, onResend } = props;
  const errors = useDocumentErrors(document);
  // con un diagnostico conocido, el mensaje del MH queda plegado debajo de la causa y que hacer
  const diagnosis = knownDiagnosis(document?.diagnosis);
  const hasDiagnosis = diagnosis.length > 0;
  // se reenvia si el diagnostico no dice que no se puede (resend 'no' lo resuelve soporte)
  const canResend = !!onResend && hasDiagnosis && diagnosis.every((item) => item.resend !== 'no');

  return (
    <Modal show={isShow} onClose={onClose} size="lg" headerTitle="Errores del Documento">
      <Modal.Body>
        <div className="p-4">
          {errors.length === 0 ? (
            <Alert text="No se encontraron errores para este documento." type="success" />
          ) : (
            <div className="space-y-3">
              {hasDiagnosis && <DteDiagnosisList document={document} />}
              <details open={!hasDiagnosis}>
                <summary className="text-text-muted text-sm cursor-pointer">
                  {hasDiagnosis ? 'Ver mensaje de Hacienda' : 'Se encontraron los siguientes problemas que impidieron el procesamiento del documento:'}
                </summary>
                <div className="max-h-96 overflow-y-auto space-y-3 p-3 mt-2 bg-bg-subtle rounded-lg">
                  {errors.map((error, idx) => (
                    <ErrorItem key={idx} error={error} />
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-2 w-full">
          {canResend && <Button onClick={() => onResend?.(document?.codigo_generacion)} preset={Preset.primary} text="Reenviar" />}
          <Button onClick={onClose} preset={Preset.close} text="Cerrar" />
        </div>
      </Modal.Footer>
    </Modal>
  );
}
import { IndicatorType } from "@/components/Indicators";
import { MaintenanceFieldType } from "@/interfaces/maintenance";

export interface MaintenanceStatusOption {
  value: number;
  label: string;
  indicator: IndicatorType;
}

export const MAINTENANCE_STATUSES: MaintenanceStatusOption[] = [
  { value: 1, label: "Recibido", indicator: "info" },
  { value: 2, label: "En diagnóstico", indicator: "warning" },
  { value: 3, label: "En reparación", indicator: "warning" },
  { value: 4, label: "Listo", indicator: "success" },
  { value: 5, label: "Entregado", indicator: "dark" },
  { value: 6, label: "Cancelado", indicator: "danger" },
];

export function getMaintenanceStatus(status: number): MaintenanceStatusOption {
  return MAINTENANCE_STATUSES.find((s) => s.value === status) ?? MAINTENANCE_STATUSES[0];
}

export const MAINTENANCE_FIELD_TYPES: { value: MaintenanceFieldType; label: string }[] = [
  { value: "text", label: "Texto" },
  { value: "textarea", label: "Texto largo" },
  { value: "number", label: "Número" },
  { value: "date", label: "Fecha" },
  { value: "boolean", label: "Sí / No" },
  { value: "select", label: "Selección" },
];

const DIACRITICS_REGEX = new RegExp("[̀-ͯ]", "g");

export function slugifyFieldName(label: string): string {
  return label
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

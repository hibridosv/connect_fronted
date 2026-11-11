"use client";
import { Badge } from "@/components/Badge";

import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";

export interface AjusteInventarioProps {
  request?: any;
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-3 items-baseline px-3 py-2">
    <dt className="text-xs font-medium text-text-muted">{label}</dt>
    <dd className="col-span-2 text-sm text-text-base">{children}</dd>
  </div>
);

export function AjusteInventario(props: AjusteInventarioProps) {
  const { request } = props;

  if (!request) return <></>;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-bg-subtle/60 rounded-lg border border-bg-subtle">
        <span className="font-mono text-xs text-text-muted shrink-0">{request?.product?.cod}</span>
        <span className="text-text-muted text-xs">—</span>
        <span className="text-sm font-semibold text-text-base truncate">{request?.product?.description}</span>
      </div>
      <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-hidden">
        <dl className="divide-y divide-bg-subtle">
          <Row label="Inicio">{formatDateAsDMY(request?.adjustment?.initial_date)} {formatHourAsHM(request?.adjustment?.initial_date)}</Row>
          <Row label="Finalizado">{formatDateAsDMY(request?.adjustment?.final_date)} {formatHourAsHM(request?.adjustment?.final_date)}</Row>
          <Row label="Estado">
            <Badge variant={request?.adjustment?.status == 1 ? 'success' : 'danger'}>
              {request?.adjustment?.status == 1 ? 'Activo' : 'Finalizado'}
            </Badge>
          </Row>
          <Row label="Cantidad"><span className="font-semibold">{request?.quantity}</span></Row>
          <Row label="Establecido"><span className="font-semibold">{request?.stablished}</span></Row>
          <Row label="Diferencia">
            <span className={`font-semibold ${request?.difference > 0 ? 'text-success' : request?.difference < 0 ? 'text-danger' : ''}`}>
              {request?.difference}
            </span>
          </Row>
        </dl>
      </div>
    </div>
  );
}

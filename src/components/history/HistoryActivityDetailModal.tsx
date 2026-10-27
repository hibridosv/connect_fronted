'use client';

import Modal from "@/components/modal/Modal";
import { ActivityLog } from "@/interfaces/activityLog";
import { formatDate, formatHourAsHM } from "@/lib/date-formats";

export interface HistoryActivityDetailModalI {
  record: ActivityLog | null;
  onClose: () => void;
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

// Lista de campos; los arreglos de objetos (productos, precios) se muestran como tabla
function ValuesBlock({ title, values }: { title: string; values?: Record<string, any> | null }) {
  if (!values || Object.keys(values).length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-xs font-bold uppercase text-text-muted mb-1">{title}</p>
      <div className="bg-bg-subtle/40 rounded-lg border border-bg-subtle p-3 text-sm space-y-1">
        {Object.entries(values).map(([key, value]) => (
          Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' ? (
            <div key={key}>
              <p className="font-semibold">{key}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs mt-1">
                  <thead>
                    <tr>{Object.keys(value[0]).map(col => <th key={col} className="text-left pr-3 py-1">{col}</th>)}</tr>
                  </thead>
                  <tbody>
                    {value.map((row: any, index: number) => (
                      <tr key={index} className="border-t border-bg-subtle">
                        {Object.keys(value[0]).map(col => <td key={col} className="pr-3 py-1 whitespace-nowrap">{formatValue(row[col])}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p key={key}><span className="font-semibold">{key}:</span> {formatValue(value)}</p>
          )
        ))}
      </div>
    </div>
  );
}

export function HistoryActivityDetailModal({ record, onClose }: HistoryActivityDetailModalI) {
  if (!record) return null;
  const properties = record.properties;

  return (
    <Modal show={!!record} onClose={onClose} size="xl3" headerTitle={record.event_label}>
      <Modal.Body>
        <div className="p-4 text-text-base">
          <p className="font-medium">{record.description}</p>
          <p className="text-sm text-text-muted mt-1">
            {formatDate(record.created_at)} {formatHourAsHM(record.created_at)} · {record.user?.name ?? 'Usuario eliminado'} · {record.module_label}
          </p>
          {record.code_request_id && (
            <p className="text-sm mt-2">
              <span className="px-2 py-0.5 rounded bg-warning/20 text-warning font-semibold">Autorizado con código</span>
              {record.code_request?.permission && <span className="ml-2 text-text-muted">{record.code_request.permission}</span>}
            </p>
          )}
          <ValuesBlock title="Antes" values={properties?.before} />
          <ValuesBlock title="Después" values={properties?.after} />
          <ValuesBlock title="Detalle" values={properties?.extra} />
          {record.user_agent && <p className="text-xs text-text-muted mt-3 break-all">{record.ip} · {record.user_agent}</p>}
        </div>
      </Modal.Body>
    </Modal>
  );
}

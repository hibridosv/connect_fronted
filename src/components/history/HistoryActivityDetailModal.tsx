'use client';

import Modal from "@/components/modal/Modal";
import { ActivityLog, ActivityLogDetails } from "@/interfaces/activityLog";
import { formatDate, formatHourAsHM } from "@/lib/date-formats";

export interface HistoryActivityDetailModalI {
  record: ActivityLog | null;
  onClose: () => void;
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-3 items-baseline px-3 py-2">
    <dt className="text-xs font-medium text-text-muted">{label}</dt>
    <dd className="col-span-2 text-sm text-text-base">{children}</dd>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p className="text-xs font-bold uppercase text-text-muted mb-1">{title}</p>
    <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-x-auto">{children}</div>
  </div>
);

// Equipo desde el user agent: "Chrome en Windows"
const deviceName = (userAgent: string | null): string => {
  if (!userAgent) return '';
  const system = [['Android', 'Android'], ['iPhone', 'iPhone'], ['iPad', 'iPad'], ['Windows', 'Windows'], ['Mac OS', 'Mac'], ['Linux', 'Linux']]
    .find(([key]) => userAgent.includes(key))?.[1];
  const browser = [['Edg/', 'Edge'], ['OPR/', 'Opera'], ['Firefox/', 'Firefox'], ['Chrome/', 'Chrome'], ['Safari/', 'Safari']]
    .find(([key]) => userAgent.includes(key))?.[1];
  if (!system && !browser) return 'Aplicación';
  return [browser, system].filter(Boolean).join(' en ');
};

// Antes y después de cada campo; si solo hay uno de los dos se muestra una sola columna
function ChangesBlock({ details }: { details: ActivityLogDetails }) {
  const changes = details.changes ?? [];
  if (changes.length === 0) return null;
  const hasBefore = changes.some(change => change.before !== null);
  const hasAfter = changes.some(change => change.after !== null);

  if (!hasBefore || !hasAfter) {
    return (
      <Section title={hasBefore ? 'Datos anteriores' : 'Datos registrados'}>
        <dl className="divide-y divide-bg-subtle">
          {changes.map((change, index) => <Row key={index} label={change.label}>{change.before ?? change.after}</Row>)}
        </dl>
      </Section>
    );
  }

  return (
    <Section title="Cambios">
      <table className="w-full text-sm">
        <thead className="text-xs text-text-muted bg-bg-subtle/60">
          <tr>
            <th className="text-left px-3 py-2 font-medium">Dato</th>
            <th className="text-left px-3 py-2 font-medium">Antes</th>
            <th className="text-left px-3 py-2 font-medium">Después</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bg-subtle">
          {changes.map((change, index) => (
            <tr key={index}>
              <td className="px-3 py-2 text-text-muted">{change.label}</td>
              <td className="px-3 py-2">{change.before ?? '—'}</td>
              <td className="px-3 py-2 font-semibold">{change.after ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

export function HistoryActivityDetailModal({ record, onClose }: HistoryActivityDetailModalI) {
  if (!record) return null;
  const details: ActivityLogDetails = record.details ?? { changes: [], data: [], tables: [] };
  const device = deviceName(record.user_agent);

  return (
    <Modal show={!!record} onClose={onClose} size="xl3" headerTitle={record.event_label}>
      <Modal.Body>
        <div className="p-4 text-text-base space-y-4">
          <div className="px-3 py-2 bg-bg-subtle/60 rounded-lg border border-bg-subtle">
            <p className="font-medium">{record.description}</p>
          </div>

          <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-hidden">
            <dl className="divide-y divide-bg-subtle">
              <Row label="Usuario"><span className="font-semibold">{record.user?.name ?? 'Usuario eliminado'}</span></Row>
              <Row label="Fecha">{formatDate(record.created_at)} {formatHourAsHM(record.created_at)}</Row>
              <Row label="Módulo">{record.module_label}</Row>
              {(device || record.ip) && <Row label="Equipo">{[device, record.ip].filter(Boolean).join(' · ')}</Row>}
            </dl>
          </div>

          <ChangesBlock details={details} />

          {details.data?.length > 0 && (
            <Section title="Detalle">
              <dl className="divide-y divide-bg-subtle">
                {details.data.map((item, index) => <Row key={index} label={item.label}>{item.value}</Row>)}
              </dl>
            </Section>
          )}

          {details.tables?.map((table, index) => (
            <Section key={index} title={table.label}>
              <table className="w-full text-xs">
                <thead className="text-text-muted bg-bg-subtle/60">
                  <tr>{table.columns.map(column => <th key={column} className="text-left px-3 py-2 font-medium whitespace-nowrap">{column}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-bg-subtle">
                  {table.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((value, column) => <td key={column} className="px-3 py-2 whitespace-nowrap">{value}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}

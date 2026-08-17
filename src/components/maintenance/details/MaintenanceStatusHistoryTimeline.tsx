import { MaintenanceStatusHistory } from "@/interfaces/maintenance";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { getMaintenanceStatus } from "@/lib/maintenance";

export interface MaintenanceStatusHistoryTimelineProps {
  history: MaintenanceStatusHistory[] | undefined;
}

const DOT_CLASSES: Record<string, string> = {
  success: 'bg-success',
  info: 'bg-info',
  danger: 'bg-danger',
  warning: 'bg-warning',
  dark: 'bg-text-base',
  inactive: 'bg-bg-subtle',
};

export function MaintenanceStatusHistoryTimeline({ history }: MaintenanceStatusHistoryTimelineProps) {
  if (!history || history.length === 0) {
    return <p className="text-sm text-text-muted italic">Sin cambios de estado registrados.</p>;
  }

  return (
    <ol className="relative border-l-2 border-bg-subtle ml-2 space-y-4">
      {history.map((entry) => {
        const { label, indicator } = getMaintenanceStatus(entry.status);
        return (
          <li key={entry.id} className="ml-4">
            <span className={`absolute w-2.5 h-2.5 rounded-full -left-[5px] mt-1.5 ${DOT_CLASSES[indicator]}`} />
            <p className="text-sm font-semibold text-text-base">{label}</p>
            <p className="text-xs text-text-muted">
              {formatDateAsDMY(entry.created_at)} · {formatHourAsHM(entry.created_at)}
              {entry.changed_by?.name && <> · {entry.changed_by.name}</>}
            </p>
            {entry.comment && <p className="text-sm text-text-base mt-0.5">{entry.comment}</p>}
          </li>
        );
      })}
    </ol>
  );
}

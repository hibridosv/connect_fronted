import { MAINTENANCE_STATUSES } from "@/lib/maintenance";

export interface MaintenanceStatusTabsProps {
  status: number | 0;
  setStatus: (status: number | 0) => void;
}

export function MaintenanceStatusTabs({ status, setStatus }: MaintenanceStatusTabsProps) {
  const tabs = [{ value: 0, label: "Todos" }, ...MAINTENANCE_STATUSES];

  return (
    <div className="flex flex-wrap gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => setStatus(tab.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 border ${
            status === tab.value
              ? 'bg-primary text-text-inverted border-primary'
              : 'bg-bg-content text-text-muted border-bg-subtle hover:bg-bg-subtle'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

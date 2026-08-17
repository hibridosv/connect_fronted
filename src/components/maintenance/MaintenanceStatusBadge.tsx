import { Indicator } from "@/components/Indicators";
import { getMaintenanceStatus } from "@/lib/maintenance";

export interface MaintenanceStatusBadgeProps {
  status: number;
  coloredText?: boolean;
}

export function MaintenanceStatusBadge({ status, coloredText = false }: MaintenanceStatusBadgeProps) {
  const { label, indicator } = getMaintenanceStatus(status);
  return <Indicator type={indicator} text={label} coloredText={coloredText} />;
}

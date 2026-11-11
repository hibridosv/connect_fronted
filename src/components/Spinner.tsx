import { LuLoaderCircle } from "react-icons/lu";

const colorClasses = {
  primary: "text-primary",
  muted: "text-text-muted",
  info: "text-info",
  danger: "text-danger",
  inverted: "text-text-inverted",
  current: "", // hereda el color del texto (p. ej. dentro de un botón)
};

export interface SpinnerProps {
  size?: number | string;
  color?: keyof typeof colorClasses;
  className?: string;
}

// Indicador de carga único de la app
export function Spinner(props: SpinnerProps) {
  const { size = "1em", color = "primary", className = "" } = props;

  return <LuLoaderCircle size={size} className={`animate-spin ${colorClasses[color]} ${className}`.trim()} aria-hidden="true" />;
}

import { ReactNode } from "react";

export type BadgeVariant = "primary" | "success" | "danger" | "warning" | "info" | "accent" | "muted";

const variantClasses: { [key in BadgeVariant]: string } = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  accent: "bg-accent/10 text-accent",
  muted: "bg-bg-subtle text-text-muted",
};

const sizeClasses = {
  sm: "text-2xs uppercase", // tarjetas densas y etiquetas cortas ("IA", "Exento")
  md: "text-xs",
};

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: keyof typeof sizeClasses;
  className?: string;
  children: ReactNode;
}

// Pastilla de estado, etiqueta o contador
export function Badge(props: BadgeProps) {
  const { variant = "primary", size = "md", className = "", children } = props;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}>
      {children}
    </span>
  );
}

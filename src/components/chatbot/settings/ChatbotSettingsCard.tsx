'use client';
import { ReactNode } from 'react';

export interface ChatbotSettingsCardI {
  icon: ReactNode;
  accent: string; // colores del icono, p. ej. "bg-primary/10 text-primary"
  title: string;
  description?: string;
  animation?: string; // animate-slide-up, animate-slide-up-delay...
  children: ReactNode;
}

/** Tarjeta de la configuracion del chatbot: encabezado con icono, como en Configuraciones > General */
export function ChatbotSettingsCard({ icon, accent, title, description, animation = 'animate-slide-up', children }: ChatbotSettingsCardI) {
  return (
    <div className={`${animation} bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden transition-shadow duration-200 hover:shadow-md`}>
      <div className="flex items-start gap-3 px-4 py-3 bg-bg-subtle/60 border-b-2 border-bg-subtle">
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${accent}`}>{icon}</div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-text-base">{title}</div>
          {description && <p className="text-xs text-text-muted mt-0.5 leading-snug">{description}</p>}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

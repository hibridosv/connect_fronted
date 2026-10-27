'use client';

import { DashboardWidget } from '@/interfaces/dashboard';
import React from 'react';

interface WidgetCardProps {
  widget: DashboardWidget;
  loading: boolean;
  error?: boolean;
  empty?: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export function WidgetCard({ widget, loading, error, empty, badge, children }: WidgetCardProps) {
  return (
    <div className="relative h-full bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-4 overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in flex flex-col">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary/60 via-accent/40 to-transparent" />
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-text-base truncate">{widget.title}</h3>
          <p className="text-[11px] text-text-muted mt-0.5 font-medium">{widget.description}</p>
        </div>
        {!loading && !error && badge}
      </div>
      <div className="flex-1 min-h-0">
        {loading && <div className="bg-bg-subtle rounded-lg animate-pulse h-full min-h-[6rem] w-full" />}
        {!loading && error && <p className="text-xs text-danger font-medium">No se pudo cargar este dato</p>}
        {!loading && !error && empty && <p className="text-xs text-text-muted font-medium">Sin datos en el período</p>}
        {!loading && !error && !empty && children}
      </div>
    </div>
  );
}

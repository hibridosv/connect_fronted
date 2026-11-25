'use client';

export interface PublicOrderUnavailableI {
  expired: boolean;
  error: string;
}

/** Pantalla cuando el enlace vencio o no se pudo cargar el menu */
export function PublicOrderUnavailable({ expired, error }: PublicOrderUnavailableI) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gap-3">
      <div className="text-5xl">⌛</div>
      <div className="text-lg font-semibold">{expired ? 'Este enlace ya no está disponible' : 'Algo salió mal'}</div>
      <div className="text-text-muted">{error}</div>
      {expired && <div className="text-sm text-text-muted">Tu pedido quedó guardado en este teléfono: al abrir el enlace nuevo lo vas a encontrar.</div>}
    </div>
  );
}

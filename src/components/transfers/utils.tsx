export const transferSummaryItems = [
  { label: 'Activos', status: 2 },
  { label: 'Aceptados', status: 4 },
  { label: 'Parciales', status: 3 },
  { label: 'Rechazados', status: 5 },
  { label: 'En Progreso', status: 1 },
  { label: 'Solicitados', status: 7 },
  { label: 'Eliminados', status: 0 },
];

export function countByStatus(data: any[], status: number): number {
  if (!data) return 0;
  return data.filter((item: any) => item?.status === status).length;
}

export const statusOfProductTransfer = (status: number) => {
  switch (status) {
    case 1: return <span className="status-info uppercase">Activo</span>;
    case 2: return <span className="status-success uppercase">Aceptado</span>;
    case 3: return <span className="status-danger uppercase">Rechazado</span>;
    default: return <span className="status-info uppercase">Activo</span>;
  }
}

export const statusOfTransfer = (status: number)=>{
  switch (status) {
    case 1: return <span className="status-info uppercase">En Progreso</span>
    case 2: return <span className="status-info uppercase">Activo</span>
    case 3: return <span className="status-warning uppercase">* Aceptado</span>
    case 4: return <span className="status-success uppercase">Aceptado</span>
    case 5: return <span className="status-danger uppercase">Rechazado</span>
    case 6: return <span className="status-danger uppercase">Solicitando</span>
    case 7: return <span className="status-danger uppercase">Solicitado</span>
    case 8: return <span className="status-info uppercase">Guardado</span>
    default: return <span className="uppercase font-bold">Eliminado</span>
  }
}
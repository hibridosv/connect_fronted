'use client';
import { Popper } from '@/components/popper/Popper';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface InfoTipProps {
  children: React.ReactNode;
}

/** Icono de ayuda junto a una etiqueta: muestra la nota al pasar el mouse o al tocarlo */
export function InfoTip({ children }: InfoTipProps) {
  return (
    <Popper label={<IoInformationCircleOutline className="ml-1 text-text-muted hover:text-primary clickeable" size={15} aria-label="Ayuda" />}>
      <div className="w-72 max-w-[90vw] px-3 py-2 text-xs leading-relaxed text-text-base space-y-1">{children}</div>
    </Popper>
  );
}

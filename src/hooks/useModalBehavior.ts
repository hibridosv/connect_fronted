import { RefObject, useEffect, useRef } from 'react';

// Modales abiertos, del primero al último. Escape solo cierra el de arriba.
const openModals: object[] = [];
let previousOverflow = '';

/**
 * Comportamiento común de Modal y DeleteModal mientras están abiertos:
 * - Escape cierra el modal de arriba, solo si `closeOnEscape` (sigue la regla del clic en el fondo).
 * - Bloquea el scroll de la página de atrás.
 * - Mueve el foco a `focusRef` al abrir (si un campo con autoFocus ya lo tiene, lo respeta)
 *   y lo devuelve al elemento que lo tenía al cerrar.
 */
export function useModalBehavior(show: boolean, onClose: () => void, closeOnEscape: boolean, focusRef: RefObject<HTMLElement>) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const closeOnEscapeRef = useRef(closeOnEscape);
  closeOnEscapeRef.current = closeOnEscape;

  useEffect(() => {
    if (!show) return;

    const token = {};
    const previousFocus = document.activeElement as HTMLElement | null;
    if (openModals.length === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    openModals.push(token);

    const element = focusRef.current;
    if (element && !element.contains(document.activeElement)) element.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || openModals[openModals.length - 1] !== token) return;
      if (!closeOnEscapeRef.current) return;
      e.stopPropagation();
      onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const index = openModals.indexOf(token);
      if (index !== -1) openModals.splice(index, 1);
      if (openModals.length === 0) document.body.style.overflow = previousOverflow;
      if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
    };
  }, [show, focusRef]);
}

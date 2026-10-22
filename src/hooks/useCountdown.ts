import { useEffect, useState } from 'react';

/**
 * Tiempo restante (mm:ss) hasta la fecha indicada; expired pasa a true al llegar a cero.
 */
export const useCountdown = (target?: string | null) => {
  const getRemaining = () => (target ? Math.max(0, new Date(target).getTime() - Date.now()) : 0);
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    setRemaining(getRemaining());
    if (!target) return;
    const interval = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const totalSeconds = Math.floor(remaining / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return { label: `${minutes}:${seconds}`, expired: !!target && remaining === 0 };
};

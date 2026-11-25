'use client';
import { useEffect, useState } from "react";

export interface PublicOrderCountdownI {
  expiresAt: number;
}

/** Cuenta regresiva del enlace: se pone roja en el ultimo minuto */
export function PublicOrderCountdown({ expiresAt }: PublicOrderCountdownI) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const seconds = Math.max(0, Math.floor((expiresAt - now) / 1000));
  return <span className={seconds < 60 ? 'text-danger' : ''}>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span>;
}

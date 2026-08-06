'use client';

import { useEffect, useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";

const WARNING_TIMEOUT_MS = 6000;
const RELOAD_TIMEOUT_MS = 12000;

export const LoadingPage = () => {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    const warningTimer = setTimeout(() => setDelayed(true), WARNING_TIMEOUT_MS);
    const reloadTimer = setTimeout(() => window.location.reload(), RELOAD_TIMEOUT_MS);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(reloadTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background-main bg-opacity-75">
      <LuLoaderCircle className="animate-spin text-primary" size={64} />
      <p className="mt-4 text-lg text-text-main">
        {delayed ? "Esto está tardando más de lo normal, recargando..." : "Cargando..."}
      </p>
    </div>
  );
};

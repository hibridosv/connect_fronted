"use client";
import { useEffect } from "react";
import { Toaster, useToaster, useToasterStore } from "react-hot-toast";
import { useToastMessage } from "@/hooks/useToastMessage";


export function ToasterMessage() {
  useToastMessage();
  const { pausedAt } = useToasterStore();
  const { handlers } = useToaster();

  // Si se navega con el mouse sobre un toast (p. ej. al dar click en un link del toast), el Toaster anterior
  // se desmonta sin onMouseLeave y la pausa queda en el store global: ningun toast se cerraria solo.
  // Solo con pausa activa: sin pausedAt, endPause le suma Date.now() a la duracion de cada toast.
  useEffect(() => {
    if (pausedAt) handlers.endPause();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <Toaster position="top-center" reverseOrder={false} />
}

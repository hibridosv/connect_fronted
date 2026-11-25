'use client';
import { FaWhatsapp } from "react-icons/fa";

export interface PublicOrderDoneI {
  orderNumber: number | null;
  phone: string | null | undefined;
}

/** Pedido recibido: invita a volver al chat de WhatsApp del negocio */
export function PublicOrderDone({ orderNumber, phone }: PublicOrderDoneI) {
  // el navegador solo deja cerrar pestañas abiertas por un script: si no se cierra, se abre el chat del negocio
  const backToWhatsapp = () => {
    window.close();
    if (phone) {
      setTimeout(() => {
        window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(`Ya hice mi pedido #${orderNumber}`)}`;
      }, 300);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gap-3">
      <div className="text-5xl">✅</div>
      <div className="text-xl font-semibold">Pedido #{orderNumber} recibido</div>
      <div className="text-text-muted">Te mandamos la confirmación por WhatsApp y te avisaremos cuando esté en preparación y cuando esté listo.</div>
      {phone ? (
        <button onClick={backToWhatsapp} className="mt-3 w-full max-w-xs flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-semibold shadow-lg active:scale-[0.98] transition-transform">
          <FaWhatsapp size={20} /> Volver a WhatsApp
        </button>
      ) : (
        <div className="mt-2 px-4 py-2 rounded-lg bg-bg-subtle text-sm font-medium">Ya puedes cerrar esta página.</div>
      )}
    </div>
  );
}

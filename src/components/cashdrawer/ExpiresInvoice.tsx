import Link from "next/link";
import { LuArrowRight, LuTriangleAlert } from "react-icons/lu";

export interface ExpiresInvoiceProps {
  isShow: boolean;
  expiresDays: number;
}

export function ExpiresInvoice({ isShow, expiresDays }: ExpiresInvoiceProps) {
  if (!isShow) return null;

  return (
    <div className="mx-4 mt-3 rounded-lg border border-bg-subtle bg-bg-content shadow-sm overflow-hidden animate-slide-up">
      <div className="flex items-start gap-3 p-4 border-l-4 border-warning">
        <LuTriangleAlert className="text-warning shrink-0 mt-0.5" size={20} />
        <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-text-base">Facturas vencidas</p>
            <p className="text-sm text-text-muted mt-0.5">
              Tiene facturas pendientes de pago con{" "}
              <span className="font-semibold text-warning">
                {expiresDays} {expiresDays > 1 ? "días" : "día"} de vencido
              </span>
              . Regularice lo antes posible para evitar inconvenientes.
            </p>
          </div>
          <Link
            href="/settings/payments"
            className="inline-flex items-center gap-1.5 shrink-0 text-xs font-semibold text-text-inverted bg-warning px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
          >
            Consultar facturas
            <LuArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

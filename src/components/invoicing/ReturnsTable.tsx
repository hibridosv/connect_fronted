import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { activeReturns } from "@/lib/returns";
import { getTotalOfItem, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { InvalidateDocumentPayload } from "@/stores/invoicing/invoiceDetailsStore";
import { useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { Alert } from "../Alert/Alert";
import { InvalidateDocumentModal } from "./InvalidateDocumentModal";

interface ReturnsTableProps {
  returns: any[];
  orderStatus: number;
  onDeleteReturn?: (id: string, data: InvalidateDocumentPayload) => void;
  isDeletingReturn?: boolean;
}

/** Eventos de Retorno (DTE 18) del documento, con su PDF y la opción de anularlos */
export function ReturnsTable({ returns, orderStatus, onDeleteReturn, isDeletingReturn = false }: ReturnsTableProps) {
  const { system, client } = useConfigStore();
  const API_URL = process.env.NEXT_PUBLIC_URL_API;
  const [selectedReturn, setSelectedReturn] = useState<any | null>(null);

  const active = activeReturns({ returns });

  const productsSummary = (item: any) =>
    (item.products_afected ?? []).map((line: any) => `${Number(line.quantity)} x ${line.product}`).join(", ");

  return (
    <div className="space-y-2">
      <Alert
        text={`Este documento contiene ${active.length} retorno${active.length !== 1 ? 's' : ''} activo${active.length !== 1 ? 's' : ''}.`}
        type="info"
      />
      <div className="w-full overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
            <tr className="border-b-2 border-bg-subtle">
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">Código de generación</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">Fecha</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">Emitido por</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">Productos</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle text-right">Total</th>
              {onDeleteReturn && <th scope="col" className="px-3 py-2 font-bold tracking-wider text-center">Anular</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle">
            {returns.map((item) => {
              const isCancelled = item.status === 0;
              const cancelledBy = item.deleted_by?.name;
              const cancelledAt = item.deleted_at ? `${formatDateAsDMY(item.deleted_at)} ${formatHourAsHM(item.deleted_at)}` : '';
              const hoverTitle = isCancelled && (cancelledBy || cancelledAt)
                ? `Anulado por: ${cancelledBy ?? '—'}\nFecha: ${cancelledAt}`
                : undefined;

              return (
                <tr
                  key={item.id}
                  title={hoverTitle}
                  className={`transition-colors duration-150 divide-x divide-bg-subtle ${isCancelled ? 'bg-danger/10 text-danger opacity-70' : 'odd:bg-bg-subtle/40 hover:bg-bg-subtle text-text-base'}`}
                >
                  <td className="px-3 py-1 font-mono text-xs uppercase">
                    <a href={`${API_URL}documents/download/pdf/${item.id}/${client?.id}`} target="_blank" title="Descargar PDF del retorno" className={isCancelled ? 'line-through' : 'text-primary hover:underline'}>{item.id}</a>
                  </td>
                  <td className="px-3 py-1 whitespace-nowrap">{formatDateAsDMY(item.emited_at)} {formatHourAsHM(item.emited_at)}</td>
                  <td className="px-3 py-1 whitespace-nowrap">{item.emited_by?.name ?? '—'}</td>
                  <td className="px-3 py-1 text-xs">{productsSummary(item)}</td>
                  <td className="px-3 py-1 text-right font-bold">
                    <span className={isCancelled ? 'line-through' : ''}>{numberToMoney(item.total, system)}</span>
                  </td>
                  {onDeleteReturn && (
                    <td className="px-3 py-1 text-center">
                      <button
                        title={isCancelled ? 'Este retorno ya fue anulado' : 'Anular retorno'}
                        disabled={isDeletingReturn || orderStatus !== 3 || isCancelled}
                        onClick={() => setSelectedReturn(item)}
                        className="text-danger hover:text-danger/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 clickeable"
                      >
                        <RiDeleteBin2Line size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            <tr className="border-t-2 border-bg-subtle bg-bg-subtle/60 font-bold">
              <td colSpan={4} className="px-3 py-1 text-right uppercase text-xs">Total retornado:</td>
              <td className="px-3 py-1 text-right">{numberToMoney(getTotalOfItem(active, 'total'), system)}</td>
              {onDeleteReturn && <td />}
            </tr>
          </tbody>
        </table>
      </div>
      <InvalidateDocumentModal
        isShow={!!selectedReturn}
        record={selectedReturn}
        isReturn={true}
        isSending={isDeletingReturn}
        onConfirm={(data) => {
          if (selectedReturn && onDeleteReturn) {
            onDeleteReturn(selectedReturn.id, data);
            setSelectedReturn(null);
          }
        }}
        onClose={() => setSelectedReturn(null)}
      />
    </div>
  );
}

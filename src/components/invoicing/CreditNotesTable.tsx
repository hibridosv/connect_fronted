import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { getTotalOfItem, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { Alert } from "../Alert/Alert";
import { DeleteModal } from "../DeleteModal";

interface CreditNotesTableProps {
  creditnotes: any[];
  orderStatus: number;
  onDeleteCreditNote?: (id: string) => void;
  isDeletingCreditNote?: boolean;
}

export function CreditNotesTable({ creditnotes, orderStatus, onDeleteCreditNote, isDeletingCreditNote = false }: CreditNotesTableProps) {
  const { system, client } = useConfigStore();
  const API_URL = process.env.NEXT_PUBLIC_URL_API;
  const [selectedCreditNoteId, setSelectedCreditNoteId] = useState<string | null>(null);

  const activeCreditNotes = creditnotes.filter((cn) => cn.status === 1);

  
  return (
    <div className="space-y-2">
      <Alert
        text={`Este documento contiene ${activeCreditNotes.length} nota${activeCreditNotes.length !== 1 ? 's' : ''} de crédito activa${activeCreditNotes.length !== 1 ? 's' : ''}.`}
        type="warning"
      />
      <div className="w-full overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
            <tr className="border-b-2 border-bg-subtle">
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">ID</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle text-center">Número</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">Fecha</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">Emitida por</th>
              <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle text-right">Total</th>
              {onDeleteCreditNote && <th scope="col" className="px-3 py-2 font-bold tracking-wider text-center">Anular</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle">
            {creditnotes.map((creditnote) => {
              const isCancelled = creditnote.status === 0;
              const cancelledBy = creditnote.deleted_by?.name;
              const cancelledAt = creditnote.deleted_at ? `${formatDateAsDMY(creditnote.deleted_at)} ${formatHourAsHM(creditnote.deleted_at)}` : '';
              const hoverTitle = isCancelled && (cancelledBy || cancelledAt)
                ? `Anulada por: ${cancelledBy ?? '—'}\nFecha: ${cancelledAt}`
                : undefined;

              return (
                <tr
                  key={creditnote.id}
                  title={hoverTitle}
                  className={`transition-colors duration-150 divide-x divide-bg-subtle ${isCancelled ? 'bg-danger/10 text-danger opacity-70' : 'odd:bg-bg-subtle/40 hover:bg-bg-subtle text-text-base'}`}
                >
                  <td className="px-3 py-1 font-mono text-xs uppercase">
                    {isCancelled ? (
                      <span>{creditnote.id}</span>
                    ) : (
                      <a href={`${API_URL}documents/download/pdf/${creditnote.id}/${client?.id}`} target="_blank" title="Descargar PDF" className="text-primary hover:underline">{creditnote.id}</a>
                    )}
                  </td>
                  <td className="px-3 py-1 text-center">
                    <span className={isCancelled ? 'line-through' : ''}>{creditnote.invoice}</span>
                  </td>
                  <td className="px-3 py-1 whitespace-nowrap">{formatDateAsDMY(creditnote.emited_at)} {formatHourAsHM(creditnote.emited_at)}</td>
                  <td className="px-3 py-1 whitespace-nowrap">{creditnote.emited_by?.name ?? '—'}</td>
                  <td className="px-3 py-1 text-right font-bold">
                    <span className={isCancelled ? 'line-through' : ''}>{numberToMoney(creditnote.total, system)}</span>
                  </td>
                  {onDeleteCreditNote && (
                    <td className="px-3 py-1 text-center">
                      <button
                        title={isCancelled ? 'Esta nota ya fue anulada' : 'Anular nota de crédito'}
                        disabled={isDeletingCreditNote || orderStatus !== 3 || isCancelled}
                        onClick={() => setSelectedCreditNoteId(creditnote.id)}
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
              <td colSpan={4} className="px-3 py-1 text-right uppercase text-xs">Total:</td>
              <td className="px-3 py-1 text-right">{numberToMoney(getTotalOfItem(activeCreditNotes, 'total'), system)}</td>
              {onDeleteCreditNote && <td />}
            </tr>
          </tbody>
        </table>
      </div>
      <DeleteModal
        isShow={!!selectedCreditNoteId}
        header="Anular Nota de Crédito"
        text="¿Estás seguro de anular esta nota de crédito? Esta acción no se puede deshacer."
        textDelete="Sí, Anular"
        isSending={isDeletingCreditNote}
        onDelete={() => {
          if (selectedCreditNoteId && onDeleteCreditNote) {
            onDeleteCreditNote(selectedCreditNoteId);
            setSelectedCreditNoteId(null);
          }
        }}
        onClose={() => setSelectedCreditNoteId(null)}
      />
    </div>
  );
}

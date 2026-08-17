'use client';
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import { getServices } from "@/services/services";
import useConfigStore from "@/stores/configStore";
import { useState } from "react";

export interface AssociateInvoiceModalProps {
  isShow: boolean;
  onClose: () => void;
  contactId: string;
  onAssociate: (ticketOrderId: string) => Promise<boolean>;
  saving: boolean;
}

export function AssociateInvoiceModal({ isShow, onClose, contactId, onAssociate, saving }: AssociateInvoiceModalProps) {
  const { system } = useConfigStore();
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const handleSearch = async () => {
    if (!term.trim()) return;
    setSearching(true);
    try {
      const response = await getServices(`orders?filterwherein[status]==3,4&filterWhere[client_id]==${contactId}&filter[invoice]=${term.trim()}&included=invoiceAssigned&sort=-charged_at&perPage=10`);
      setResults(response.data.data?.data ?? []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAssociate = async () => {
    if (!selected) return;
    const success = await onAssociate(selected.id);
    if (success) handleClose();
  };

  const handleClose = () => {
    setSelected(null);
    setResults([]);
    setTerm('');
    onClose();
  };

  if (!isShow) return null;

  return (
    <Modal show={isShow} onClose={handleClose} headerTitle="Asociar factura" size="md" closeOnOverlayClick={false}>
      <Modal.Body>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              className="input"
              placeholder="No. de factura"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button text="Buscar" preset={Preset.info} onClick={handleSearch} disabled={searching} />
          </div>

          {searching && <p className="text-sm text-text-muted">Buscando...</p>}

          {!searching && results.length === 0 && term && (
            <p className="text-sm text-text-muted italic">Sin facturas pagadas para este cliente con ese número.</p>
          )}

          {results.length > 0 && (
            <div className="divide-y divide-bg-subtle border border-bg-subtle rounded-lg max-h-64 overflow-y-auto custom-scrollbar">
              {results.map((order) => (
                <button
                  type="button"
                  key={order.id}
                  onClick={() => setSelected(order)}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 transition-colors ${selected?.id === order.id ? 'bg-primary/10' : 'hover:bg-bg-subtle/40'}`}
                >
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium text-text-muted uppercase tracking-wide truncate">
                      {order.invoice_assigned?.name ?? 'Documento'}
                    </span>
                    <span className="font-semibold text-text-base">#{order.invoice}</span>
                    <span className="text-text-muted ml-2 text-xs">{formatDateAsDMY(order.charged_at)}</span>
                  </span>
                  <span className="font-semibold text-text-base shrink-0">{numberToMoney(order.total ?? 0, system)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} preset={Preset.close} disabled={saving} />
        <Button onClick={handleAssociate} disabled={!selected || saving} preset={saving ? Preset.saving : Preset.accept} />
      </Modal.Footer>
    </Modal>
  );
}

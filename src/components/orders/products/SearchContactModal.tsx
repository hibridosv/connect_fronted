"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { ClientsSearch } from "@/components/search/ClientsSearch";
import { useOrderFnLogic } from "@/hooks/order/product/useOrderFnLogic";
import { Contact } from "@/interfaces/contact";
import { formatDuiWithAll } from "@/lib/utils";
import { UpdateServiceInterface } from "@/services/Interfaces";
import useModalStore from "@/stores/modalStorage";
import ordersStore from "@/stores/orders/ordersStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect } from "react";
import { FiAlertCircle, FiCreditCard, FiEdit2, FiMail, FiMapPin, FiPhone, FiTag, FiX } from "react-icons/fi";
import { setNameContact, setParam, setRowToChange, setRowToGet } from "../functions";

export interface SearchContactModalI {
  onClose: () => void;
  isShow: boolean;
}

export function SearchContactModal(props: SearchContactModalI) {
  const { onClose, isShow } = props;
  const { order, sending } = ordersStore();
  const { getElement, setElement, clearElement } = useTempStorage();
  const tempSelectedName = getElement('contactSearch');
  const selectedContact: Contact | null = getElement(tempSelectedName) ?? null;
  const { openModal, closeModal } = useModalStore();
  const { update } = useOrderFnLogic();
  const { setError } = useToastMessageStore();

  useEffect(() => {
    if (isShow && order) {
      if (order[setRowToGet(tempSelectedName)]) {
        setElement(tempSelectedName, order[setRowToGet(tempSelectedName)]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow, order, setRowToGet, setElement]);

  if (!isShow || !order) return null;

  const clearContact = async () => {
    if (!selectedContact || !tempSelectedName || !order) return;
    const values: UpdateServiceInterface = { row: setRowToChange(tempSelectedName), value: null };
    const success = await update(order.id, values);
    if (success) {
      clearElement(tempSelectedName);
      closeModal('searchContact');
    } else {
      setError({ message: `Existe un error, No se actualizó correctamente el ${setNameContact(tempSelectedName)}. Vuelva a intentarlo.` });
    }
  };

  const updateContact = async (item: any) => {
    if (!item || !tempSelectedName || !order) return;
    const values: UpdateServiceInterface = { row: setRowToChange(tempSelectedName), value: item.id };
    const success = await update(order.id, values);
    if (success) {
      clearElement(tempSelectedName);
      closeModal('searchContact');
    } else {
      setError({ message: `Existe un error, No se actualizó correctamente el ${setNameContact(tempSelectedName)}. Vuelva a intentarlo.` });
    }
  };

  const handleClose = async () => {
    clearElement(tempSelectedName);
    clearElement('editContact');
    onClose && onClose();
  };

  const contactTypes = [
    { flag: selectedContact?.is_client, label: 'Cliente', style: 'status-info' },
    { flag: selectedContact?.is_provider, label: 'Proveedor', style: 'status-warning' },
    { flag: selectedContact?.is_employee, label: 'Empleado', style: 'status-success' },
    { flag: selectedContact?.is_referred, label: 'Referido', style: 'status-info' },
  ].filter(t => t.flag === 1);

  const initial = selectedContact?.name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <Modal show={isShow} onClose={handleClose} size="xl" headerTitle={`Asignar ${setNameContact(tempSelectedName)}`}>
      <div className="p-4 space-y-4 overflow-visible">
        <ClientsSearch
          param={setParam(tempSelectedName)}
          placeholder={`Buscar ${setNameContact(tempSelectedName)}`}
          onSelect={updateContact}
          tempSelectedName={tempSelectedName}
        />

        {selectedContact && (
          <div className="rounded-lg border border-bg-subtle bg-bg-content overflow-hidden shadow-sm">
            <div className="bg-primary/10 border-b border-bg-subtle px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-text-inverted font-bold text-base leading-none">{initial}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-text-base uppercase text-sm truncate">{selectedContact.name}</p>
                  {contactTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {contactTypes.map(type => (
                        <span key={type.label} className={`${type.style} text-xs px-1.5 py-0.5 rounded`}>{type.label}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => { openModal('contactAdd'); setElement('editContact', selectedContact); }}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors clickeable"
                >
                  <FiEdit2 size={13} />
                </button>
                <button
                  onClick={clearContact}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-danger/10 text-danger hover:bg-danger/20 transition-colors clickeable"
                >
                  <FiX size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3 text-sm text-text-muted">
              {selectedContact.phone && (
                <div className="flex items-center gap-2">
                  <FiPhone size={13} className="text-primary shrink-0" />
                  <span className="truncate">{selectedContact.phone}</span>
                </div>
              )}
              {selectedContact.email && (
                <div className="flex items-center gap-2">
                  <FiMail size={13} className="text-primary shrink-0" />
                  <span className="truncate">{selectedContact.email}</span>
                </div>
              )}
              {selectedContact.id_number && (
                <div className="flex items-center gap-2">
                  <FiCreditCard size={13} className="text-primary shrink-0" />
                  <span className="truncate">{formatDuiWithAll(selectedContact.id_number)}</span>
                </div>
              )}
              {selectedContact.code && (
                <div className="flex items-center gap-2">
                  <FiTag size={13} className="text-primary shrink-0" />
                  <span className="truncate">Cód. {selectedContact.code}</span>
                </div>
              )}
              {selectedContact.address && (
                <div className="flex items-start gap-2 col-span-2">
                  <FiMapPin size={13} className="text-primary shrink-0 mt-0.5" />
                  <span className="break-words whitespace-normal">{selectedContact.address}</span>
                </div>
              )}
              {selectedContact.is_credit_block === 1 && (
                <div className="flex items-center gap-2 col-span-2">
                  <FiAlertCircle size={13} className="text-danger shrink-0" />
                  <span className="text-danger font-medium">Crédito bloqueado</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal.Footer>
        <Button
          onClick={() => { openModal('contactAdd'); clearElement('editContact'); }}
          text={`Registrar ${setNameContact(tempSelectedName)}`}
          preset={Preset.add}
        />
        <Button onClick={handleClose} preset={Preset.close} disabled={sending} />
      </Modal.Footer>
    </Modal>
  );
}

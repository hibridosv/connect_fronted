"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { ClientsSearch } from "@/components/search/ClientsSearch";
import { ShowClientSearched } from "@/components/search/ShowClientSearched";
import { useOrderFnLogic } from "@/hooks/order/product/useOrderFnLogic";
import { UpdateServiceInterface } from "@/services/Interfaces";
import useModalStore from "@/stores/modalStorage";
import ordersStore from "@/stores/orders/ordersStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect } from "react";
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
  const { openModal, closeModal} = useModalStore();
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
  
  const clearContact = async(item: any) => {
    if (!item || !tempSelectedName || !order) return;
    let values: UpdateServiceInterface = {
      row: setRowToChange(tempSelectedName),
      value: null
    }
    const success = await update(order.id, values);
    if (success) {
      clearElement(tempSelectedName);
      closeModal('searchContact');
    } else {
      setError({ message: `Existe un error, No se actualizo correctamente el ${setNameContact(tempSelectedName)}. Vuelva a intentarlo.`})
    }
  }
  
  const updateContact = async(item: any) => {
    if (!item || !tempSelectedName || !order) return;
    let values: UpdateServiceInterface = {
      row: setRowToChange(tempSelectedName),
      value: item.id
    }
    const success = await update(order.id, values);
    if (success) {
      clearElement(tempSelectedName);
      closeModal('searchContact');
    } else{
      setError({ message: `Existe un error, No se actualizo correctamente el ${setNameContact(tempSelectedName)}. Vuelva a intentarlo.`})
    }
  }
  
  const handleClose = async() => {
    clearElement(tempSelectedName);
    clearElement('editContact');
    onClose && onClose();
  }
  

  return (
    <Modal show={isShow} onClose={handleClose} size="md" headerTitle={`Asignar ${setNameContact(tempSelectedName)}`} >
      <div className="p-2 space-y-3 overflow-visible">
        <ClientsSearch param={setParam(tempSelectedName)} placeholder={`Buscar ${setNameContact(tempSelectedName)}`} onSelect={updateContact} tempSelectedName={tempSelectedName} />
        <ShowClientSearched onClose={clearContact} tempSelectedName={tempSelectedName} />
      </div>
      <Modal.Footer>
        {
          getElement(tempSelectedName) &&
          <Button onClick={() => { openModal('contactAdd'); setElement('editContact', getElement(tempSelectedName)) }} preset={Preset.smallEdit}/>
        }
        <Button onClick={() => { openModal('contactAdd'); clearElement('editContact') }} text={`Registrar ${setNameContact(tempSelectedName)}`} preset={Preset.add}/>
        <Button onClick={handleClose} preset={Preset.close} disabled={sending} /> 
      </Modal.Footer>
    </Modal>
  );

}

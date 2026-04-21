'use client';
import { Button, Preset } from "@/components/button/button";
import { LinksList } from "@/components/button/LinkList";
import { AddContactModal } from "@/components/contacs/AddContactModal";
import { ContactsTable } from "@/components/contacs/ContactsTable";
import { getParamString } from "@/components/contacs/utils";
import { ViewContactModal } from "@/components/contacs/ViewContactModal";
import { DeleteModal } from "@/components/DeleteModal";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/Search";
import { ShowTotal } from "@/components/ShowTotal";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useContactsLogic } from "@/hooks/contacts/useContactsLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import useContactStore from "@/stores/ContactStore";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";
import { useSearchParams } from 'next/navigation';
import { BiPlusCircle } from "react-icons/bi";


export default function Page() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["name", "id_number", "code", "phone"], 500);
  const { onDelete, links } = useContactsLogic(currentPage, searchTerm, getParamString(pageParam));
  const { contacts, loading } = useContactStore();
  const { getElement, clearElement } =  useTempStorage();
  const { modals, closeModal, openModal} = useModalStore();
 


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <div className="flex justify-between">
          <ViewTitle text="Lista de Contactos" />
          <BiPlusCircle size={28} className="clickeable text-primary mt-3 mr-4" onClick={()=>{openModal('contactAdd'); clearElement('contactAdd'); }} />
        </div>
        <div className="p-4">
          <ContactsTable />
          <Pagination records={contacts} handlePageNumber={handlePageNumber } />
        </div>
    </div>
    <div className="md:col-span-3">
        <ViewTitle text="Buscar Contacto" />
        <div className="p-4">
          <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Contacto" animating={loading} />
        </div>
        <div className="p-4">
          <ShowTotal quantity={contacts?.total} text="Cantidad de Contactos" number={true} />
        </div>
        <div className="p-4 flex justify-center">
          <Button preset={Preset.add} text="Agregar Contacto" onClick={()=>{openModal('contactAdd'); clearElement('contactAdd'); }} />
        </div>
        <div className="p-4">
          <LinksList links={links} text="DESCARGAS" />
        </div>
    </div> 
    <ViewContactModal isShow={modals.contactDetails} onClose={()=>closeModal('contactDetails')} record={getElement('contactDetails')} />
    <AddContactModal isShow={modals.contactAdd} onClose={()=>closeModal('contactAdd')} record={getElement('contactAdd')} />
    <DeleteModal
        isShow={modals.deleteContact}
        text={`¿Estas seguro de eliminar este contacto?`}
        onDelete={() =>{ onDelete(getElement('deleteContact').id);  }}
        onClose={() => closeModal('deleteContact')} />
    <ToasterMessage />
</div>
  );
}

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import useContactStore from "@/stores/ContactStore";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";
import { FiSettings } from "react-icons/fi";
import { Dropdown } from "../dropDown/Dropdown";
import { DropdownDivider } from "../dropDown/DropdownDivider";
import { DropdownItem } from "../dropDown/DropdownItem";


export function ContactsTable() {
    const { contacts: response, loading} = useContactStore();
    const contacts = response?.data;
    const { setElement } = useTempStorage();
    const { openModal } = useModalStore();


    if (contacts && loading) return <SkeletonTable rows={10} columns={7} />;
    if (!contacts) return null;
    if (contacts && contacts.length === 0) return (<NothingHere text="No se encuentran contactos" />)


    const listItems = contacts && contacts.map((record: any) => {
        return (
            <tr 
            key={record.id} 
            className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
            
            <td className="px-1 py-1 text-left  font-medium clickeable" onClick={() => { setElement('contactDetails', record); openModal('contactDetails'); }}>
                { record?.name }
            </td>
            {/* <td className="px-1 py-1 text-left text-sm whitespace-normal">
            { record?.address }
            </td> */}
            <td className="px-1 py-1 text-center" >
            { record?.phone }
            </td>
            <td className={`px-1 py-1 text-left`}>
            { record?.email }
            </td>
            <td className="px-1 py-1 flex justify-center">
            <Dropdown label={<FiSettings size={18} /> }>
                <DropdownItem onClick={() => { setElement('contactDetails', record); openModal('contactDetails'); }}>Ver Contacto</DropdownItem>
                <DropdownItem onClick={() => { setElement('contactAdd', record); openModal('contactAdd'); }}>Editar</DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={() => { setElement('deleteContact', record); openModal('deleteContact'); }}> <span className="text-danger font-semibold">Eliminar</span> </DropdownItem>
            </Dropdown> 
            </td>
            </tr>
        )
      });


  return (
    <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left table-fixed">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
            <tr className="border-b-2 border-bg-subtle">
              <th scope="col" className="px-1 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Nombre</th>
              {/* <th scope="col" className="px-1 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Dirección</th> */}
              <th scope="col" className="w-24 px-1 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Tel&eacute;fono</th>
              <th scope="col" className="w-auto px-1 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Email</th>
              <th scope="col" className="w-12 px-1 py-3 font-bold tracking-wider text-center">OP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle">
            {listItems}
          </tbody>
        </table>
      </div>
  );
}
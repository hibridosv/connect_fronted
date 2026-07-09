'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useStateStore from "@/stores/stateStorage";
import useTempStorage from "@/stores/useTempStorage";
import { DateTime } from "luxon";
import { FaEdit, FaSpinner } from "react-icons/fa";
import { Dropdown } from "../dropDown/Dropdown";
import { DropdownItem } from "../dropDown/DropdownItem";
import { status, tipoDTE } from "./utils";


export interface DocumentsElectronicTableI {
  records: any;
  resendDocument: (invoiceId: string) => void;
}

export function DocumentsElectronicTable(props: DocumentsElectronicTableI) {
  const { records, resendDocument } = props;
  const { system } = useConfigStore();
  const API_URL = process.env.NEXT_PUBLIC_URL_API;
  const { setElement, getElement} = useTempStorage();
  const { openModal } = useModalStore();
  const {  loading } = useStateStore();
  const isLoading = loading.history ?? false; 
  const isReSending = loading.resendDocument ?? false;
  const InvoiceResending = getElement('resendDocument');


  if(isLoading) return <SkeletonTable rows={5} columns={8} />

  if (!records || records.length === 0) {
    return <NothingHere text="No hay datos en esta fecha" />;
  }


  const listItems = records.map((record: any) => {
    const visibleTypes = ["01", "03", "11", "14"];
    const isDocumentVisible = visibleTypes.includes(record?.tipo_dte ?? "");
    const isRejected = record?.status == 3 ? true : false;
    const isDownloader =  (record?.status == 4 || record?.status == 5) ? true : false;
    const createdAt = record?.created_at ? DateTime.fromISO(record.created_at) : null;
    const isWithinTwoMonths = createdAt ? createdAt >= DateTime.now().minus({ months: 2 }) : false;


    return (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
      <td className={`px-3 py-2 whitespace-nowrap font-medium text-primary`}>
        { record?.fecha_procesamiento ?? "N/A" }
      </td>
      <td className={`px-3 py-2 whitespace-nowrap ${!isDownloader && 'text-red-500'}`}>
        { isDownloader ?
        <a target="_blank" href={`${API_URL}documents/download/pdf/${record?.codigo_generacion}/${record?.client_id}`} title="Descargar PDF" className="clickeable">
          { tipoDTE(record?.tipo_dte) }
        </a>  
          :
        <div title={record?.observaciones}>{ tipoDTE(record?.tipo_dte) }</div>
        }
      </td>
      <td className={`px-3 py-2 text-left ${isDocumentVisible && 'clickeable'}`} 
        onClick={ isDocumentVisible ? ()=> { setElement('documentSelected', record); openModal('documentDetail')  } : ()=>{}} >
        { record?.numero_control ?? "--" }
      </td>
      <td className={`px-3 py-2 text-left`}>
        { record?.receptor_nombre ?? "N/A" }
      </td>
      <td className={`px-3 py-2 text-left whitespace-nowrap ${isRejected && 'clickeable'}`} title={record?.descripcion_msg} 
        onClick={ isRejected ? ()=>{ setElement('documentSelected', record); openModal('documentErrors')  } : ()=>{} }>
        { status(record?.status) }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        { record?.email == 1 ? "Enviado" : "Sin Enviar" }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
         { isReSending && InvoiceResending == record?.codigo_generacion ? 
            <FaSpinner className="animate-spin" size={20} />
          : <Dropdown label={<FaEdit size={18} /> }>
            <DropdownItem disabled={!isDocumentVisible} onClick={() => { setElement('documentSelected', record); openModal('documentDetail')  }}>Detalles del Documento</DropdownItem>
            <DropdownItem disabled={!isDownloader} target="_blank" href={`${API_URL}documents/download/pdf/${record?.codigo_generacion}/${record?.client_id}`}>Descargar PDF</DropdownItem>
            <DropdownItem disabled={!isDownloader} target="_blank" href={`${API_URL}documents/download/json/${record?.codigo_generacion}/${record?.client_id}`}>Descargas JSON</DropdownItem>
            <DropdownItem disabled={!isDownloader} onClick={() => { setElement('documentSelected', record); openModal('documentEmail')  }}>Reenviar Email</DropdownItem>
            <DropdownItem disabled={!isRejected || !isWithinTwoMonths} onClick={() => { resendDocument(record?.codigo_generacion) }}>Reenviar Documento</DropdownItem>
          </Dropdown> }
      </td>
    </tr>
  )
  });

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Tipo DTE</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Numero de Control</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cliente</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Estado </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Email</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">OP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
        </table>
      </div>
    </div>
  );
}

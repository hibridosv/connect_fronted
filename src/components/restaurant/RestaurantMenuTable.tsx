'use client';

import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { URL } from '@/constants';
import { useRestaurantMenuProductLogic } from "@/hooks/restaurant/useRestaurantMenuProductLogic";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import manageRestaurantStore from "@/stores/restaurant/manageRestaurantStore";
import Image from "next/image";
import { BiCategory, BiRename } from "react-icons/bi";
import { FaCheckCircle, FaImages, FaSolarPanel, FaStar } from "react-icons/fa";
import { IoMdCloseCircleOutline, IoMdOptions } from "react-icons/io";
import { MdAttachMoney, MdDelete, MdOutlinePriceCheck, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { RiMenuSearchFill } from "react-icons/ri";
import { Dropdown } from "../dropDown/Dropdown";
import { DropdownDivider } from "../dropDown/DropdownDivider";
import { DropdownItem } from "../dropDown/DropdownItem";



export function RestaurantMenuTable() {
  const { products, loadingProducts } = manageRestaurantStore();
  const {
    handleOpenFieldModal,
    handleOpenCategoryModal,
    handleOpenPanelModal,
    handleOpenModifiersModal,
    handleOpenImageModal,
    handleOpenLinkedModal,
    handleOpenDeleteModal,
    handleToggleStatus,
  } = useRestaurantMenuProductLogic();

  const { system } = useConfigStore();

  let data = products?.per_page ? products.data : products;

  if(loadingProducts) return <SkeletonTable rows={8} columns={8} />

  if (!data || data.length === 0) {
    return <NothingHere text="Seleccione un producto" />;
  }

    const imageLoader = ({ src, width, quality }: any) => {
    return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
  }

  const listItems = data.map((record: any) => (
    <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
      <td className="px-3 py-2">
        <Image loader={imageLoader} src={record?.restaurant?.image} alt="Icono de imagen" width={40} height={40} className="drop-shadow-lg rounded-md" />
      </td>
      <td className="px-3 py-2 whitespace-nowrap font-medium">
        <div className="flex"> 
          <span>{ record?.description }</span> 
          <span className="mt-1 ml-2">{record.menu_order?.special === 1 && <FaStar size={8} color="#009eff" /> }</span>
        </div>
        { record.menu_order?.status === 0 && <div className="uppercase text-red-700">Inhabilitado</div> }
      </td>
      <td className="px-3 py-2 text-left whitespace-nowrap" >
        { record?.category?.name}
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap font-bold`}>
       { record?.assigments && <ul className="pl-4">{record?.assigments.map((assigment: any)=> <li key={assigment.id}>{assigment.option?.name}</li>)}</ul> }
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap  font-bold`}>
        {record?.restaurant?.workstation?.name}
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        {record?.prices ? numberToMoney(record?.prices[0]?.price, system) : numberToMoney(0, system)}
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        {numberToMoney(record?.unit_cost ?? 0, system)}
      </td>
      <td className={`px-3 py-2 text-center whitespace-nowrap`}>
        <Dropdown label={<RiMenuSearchFill size={18} /> }>
          <DropdownItem onClick={() => handleOpenFieldModal(record, 'price', 'number', 'Precio')}>
            <span className="flex justify-items-start">
              <span className="mt-1"><MdOutlinePriceCheck /></span>
              <span className="ml-2">Cambiar Precio</span>
            </span>
          </DropdownItem>
          <DropdownItem onClick={() => handleOpenFieldModal(record, 'unit_cost', 'number', 'Costo')}>
            <span className="flex justify-items-start">
              <span className="mt-1"><MdAttachMoney /></span>
              <span className="ml-2">Cambiar Costo</span>
            </span>
          </DropdownItem>
          <DropdownItem onClick={() => handleOpenFieldModal(record, 'description', 'text', 'Nombre')}>
            <span className="flex justify-items-start">
              <span className="mt-1"><BiRename /></span>
              <span className="ml-2">Cambiar Nombre</span>
            </span>
          </DropdownItem>
          <DropdownItem onClick={() => handleOpenModifiersModal(record)}>
            <span className="flex justify-items-start">
              <span className="mt-1"><IoMdOptions /></span>
              <span className="ml-2">Cambiar Modificadores</span>
            </span>
          </DropdownItem>
          <DropdownItem onClick={() => handleOpenCategoryModal(record)}>
            <span className="flex justify-items-start">
              <span className="mt-1"><BiCategory /></span>
              <span className="ml-2">Cambiar Categorias</span>
            </span>
          </DropdownItem>
          <DropdownItem onClick={() => handleOpenPanelModal(record)}>
            <span className="flex justify-items-start">
              <span className="mt-1"><FaSolarPanel /></span>
              <span className="ml-2">Cambiar Panel</span>
            </span>
          </DropdownItem>
          <DropdownItem onClick={() => handleOpenImageModal(record)}>
            <span className="flex justify-items-start">
              <span className="mt-1"><FaImages /></span>
              <span className="ml-2">Cambiar Imagen</span>
            </span>
          </DropdownItem>
          <DropdownItem onClick={() => handleOpenLinkedModal(record)}>
            <span className="flex justify-items-start">
              <span className="mt-1"><MdOutlineProductionQuantityLimits /></span>
              <span className="ml-2">Productos a descontar</span>
            </span>
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={() => handleToggleStatus(record)}>
            <span className={`flex justify-items-start font-semibold ${record.menu_order?.status === 0 ? 'text-green-700' : 'text-red-700'}`}>
              <span className="mt-1">{record.menu_order?.status === 0 ? <FaCheckCircle color="green" /> : <IoMdCloseCircleOutline />}</span>
              <span className="ml-2">{record.menu_order?.status === 0 ? 'Habilitar Producto' : 'Inhabilitar Producto'}</span>
            </span>
          </DropdownItem>
          <DropdownItem onClick={() => handleOpenDeleteModal(record)}>
            <span className="flex justify-items-start font-semibold text-red-700">
              <MdDelete className="mt-1" />
              <span className="ml-2">Eliminar Producto</span>
            </span>
          </DropdownItem>
        </Dropdown>
      </td>
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle">IMG</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Nombre </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Categoria </th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Modificadores</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Panel</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Precio</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Costo</th>
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

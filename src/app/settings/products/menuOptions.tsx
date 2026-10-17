import { BiCategory } from "react-icons/bi";
import { MdBrandingWatermark, MdCreditScore, MdDescription, MdLocationOn, MdPointOfSale } from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";

export const menuOptions = [
  { label: "Categorías", value: 1, icon: <BiCategory className="mr-2" /> },
  { label: "Unidades de Medida", value: 2, icon: <TbRulerMeasure className="mr-2" /> },
  { label: "Marcas", value: 3, icon: <MdBrandingWatermark className="mr-2" /> },
  { label: "Ubicaciones", value: 4, icon: <MdLocationOn className="mr-2" /> },
  { label: "Documentos", value: 5, icon: <MdDescription className="mr-2" /> },
  { label: "Cajas de Cobro", value: 6, icon: <MdPointOfSale className="mr-2" /> },
  { label: "Créditos", value: 7, icon: <MdCreditScore className="mr-2" /> },
];

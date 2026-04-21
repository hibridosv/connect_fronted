import { FaLayerGroup } from "react-icons/fa";
import { MdOutlineHomeRepairService } from "react-icons/md";
import { Indicator } from "../Indicators";

  export const productTypeIcon = (type: number) => {
    switch (type) {
      case 2: return <span title="Servicio" className="mr-2 text-info"><MdOutlineHomeRepairService size={14} /></span>;
      case 3: return <span title="Relacionado" className="mr-2 text-success"><FaLayerGroup size={12} /></span>;
      default: return null;
    }
  };


  export const sortBySelected = (sort: string, sortBy: string) => {
      let sortNew;
      if (sortBy.slice(0, 1) !== "-") {
       sortNew = "-" + sort;
      } else {
       sortNew = sort; 
      }
      return sortNew;
  };

  export const typeFailure = (status: number) => {
  switch (status) {
    case 1: return <Indicator type="danger" text="Averias" />
    case 2: return <Indicator type="success" text="Traslados" />
    case 3: return <Indicator type="info" text="Devoluciones" />
    case 4: return <Indicator type="warning" text="Cambios" />
    case 5: return <Indicator type="dark" text="Otros" />
  }
}

export const excludedRoles: string[]  = ['Cajero', 'Mesero', 'Usuario', 'Contador']; // Roles denegados para ver detalles

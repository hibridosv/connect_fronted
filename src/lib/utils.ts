import { DocumentTypes, DocumentTypesNames, PaymentType, PaymentTypeNames } from "@/services/enums";
import { formatDateAsNumber } from "./date-formats";

export const getCountryProperty = (country: number): { name: string, subname: string, currency: string, currencyName: string, document: string , taxes: number, taxesName: string} => {
  switch (country) {
    case 1: return {"name": "El Salvador", "subname": "SV", "currency": "$", "currencyName": "Dolares", "document": "NIT", "taxes": 13, "taxesName" : "IVA"};
    case 2: return {"name": "Honduras", "subname": "HN", "currency": "L", "currencyName": "Lempiras", "document": "RTN", "taxes": 15, "taxesName" : "ISV"};
    case 3: return {"name": "Guatemala", "subname": "GT", "currency": "Q", "currencyName": "Quetzales", "document": "NIT", "taxes": 12, "taxesName" : "IVA"};
    default: return {"name": "El Salvador", "subname": "SV", "currency": "$", "currencyName": "Dolares", "document": "NIT", "taxes": 13, "taxesName" : "IVA"};
  }
}


export const numberToMoney = (number: number, systemInformation = null as any): string => {
    let num = number ? number : 0;
    let symbol =  systemInformation ? getCountryProperty(parseInt(systemInformation?.country)).currency : '$';
    return `${symbol}${num.toFixed(2)}`
}

export const numberToMoney4Digits = (number: number, systemInformation = null as any): string => {
  let num = number ? number : 0;
  let symbol =  systemInformation ? getCountryProperty(parseInt(systemInformation?.country)).currency : '$';
  return `${symbol}${num.toFixed(4)}`
}

export const dateToNumberValidate = () =>{
  const fecha = new Date();
  const hoy = fecha.toISOString();
  return formatDateAsNumber(hoy)
}

export const permissionExists = (permissions: any, permission: string) => {
  if(!permissions) return false; 
  return permissions.some((perm: any) => perm.name === permission);
};


/// obtengo el nombre del tipo de pago 
export const getPaymentTypeName = (type: PaymentType): string | undefined => {
  const typeName = Object.entries(PaymentType)
    .filter(([key, value]) => typeof value === 'number' && value === type)
    .map(([key]) => key)
    .pop();

  return typeName ? (PaymentTypeNames as Record<string, string>)[typeName] : undefined;
};

export const documentType = (document: DocumentTypes): string => {
  if (document == DocumentTypes.ninguno) return DocumentTypesNames.ninguno;
  if (document == DocumentTypes.ticket) return DocumentTypesNames.ticket;
  if (document == DocumentTypes.factura) return DocumentTypesNames.factura;
  if (document == DocumentTypes.creditoFiscal) return DocumentTypesNames.creditoFiscal;
  return DocumentTypesNames.ninguno;
}



export function formatDuiWithAll(cadena: string) {
  if(!cadena) return; 
  var doc = cadena.replace(/-/g, '');
  if (doc.length == 14) {
        var partes = [
          doc.slice(0, 4),   // Primer grupo de 4 dígitos
          doc.slice(4, 10),  // Segundo grupo de 6 dígitos
          doc.slice(10, 13), // Tercer grupo de 3 dígitos
          doc.slice(13)      // Último dígito
      ];
    return partes.join('-');
  } else {
    var posicion = doc.length - 1;
    return doc.slice(0, posicion) + '-' + doc.slice(posicion);
  }

}

export const getDepartmentNameById = (id: string, data: any): any => {
  if(!data?.departamentos) return; 
  const department = data?.departamentos.find((dept: any) => dept.id === id);
  if (department) {
    return department?.nombre;
  }
};

export const getMunicipioNameById = (id_mun: string, data: any): any => {
  if(!data?.departamentos) return; 
  for (const departamento of data?.departamentos) {
    const municipio = departamento?.municipios.find((mun: any) => mun.id_mun === id_mun);
    if (municipio) {
      return municipio?.nombre;
    }
  }
};


export function getCountryNameByCode(code: any, countries: any) {
  if(!code || !countries) return; 
  if (!Array.isArray(countries)) {
    return 'La lista de países no es válida';
}

  const country = countries && countries.find((c:any) => c.code === code);
  return country ? country.country : 'Código no encontrado';
}

export const getMunicipiosByDepartamentoId = (data: any, departamentoId: string) => {
  const departamento = data.departamentos.find((dep: any) => dep.id === departamentoId);
  if (departamento) {
    return departamento.municipios;
  }
  return [];
};


export function formatDocument(cadena: string) {
  if (!cadena) return;
  return cadena.replace(/-/g, '');
}


export function formatNumberPhone(num: any) {
  if (!num || num.length == 0) return;
  let numStr = num.toString();
  if (numStr.length !== 8) {
      return num
  }
  return `${numStr.slice(0, 4)}-${numStr.slice(4, 8)}`;
}


/// suma una item de un arreglo con aulgun estado
export const getTotalOfItemWithStatus = (datos: any, item: string = 'total', filter: string =  "status", status: any =  1): any => {
  if (!datos || !Array.isArray(datos)) return 0;
  let totalSuma = 0;

  datos.forEach((elemento: any) => {
    if (elemento.hasOwnProperty(item)  && elemento[filter] == status) {
      totalSuma += elemento[item];
    }
  });

  return totalSuma;
}


export const getTotalOfItem = (datos: any, item: string = 'total'): any => {
  if (!datos || !Array.isArray(datos)) return 0;
  let totalSuma = 0;

  datos.forEach((elemento: any) => {
    if (elemento.hasOwnProperty(item)) {
      totalSuma += elemento[item];
    }
  });

  return totalSuma;
}

// cuenta los elementos de un arreglo con algun estado
export const countItemsWithStatus = (datos: any, filter: string =  "status", status: any =  1): any => {
  if (!datos || !Array.isArray(datos)) return 0;
  let count = 0;
  datos.forEach((elemento: any) => {
    if (elemento[filter] == status) {
      count += 1;
    }
  });

  return count;
}


// obtiene el ultimo elemento de un arreglo
export const getLastElement = (items: any, row = "status", status = 1)=> {
  if(!items || !Array.isArray(items)) return null;
  const elementsWithStatus1 = items.filter((element:any) => element[row] === status);

  if (elementsWithStatus1 && elementsWithStatus1.length > 0) {
      const lastElementWithStatus1 = elementsWithStatus1[elementsWithStatus1.length - 1];
      return lastElementWithStatus1;
  } else {
      return null;
  }
}

// obtiene el primer elemento de un arreglo
export const getFirstElement = (items: any, row = "status", status = 1)=> {
  if(!items || !Array.isArray(items)) return null;

  const elementsWithStatus1 = items.filter((element: any) => element[row] === status);

  if (elementsWithStatus1 && elementsWithStatus1.length > 0) {
      const firstElementWithStatus1 = elementsWithStatus1[0];
      return firstElementWithStatus1;
  } else {
      return null;
  }
}

// porcentaje de ganancias segun el precio costo y precio de venta de un producto
export const percentage = (totalCost: number, totalPrice: number): number => {
  if (totalCost === 0) return 0; 
  return ((totalPrice - totalCost) / totalCost) * 100;
};

// calcula el valor segun porcentaje
export const getTotalPercentage = (porcentaje: number, total: number ) :number => {
  return (porcentaje / 100) * total;
}


export const isRestaurant = (tenant: number): boolean => {
    return tenant === 2 || tenant === 4;
}

export const isProducts = (tenant: number): boolean => {
    return tenant === 1 || tenant === 3;
}

export const getCashDrawerStatusLabel = (status: number): { text: string; color: string } => {
  if (status === 0) return { text: 'Inactiva', color: 'text-text-muted' };
  if (status === 1) return { text: 'Activa', color: 'text-success' };
  if (status === 2) return { text: 'Abierta', color: 'text-info' };
  return { text: 'Desconocido', color: 'text-text-muted' };
}